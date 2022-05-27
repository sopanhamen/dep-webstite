import { ALERT_MESSAGE } from '@shared/constant';
import { ELanguage, EStatus } from '@shared/enum';
import { ICommonQueries, IMessagePayload, IToggle } from '@shared/interfaces';
import { UserVerification } from '@shared/models/user-management/user-verification.modal';
import { APIServices } from '@shared/services/api.service';
import { ToastServices } from '@shared/services/toast.service';
import axios, { AxiosError } from 'axios';
import { Dispatch } from 'redux';
import { StoreState } from 'store/root-reducer';
import * as UserVerificationService from 'store/services/user-management/user-verification.service';
import { userVerificationType } from './user-verification.action-types';

const USER_VERIFICATION = `${APIServices.apiUrlV1}/admin/users`;

const getUserVerification = (params: ICommonQueries, language: ELanguage) => {
  return async function (dispatch: Dispatch) {
    dispatch({
      type: userVerificationType.USER_VERIFICATION_REQUEST,
    });

    try {
      const result = await UserVerificationService.getUserVerificationList(
        params,
        language,
      );

      return dispatch({
        type: userVerificationType.USER_VERIFICATION_SUCCESS,
        data: {
          userVerifications: result.data.data.map(
            (x) => new UserVerification(x),
          ),
          metadata: result.data.metadata,
        },
      });
    } catch (e: unknown) {
      const m =
        e instanceof Error ? e.message : ALERT_MESSAGE.UNKNOWN_ERROR_RETRY;

      ToastServices.error(m);

      dispatch({
        type: userVerificationType.USER_VERIFICATION_FAILED,
      });
    }
  };
};

const toggleStatusAction = (id: string, payload: IToggle) => {
  return (dispatch: Dispatch, getState: () => StoreState) => {
    APIServices.axiosConfig();

    axios
      .put(`${USER_VERIFICATION}/${id}/approve`)
      .then(() => {
        const resetParams: ICommonQueries = {
          status: EStatus.PENDING,
        };
        dispatch(getUserVerification(resetParams, ELanguage.ENGLISH) as any);

        ToastServices.success(ALERT_MESSAGE.UPDATE_SUCCESS);
      })
      .catch((err: AxiosError) => {
        const msg =
          err?.response?.data?.message || ALERT_MESSAGE.UNKNOWN_ERROR_RETRY;
        ToastServices.error(msg);
      });
  };
};

const onSubmitNote = (id: string, payload: IToggle, param: IMessagePayload) => {
  return async function (dispatch: Dispatch) {
    dispatch({
      type: userVerificationType.TOGGLE_USER_VERIFICATION_STATUS_REQUEST,
    });

    try {
      await UserVerificationService.statusReject(id, payload, param);

      ToastServices.success(ALERT_MESSAGE.UPDATE_SUCCESS);

      return dispatch({
        type: userVerificationType.TOGGLE_USER_VERIFICATION_STATUS_SUCCESS,
        data: { userVerifications: [payload] },
      });
    } catch (e: unknown) {
      const m =
        e instanceof Error ? e.message : ALERT_MESSAGE.UNKNOWN_ERROR_RETRY;

      ToastServices.error(m);

      dispatch({
        type: userVerificationType.TOGGLE_USER_VERIFICATION_STATUS_FAILED,
      });
    }
  };
};

export const UserVerificationActions = {
  getUserVerification,
  toggleStatusAction,
  onSubmitNote,
};
