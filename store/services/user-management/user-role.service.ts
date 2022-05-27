import { ELanguage } from '@shared/enum';
import { ICommonQueries, ICommonResponse } from '@shared/interfaces';
import { UserRole } from '@shared/models/user-management/user-role.model';
import { APIServices } from '@shared/services/api.service';
import axios, { AxiosResponse } from 'axios';

const USER_ROLE = `${APIServices.apiUrlV1}/admin/roles`;

export async function getUserRoleList(
  payload: ICommonQueries,
  language: ELanguage,
): Promise<AxiosResponse<ICommonResponse<UserRole>, any>> {
  APIServices.axiosConfig();

  const headers = {
    'x-language': language,
  };

  return await axios.get<ICommonResponse<UserRole>>(`${USER_ROLE}`, {
    params: {
      ...payload,
    },
    headers,
  });
}
