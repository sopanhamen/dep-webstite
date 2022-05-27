import { IEventBody } from '@components/admin/user-management/events/add-event';
import { ALERT_MESSAGE } from '@shared/constant';
import { ELanguage } from '@shared/enum';
import { ICommonQueries, IToggle } from '@shared/interfaces';
import { MEvent } from '@shared/models/user-management/event.model';
import { APIServices } from '@shared/services/api.service';
import { ToastServices } from '@shared/services/toast.service';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Dispatch } from 'redux';
import store from 'store';
import * as EventService from 'store/services/user-management/event.service';
import { eventTypes } from './event.action-types';

const url = `${APIServices.apiUrlV1}`;

const getEventListAction = (payload: ICommonQueries, language: ELanguage) => {
  return async function (dispatch: Dispatch) {
    dispatch({
      type: eventTypes.GET_EVENTS_REQUEST,
    });

    try {
      const result = await EventService.getEventList(payload, language);

      return dispatch({
        type: eventTypes.GET_EVENTS_SUCCESS,
        data: {
          events: result.data.data.map((x) => new MEvent(x, language)),
          metadata: result.data.metadata,
        },
      });
    } catch (e: unknown) {
      const m =
        e instanceof Error ? e.message : ALERT_MESSAGE.UNKNOWN_ERROR_RETRY;

      ToastServices.error(m);

      dispatch({
        type: eventTypes.GET_EVENTS_FAILED,
      });
    }
  };
};

const toggleStatusAction = (id: string, payload: IToggle) => {
  return async function (dispatch: Dispatch) {
    dispatch({
      type: eventTypes.TOGGLE_EVENTS_REQUEST,
    });

    try {
      const currentEvents: MEvent[] =
        store?.state?.getState()?.userManagement.event.events;

      await EventService.toggleStatus(id, payload);

      const updatedEvents = currentEvents.map((e) =>
        e.id === id ? { ...e, ...payload } : { ...e },
      );

      ToastServices.success(ALERT_MESSAGE.DELETE_SUCCESS);

      return dispatch({
        type: eventTypes.TOGGLE_EVENTS_SUCCESS,
        data: { events: [...updatedEvents] },
      });
    } catch (e: unknown) {
      const m =
        e instanceof Error ? e.message : ALERT_MESSAGE.UNKNOWN_ERROR_RETRY;

      ToastServices.error(m);

      dispatch({
        type: eventTypes.TOGGLE_EVENTS_FAILED,
      });
    }
  };
};

const getEventHomepage = (payload: ICommonQueries, language: ELanguage) => {
  return async function (dispatch: Dispatch) {
    dispatch({ type: eventTypes.GET_EVENT_REQUEST });

    try {
      const result = await EventService.getCurrentEvent(payload, language);

      return dispatch({
        type: eventTypes.GET_EVENT_SUCCESS,
        data: {
          events: result.data.data.map((x) => new MEvent(x, language)),
        },
      });
    } catch (e: unknown) {
      const m =
        e instanceof Error ? e.message : ALERT_MESSAGE.UNKNOWN_ERROR_RETRY;

      ToastServices.error(m);

      dispatch({
        type: eventTypes.GET_EVENT_FAILED,
      });
    }
  };
};

const createEvent = (payload: IEventBody) => {
  return (dispatch: Dispatch) => {
    APIServices.axiosConfig();
    return new Promise((resolve, reject) => {
      axios
        .post(`${url}/admin/announcements`, payload)
        .then((res: AxiosResponse) => {
          const resetParams: ICommonQueries = {
            limit: 10,
            offset: 0,
            search: '',
          };
          dispatch(getEventListAction(resetParams, ELanguage.ENGLISH) as any);
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

const getEventDetail = (id: string) => {
  return (dispatch: Dispatch) => {
    APIServices.axiosConfig();
    axios
      .get(`${url}/admin/announcements/${id}`)
      .then((res: AxiosResponse) => {
        dispatch({
          type: eventTypes.GET_EVENT_DETAIL,
          data: res.data,
        });
      })
      .catch((errors: AxiosError) => {
        const message = errors?.response?.data?.message;
        ToastServices.error(message || ALERT_MESSAGE.UNKNOWN_ERROR_RETRY);
      });
  };
};

const updateEvent = (id: string, payload: IEventBody) => {
  return (dispatch: Dispatch) => {
    APIServices.axiosConfig();
    return new Promise((resolve, reject) => {
      axios
        .put(`${url}/admin/announcements/${id}`, payload)
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

const eventActions = {
  getEventListAction,
  toggleStatusAction,
  getEventHomepage,
  createEvent,
  getEventDetail,
  updateEvent,
};

export default eventActions;
