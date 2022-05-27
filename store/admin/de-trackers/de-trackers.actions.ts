import { ALERT_MESSAGE } from '@shared/constant';
import { removeFalseyObject } from '@shared/custom-function/common';
import { arrayToPipeString } from '@shared/custom-function/conversion';
import { EChartType, EStatus } from '@shared/enum';
import { ISharedCommonQueries, IToggle } from '@shared/interfaces';
import { MFileImport } from '@shared/models/common.model';
import {
  IChartTrackerBody,
  IFormArrayChartTypesBody,
  IPillarAPIBody,
  ITrackerGetChartDataBody,
  MDETracker,
} from '@shared/models/de-tracker.model';
import { APIServices } from '@shared/services/api.service';
import { ToastServices } from '@shared/services/toast.service';
import axios, { AxiosError, AxiosResponse } from 'axios';
import _ from 'lodash';
import moment from 'moment';
import { Dispatch } from 'redux';
import { StoreState } from 'store/root-reducer';
import { deTrackerActionType } from './de-trackers.action-types';

const DETRACKER_URL = '/admin/de-trackers';
const PILLARSTRACKER_URL = '/admin/de-trackers/pillars';
const IMPORT = `${DETRACKER_URL}/import`;
const EXPORT_SAMPLE = `${DETRACKER_URL}/export/sample`;

/*========== Loading ==========*/
const setFetching = (isLoading: boolean) => {
  return ((dispatch: Dispatch) => {
    dispatch({
      type: deTrackerActionType.SET_LOADING_LIST,
      payload: isLoading,
    });
  }) as any;
};

const setSubmitting = (isLoading: boolean) => {
  return ((dispatch: Dispatch) => {
    dispatch({
      type: deTrackerActionType.SET_LOADING_SUBMIT,
      payload: isLoading,
    });
  }) as any;
};

/*========== Pillars List ==========*/
const getPillarsListAction = () => {
  return ((dispatch: Dispatch, getState: () => StoreState) => {
    APIServices.axiosConfig();
    APIServices.setAxiosHeaders([{ key: 'x-language', value: 'en|km' }]);

    dispatch(setFetching(true));

    axios
      .get(PILLARSTRACKER_URL)
      .then((res: AxiosResponse) => {
        const data = res?.data?.data;
        dispatch({
          type: deTrackerActionType.GET_PILLAR_TRACKER_LIST,
          payload: data.map((e: any) => new MDETracker(e)),
        });
        const metadata = res?.data.metadata;
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

/*========== List ==========*/

const setListLocalStatesAction = (localStates: ISharedCommonQueries) => {
  return (dispatch: Dispatch) => {
    const payload = { ...localStates };
    dispatch({
      type: deTrackerActionType.SET_TRACKER_BY_PILLARS_LOCAL_STATES,
      payload,
    });
  };
};

const setListQueriesAction = (queries: ISharedCommonQueries) => {
  return (dispatch: Dispatch) => {
    const payload = { ...queries };
    dispatch({
      type: deTrackerActionType.SET_TRACKER_BY_PILLARS_QUERIES,
      payload,
    });
  };
};

const resetListQueriesAction = () => {
  return (dispatch: Dispatch) => {
    dispatch({ type: deTrackerActionType.RESET_TRACKER_BY_PILLARS_QUERIES });
  };
};

/*========== Pillars List and detail by id ==========*/
const getPillarsListIdAction = (id: string) => {
  if (!id) return;
  return (dispatch: Dispatch) => {
    APIServices.axiosConfig();
    APIServices.setAxiosHeaders([{ key: 'x-language', value: 'en|km' }]);

    dispatch(setFetching(true));

    axios
      .get(`${PILLARSTRACKER_URL}/${id}`)
      .then((res: AxiosResponse) => {
        dispatch({
          type: deTrackerActionType.SET_PILLAR_DETAIL,
          payload: res?.data,
        });

        dispatch(setFetching(false));
      })
      .catch((err: AxiosError) => {
        dispatch(setFetching(false));

        const msg =
          err?.response?.data?.message || ALERT_MESSAGE.UNKNOWN_ERROR_RETRY;
        ToastServices.error(msg);
      });
  };
};

const getTrackerListByPillarAction = (payload: ISharedCommonQueries) => {
  return (dispatch: Dispatch, getState: () => StoreState) => {
    APIServices.axiosConfig();
    APIServices.setAxiosHeaders([{ key: 'x-language', value: 'en|km' }]);

    dispatch(setFetching(true));

    const storedQueries: ISharedCommonQueries = JSON.parse(
      JSON.stringify(getState()?.deTrackers?.queries),
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
      pillar: arrayToPipeString(payload),
      statuses: arrayToPipeString(storedQueries?.statuses),
    };

    params = removeFalseyObject(params);

    axios
      .get(`${DETRACKER_URL}`, { params })
      .then((res: AxiosResponse) => {
        const data = res?.data?.data;

        dispatch({
          type: deTrackerActionType.GET_TRACKER_BY_PILLARS_LIST,
          payload: data.map((e: any) => new MDETracker(e)),
        });

        const metadata = res?.data.metadata;
        const localStates = { total: metadata?.total };

        dispatch({
          type: deTrackerActionType.SET_TRACKER_BY_PILLARS_LOCAL_STATES,
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
  };
};

const setFormArrayChartTypes = (
  { index, chartType }: IFormArrayChartTypesBody,
  type: 'add' | 'remove' = 'add',
) => {
  return (dispatch: Dispatch, getState: () => StoreState) => {
    const payload = _.cloneDeep(getState()?.deTrackers?.formArrayChartTypes);
    if (type === 'add') {
      payload[index] = chartType;
    } else {
      payload?.splice(index, 1);
    }
    dispatch({ type: deTrackerActionType.SET_CURRENT_CHART_TYPE, payload });
  };
};

const setTrackerImportFiles = (
  { body, index }: IChartTrackerBody<MFileImport>,
  type: 'add' | 'remove' = 'add',
) => {
  return (dispatch: Dispatch, getState: () => StoreState) => {
    const payload = _.cloneDeep(getState()?.deTrackers?.importedFiles);
    if (type === 'add') {
      payload[index] = body;
    } else {
      payload?.splice(index, 1);
    }
    dispatch({ type: deTrackerActionType.SET_IMPORTED_FILES, payload });
  };
};

const removeTrackerChartData = (index: number) => {
  return (dispatch: Dispatch, getState: () => StoreState) => {
    const payload = _.cloneDeep(getState()?.deTrackers?.chartsData);
    payload?.splice(index, 1);
    dispatch({
      type: deTrackerActionType.SET_CHARTS_DATA,
      payload,
    });
  };
};

const getTrackersChartsData = ({
  body,
  index,
}: IChartTrackerBody<ITrackerGetChartDataBody>) => {
  return (dispatch: Dispatch, getState: () => StoreState) => {
    APIServices.axiosConfig();
    const payload = _.cloneDeep(getState()?.deTrackers?.chartsData);

    return new Promise((resolve, reject) => {
      axios
        .post(IMPORT, body)
        .then((res: AxiosResponse) => {
          payload[index] = res?.data;
          dispatch({
            type: deTrackerActionType.SET_CHARTS_DATA,
            payload,
          });
          resolve(res?.data);
        })
        .catch((errors: AxiosError) => {
          const msg =
            errors?.response?.data?.message ||
            ALERT_MESSAGE.UNKNOWN_ERROR_RETRY;
          ToastServices.error(msg);
          reject(errors);
        });
    });
  };
};

const exportSample = (chartType?: EChartType) => {
  return (dispatch: Dispatch) => {
    APIServices.axiosConfig();
    APIServices.setAxiosHeaders([
      { key: 'Accept', value: 'application/octet-stream' },
    ]);

    return new Promise((resolve, reject) => {
      const params = { chartType };
      axios
        .get(EXPORT_SAMPLE, { responseType: 'arraybuffer', params })
        .then((res: AxiosResponse) => {
          resolve(res?.data);
        })
        .catch((errors: AxiosError) => {
          const msg =
            errors?.response?.data?.message ||
            ALERT_MESSAGE.UNKNOWN_ERROR_RETRY;
          ToastServices.error(msg);
          reject(errors);
        });
    });
  };
};
const toggleTrackerStatusAction = (id: string, payload: IToggle) => {
  return (dispatch: Dispatch) => {
    APIServices.axiosConfig();

    dispatch(setFetching(true));

    axios
      .delete(`${DETRACKER_URL}/${id}`)
      .then(() => {
        dispatch(getTrackerListByPillarAction(payload) as any);

        ToastServices.success(
          payload.status === EStatus.ACTIVE
            ? ALERT_MESSAGE.ACTIVATE_SUCCESS
            : ALERT_MESSAGE.DEACTIVATE_SUCCESS,
        );

        dispatch(setFetching(false));
      })
      .catch((err: AxiosError) => {
        dispatch(setFetching(false));
        const msg =
          err?.response?.data?.message || ALERT_MESSAGE.UNKNOWN_ERROR_RETRY;
        ToastServices.error(msg);
      });
  };
};

const updatePillars = (id: string, body: IPillarAPIBody) => {
  return (dispatch: Dispatch) => {
    APIServices.axiosConfig();
    return new Promise((resolve, reject) => {
      dispatch(setSubmitting(true));

      axios
        .put(`${PILLARSTRACKER_URL}/${id}`, body)
        .then((res: AxiosResponse) => {
          ToastServices.success(ALERT_MESSAGE.UPDATE_SUCCESS);

          dispatch(setSubmitting(false));

          resolve(res);
        })
        .catch((err: AxiosError) => {
          dispatch(setSubmitting(false));

          const msg =
            err?.response?.data?.message || ALERT_MESSAGE.UNKNOWN_ERROR_RETRY;
          ToastServices.error(msg);

          reject(err);
        });
    });
  };
};

export const deTrackerActions = {
  getPillarsListAction,
  resetListQueriesAction,
  setListLocalStatesAction,
  setListQueriesAction,
  setFetching,
  getPillarsListIdAction,
  getTrackersChartsData,
  setFormArrayChartTypes,
  setTrackerImportFiles,
  exportSample,
  removeTrackerChartData,
  getTrackerListByPillarAction,
  toggleTrackerStatusAction,
  updatePillars,
};
