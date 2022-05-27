import { IAddProjectPayload } from '@components/admin/projects/add-project';
import {
  ICommonQueries,
  ICommonResponse,
  IMessage,
  ISingleCommonResponse,
} from '@shared/interfaces';
import { Project } from '@shared/models/project.model';
import { APIServices } from '@shared/services/api.service';
import axios, { AxiosResponse } from 'axios';

const PROJECT = `${APIServices.apiUrlV1}/admin/projects`;

export async function getProjectList(
  payload: ICommonQueries,
  language: string,
): Promise<AxiosResponse<ICommonResponse<Project>, any>> {
  APIServices.axiosConfig();
  axios.defaults.headers.common['x-language'] = language;

  const headers = {
    'x-language': language,
  };

  return await axios.get<ICommonResponse<Project>>(`${PROJECT}`, {
    headers,
    params: { ...payload },
  });
}

export async function toggleStatus(
  id: string,
  payload: ICommonQueries,
): Promise<AxiosResponse<ICommonResponse<IMessage>, any>> {
  APIServices.axiosConfig();

  return await axios.delete<ICommonResponse<IMessage>>(`${PROJECT}/${id}`);
}

export async function createProject(
  payload: IAddProjectPayload,
): Promise<AxiosResponse<ISingleCommonResponse<Project>, any>> {
  APIServices.axiosConfig();

  return await axios.post<ISingleCommonResponse<Project>>(
    `${PROJECT}`,
    payload,
  );
}

export async function getProjectDetailById(
  id: string,
): Promise<AxiosResponse<ISingleCommonResponse<Project>, any>> {
  APIServices.axiosConfig();

  return await axios.get<ISingleCommonResponse<Project>>(`${PROJECT}/${id}`);
}

export async function updateProjectDetailsCMSById(
  id: string,
  payload: IAddProjectPayload,
): Promise<AxiosResponse<IMessage, any>> {
  APIServices.axiosConfig();

  return await axios.put<IMessage>(`${PROJECT}/${id}`, payload);
}
