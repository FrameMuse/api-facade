import { OCBAppInstance, OCBAppPreview } from "@/entities/app/ocb/ocb.types"
import FileUtils from "@/utils/transform/file"

import { APIDocsSwagger } from "../APIStable"


type PartialOCBAppInstance = Partial<typeof APIDocsSwagger.schemas.Screen._plain & typeof APIDocsSwagger.schemas.OcbApp._plain>

export async function mapOCBAppInstance(schema: PartialOCBAppInstance): Promise<OCBAppInstance> {
  const [order, welcome] = await Promise.all([
    FileUtils.resolveURLs(schema.orderScreen ?? {}),
    FileUtils.resolveURLs(schema.welcomeScreen ?? {})
  ]) as never[]

  return {
    type: "OCB",
    name: schema.appId ?? schema.screen?.appId ?? "unknown",
    views: { order, welcome },
    empty: Object.keys(order).length === 0 && Object.keys(welcome).length === 0,

    locationId: schema.location ?? schema.screen?.location ?? "unknown"
  }
}


export function mapOCBAppPreview(schema: PartialOCBAppInstance): OCBAppPreview {
  return {
    type: "OCB",
    name: schema.appId ?? schema.screen?.appId ?? "unknown"
  }
}
