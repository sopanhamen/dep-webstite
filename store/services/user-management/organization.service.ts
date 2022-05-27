import { ELanguage } from '@shared/enum';
import { ICommonQueries, ICommonResponse, IMessage } from '@shared/interfaces';
import { IUpdate } from '@shared/models/common.model';
import { Organization } from '@shared/models/user-management/organization.model';
import { APIServices } from '@shared/services/api.service';
import axios, { AxiosResponse } from 'axios';

const ORGANIZATION = `${APIServices.apiUrlV1}/admin/organizations`;
const ORGANIZATION_PUBLIC = `${APIServices.apiUrlV1}/organizations`;

export async function getOrganizationList(
  payload: ICommonQueries,
  language: ELanguage,
): Promise<AxiosResponse<ICommonResponse<Organization>, any>> {
  APIServices.axiosConfig();

  const headers = {
    'x-language': language,
  };

  return await axios.get<ICommonResponse<Organization>>(`${ORGANIZATION}`, {
    headers,
    params: {
      ...payload,
    },
  });
}

export async function toggleStatus(
  id: string,
  payload: ICommonQueries,
): Promise<AxiosResponse<ICommonResponse<IMessage>, any>> {
  APIServices.axiosConfig();

  return await axios.delete<ICommonResponse<IMessage>>(
    `${ORGANIZATION}/${id}`,
    {
      data: {
        source: payload,
      },
    },
  );
}

export async function createOrganization(payload: Organization) {
  APIServices.axiosConfig();

  return await axios.post(ORGANIZATION, payload);
}

export async function getOrganization(id: string) {
  APIServices.axiosConfig();

  return await axios.get(`${ORGANIZATION}/${id}`);
}

export async function updateOrganization(payload: IUpdate<Organization>) {
  APIServices.axiosConfig();

  return await axios.put(`${ORGANIZATION}/${payload?.id}`, payload?.body);
}

export async function getOrganizationPublicList(
  payload: ICommonQueries,
  language: ELanguage,
): Promise<AxiosResponse<ICommonResponse<Organization>, any>> {
  const headers = {
    ...APIServices.publicHeader(),
    'x-language': language,
  };

  return await axios.get<ICommonResponse<Organization>>(
    `${ORGANIZATION_PUBLIC}`,
    {
      headers,
      params: {
        ...payload,
      },
    },
  );
}
