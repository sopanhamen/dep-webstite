import { APIServices } from '@shared/services/api.service';
import { ToastServices } from '@shared/services/toast.service';
import axios, { AxiosError, AxiosResponse } from 'axios';
import _ from 'lodash';

export interface IDownloadPayload {
  resourceHubId: string;
  referenceFileId: string;
  email: string;
  gender: string;
  institution: string;
  purpose: string;
  fileId: string;
}

const IMAGE = 'uploads/images';
const VIDEOS = 'uploads/videos';
const IMAGES_BULKS = 'uploads/images/bulks';
const FILES_BULKS = 'uploads/files/bulks';
const FILE = 'uploads/files';
const RESOURCE_HUBS_DOWNLOAD_FILE = 'resource-hubs/downloads';
const IMPORTS = `${FILE}/imports`;

const uploadImage = async (file: File) => {
  APIServices.axiosConfig();

  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append('filename', file);

    axios
      .post(IMAGE, formData)
      .then((res) => resolve(res))
      .catch((errors) => {
        const message = errors?.response?.data?.message;
        ToastServices.error(message || 'Unable to upload image');
        reject(errors);
      });
  });
};

const uploadImages = (files: File[]) => {
  APIServices.axiosConfig();

  return new Promise((resolve, reject) => {
    let formData = new FormData();

    for (let i = 0; i < files?.length; i++) {
      formData.append('images', files[i]);
    }

    axios
      .post(IMAGES_BULKS, formData)
      .then((res) => resolve(res))
      .catch((errors) => {
        const message = errors?.response?.data?.message;
        ToastServices.error(message || 'Unable to upload image');
        reject(errors);
      });
  });
};

const uploadVideos = (files: File[]): Promise<any> => {
  APIServices.axiosConfig();

  return new Promise((resolve, reject) => {
    let formData = new FormData();
    for (let i = 0; i < files?.length; i++) {
      formData.append('filename', files[i]);
    }
    axios
      .post(VIDEOS, formData)
      .then((response: AxiosResponse) => {
        resolve(response);
      })
      .catch((errors: AxiosError) => {
        const message = errors?.response?.data?.message;
        ToastServices.error(message || 'Unable to upload image');
        reject(errors);
      });
  });
};

const uploadFiles = (files: File[]): Promise<any> => {
  APIServices.axiosConfig();

  return new Promise((resolve, reject) => {
    let formData = new FormData();
    for (let i = 0; i < files?.length; i++) {
      formData.append('files', files[i]);
    }
    axios
      .post(FILES_BULKS, formData)
      .then((response: AxiosResponse) => {
        resolve(response);
      })
      .catch((errors: AxiosError) => {
        const message = errors?.response?.data?.message;
        ToastServices.error(message || 'Unable to upload file');
        reject(errors);
      });
  });
};

const uploadFile = async (file: File) => {
  APIServices.axiosConfig();

  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append('filename', file);
    axios
      .post(FILE, formData)
      .then((res) => resolve(res))
      .catch((errors) => {
        const message = errors?.response?.data?.message;
        ToastServices.error(message || 'Unable to upload file');
        reject(errors);
      });
  });
};

const importFile = (file: File): Promise<any> => {
  APIServices.axiosConfig();
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append('filename', file);
    axios
      .post(IMPORTS, formData)
      .then((res: AxiosResponse) => {
        resolve(res);
      })
      .catch((errors: AxiosError) => {
        const message = errors?.response?.data?.message;
        ToastServices.error(message || 'Unable to upload file');
        reject(errors);
      });
  });
};

const downloadResourceHubFiles = (payload: IDownloadPayload) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${RESOURCE_HUBS_DOWNLOAD_FILE}/${payload?.fileId}`,
        _.omit(payload, ['fileId']),
      )
      .then((res) => {
        ToastServices.success('File Downloaded');
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const CommonServices = {
  uploadImage,
  uploadImages,
  uploadVideos,
  uploadFiles,
  uploadFile,
  downloadResourceHubFiles,
  importFile,
};

export default CommonServices;
