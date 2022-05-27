import { ICommonResponse } from '@shared/interfaces';
import { UserRole } from '@shared/models/user-management/user-role.model';
import axios, { AxiosResponse } from 'axios';
import { APIServices } from './api.service';

const USER_MANAGEMENT = `${APIServices.apiUrlV1}/admin/roles`;

export const UserManagement = {
  getUserRolesApi: async (
    payload: string,
  ): Promise<AxiosResponse<ICommonResponse<UserRole>, any>> => {
    APIServices.axiosConfig();

    return axios.get<ICommonResponse<UserRole>>(
      `${USER_MANAGEMENT}/roles?${payload}`,
    );
  },
};
