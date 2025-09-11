import { MenuAppInstance } from "@/entities/app/menu/menu.types"

import { APIDocsSwagger } from "../APIStable"


type MenuAppInstanceSchema = Partial<typeof APIDocsSwagger.schemas.Screen._plain & typeof APIDocsSwagger.schemas.MenuApp._plain>

export function mapMenuAppInstance(schema: MenuAppInstanceSchema): MenuAppInstance {
  return {
    type: "MENU",
    name: schema.appId ?? schema.screen?.appId ?? "unknown",

    id: schema._id ?? "unknown",
    designId: schema?.events?.[0]?.designId ?? null,

    companyId: schema.company ?? schema.screen?.company ?? schema.screen?.location?.company?._id ?? "unknown",
    locationId: schema.screen?.location?._id ?? "unknown"
  }
}
