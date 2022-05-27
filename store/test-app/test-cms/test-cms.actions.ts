import { ALERT_MESSAGE } from '@shared/constant';
import { removeFalseyObject } from '@shared/custom-function/common';
import { arrayToPipeString } from '@shared/custom-function/conversion';
import { EStatus } from '@shared/enum';
import { ISharedCommonQueries, IToggle } from '@shared/interfaces';
import { TestCMSProject } from '@shared/models/test-cms.model';
import { APIServices } from '@shared/services/api.service';
import { ToastServices } from '@shared/services/toast.service';
import axios, { AxiosError, AxiosResponse } from 'axios';
import moment from 'moment';
import { Dispatch } from 'redux';
import { StoreState } from 'store/root-reducer';
import { testCMSTypes } from './test-cms.action-types';

const PROJECT_URL = '/admin/projects';

/*========== Loading ==========*/
const setLoadingListAction = (isLoading: boolean) => {
  return ((dispatch: Dispatch) => {
    dispatch({ type: testCMSTypes.SET_LOADING_LIST, payload: isLoading });
  }) as any;
};

const setLoadingSubmitAction = (isLoading: boolean) => {
  return ((dispatch: Dispatch) => {
    dispatch({ type: testCMSTypes.SET_LOADING_SUBMIT, payload: isLoading });
  }) as any;
};

/*========== List ==========*/
const setListLocalStatesAction = (localStates: ISharedCommonQueries) => {
  return (dispatch: Dispatch) => {
    const payload = { ...localStates };
    dispatch({ type: testCMSTypes.SET_TEST_CMS_LIST_LOCAL_STATES, payload });
  };
};

const setListQueriesAction = (queries: ISharedCommonQueries) => {
  return (dispatch: Dispatch) => {
    const payload = { ...queries };
    dispatch({ type: testCMSTypes.SET_TEST_CMS_LIST_QUERIES, payload });
  };
};

const resetListQueriesAction = () => {
  return (dispatch: Dispatch) => {
    dispatch({ type: testCMSTypes.RESET_TEST_CMS_LIST_QUERIES });
  };
};

const getTestCMSListAction = () => {
  return (dispatch: Dispatch, getState: () => StoreState) => {
    APIServices.axiosConfig();

    dispatch(setLoadingListAction(true));

    const storedQueries: ISharedCommonQueries = JSON.parse(
      JSON.stringify(getState()?.testCMS?.queries),
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
      statuses: arrayToPipeString(storedQueries?.statuses),
      pillars: arrayToPipeString(storedQueries?.pillars),
      sectors: arrayToPipeString(storedQueries?.sectors),
      owners: arrayToPipeString(storedQueries?.owners),
      partners: arrayToPipeString(storedQueries?.partners),
    };
    params = removeFalseyObject(params);

    axios
      .get(PROJECT_URL, { params })
      .then((res: AxiosResponse) => {
        const data = res?.data?.data;
        dispatch({ type: testCMSTypes.GET_TEST_CMS_LIST, payload: data });

        const metadata = res?.data.metadata;
        const localStates = { total: metadata?.total };
        dispatch({
          type: testCMSTypes.SET_TEST_CMS_LIST_LOCAL_STATES,
          payload: localStates,
        });

        dispatch(setLoadingListAction(false));
      })
      .catch((err: AxiosError) => {
        dispatch(setLoadingListAction(false));
        const msg =
          err?.response?.data?.message || ALERT_MESSAGE.UNKNOWN_ERROR_RETRY;
        ToastServices.error(msg);
      });
  };
};

const toggleTestCMSStatusAction = (id: string, payload: IToggle) => {
  return (dispatch: Dispatch, getState: () => StoreState) => {
    APIServices.axiosConfig();

    dispatch(setLoadingListAction(true));

    axios
      .delete(`${PROJECT_URL}/${id}`)
      .then(() => {
        const project: TestCMSProject[] = getState()?.testCMS?.data || [];

        project.forEach((p) => {
          if (p.id === id) p.status = payload?.status;
        });

        ToastServices.success(
          payload.status === EStatus.ACTIVE
            ? ALERT_MESSAGE.ACTIVATE_SUCCESS
            : ALERT_MESSAGE.DEACTIVATE_SUCCESS,
        );

        dispatch({
          type: testCMSTypes.TOGGLE_TEST_CMS_STATUS,
          payload: project,
        });
        dispatch(setLoadingListAction(false));
      })
      .catch((err: AxiosError) => {
        dispatch(setLoadingListAction(false));
        const msg =
          err?.response?.data?.message || ALERT_MESSAGE.UNKNOWN_ERROR_RETRY;
        ToastServices.error(msg);
      });
  };
};

export const testCMSActions = {
  setLoadingListAction,
  setLoadingSubmitAction,
  setListLocalStatesAction,
  setListQueriesAction,
  resetListQueriesAction,
  getTestCMSListAction,
  toggleTestCMSStatusAction,
};
