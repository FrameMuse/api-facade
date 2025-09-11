import { AuditLogAction, AuditLogEntry } from "@/entities/audit-log/audit-log.types"

import { APIDocsSwagger } from "../APIStable"

export function mapAuditLogEntry(schema: typeof APIDocsSwagger.schemas.Log._plain): AuditLogEntry {
  return {
    id: schema._id,
    timestamp: new Date(schema.timestamp),
    action: schema.action as AuditLogAction,
    username: schema.username,
    description: schema.description,
    newData: schema.newData,
    oldData: schema.oldData
  }
}
