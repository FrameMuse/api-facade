import { User, UserStatus } from "@/entities/user"

import { APIDocsSwagger } from "../APIStable"

export function mapUser(user: typeof APIDocsSwagger.schemas.User._plain): User {
  return {
    id: user._id as unknown as string,

    avatar: user.avatar?.url,
    email: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    status: mapUserStatus(user),
    deletedAt: user.deletedAt,
    deleted: user.deleted,

    companyId: user.company?._id,

    role: user.role - 1, // API enums start from 1.
    signed: true
  }
}

function mapUserStatus(user: typeof APIDocsSwagger.schemas.User._plain): UserStatus {
  if (user.deleted) return UserStatus.Archived
  if (!user.verified) return UserStatus.Invited

  return UserStatus.Active
}
