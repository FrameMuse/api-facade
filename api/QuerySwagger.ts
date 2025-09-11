import { Schema, SwaggerDocs } from "openapi-schema-tools"

import BodyTypeUtils from "./BodyTypeUtils"
import QueryAction from "./QueryAction"
import QueryShape from "./QueryShape"
import { ParseOperation, SwaggerQuerySchemaByName, SwaggerSchema } from "./SwaggerSchema"
import { RequestMethod } from "./types"

export type FilterPath<Docs extends SwaggerDocs, Method extends RequestMethod, Path extends keyof Docs["paths"]> =
  keyof Docs["paths"][Path][Lowercase<Method>] extends never ? never : Path

class QuerySwagger<Docs extends SwaggerDocs> {
  docs: Docs
  schemas: {
    [SchemaName in keyof Docs["components"]["schemas"]]: SwaggerQuerySchemaByName<Docs["components"]["schemas"], SchemaName>
  }
  actions: {
    [Method in RequestMethod]: {
      [Path in (keyof Docs["paths"]) as FilterPath<Docs, Method, Path>]: ParseOperation<Docs, Path, Lowercase<Method>>["action"]
    }
  }


  constructor(docs: Docs) {
    this.docs = docs
    // Create schemas.
    this.schemas = {} as never
    for (const key of Object.keys(docs.components.schemas)) {
      const schemaName = key as keyof Docs["components"]["schemas"]
      this.schemas[schemaName] = this.createSchema(schemaName)
    }
    // Create actions.
    this.actions = {} as never
    for (const path of Object.keys(docs.paths)) {
      for (const method of Object.keys(docs.paths[path])) {
        const action = this.createAction(path, method)
        const actionMethodUppercase = method.toUpperCase() as RequestMethod

        this.actions[actionMethodUppercase] = {
          ...this.actions[actionMethodUppercase],
          [path]: action
        } as never
      }
    }
  }

  private createSchema<SchemaName extends keyof Docs["components"]["schemas"]>(schemaName: SchemaName) {
    const schema = this.docs.components.schemas[schemaName]
    return SwaggerSchema(schema, this.docs.components.schemas)
  }


  private createAction<
    Path extends keyof Docs["paths"] & string,
    Method extends keyof Docs["paths"][Path] & string
  >(path: Path, method: Method): QueryAction {
    const operation = this.docs.paths[path][method]

    const requestBodyShape = this.getContentShape(operation.requestBody?.content)
    const responsePayloadShape = this.getContentShape(operation.responses?.["200"]?.content)

    return new QueryAction({
      path,
      method: method.toUpperCase() as Extract<Uppercase<Method>, RequestMethod>,

      requestBodyShape: requestBodyShape as never,
      responsePayloadShape: responsePayloadShape as never,
    })
  }

  private getContentShape<S extends Schema>(content: Record<string, { schema?: Schema }> | null | undefined): QueryShape {
    if (content == null) return QueryShape.NULL

    const contentTypes = Object.keys(content)
    if (contentTypes.length === 0) return QueryShape.NULL

    const suitableContentType = QuerySwaggerContentUtils.findSuitableContentType(contentTypes)
    const suitableContentSchema = content[suitableContentType]?.schema
    if (suitableContentSchema == null) return QueryShape.NULL


    return new QueryShape(
      BodyTypeUtils.fromMediaType(suitableContentType),
      SwaggerSchema(suitableContentSchema as S, this.docs.components.schemas)
    )
  }
}

export default QuerySwagger


class QuerySwaggerContentUtils {


  static findSuitableContentType(contentTypes: string[]): string {
    const jsonContentType = contentTypes.find(contentType => contentType.includes("json"))
    if (jsonContentType == null) return contentTypes[0]

    return jsonContentType
  }
}
