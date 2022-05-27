import { IResourceHubBody } from '@components/admin/resource-hub/add-resource';
import { IOrganization } from '@shared/models/organization.model';
import { ALERT_MESSAGE } from '@shared/constant';
import { removeFalseyObject } from '@shared/custom-function/common';
import { arrayToPipeString } from '@shared/custom-function/conversion';
import { EStatus } from '@shared/enum';
import { ICommonQueries, ISharedCommonQueries } from '@shared/interfaces';
import { ResourceHubCardModel } from '@shared/models/resource-hub-card.model';
import { MResourceHub } from '@shared/models/resource-hub.model';
import { APIServices } from '@shared/services/api.service';
import { ToastServices } from '@shared/services/toast.service';
import axios, { AxiosError, AxiosResponse } from 'axios';
import _ from 'lodash';
import moment from 'moment';
import { Dispatch } from 'redux';
import { resourceActionTypes } from 'store/admin/resource-hub/resource-hub.action-types';
import { StoreState } from 'store/root-reducer';

const RESOURCE = 'admin/resource-hubs';
const ORGANZATION = 'admin/organizations';
const ClIENT_RESOURCE = APIServices.apiUrlV1 + '/resource-hubs';

const setLoading = (payload: boolean) => {
  return (dispatch: Dispatch) => {
    dispatch({ type: resourceActionTypes.SET_LOADING, payload });
  };
};

const setFilter = (queries: ICommonQueries) => {
  return (dispatch: Dispatch, getState: () => StoreState) => {
    const resourceQueries = getState()?.resourceHub?.queries;
    const payload = { ...resourceQueries, ...queries };
    dispatch({ type: resourceActionTypes.SET_FILTER, payload });
  };
};

const resetFilter = () => {
  return (dispatch: Dispatch) => {
    dispatch({ type: resourceActionTypes.RESET_FILTER });
  };
};

const getResourceHubs = () => {
  return (dispatch: Dispatch, getState: () => StoreState) => {
    APIServices.axiosConfig();
    dispatch(setLoading(true) as any);
    const queries = _.cloneDeep(getState()?.resourceHub?.queries);
    const startCreatedAt = queries?.startCreatedAt
      ? moment(queries?.startCreatedAt).toISOString()
      : null;
    const endCreatedAt = queries?.endCreatedAt
      ? moment(queries?.endCreatedAt).toISOString()
      : null;

    // remove page field before send it to API
    const params = {
      ..._.omit(queries, [
        'page',
        'dateType',
        'startCreatedAt',
        'endCreatedAt',
        queries?.orders ? '' : 'orders',
      ]),
      startCreatedAt,
      endCreatedAt,
    };

    axios
      .get(RESOURCE, { params: { ...params, startCreatedAt, endCreatedAt } })
      .then((res: AxiosResponse) => {
        const { data, metadata } = res?.data;
        const resourceHubs = data?.map(
          (resource: MResourceHub) => new MResourceHub(resource),
        );
        const payload = { resourceHubs, metadata };
        dispatch({ type: resourceActionTypes.GET_RESOURCE_HUBS, payload });
        dispatch(setLoading(false) as any);
      })
      .catch((errors: AxiosError) => {
        const message = errors?.response?.data?.message;
        ToastServices.error(message || ALERT_MESSAGE.UNKNOWN_ERROR_RETRY);
        dispatch(setLoading(false) as any);
      });
  };
};

const toggleResourceHub = (id: string) => {
  return (dispatch: Dispatch, getState: () => StoreState) => {
    const { metadata, resourceHubs } = getState()?.resourceHub;
    dispatch(setLoading(true) as any);

    axios
      .delete(`${RESOURCE}/${id}`)
      .then(() => {
        const updatedResource = resourceHubs?.map((resource: MResourceHub) => {
          const checkedStatus =
            resource?.status === EStatus.ACTIVE
              ? EStatus?.INACTIVE
              : EStatus.ACTIVE;
          return {
            ...resource,
            status: resource?.id === id ? checkedStatus : resource?.status,
          };
        });
        const payload = { resourceHubs: updatedResource, metadata };
        dispatch({ type: resourceActionTypes.GET_RESOURCE_HUBS, payload });
        ToastServices.success('Resource Hub Updated');
        dispatch(setLoading(false) as any);
      })
      .catch((errors: AxiosError) => {
        dispatch(setLoading(false) as any);
        const message = errors?.response?.data?.message;
        ToastServices.error(message || ALERT_MESSAGE.UNKNOWN_ERROR_RETRY);
      });
  };
};

const createResourceHub = (payload: IResourceHubBody) => {
  return (dispatch: Dispatch) => {
    APIServices.axiosConfig();
    return new Promise((resolve, reject) => {
      axios
        .post(`${RESOURCE}`, payload)
        .then((res: AxiosResponse) => {
          dispatch(getResourceHubs() as any);
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

const getResourceHubDetail = (id: string) => {
  return (dispatch: Dispatch) => {
    APIServices.axiosConfig();
    dispatch(setLoading(true) as any);
    axios
      .get(`${RESOURCE}/${id}`)
      .then((res: AxiosResponse) => {
        dispatch(setLoading(false) as any);
        dispatch({
          type: resourceActionTypes.GET_RESOURCE_HUB_DETAIL,
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

const updateResourceHub = (id: string, payload: IResourceHubBody) => {
  return (dispatch: Dispatch) => {
    APIServices.axiosConfig();
    dispatch(setLoading(true) as any);
    return new Promise((resolve, reject) => {
      axios
        .put(`${RESOURCE}/${id}`, payload)
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

const getOrganzations = () => {
  return (dispatch: Dispatch, getState: () => StoreState) => {
    APIServices.axiosConfig();

    const params = {
      status: EStatus.ACTIVE,
      limit: 0,
      offset: 0,
      search: '',
    };

    axios
      .get(ORGANZATION, { params })
      .then((res: AxiosResponse) => {
        const { data } = res?.data;
        const newOrganzations = data?.map((item: IOrganization) => {
          return {
            label: item?.name,
            value: item?.code,
          };
        });
        const payload = newOrganzations;
        dispatch({ type: resourceActionTypes.GET_ORGANZATIONS, payload });
      })
      .catch((errors: AxiosError) => {
        const message = errors?.response?.data?.message;
        ToastServices.error(message || ALERT_MESSAGE.UNKNOWN_ERROR_RETRY);
      });
  };
};

const getClientResourceHubsList = () => {
  return ((dispatch: Dispatch, getState: () => StoreState) => {
    APIServices.axiosClientConfig();
    APIServices.setAxiosHeaders([{ key: 'x-language', value: 'en|km' }]);

    dispatch(setLoading(true) as any);

    const storedQueries: ISharedCommonQueries = JSON.parse(
      JSON.stringify(getState()?.resourceHub?.queries),
    );
    const startCreatedAt = storedQueries?.startCreatedAt
      ? moment(storedQueries?.startCreatedAt).toISOString()
      : null;
    const endCreatedAt = storedQueries?.endCreatedAt
      ? moment(storedQueries?.endCreatedAt).toISOString()
      : null;

    // remove page field before send it to API
    let params = {
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
      fileTypes: arrayToPipeString(storedQueries?.fileTypes),
      extensions: arrayToPipeString(storedQueries?.extensions),
    };
    params = removeFalseyObject(params) as any;

    axios
      .get(ClIENT_RESOURCE, {
        params: { ...params },
      })
      .then((res: AxiosResponse) => {
        const data = res?.data?.data;
        dispatch({
          type: resourceActionTypes.GET_RESOURCE_HUBS_LIST,
          payload: data.map((e: any) => new ResourceHubCardModel(e)),
        });

        const metadata = res?.data.metadata;
        const localStates = { total: metadata?.total };
        dispatch({
          type: resourceActionTypes.SET_RESOURCE_HUBS_LOCAL_STATES,
          payload: localStates,
        });

        dispatch(setLoading(true) as any);
      })
      .catch((err: AxiosError) => {
        dispatch(setLoading(true) as any);
        const msg =
          err?.response?.data?.message || ALERT_MESSAGE.UNKNOWN_ERROR_RETRY;
        ToastServices.error(msg);
      });
  }) as any;
};

/*==========Client Resource Hub Detail ==========*/
const getClientResourceHubDetail = (id: string) => {
  return (dispatch: Dispatch) => {
    APIServices.axiosClientConfig();

    axios
      .get(`${ClIENT_RESOURCE}/${id}`)
      .then((res: AxiosResponse) => {
        dispatch({
          type: resourceActionTypes.GET_RESOURCE_HUBS_DETAIL,
          data: res.data,
        });
      })

      .catch((errors: AxiosError) => {
        const message = errors?.response?.data?.message;
        ToastServices.error(message || ALERT_MESSAGE.UNKNOWN_ERROR_RETRY);
      });
  };
};

const ResourceHubActions = {
  getResourceHubs,
  setLoading,
  setFilter,
  resetFilter,
  toggleResourceHub,
  createResourceHub,
  getResourceHubDetail,
  updateResourceHub,
  getOrganzations,
  getClientResourceHubsList,
  getClientResourceHubDetail,
};

export default ResourceHubActions;
