# Light API Client

This client handles every common case, while still being pretty straightforward.

It introduces testability by splitting the code into smaller pieces,
which allows testing web requests without `fetch` mocking.

It resolves path variables and has more advanced search query conversion via `qs` library,
which makes it to accept almost any kind of js data.

It's also very extensible and in this case it implements response validation via `zod` library,
which allows to provide the return type with confidence.

## Usage

```ts
import { api } from "./api"
import { array } from "zod"

const CatsSchema = array(...)
const cats = await api("/cats", { schema: CatsSchema })


```
