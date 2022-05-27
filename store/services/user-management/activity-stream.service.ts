import { ELanguage } from '@shared/enum';
import { ICommonQueries, ICommonResponse } from '@shared/interfaces';
import { ActivityStream } from '@shared/models/user-management/activity-stream.model';
import { APIServices } from '@shared/services/api.service';
import axios, { AxiosResponse } from 'axios';

const ACTIVITY = `${APIServices.apiUrlV1}/admin/users/activity-logs`;

export async function getActivityStreamList(
  payload: ICommonQueries,
  language: ELanguage,
): Promise<AxiosResponse<ICommonResponse<ActivityStream>, any>> {
  APIServices.axiosConfig();

  const headers = {
    'x-language': language,
  };

  return await axios.get<ICommonResponse<ActivityStream>>(`${ACTIVITY}`, {
    headers,
    params: { ...payload },
  });
}
