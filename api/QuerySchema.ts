export type QuerySchemaMode = "required" | "mocked"

interface QuerySchema<Schema = unknown, Plain = unknown> {
  readonly _plain: Plain
  readonly _partial: Plain | Partial<Plain> | null | undefined
  readonly schema: Schema

  /**
   * @throws If the `value` is invalid.
   * @returns Parsed value.
   */
  parse(value: this["_partial"], mode?: QuerySchemaMode): Plain
  /**
   * @returns Mocked value.
   */
  mock(): Plain
}

export default QuerySchema

export const QueryNullSchema: QuerySchema<null, null> = {
  _plain: undefined as never,
  _partial: undefined as never,

  schema: null,
  parse: () => null,
  mock: () => null
} as const

Object.seal(QueryNullSchema)
Object.freeze(QueryNullSchema)
