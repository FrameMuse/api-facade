import BodyTypeUtils from "./BodyTypeUtils"
import QuerySchema, { QueryNullSchema, QuerySchemaMode } from "./QuerySchema"
import { BodyType, BodyTypeMap, BodyTypeValues } from "./types"
import { ResolveBodyType } from "./types.helpers"

class QueryShape<Type extends BodyType = BodyType, Schema extends QuerySchema = QuerySchema> {
  type: Type
  schema: Schema

  readonly _mixed!: BodyTypeValues<true> | Schema["_partial"]
  readonly _resolved!: ResolveBodyType<Type, Schema["_plain"]>

  static readonly NULL = new QueryShape("json", QueryNullSchema)

  constructor(type: Type, schema: Schema) {
    this.type = type
    this.schema = schema
  }

  private async parse(value: BodyTypeValues | Schema["_partial"], mode?: QuerySchemaMode): Promise<Schema["_plain"]> {
    const valueConverted = await BodyTypeUtils.convertType(value, "json")

    const valueParsed = this.schema.parse(valueConverted, mode)
    return valueParsed
  }

  private async convert(value: unknown): Promise<BodyTypeMap[Type]> {
    const valueConverted = await BodyTypeUtils.convertType(value, this.type)
    return valueConverted
  }

  public async form(value: unknown, mode?: QuerySchemaMode): Promise<this["_resolved"]> {
    // const valueParsed = await this.parse(value, mode)
    const valueConverted = await this.convert(value)

    return valueConverted as never
  }
}

export default QueryShape
