import { ICompanyBackgroundBody } from '@components/admin/about-us/company-background/add-company-background';
import { ALERT_MESSAGE } from '@shared/constant';
import { MCompanyBackground } from '@shared/models/about-us/company-background';
import { APIServices } from '@shared/services/api.service';
import { ToastServices } from '@shared/services/toast.service';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Dispatch } from 'redux';
import { companyBackgroundTypes } from './company-background.action-types';

const COMPANY_BACKGROUND = 'admin/contents';

const setLoading = (payload: boolean) => {
  return (dispatch: Dispatch) => {
    dispatch({ type: companyBackgroundTypes.SET_LOADING, payload });
  };
};

const getCompanyBackgrounds = () => {
  return (dispatch: Dispatch) => {
    APIServices.axiosConfig();
    dispatch(setLoading(true) as any);

    const params = {
      type: 'ABOUT-US',
      limit: 1,
      offset: 0,
    };

    axios
      .get(COMPANY_BACKGROUND, { params })
      .then((res: AxiosResponse) => {
        dispatch(setLoading(false) as any);
        const { data, metadata } = res?.data;
        const companyBackground = data?.map(
          (cbg: MCompanyBackground) => new MCompanyBackground(cbg),
        );

        const payload = { companyBackground, metadata };
        dispatch({
          type: companyBackgroundTypes.GET_COMPANY_BACKGROUND,
          payload,
        });
      })
      .catch((errors: AxiosError) => {
        const message = errors?.response?.data?.message;
        ToastServices.error(message || ALERT_MESSAGE.UNKNOWN_ERROR_RETRY);
        dispatch(setLoading(false) as any);
      });
  };
};

const createCompanyBackground = (body: ICompanyBackgroundBody) => {
  return (dispatch: Dispatch) => {
    APIServices.axiosConfig();
    return new Promise((resolve, reject) => {
      axios
        .post(`${COMPANY_BACKGROUND}`, body)
        .then((res: AxiosResponse) => {
          dispatch(getCompanyBackgrounds() as any);
          resolve(res);
          ToastServices.success(ALERT_MESSAGE.CREATE_SUCCESS);
        })
        .catch((err: AxiosError) => {
          const message = err?.response?.data?.message;
          ToastServices.error(message || ALERT_MESSAGE.UNKNOWN_ERROR_RETRY);
          reject(err?.response);
        });
    });
  };
};

const getCompanyBackgroundDetail = (id: string) => {
  return (dispatch: Dispatch) => {
    APIServices.axiosConfig();
    dispatch(setLoading(true) as any);
    axios
      .get(`${COMPANY_BACKGROUND}/${id}`)
      .then((res: AxiosResponse) => {
        dispatch(setLoading(false) as any);
        dispatch({
          type: companyBackgroundTypes.GET_COMPANY_BACKGROUND_DETAIL,
          data: res.data,
        });
      })
      .catch((errors: AxiosError) => {
        dispatch(setLoading(false) as any);
        const message = errors?.response?.data?.message;
        ToastServices.error(message || ALERT_MESSAGE.UNKNOWN_ERROR_RETRY);
      });
  };
};

const updateCompanyBackground = (
  id: string,
  payload: ICompanyBackgroundBody,
) => {
  return (dispatch: Dispatch) => {
    APIServices.axiosConfig();
    dispatch(setLoading(true) as any);
    return new Promise((resolve, reject) => {
      axios
        .put(`${COMPANY_BACKGROUND}/${id}`, payload)
        .then((res: AxiosResponse) => {
          resolve(res);
          ToastServices.success(ALERT_MESSAGE.UPDATE_SUCCESS);
        })
        .catch((err: AxiosError) => {
          const message = err?.response?.data?.message;
          ToastServices.error(message || ALERT_MESSAGE.UNKNOWN_ERROR_RETRY);
          reject(err?.response);
        });
    });
  };
};

const CompanyBackgroundActions = {
  getCompanyBackgrounds,
  createCompanyBackground,
  getCompanyBackgroundDetail,
  updateCompanyBackground,
};

export default CompanyBackgroundActions;
