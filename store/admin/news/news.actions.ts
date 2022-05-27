import { ALERT_MESSAGE } from '@shared/constant';
import { removeFalseyObject } from '@shared/custom-function/common';
import { arrayToPipeString } from '@shared/custom-function/conversion';
import { EStatus } from '@shared/enum';
import { ISharedCommonQueries, IToggle } from '@shared/interfaces';
import { INewsAPIBody, MNews } from '@shared/models/news.model';
import { APIServices } from '@shared/services/api.service';
import { ToastServices } from '@shared/services/toast.service';
import axios, { AxiosError, AxiosResponse } from 'axios';
import moment from 'moment';
import { Dispatch } from 'redux';
import { StoreState } from 'store/root-reducer';
import { newsActionType } from './news.action-types';

const NEWS_URL = '/admin/news';
const CLIENT_NEWS_URL = APIServices.apiUrlV1 + '/news';

/*========== Loading ==========*/
const setFetching = (isLoading: boolean) => {
  return ((dispatch: Dispatch) => {
    dispatch({ type: newsActionType.SET_LOADING_LIST, payload: isLoading });
  }) as any;
};

const setSubmitting = (isLoading: boolean) => {
  return ((dispatch: Dispatch) => {
    dispatch({
      type: newsActionType.SET_LOADING_SUBMIT,
      payload: isLoading,
    });
  }) as any;
};

/*========== List ==========*/
const setListLocalStatesAction = (localStates: ISharedCommonQueries) => {
  return (dispatch: Dispatch) => {
    const payload = { ...localStates };
    dispatch({
      type: newsActionType.SET_NEWS_LOCAL_STATES,
      payload,
    });
  };
};

const setListQueriesAction = (queries: ISharedCommonQueries) => {
  return (dispatch: Dispatch) => {
    const payload = { ...queries };
    dispatch({ type: newsActionType.SET_NEWS_QUERIES, payload });
  };
};

const resetListQueriesAction = () => {
  return (dispatch: Dispatch) => {
    dispatch({ type: newsActionType.RESET_NEWS_QUERIES });
  };
};

const getNewsListAction = () => {
  return ((dispatch: Dispatch, getState: () => StoreState) => {
    APIServices.axiosConfig();
    APIServices.setAxiosHeaders([{ key: 'x-language', value: 'en|km' }]);

    dispatch(setFetching(true));

    const storedQueries: ISharedCommonQueries = JSON.parse(
      JSON.stringify(getState()?.news?.queries),
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
    };
    params = removeFalseyObject(params);

    axios
      .get(NEWS_URL, { params })
      .then((res: AxiosResponse) => {
        const data = res?.data?.data;
        dispatch({
          type: newsActionType.GET_NEWS_LIST,
          payload: data.map((e: any) => new MNews(e)),
        });

        const metadata = res?.data.metadata;
        const localStates = { total: metadata?.total };
        dispatch({
          type: newsActionType.SET_NEWS_LOCAL_STATES,
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

const toggleNewsStatusAction = (id: string, payload: IToggle) => {
  return (dispatch: Dispatch) => {
    APIServices.axiosConfig();

    dispatch(setFetching(true));

    axios
      .delete(`${NEWS_URL}/${id}`)
      .then(() => {
        dispatch(getNewsListAction());

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

/*========== Detail ==========*/
const getCMSNewsDetail = (id: string) => {
  if (!id) return;
  return (dispatch: Dispatch) => {
    APIServices.axiosConfig();

    dispatch(setFetching(true));

    axios
      .get(`${NEWS_URL}/${id}`)
      .then((res: AxiosResponse) => {
        dispatch({ type: newsActionType.SET_NEWS_DETAIL, payload: res?.data });

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

const updateNews = (id: string, body: INewsAPIBody) => {
  return (dispatch: Dispatch) => {
    APIServices.axiosConfig();
    return new Promise((resolve, reject) => {
      dispatch(setSubmitting(true));

      axios
        .put(`${NEWS_URL}/${id}`, body)
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

/*========== Create ==========*/
const createNews = (body: INewsAPIBody) => {
  return (dispatch: Dispatch) => {
    APIServices.axiosConfig();
    return new Promise((resolve, reject) => {
      dispatch(setSubmitting(true));

      axios
        .post(NEWS_URL, body)
        .then((res: AxiosResponse) => {
          ToastServices.success(ALERT_MESSAGE.CREATE_SUCCESS);

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

/*========== Visitor ==========*/
const getClientNewsListAction = () => {
  return ((dispatch: Dispatch, getState: () => StoreState) => {
    APIServices.axiosClientConfig();
    APIServices.setAxiosHeaders([{ key: 'x-language', value: 'en|km' }]);

    dispatch(setFetching(true));

    const storedQueries: ISharedCommonQueries = JSON.parse(
      JSON.stringify(getState()?.news?.queries),
    );
    const startPublishedAt = storedQueries?.startPublishedAt
      ? moment(storedQueries?.startPublishedAt).toISOString()
      : null;
    const endPublishedAt = storedQueries?.endPublishedAt
      ? moment(storedQueries?.endPublishedAt).toISOString()
      : null;
    let params: ISharedCommonQueries = {
      ...storedQueries,
      page: undefined,
      total: undefined,
      dateType: undefined,
      startPublishedAt,
      endPublishedAt,
      statuses: EStatus?.ACTIVE, /// active only, on visitor side.
      pillars: arrayToPipeString(storedQueries?.pillars),
    };
    params = removeFalseyObject(params);

    axios
      .get(CLIENT_NEWS_URL, { params })
      .then((res: AxiosResponse) => {
        const data = res?.data?.data;
        dispatch({
          type: newsActionType.GET_NEWS_LIST,
          payload: data.map((e: any) => new MNews(e)),
        });

        const metadata = res?.data.metadata;
        const localStates = { total: metadata?.total };
        dispatch({
          type: newsActionType.SET_NEWS_LOCAL_STATES,
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

export const newsActions = {
  createNews,
  updateNews,
  getCMSNewsDetail,
  getNewsListAction,
  resetListQueriesAction,
  setListLocalStatesAction,
  setListQueriesAction,
  setFetching,
  setSubmitting,
  toggleNewsStatusAction,
  getClientNewsListAction,
};
