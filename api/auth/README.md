# Auth as a Domain

The API facade handles **credential transport** — injecting tokens, intercepting 401s,
refreshing. But auth itself is often a **domain** with multi-step flows, persistence
across page loads, and provider-specific state machines.

This document covers the higher-level patterns that live around and above the facade.

## Intent Pattern

Simple login → token flows are well served by the facade's `Authorization` interceptor.
But many auth flows are multi-step:

| Flow | Steps |
|------|-------|
| Email login | `start(email, password)` → session |
| Email registration | `start(email, password)` → `verify(code)` → session |
| Password reset | `start(email)` → `verify(code)` → session |
| Telegram / OTP | `start()` → `verify(otp)` → session |

Each step is a distinct API call, and the intermediate state matters. Modeling each
flow as an **intent** — a stateful object with `start()` and optional `verify()` —
keeps the logic contained:

```ts
class EmailRegisterIntent {
  email: string | null = null

  async start(email: string, password: string, username?: string): Promise<void> {
    this.email = email
    const resp = await fetch("/email/register", {
      method: "POST",
      body: JSON.stringify({ email, password, username }),
    })
    if (!resp.ok) throw new AuthError("Registration failed", resp.status)
  }

  async verify(code: string): Promise<void> {
    const resp = await fetch(`/email/verify?token=${encodeURIComponent(code)}`)
    if (!resp.ok) throw new AuthError("Verification failed", resp.status)
  }

  toJSON() {
    return { type: "email_register", data: {} }
  }

  static restore(_data: object): EmailRegisterIntent {
    return new EmailRegisterIntent()
  }
}
```

The consumer calls the intent, not raw endpoints:

```ts
const intent = new Auth.Intent.EmailRegister()
await intent.start("alice@example.com", "s3cret", "alice")
// ... navigate to verification page
await intent.verify("123456")
const session = await new Auth.Attempt(intent).toSession()
```

## Attempt Persistence

Multi-step auth is vulnerable to page reload — the user is mid-registration and
refreshes. **Attempt persistence** saves the intent state so the flow can resume.

```ts
class Attempt {
  readonly id: string

  constructor(public intent: AnyIntent) {
    this.id = crypto.randomUUID()
    this.persist()
  }

  persist(): void {
    const stored = {
      id: this.id,
      intentType: this.intent.toJSON().type,
      intentData: this.intent.toJSON().data,
    }
    sessionStorage.setItem("auth_attempt", JSON.stringify(stored))
  }

  static async restore(): Promise<Attempt | null> {
    const raw = sessionStorage.getItem("auth_attempt")
    if (!raw) return null

    const stored = JSON.parse(raw)
    const restoreFn = restoreRegistry[stored.intentType]
    if (!restoreFn) return null

    const intent = await restoreFn(stored.intentData)
    return new Attempt(intent)
  }

  clear(): void {
    sessionStorage.removeItem("auth_attempt")
  }
}
```

Key details:
- Use `sessionStorage` — cleared when the tab closes, no stale state leaks
- Store only `type` + `data` — intents control their own serialization via `toJSON()`
- `restore()` returns `null` silently on corruption — never throw during recovery
- Clear on completion (`toSession()` calls `clear()`)

## Session Lifecycle

Once an intent completes, the result is a **session** — the authenticated context.

```ts
class Session {
  constructor(
    public user: AuthUser,
    public profile: AuthProfile,
    public expiresAt: number,
    public jwt: string | null = null,
    public refreshToken: string | null = null,
  ) {}

  persist(): void {
    localStorage.setItem("auth_session", this.toJSON())
  }

  async refresh(refreshToken: string): Promise<void> {
    const resp = await fetch("/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
    if (!resp.ok) throw new AuthError("Refresh failed", resp.status)
    const data = await resp.json()
    this.expiresAt = data.expires_at
    this.jwt = null
    this.refreshToken = data.refresh_token ?? this.refreshToken
    this.persist()
  }

  async revoke(): Promise<void> {
    await fetch("/revoke", { method: "POST", body: JSON.stringify({ all: true }) })
    localStorage.removeItem("auth_session")
  }
}
```

Use `localStorage` for sessions (survives tab closes). The consumer reads it on
app start to restore auth state.

### Where the facade fits in

The facade's `APIAuthorization` (see `api/API.ts`) injects the session's `jwt`
into every request. The session's `refresh()` can be wired to the facade's
auto-refresh batching:

```ts
// Facade reads token from the session
const api = new API({
  // ...
  options: {
    request: {
      security: {
        tokens: [{
          header: "Authorization",
          read: () => session.jwt,
          refresh: async () => {
            await session.refresh(session.refreshToken)
            return session.jwt!
          },
        }],
      },
    },
  },
})
```

## Provider Routing / Intent Registry

When you support multiple auth providers, an **intent registry** decouples provider
lookup from the rest of the auth logic:

```ts
const restoreRegistry: Record<string, (data: object) => AnyIntent> = {}

function registerIntent(type: string, restore: (data: object) => AnyIntent) {
  restoreRegistry[type] = restore
}

// Register providers
registerIntent("email",         () => new EmailIntent())
registerIntent("email_register", () => new EmailRegisterIntent())
registerIntent("telegram",     (d) => TelegramIntent.restore(d))
```

This enables:
- **Lazy loading** — register on demand, providers can be code-split
- **Dynamic discovery** — backend advertises available methods, frontend loads matching intents
- **Serialization round-trip** — any intent can be stored/restored via its registered type

## Claims → Model Mapping

JWT claims are strings and timestamps. Map them to typed models immediately so the
rest of the app never parses tokens.

```ts
class AuthUser {
  constructor(
    public readonly id: string,
    public readonly username: string | null,
    public readonly email: string | null,
    public readonly displayName: string | null,
    public readonly authMethods: string[],  // amr claim
    public readonly sessionMethod: string,   // acr claim
  ) {}

  static fromJwtClaims(claims: Record<string, unknown>): AuthUser {
    return new AuthUser(
      claims.sub as string,
      (claims.username as string) ?? null,
      (claims.email as string) ?? null,
      (claims.display_name as string) ?? (claims.displayName as string) ?? null,
      (claims.amr as string[]) ?? [],
      (claims.acr as string) ?? "",
    )
  }
}
```

Keep the mapping in a dedicated class (`fromJwtClaims` or `fromJSON`) so token
structure changes only affect one place.

## Dual Credential Strategy

Some endpoints use `Authorization: Bearer`, others rely on cookies
(`credentials: "include"`). The intent pattern handles this naturally — each intent
controls its own fetch calls. For the main facade, a configurable credential mode
keeps things flexible:

```ts
const api = new API({
  baseURL: "https://api.example.com",
  credentials: "include",        // Cookie-based by default
  options: {
    request: {
      security: {
        tokens: [{
          header: "Authorization",
          read: () => session.jwt,
        }],
      },
    },
  },
})

// Per-request override
api.fetch.GET["/public/resource"]({ credentials: "omit" })
```

## Comparison With Facade-Level Auth

| Concern | Facade (api/API.ts) | Auth Domain (this doc) |
|---------|-------------------|----------------------|
| Token injection | `Authorization` header interceptor | — |
| 401 handling | Auto-refresh with batching, broadcast logout | — |
| Multi-step flows | — | Intent pattern (`start` → `verify` → session) |
| Attempt persistence | — | `sessionStorage`-backed attempt recovery |
| Session object | — | `Session` with `persist`/`refresh`/`revoke` |
| Claims mapping | — | `AuthUser`/`AuthProfile` from JWT |
| Provider routing | — | Intent registry |

## Standard References

- **JWT**: [RFC 7519](https://datatracker.ietf.org/doc/html/rfc7519) — standard claims (`sub`, `amr`, `acr`)
- **OAuth 2.0**: [RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749) — authorization framework
- **OpenID Connect**: [Core spec](https://openid.net/specs/openid-connect-core-1_0.html) — identity layer on top of OAuth 2.0
- **WebAuthn**: [W3C](https://www.w3.org/TR/webauthn/) — passwordless auth with biometrics/security keys
- **Auth0 / Clerk / Kinde**: Commercial auth platforms that implement similar intent-based flows
