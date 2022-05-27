import { ELanguage } from '@shared/enum';
import {
  ICommonQueries,
  ICommonResponse,
  IMessage,
  IMessagePayload,
  IToggle,
} from '@shared/interfaces';
import { Organization } from '@shared/models/user-management/organization.model';
import { APIServices } from '@shared/services/api.service';
import axios, { AxiosResponse } from 'axios';

const USER_VERIFICATION = `${APIServices.apiUrlV1}/admin/users`;

export async function getUserVerificationList(
  payload: ICommonQueries,
  language: ELanguage,
): Promise<AxiosResponse<ICommonResponse<Organization>, any>> {
  APIServices.axiosConfig();

  const headers = {
    'x-language': language,
  };

  return await axios.get<ICommonResponse<Organization>>(
    `${USER_VERIFICATION}`,
    {
      params: {
        ...payload,
      },
      headers,
    },
  );
}

export async function toggleStatus(
  id: string,
  payload: ICommonQueries,
): Promise<AxiosResponse<ICommonResponse<IMessage>, any>> {
  APIServices.axiosConfig();

  return await axios.put<ICommonResponse<IMessage>>(
    `${USER_VERIFICATION}/${id}/approve`,
    {
      data: { source: payload },
    },
  );
}

export async function statusReject(
  id: string,
  payload: IToggle,
  param: IMessagePayload,
): Promise<AxiosResponse<ICommonResponse<IMessage>, any>> {
  APIServices.axiosConfig();
  return await axios.put<ICommonResponse<IMessage>>(
    `${USER_VERIFICATION}/${id}/reject`,
    param,
    {
      data: { source: payload },
    },
  );
}
