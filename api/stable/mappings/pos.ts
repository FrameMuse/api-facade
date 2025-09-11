import { POSIntegration, POSName } from "@/entities/pos/pos.types"
import BiMap from "@/utils/transform/bimap"

import { APIDocsSwagger } from "../APIStable"

export function mapPOSIntegration(
  posProvider: typeof APIDocsSwagger.schemas.PosProvider._plain,
): POSIntegration {
  return {
    name: posName.forward(posProvider.posName.toLowerCase()),
    clientId: posProvider.clientId,
    config: posProvider.configJson && JSON.parse(posProvider.configJson)
  }
}

const posName = new BiMap<string, POSName>({
  "ncr": POSName.NCR,
  "cbs northstar": POSName.CBSNorthStar,
  "tableneeds": POSName.TableNeeds,
  "oracle": POSName.Oracle,
  "holiday oil": POSName.HolidayOil
})
