import { ALERT_MESSAGE } from '@shared/constant';
import { removeFalseyObject } from '@shared/custom-function/common';
import { ISharedCommonQueries } from '@shared/interfaces';
import { APIServices } from '@shared/services/api.service';
import { ToastServices } from '@shared/services/toast.service';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Dispatch } from 'redux';
import { filterTypes } from './filter.action-types';

const PILLAR_ADMIN_URL = '/admin/classifications?type=PILLAR';
const PILLAR_URL = '/classifications?type=PILLAR';
const SECTOR_ADMIN_URL = '/admin/classifications?type=SECTOR';
const SECTOR_URL = '/classifications?type=SECTOR';
const ORGANIZATION_ADMIN_URL = '/admin/organizations';
const ORGANIZATION_URL = '/organizations';
const ROLE_ADMIN_URL = '/admin/roles';
const ROLE_URL = '/roles';
const EXTENSIONS_URL = '/resource-hubs/extensions';
const TYPE_URL = '/classifications?type=REFERENCE-FILE-TYPE';
const STAKEHOLDER_URL = '/organizations?type=STAKEHOLDER';

/*========== Pillar ==========*/
const setPillarFilterLoadingAction = (isLoading: boolean) => {
  return ((dispatch: Dispatch) => {
    dispatch({
      type: filterTypes.SET_PILLAR_FILTER_LOADING,
      payload: isLoading,
    });
  }) as any;
};

const resetPillarFilterListAction = (
  forAdmin: boolean = true,
  params: ISharedCommonQueries,
) => {
  return (dispatch: Dispatch) => {
    forAdmin ? APIServices.axiosConfig() : APIServices.axiosClientConfig();

    dispatch(setPillarFilterLoadingAction(true));

    params = removeFalseyObject(params);

    axios
      .get(forAdmin ? PILLAR_ADMIN_URL : PILLAR_URL, { params })
      .then((res: AxiosResponse) => {
        const data = res?.data?.data;
        dispatch({ type: filterTypes.RESET_PILLAR_FILTER_LIST, payload: data });

        dispatch(setPillarFilterLoadingAction(false));
      })
      .catch((err: AxiosError) => {
        dispatch(setPillarFilterLoadingAction(false));
        const msg =
          err?.response?.data?.message || ALERT_MESSAGE.UNKNOWN_ERROR_RETRY;
        ToastServices.error(msg);
      });
  };
};

/*========== Sector ==========*/
const setSectorFilterLoadingAction = (isLoading: boolean) => {
  return ((dispatch: Dispatch) => {
    dispatch({
      type: filterTypes.SET_SECTOR_FILTER_LOADING,
      payload: isLoading,
    });
  }) as any;
};

const resetSectorFilterListAction = (
  forAdmin: boolean = true,
  params: ISharedCommonQueries,
) => {
  return (dispatch: Dispatch) => {
    forAdmin ? APIServices.axiosConfig() : APIServices.axiosClientConfig();

    dispatch(setSectorFilterLoadingAction(true));

    params = removeFalseyObject(params);

    axios
      .get(forAdmin ? SECTOR_ADMIN_URL : SECTOR_URL, { params })
      .then((res: AxiosResponse) => {
        const data = res?.data?.data;
        dispatch({ type: filterTypes.RESET_SECTOR_FILTER_LIST, payload: data });

        dispatch(setSectorFilterLoadingAction(false));
      })
      .catch((err: AxiosError) => {
        dispatch(setSectorFilterLoadingAction(false));
        const msg =
          err?.response?.data?.message || ALERT_MESSAGE.UNKNOWN_ERROR_RETRY;
        ToastServices.error(msg);
      });
  };
};

/*========== Organization ==========*/
const setOrganizationFilterLoadingAction = (isLoading: boolean) => {
  return ((dispatch: Dispatch) => {
    dispatch({
      type: filterTypes.SET_ORGANIZATION_FILTER_LOADING,
      payload: isLoading,
    });
  }) as any;
};

const resetOrganizationFilterListAction = (
  forAdmin: boolean = true,
  params: ISharedCommonQueries,
) => {
  return (dispatch: Dispatch) => {
    forAdmin ? APIServices.axiosConfig() : APIServices.axiosClientConfig();

    dispatch(setOrganizationFilterLoadingAction(true));

    params = removeFalseyObject(params);

    axios
      .get(forAdmin ? ORGANIZATION_ADMIN_URL : ORGANIZATION_URL, { params })
      .then((res: AxiosResponse) => {
        const data = res?.data?.data;
        dispatch({
          type: filterTypes.RESET_ORGANIZATION_FILTER_LIST,
          payload: data,
        });

        dispatch(setOrganizationFilterLoadingAction(false));
      })
      .catch((err: AxiosError) => {
        dispatch(setOrganizationFilterLoadingAction(false));
        const msg =
          err?.response?.data?.message || ALERT_MESSAGE.UNKNOWN_ERROR_RETRY;
        ToastServices.error(msg);
      });
  };
};

/*========== Role ==========*/
const setRoleFilterLoadingAction = (isLoading: boolean) => {
  return ((dispatch: Dispatch) => {
    dispatch({ type: filterTypes.SET_ROLE_FILTER_LOADING, payload: isLoading });
  }) as any;
};

const resetRoleFilterListAction = (
  forAdmin: boolean = true,
  params: ISharedCommonQueries,
) => {
  return (dispatch: Dispatch) => {
    forAdmin ? APIServices.axiosConfig() : APIServices.axiosClientConfig();

    dispatch(setRoleFilterLoadingAction(true));

    params = removeFalseyObject(params);

    axios
      .get(forAdmin ? ROLE_ADMIN_URL : ROLE_URL, { params })
      .then((res: AxiosResponse) => {
        const data = res?.data?.data;
        dispatch({ type: filterTypes.RESET_ROLE_FILTER_LIST, payload: data });

        dispatch(setRoleFilterLoadingAction(false));
      })
      .catch((err: AxiosError) => {
        dispatch(setRoleFilterLoadingAction(false));
        const msg =
          err?.response?.data?.message || ALERT_MESSAGE.UNKNOWN_ERROR_RETRY;
        ToastServices.error(msg);
      });
  };
};

/*========== Type ==========*/
const setTypeFilterLoadingAction = (isLoading: boolean) => {
  return ((dispatch: Dispatch) => {
    dispatch({
      type: filterTypes.SET_REFERENCE_FILE_TYPE_FILTER_LOADING,
      payload: isLoading,
    });
  }) as any;
};

const resetTypeFilterListAction = (
  forAdmin: boolean = true,
  params: ISharedCommonQueries,
) => {
  return (dispatch: Dispatch) => {
    forAdmin ? APIServices.axiosConfig() : APIServices.axiosClientConfig();
    APIServices.setAxiosHeaders([{ key: 'x-language', value: 'en|km' }]);

    dispatch(setTypeFilterLoadingAction(true));

    params = removeFalseyObject(params);

    axios
      .get(TYPE_URL, { params })
      .then((res: AxiosResponse) => {
        const data = res?.data?.data;

        dispatch({
          type: filterTypes.RESET_REFERENCE_FILE_TYPE_FILTER_LIST,
          payload: data,
        });
        const metadata = res?.data.metadata;

        dispatch(setTypeFilterLoadingAction(false));
      })
      .catch((err: AxiosError) => {
        dispatch(setTypeFilterLoadingAction(false));
        const msg =
          err?.response?.data?.message || ALERT_MESSAGE.UNKNOWN_ERROR_RETRY;
        ToastServices.error(msg);
      });
  };
};

/*========== Extensions ==========*/
const setExtenstionsFilterLoadingAction = (isLoading: boolean) => {
  return ((dispatch: Dispatch) => {
    dispatch({
      type: filterTypes.SET_EXTENSIONS_FILTER_LOADING,
      payload: isLoading,
    });
  }) as any;
};

const resetExtensionsFilterListAction = (forAdmin: boolean = true) => {
  return (dispatch: Dispatch) => {
    forAdmin ? APIServices.axiosConfig() : APIServices.axiosClientConfig();

    dispatch(setExtenstionsFilterLoadingAction(true));

    axios
      .get(EXTENSIONS_URL)
      .then((res: AxiosResponse) => {
        const data = res?.data?.extensions;
        dispatch({
          type: filterTypes.RESET_EXTENSIONS_FILTER_LIST,
          payload: data,
        });

        dispatch(setExtenstionsFilterLoadingAction(false));
      })
      .catch((err: AxiosError) => {
        dispatch(setExtenstionsFilterLoadingAction(false));
        const msg =
          err?.response?.data?.message || ALERT_MESSAGE.UNKNOWN_ERROR_RETRY;
        ToastServices.error(msg);
      });
  };
};

export const filterActions = {
  /*========== Pillar ==========*/
  setPillarFilterLoadingAction,
  resetPillarFilterListAction,
  /*========== Sector ==========*/
  setSectorFilterLoadingAction,
  resetSectorFilterListAction,
  /*========== Organization ==========*/
  setOrganizationFilterLoadingAction,
  resetOrganizationFilterListAction,
  /*========== Organization ==========*/
  setRoleFilterLoadingAction,
  resetRoleFilterListAction,

  /*========== Extenstions ==========*/
  setTypeFilterLoadingAction,
  resetTypeFilterListAction,

  /*========== Extenstions ==========*/
  setExtenstionsFilterLoadingAction,
  resetExtensionsFilterListAction,
};
