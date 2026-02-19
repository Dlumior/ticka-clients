import {
  zOrganizationCreateOutput,
  zOrganizationDetailOutput,
  zOrganizationListOutput,
  zOrganizationUpdateOutput,
} from '@repo/api-types'
import { apiRequest } from './client'
import type {
  zOrganizationCreateInputRequest,
  zPatchedOrganizationUpdateInputRequest,
} from '@repo/api-types'
import type z from 'zod'

export type Organization = z.infer<typeof zOrganizationListOutput>
export type OrganizationDetail = z.infer<typeof zOrganizationDetailOutput>
export type OrganizationCreateInput = z.infer<
  typeof zOrganizationCreateInputRequest
>
export type OrganizationUpdateInput = z.infer<
  typeof zPatchedOrganizationUpdateInputRequest
>

export async function listOrganizations(): Promise<Array<Organization>> {
  return apiRequest(
    {
      method: 'GET',
      url: '/identities/organizations/',
    },
    zOrganizationListOutput.array(),
  )
}

export async function getOrganization(id: string): Promise<OrganizationDetail> {
  return apiRequest(
    {
      method: 'GET',
      url: `/identities/organizations/${id}/`,
    },
    zOrganizationDetailOutput,
  )
}

export async function createOrganization(
  data: OrganizationCreateInput,
): Promise<z.infer<typeof zOrganizationCreateOutput>> {
  return apiRequest(
    {
      method: 'POST',
      url: '/identities/organizations/create/',
      data,
    },
    zOrganizationCreateOutput,
  )
}

export async function updateOrganization(
  id: string,
  data: OrganizationUpdateInput,
): Promise<z.infer<typeof zOrganizationUpdateOutput>> {
  return apiRequest(
    {
      method: 'PATCH',
      url: `/identities/organizations/${id}/update/`,
      data,
    },
    zOrganizationUpdateOutput,
  )
}

export async function deleteOrganization(id: string): Promise<void> {
  await apiRequest(
    {
      method: 'DELETE',
      url: `/identities/organizations/${id}/delete/`,
    },
    zOrganizationUpdateOutput,
  )
}
