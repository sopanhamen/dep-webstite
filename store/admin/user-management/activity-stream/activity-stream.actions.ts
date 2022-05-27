import { ALERT_MESSAGE } from '@shared/constant';
import { removeFalseyObject } from '@shared/custom-function/common';
import { arrayToPipeString } from '@shared/custom-function/conversion';
import { ELanguage } from '@shared/enum';
import { ISharedCommonQueries } from '@shared/interfaces';
import { ActivityStream } from '@shared/models/user-management/activity-stream.model';
import { APIServices } from '@shared/services/api.service';
import { ToastServices } from '@shared/services/toast.service';
import axios, { AxiosError, AxiosResponse } from 'axios';
import moment from 'moment';
import { Dispatch } from 'redux';
import { StoreState } from 'store/root-reducer';
import { activityActionType } from './activity-stream.action-types';

const ACTIVITY_URL = '/admin/users/activity-logs';

/*========== Loading ==========*/
const setFetching = (isLoading: boolean) => {
  return ((dispatch: Dispatch) => {
    dispatch({ type: activityActionType.SET_LOADING_LIST, payload: isLoading });
  }) as any;
};

/*========== List ==========*/
const setListLocalStatesAction = (localStates: ISharedCommonQueries) => {
  return (dispatch: Dispatch) => {
    const payload = { ...localStates };
    dispatch({
      type: activityActionType.SET_ACTIVITY_LOCAL_STATES,
      payload,
    });
  };
};

const setListQueriesAction = (queries: ISharedCommonQueries) => {
  return (dispatch: Dispatch) => {
    const payload = { ...queries };
    dispatch({ type: activityActionType.SET_ACTIVITY_QUERIES, payload });
  };
};

const resetListQueriesAction = () => {
  return (dispatch: Dispatch) => {
    dispatch({ type: activityActionType.RESET_ACTIVITY_QUERIES });
  };
};

const getActivityListAction = () => {
  return ((dispatch: Dispatch, getState: () => StoreState) => {
    APIServices.axiosConfig();
    APIServices.setAxiosHeaders([
      { key: 'x-language', value: `${ELanguage.ENGLISH}|${ELanguage.KHMER}` },
    ]);

    dispatch(setFetching(true));

    const storedQueries: ISharedCommonQueries = JSON.parse(
      JSON.stringify(getState()?.userManagement?.activityStream?.queries),
    );
    const startCreatedAt = storedQueries?.startCreatedAt
      ? moment(storedQueries?.startCreatedAt).toISOString()
      : null;
    const endCreatedAt = storedQueries?.endCreatedAt
      ? moment(storedQueries?.endCreatedAt).toISOString()
      : null;
    let params: ISharedCommonQueries = {
      ...storedQueries,
      page: undefined,
      total: undefined,
      dateType: undefined,
      startCreatedAt,
      endCreatedAt,
    };
    params = removeFalseyObject(params);

    axios
      .get(ACTIVITY_URL, { params })
      .then((res: AxiosResponse) => {
        const data = res?.data?.data;
        console.log('dataaaaa', data);

        dispatch({
          type: activityActionType.GET_ACTIVITY_LIST,
          payload: data?.map((x: any) => new ActivityStream(x)),
        });

        const metadata = res?.data.metadata;
        const localStates = { total: metadata?.total };
        dispatch({
          type: activityActionType.SET_ACTIVITY_LOCAL_STATES,
          payload: localStates,
        });

        dispatch(setFetching(false));
      })
      .catch((err: AxiosError) => {
        dispatch(setFetching(false));
        const msg =
          err?.response?.data?.message || ALERT_MESSAGE.UNKNOWN_ERROR_RETRY;
        ToastServices.error(msg);
      });
  }) as any;
};

export const activityStreamActions = {
  getActivityListAction,
  resetListQueriesAction,
  setListLocalStatesAction,
  setListQueriesAction,
  setFetching,
};
