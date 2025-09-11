import { QLocation } from "@/entities/location/location.types"

import { APIDocsSwagger } from "../APIStable"

export function mapLocation(
  location: typeof APIDocsSwagger.schemas.Location._plain,
): QLocation {
  return {
    id: location._id,
    title: location.name,
    pos: location.pos && mapLocationsPos(location.pos)
  }
}

function mapLocationsPos(
  pos: (typeof APIDocsSwagger.schemas.PosProvider._plain),
) {
  return {
    id: pos._id,
    name: pos.posName,
    client: pos.clientId,
    configJson: pos.configJson
  }
}
