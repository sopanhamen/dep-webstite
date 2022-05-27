/* eslint-disable no-case-declarations */
import { ISignUpBody } from '@shared/components/web-layout/sign-up-form';
import { getLanguage } from '@shared/custom-function/common';
import { EStatus } from '@shared/enum';
import { EClassification } from '@shared/enum/classification.enum';
import { ICommonQueries } from '@shared/interfaces';
import { IOrganization } from '@shared/models/organization.model';
import { APIServices } from '@shared/services/api.service';
import { ToastServices } from '@shared/services/toast.service';
import axios from 'axios';
import { IForgotPasswordBody } from 'pages/forgot-password';
import { ILoginBody } from 'pages/login';
import { IResetPasswordBody } from 'pages/reset-password';
import { Dispatch } from 'redux';
import { AuthActionTypes } from './auth.action-types';

const authUrl = `${APIServices.authUrl}/auth`;
const url = `${APIServices.apiUrlV1}`;

const setLoading = (isLoading: boolean) => {
  return (dispatch: Dispatch) => {
    dispatch({
      type: AuthActionTypes.SET_GLOBAL_LOADING,
      payload: isLoading,
    });
  };
};

const getAuthorization = () => {
  return (dispatch: Dispatch) => {
    const { clientId, authorizeHeader } = APIServices;
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${authUrl}/authorize`,
          { clientId },
          { headers: authorizeHeader() },
        )
        .then((response: any) => {
          const payload = response?.data?.token;
          dispatch({
            type: AuthActionTypes.GET_AUTHORIZE_TOKEN,
            payload,
          });

          resolve(response);
        })
        .catch((errors: any) => {
          dispatch({
            type: AuthActionTypes.GET_AUTHORIZE_TOKEN,
            payload: null,
          });
          const message = errors?.response?.data?.message;
          ToastServices.error(message || 'Unspecific errors!');
          reject(errors?.response);
        });
    });
  };
};

const getPublicToken = () => {
  return (dispatch: Dispatch) => {
    const headers = APIServices.authenticationHeader();
    return new Promise((resolve, reject) => {
      axios
        .post(`${authUrl}/token`, {}, { headers })
        .then((response: any) => {
          dispatch({
            type: AuthActionTypes.GET_PUBLIC_TOKEN,
            payload: response?.data?.accessToken,
          });
          resolve(response);
        })
        .catch((errors) => {
          dispatch({
            type: AuthActionTypes.GET_PUBLIC_TOKEN,
            payload: null,
          });
          reject(errors);
        });
    });
  };
};

const login = (payload: ILoginBody) => {
  return (dispatch: Dispatch) => {
    dispatch(setLoading(true) as any);
    const headers = APIServices.authenticationHeader();
    return new Promise((resolve, reject) => {
      axios
        .post(`${authUrl}/login`, payload, { headers })
        .then((response: any) => {
          dispatch(setLoading(false) as any);
          dispatch({
            type: AuthActionTypes.LOGIN,
            payload: response?.data,
          });
          resolve(response?.data?.user);
        })
        .catch((errors: any) => {
          dispatch(setLoading(false) as any);
          const message = errors?.response?.data?.message;
          ToastServices.error(message || 'Unspecific errors!');
          reject(errors?.response);
        });
    });
  };
};

const logout = () => {
  return (dispatch: Dispatch) => {
    dispatch({ type: AuthActionTypes.LOGOUT });
  };
};

const forgotPassword = (payload: IForgotPasswordBody) => {
  return (dispatch: Dispatch) => {
    dispatch(setLoading(true) as any);
    const headers = APIServices.authenticationHeaderForgotPwd();
    return new Promise((resolve, reject) => {
      axios
        .post(`${url}/users/forget-password`, payload, { headers })
        .then((response: any) => {
          dispatch(setLoading(false) as any);
          resolve(response);
        })
        .catch((errors: any) => {
          dispatch(setLoading(false) as any);
          const message = errors?.response?.data?.message;
          ToastServices.error(message || 'Unspecific errors!');
          reject(errors?.response);
        });
    });
  };
};

const resetPassword = (payload: IResetPasswordBody) => {
  return (dispatch: Dispatch) => {
    dispatch(setLoading(true) as any);
    const headers = APIServices.authenticationHeaderForgotPwd();
    return new Promise((resolve, reject) => {
      axios
        .post(`${url}/users/reset-password`, payload, { headers })
        .then((response: any) => {
          dispatch(setLoading(false) as any);
          resolve(response);
        })
        .catch((errors: any) => {
          dispatch(setLoading(false) as any);
          const message = errors?.response?.data?.message;
          ToastServices.error(message || 'Unspecific errors!');
          reject(errors?.response);
        });
    });
  };
};

const getOrganizationNames = (payload?: ICommonQueries) => {
  return (dispatch: Dispatch, getState: any) => {
    let params: ICommonQueries = {
      limit: 0,
      token: getState()?.auth?.publicToken,
    };

    if (payload?.statuses) {
      params = {
        ...params,
        statuses: payload.statuses,
      };
    } else {
      params = {
        ...params,
        status: payload?.status ?? EStatus.ACTIVE,
      };
    }

    const headers = {
      'x-language': `${getLanguage()}`,
    };
    axios
      .get(`${url}/organizations`, { params, headers })
      .then((res: any) => {
        const data = res.data?.data.map((item: IOrganization) => {
          return {
            ...item,
            id: item?.id,
            label: item?.name,
            value: item?.id,
          };
        });

        dispatch({
          type: AuthActionTypes.GET_ORGANIZATION_NAMES,
          payload: data,
        });
      })
      .catch((errors: any) => {
        const message = errors?.response?.data?.message;
        ToastServices.error(message || 'Unspecific errors!');
      });
  };
};

const getClassifications = (classType: string) => {
  return (dispatch: Dispatch, getState: any) => {
    const params = {
      type: classType,
      limit: 0,
      status: 'ACTIVE',
      token: getState()?.auth?.publicToken,
    };
    const headers = {
      'x-language': `${getLanguage()}`,
    };

    axios
      .get(`${url}/classifications`, { params, headers })
      .then((res: any) => {
        const data = res.data?.data.map((item: any) => {
          return {
            id: item?.id,
            label: item?.name,
            value: item?.code,
          };
        });

        switch (classType) {
          case EClassification.ORGANIZATION:
            dispatch({
              type: AuthActionTypes.GET_ORGANIZATION_TYPES,
              payload: data,
            });
            break;

          case EClassification.PILLAR:
            dispatch({
              type: AuthActionTypes.GET_PILLARS,
              payload: data,
            });
            break;

          case EClassification.SECTOR:
            dispatch({
              type: AuthActionTypes.GET_SECTORS,
              payload: data,
            });
            break;

          default:
            break;
        }
      })
      .catch((errors: any) => {
        const message = errors?.response?.data?.message;
        ToastServices.error(message || 'Unspecific errors!');
      });
  };
};

const onSignUp = (payload: ISignUpBody) => {
  return (dispatch: Dispatch) => {
    dispatch(setLoading(true) as any);
    const headers = APIServices.publicHeader();
    return new Promise((resolve, reject) => {
      axios
        .post(`${url}/users/sign-up`, payload, { headers })
        .then((response: any) => {
          dispatch(setLoading(false) as any);
          resolve(response);
          ToastServices.success('Sign up is create successfully.');
        })
        .catch((errors: any) => {
          dispatch(setLoading(false) as any);
          const message = errors?.response?.data?.message;
          ToastServices.error(message || 'Unspecific errors!');
          reject(errors?.response);
        });
    });
  };
};

const AuthAction = {
  getAuthorization,
  login,
  logout,
  getPublicToken,
  setLoading,
  forgotPassword,
  resetPassword,
  getOrganizationNames,
  getClassifications,
  onSignUp,
};

export default AuthAction;
