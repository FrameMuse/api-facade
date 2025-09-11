import { Design } from "@/entities/design"

import { APIDocsSwagger } from "../APIStable"

export function mapDesign(schema: typeof APIDocsSwagger.schemas.Design._plain): Design {
  return {
    id: schema._id,
    json: schema.json,
    name: schema.name,

    companyId: schema.companyId ?? "unknown",
    locationId: schema.location
  }
}
