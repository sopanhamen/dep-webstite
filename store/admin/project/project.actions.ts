import { IAddProjectPayload } from '@components/admin/projects/add-project';
import { ALERT_MESSAGE } from '@shared/constant';
import { removeFalseyObject } from '@shared/custom-function/common';
import { arrayToPipeString } from '@shared/custom-function/conversion';
import { EStatus } from '@shared/enum';
import { ISharedCommonQueries, IToggle } from '@shared/interfaces';
import { Project } from '@shared/models/project.model';
import { APIServices } from '@shared/services/api.service';
import { ToastServices } from '@shared/services/toast.service';
import axios, { AxiosError, AxiosResponse } from 'axios';
import moment from 'moment';
import { Dispatch } from 'redux';
import store from 'store';
import { StoreState } from 'store/root-reducer';
import * as ProjectService from 'store/services/project.service';
import { projectActionType } from './project.action-types';

const PROJECT_URL = '/admin/projects';
const CLIENT_PROJECT_URL = APIServices.apiUrlV1 + '/projects';

/*========== Loading ==========*/
const setLoadingListAction = (isLoading: boolean) => {
  return ((dispatch: Dispatch) => {
    dispatch({ type: projectActionType.SET_LOADING_LIST, payload: isLoading });
  }) as any;
};

const setLoadingSubmitAction = (isLoading: boolean) => {
  return ((dispatch: Dispatch) => {
    dispatch({
      type: projectActionType.SET_LOADING_SUBMIT,
      payload: isLoading,
    });
  }) as any;
};

/*========== List ==========*/
const setListLocalStatesAction = (localStates: ISharedCommonQueries) => {
  return (dispatch: Dispatch) => {
    const payload = { ...localStates };
    dispatch({
      type: projectActionType.SET_PROJECT_LOCAL_STATES,
      payload,
    });
  };
};

const setListQueriesAction = (queries: ISharedCommonQueries) => {
  return (dispatch: Dispatch) => {
    const payload = { ...queries };
    dispatch({ type: projectActionType.SET_PROJECT_QUERIES, payload });
  };
};

const resetListQueriesAction = () => {
  return (dispatch: Dispatch) => {
    dispatch({ type: projectActionType.RESET_PROJECT_QUERIES });
  };
};

const getProjectListAction = () => {
  return ((dispatch: Dispatch, getState: () => StoreState) => {
    APIServices.axiosConfig();
    APIServices.setAxiosHeaders([{ key: 'x-language', value: 'en|km' }]);

    dispatch(setLoadingListAction(true));

    const storedQueries: ISharedCommonQueries = JSON.parse(
      JSON.stringify(getState()?.project?.queries),
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

        dispatch({
          type: projectActionType.GET_PROJECT_LIST,
          payload: data.map((e: any) => new Project(e)),
        });

        const metadata = res?.data.metadata;
        const localStates = { total: metadata?.total };
        dispatch({
          type: projectActionType.SET_PROJECT_LOCAL_STATES,
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
  }) as any;
};

const toggleProjectStatusAction = (id: string, payload: IToggle) => {
  return (dispatch: Dispatch, getState: () => StoreState) => {
    APIServices.axiosConfig();

    dispatch(setLoadingListAction(true));

    axios
      .delete(`${PROJECT_URL}/${id}`)
      .then(() => {
        dispatch(getProjectListAction());

        ToastServices.success(
          payload.status === EStatus.ACTIVE
            ? ALERT_MESSAGE.ACTIVATE_SUCCESS
            : ALERT_MESSAGE.DEACTIVATE_SUCCESS,
        );

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

const createProjectCMS = (payload: IAddProjectPayload) => {
  return (dispatch: Dispatch) => {
    APIServices.axiosConfig();
    return new Promise((resolve, reject) => {
      axios
        .post(`${PROJECT_URL}`, payload)
        .then((res: AxiosResponse) => {
          dispatch(getProjectListAction());
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

const getClientProjectListAction = () => {
  return ((dispatch: Dispatch, getState: () => StoreState) => {
    APIServices.axiosClientConfig();
    APIServices.setAxiosHeaders([{ key: 'x-language', value: 'en|km' }]);

    dispatch(setLoadingListAction(true));

    const storedQueries: ISharedCommonQueries = JSON.parse(
      JSON.stringify(getState()?.project?.queries),
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
      .get(CLIENT_PROJECT_URL, { params })
      .then((res: AxiosResponse) => {
        const data = res?.data?.data;
        dispatch({
          type: projectActionType.GET_PROJECT_LIST,
          payload: data.map((e: any) => new Project(e)),
        });

        const metadata = res?.data.metadata;
        const localStates = { total: metadata?.total };
        dispatch({
          type: projectActionType.SET_PROJECT_LOCAL_STATES,
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
  }) as any;
};

const getProjectDetail = (id: string) => {
  return (dispatch: Dispatch) => {
    APIServices.axiosClientConfig();
    APIServices.setAxiosHeaders([{ key: 'x-language', value: 'en|km' }]);

    axios
      .get(`${CLIENT_PROJECT_URL}/${id}`)
      .then((res: AxiosResponse) => {
        dispatch({
          type: projectActionType.GET_PROJECT_DETAIL,
          data: res.data,
        });
      })
      .catch((errors: AxiosError) => {
        const message = errors?.response?.data?.message;
        ToastServices.error(message || 'Unspecific errors!');
      });
  };
};

const resetProjectModal = () => {
  return async function (dispatch: Dispatch) {
    dispatch({ type: projectActionType.RESET_PROJECTS });
  };
};

const getProjectDetailByIdCMS = (id: string) => {
  return async function (dispatch: Dispatch) {
    dispatch({ type: projectActionType.GET_PROJECTS_CMS_REQUEST });

    try {
      const result = await ProjectService.getProjectDetailById(id);

      return dispatch({
        type: projectActionType.GET_PROJECTS_CMS_SUCCESS,
        data: { project: new Project(result.data) },
      });
    } catch (e: unknown) {
      const m =
        e instanceof Error ? e.message : ALERT_MESSAGE.UNKNOWN_ERROR_RETRY;

      ToastServices.error(m);

      dispatch({ type: projectActionType.GET_PROJECTS_CMS_FAILED });
    }
  };
};

const updateProjectDetailIdCMS = (id: string, payload: IAddProjectPayload) => {
  return (dispatch: Dispatch) => {
    APIServices.axiosConfig();
    return new Promise((resolve, reject) => {
      axios
        .put(`${PROJECT_URL}/${id}`, payload)
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

export const projectActions = {
  createProjectCMS,
  getClientProjectListAction,
  getProjectDetail,
  getProjectDetailByIdCMS,
  getProjectListAction,
  resetListQueriesAction,
  resetProjectModal,
  setListLocalStatesAction,
  setListQueriesAction,
  setLoadingListAction,
  setLoadingSubmitAction,
  toggleProjectStatusAction,
  updateProjectDetailIdCMS,
};
