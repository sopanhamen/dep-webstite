import { ELanguage } from '@shared/enum';
import { ICommonQueries, ICommonResponse, IMessage } from '@shared/interfaces';
import { MEvent } from '@shared/models/user-management/event.model';
import { APIServices } from '@shared/services/api.service';
import axios, { AxiosResponse } from 'axios';

const EVENT = `${APIServices.apiUrlV1}/admin/announcements`;
const EVENT_WEB = `${APIServices.apiUrlV1}/announcements`;

export async function getEventList(
  payload: ICommonQueries,
  language: ELanguage,
): Promise<AxiosResponse<ICommonResponse<MEvent>, any>> {
  APIServices.axiosConfig();

  const headers = {
    'x-language': language,
  };

  return await axios.get<ICommonResponse<MEvent>>(`${EVENT}`, {
    headers,
    params: { ...payload },
  });
}

export async function toggleStatus(
  id: string,
  payload: ICommonQueries,
): Promise<AxiosResponse<ICommonResponse<IMessage>, any>> {
  APIServices.axiosConfig();

  return await axios.delete<ICommonResponse<IMessage>>(`${EVENT}/${id}`, {
    data: { source: payload },
  });
}

export async function getCurrentEvent(
  payload: ICommonQueries,
  language: ELanguage,
): Promise<AxiosResponse<ICommonResponse<MEvent>, any>> {
  const headers = {
    ...APIServices.publicHeader(),
    'x-language': language,
  };

  return await axios.get<ICommonResponse<MEvent>>(`${EVENT_WEB}`, {
    headers,
    params: { ...payload },
  });
}
