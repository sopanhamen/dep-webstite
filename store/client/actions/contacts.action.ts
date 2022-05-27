import axios from 'axios';
import * as _ from 'lodash';
import { Dispatch } from 'redux';
import { APIServices } from '@shared/services/api.service';
import { AuthActionTypes } from 'store/auth/auth.action-types';
import { ToastServices } from '@shared/services/toast.service';

const authUrl = `${APIServices.authUrl}/auth`;
const url = `${APIServices.apiUrlV1}`;

interface IContact {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  type: string;
  status: string;
}

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

const onSubmiteReport = (payload: IContact) => {
  return (dispatch: Dispatch) => {
    dispatch(setLoading(true) as any);
    const headers = APIServices.publicHeader();

    return new Promise((resolve, reject) => {
      axios
        .post(`${url}/contacts`, payload, { headers })
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

const ContactsAction = {
  getAuthorization,
  getPublicToken,
  setLoading,
  onSubmiteReport,
};

export default ContactsAction;
