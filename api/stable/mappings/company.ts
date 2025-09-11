import { Company, CompanyStatus } from "@/entities/company/company.types"
import BiMap from "@/utils/transform/bimap"

import DefaultImageJPG from "./default-image.jpg"

import { APIDocsSwagger } from "../APIStable"

export function mapCompany(company: typeof APIDocsSwagger.schemas.Company._plain): Company {
  return {
    id: company._id as unknown as string,
    logo: company.logo?.url ?? DefaultImageJPG,
    title: company.name,
    status: mapCompanyStatus(company),
    deletedAt: company.deletedAt,
    owner: {
      id: company.owner?._id,
      firstName: company.owner?.firstName,
      lastName: company.owner?.lastName,
      email: company.email,
    }
  }
}

function mapCompanyStatus(company: typeof APIDocsSwagger.schemas.Company._plain): CompanyStatus {
  if (company.owner?.verified === false) return CompanyStatus.PendingOwnerInvite

  return companyStatus.forward(company.status)
}

const companyStatus = new BiMap({
  1: CompanyStatus.Active,
  2: CompanyStatus.PendingDeletionRequest,
  3: CompanyStatus.pendingRestorationRequest,
  4: CompanyStatus.Archived
})
