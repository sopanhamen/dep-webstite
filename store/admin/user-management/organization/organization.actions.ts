import { ALERT_MESSAGE } from '@shared/constant';
import { ELanguage } from '@shared/enum';
import { ICommonQueries, ICommonResponse, IToggle } from '@shared/interfaces';
import { MClassification } from '@shared/models/classification.model';
import { IUpdate } from '@shared/models/common.model';
import { Organization } from '@shared/models/user-management/organization.model';
import { ToastServices } from '@shared/services/toast.service';
import { AxiosResponse } from 'axios';
import { Dispatch } from 'redux';
import store from 'store';
import { classificationTypes } from 'store/admin/classification/classification.action-type';
import * as OrganizationService from 'store/services/user-management/organization.service';
import { OrganizationTypes } from './organization.action-types';

const getOrganizationListAction = (
  payload: ICommonQueries,
  language: ELanguage,
  isPublic?: boolean,
) => {
  return async function (dispatch: Dispatch) {
    dispatch({
      type: OrganizationTypes.GET_USER_ORGANIZATION_REQUEST,
    });

    try {
      let result: AxiosResponse<ICommonResponse<Organization>, any>;

      if (isPublic) {
        result = await OrganizationService.getOrganizationPublicList(
          payload,
          language,
        );
      } else {
        result = await OrganizationService.getOrganizationList(
          payload,
          language,
        );
      }

      return dispatch({
        type: OrganizationTypes.GET_USER_ORGANIZATION_SUCCESS,
        data: {
          organizations: result.data.data.map((x) => new Organization(x)),
          metadata: result.data.metadata,
        },
      });
    } catch (e: unknown) {
      const m =
        e instanceof Error ? e.message : ALERT_MESSAGE.UNKNOWN_ERROR_RETRY;

      ToastServices.error(m);

      dispatch({ type: OrganizationTypes.GET_USER_ORGANIZATION_FAILED });
    }
  };
};

const toggleStatusAction = (id: string, payload: IToggle) => {
  return async function (dispatch: Dispatch) {
    dispatch({
      type: OrganizationTypes.TOGGLE_USER_ORGANIZATION_STATUS_REQUEST,
    });

    try {
      const currentOrg: Organization[] =
        store?.state?.getState()?.userManagement.organization.organizations;

      await OrganizationService.toggleStatus(id, payload);

      const updatedOrg = currentOrg.map((e) =>
        e.id === id ? { ...e, ...payload } : { ...e },
      );

      ToastServices.success(ALERT_MESSAGE.UPDATE_SUCCESS);

      return dispatch({
        type: OrganizationTypes.TOGGLE_USER_ORGANIZATION_STATUS_SUCCESS,
        data: { organizations: [...updatedOrg] },
      });
    } catch (e: unknown) {
      const m =
        e instanceof Error ? e.message : ALERT_MESSAGE.UNKNOWN_ERROR_RETRY;

      ToastServices.error(m);

      dispatch({
        type: OrganizationTypes.TOGGLE_USER_ORGANIZATION_STATUS_FAILED,
      });
    }
  };
};

const createOrganization = (payload: Organization) => {
  return async (dispatch: Dispatch) => {
    return new Promise(async (resolve, reject) => {
      try {
        const resetParams: ICommonQueries = {
          limit: 10,
          offset: 0,
          search: '',
        };
        const res = await OrganizationService.createOrganization(payload);
        ToastServices.success('Organization Created');
        dispatch(
          getOrganizationListAction(resetParams, ELanguage.ENGLISH) as any,
        );
        resolve(res);
      } catch (e: unknown) {
        const m =
          e instanceof Error ? e?.message : ALERT_MESSAGE.UNKNOWN_ERROR_RETRY;
        ToastServices.error(m);
        reject(e);
      }
    });
  };
};

const setInitialSelectOpts = (res: AxiosResponse) => {
  return (dispatch: Dispatch) => {
    const { pillar, type, sectors: resSectors } = res?.data;

    const types = [new MClassification(type)];
    const pillars = [new MClassification(pillar)];
    const sectors = resSectors?.map(
      (sector: MClassification) => new MClassification(sector),
    );
    // set classifications for users selection while the API request for classification processing
    dispatch({ type: classificationTypes.GET_ORGANIZATIONS, payload: types });
    dispatch({ type: classificationTypes.GET_PILLARS, payload: pillars });
    dispatch({ type: classificationTypes.GET_SECTORS, payload: sectors });
  };
};

const getOrganization = (id: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await OrganizationService.getOrganization(id);

      dispatch(setInitialSelectOpts(res) as any);
      dispatch({
        type: OrganizationTypes.GET_USER_ORGANIZATION,
        data: {
          organizations: [new Organization(res?.data)],
        },
      });
      return Promise.resolve(res);
    } catch (e: unknown) {
      const m =
        e instanceof Error ? e?.message : ALERT_MESSAGE.UNKNOWN_ERROR_RETRY;
      ToastServices.error(m);
      return Promise.reject(m);
    }
  };
};

const updateOrganization = (payload: IUpdate<Organization>) => {
  return () => {
    return new Promise((resolve, reject) => {
      try {
        const res = OrganizationService.updateOrganization(payload);
        ToastServices.success('Organization Updated');
        resolve(res);
      } catch (e: unknown) {
        const m =
          e instanceof Error ? e?.message : ALERT_MESSAGE.UNKNOWN_ERROR_RETRY;
        ToastServices.error(m);
        reject(e);
      }
    });
  };
};

export const organizationActions = {
  getOrganizationListAction,
  toggleStatusAction,
  createOrganization,
  updateOrganization,
  getOrganization,
};
