import { ELanguage } from '@shared/enum';
import {
  BannerQuery,
  ICommonResponse,
  IUploadPayload,
} from '@shared/interfaces';
import { APIServices } from '@shared/services/api.service';
import axios from 'axios';

const BANNER = `${APIServices.apiUrlV1}/admin/banners`;
const CLIENT_BANNER = `${APIServices.apiUrlV1}/banners`;

export async function getBannerList(payload: BannerQuery) {
  APIServices.axiosConfig();

  return axios.get(`${BANNER}`, {
    params: { ...payload, page: payload.page.split('_').join('-') },
  });
}

export async function uploadBanner(payload: IUploadPayload) {
  APIServices.axiosConfig();

  return axios.post(`${BANNER}`, payload);
}

export async function getClientBanner(payload: BannerQuery) {
  APIServices.axiosClientConfig();

  const headers = {
    'x-language': `${ELanguage.ALL}`,
  };

  return axios.get<ICommonResponse<any>>(`${CLIENT_BANNER}`, {
    headers,
    params: { ...payload, page: payload.page.split('_').join('-') },
  });
}
