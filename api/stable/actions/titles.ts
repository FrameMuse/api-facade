import { LiteralUnion } from "type-fest"

import APIDocs from "../data/docs.json"

const pathTitles: Partial<Record<LiteralUnion<keyof typeof APIDocs["paths"], string>, string>> = {
  "/auth/login": "Login",
  "/auth/profile": "Your profile",
}
export default pathTitles
