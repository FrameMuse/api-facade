/* eslint-disable @typescript-eslint/no-unused-vars */

import { ResolveSchema, Schema, SchemaMocker, SchemaRef, SchemaResolve, Schemas, SchemaSatisfier, SwaggerDocs } from "openapi-schema-tools"
import { Simplify, ValueOf } from "type-fest"
import { ArrayElement } from "type-fest/source/internal"

import QueryAction from "./QueryAction"
import QuerySchema from "./QuerySchema"
import QueryShape from "./QueryShape"
import { QueryParams, RequestMethod } from "./types"



export type MediaTypeToBodyType<MediaType extends string> =
  true extends MediaSubTypeIncludes<MediaType, "json"> ? "json" :
  true extends MediaSubTypeIncludes<MediaType, "form-data"> ? "formData" :
  true extends MediaSubTypeIncludes<MediaType, "text"> ? "text" :
  never

type MediaSubTypeIncludes<MediaType extends string, Search extends string> =
  MediaType extends `${string}${Search}${string}` ? true : never

const test1: MediaSubTypeIncludes<"application/json" | "penis" | "1" | "multipart/form-data", "json"> = true
const test2: MediaSubTypeIncludes<"application/json" | "penis" | "1" | "multipart/form-data", "form-data"> = true
const test3: never = {} as MediaSubTypeIncludes<"application/json" | "penis" | "1", "form-data">

const test4: MediaTypeToBodyType<("application/json" | "penis" | "1" | "multipart/form-data")> = "json"
const test5: MediaTypeToBodyType<("penis" | "1" | "multipart/form-data")> = "formData"
const test6: never = {} as MediaTypeToBodyType<"">


interface ParseContent<T extends { content?: Record<string, { schema?: Schema }> } | undefined> {
  contentType: Simplify<keyof NonNullable<T>["content"]> & string
  bodyType: MediaTypeToBodyType<this["contentType"]>
  schema: T extends NonNullable<unknown> ? NonNullable<NonNullable<NonNullable<T["content"]>[this["contentType"]]>["schema"]> : never
}

// type asd = Simplify<typeof APIDocs["paths"]["/auth/login"]["post"]["responses"]>
// type dd = asd["201"]
// type dd1 = ResolveResponse<asd>

type ResolveOKResponse<Responses extends Record<string, unknown>> =
  keyof Responses extends `${infer StatusCode}`
  ? StatusCode extends `2${string}`
  ? Responses[StatusCode]
  : never
  : never


export type SwaggerQuerySchemaByName<Context extends Schemas, SchemaName extends keyof Context> =
  QuerySchema<Context[SchemaName], ResolveSchema<Context[SchemaName], Context>>

type ExtractQueryParameter<T extends { in: "query" | "path" }[]> = Extract<ArrayElement<T>, { in: "query" }>[]

export interface ParseOperation<
  Docs extends SwaggerDocs,
  Path extends keyof Docs["paths"],
  Method extends keyof Docs["paths"][Path] & string
> {
  __OPERATION__: Docs["paths"][Path][Method]
  __REQUEST_CONTENT__: ParseContent<this["__OPERATION__"]["requestBody"]>
  __RESPONSE_CONTENT__: ParseContent<ResolveOKResponse<NonNullable<this["__OPERATION__"]["responses"]>>>

  action: QueryAction<
    Path & string,
    Extract<Uppercase<Method>, RequestMethod>,

    QueryShape<
      this["__REQUEST_CONTENT__"]["bodyType"],
      QuerySchema<this["__REQUEST_CONTENT__"]["schema"], ResolveSchema<this["__REQUEST_CONTENT__"]["schema"], Docs["components"]["schemas"]>>
    >,
    QueryShape<
      this["__RESPONSE_CONTENT__"]["bodyType"],
      QuerySchema<this["__RESPONSE_CONTENT__"]["schema"], ResolveSchema<this["__RESPONSE_CONTENT__"]["schema"], Docs["components"]["schemas"]>>
    >,

    SchemaResolve.Parameters<ExtractQueryParameter<this["__OPERATION__"]["parameters"] & {}>, Docs["components"]["schemas"]> & QueryParams
  >
}


export function SwaggerSchema<S extends ValueOf<Context> | SchemaRef, Context extends Schemas>(schema: S, context?: Context): QuerySchema<S, ResolveSchema<S, Context>> {
  const satisfier = new SchemaSatisfier(context)
  const mocker = new SchemaMocker(context)

  return {
    _plain: undefined as never,
    _partial: undefined as never,
    schema,
    parse: (value, mode) => {
      switch (mode) {
        case "mocked":
          return satisfier.mocked(value, schema)
        // case "partial":
        //   return satisfier.partial(value, schema)
        case "required":
          return satisfier.required(value, schema)

        default:
          return satisfier.required(value, schema)
      }
    },
    mock: () => mocker.mock(schema)
  }
}
