import { EClassification } from '@shared/enum/classification.enum';
import { ICommonQueries } from '@shared/interfaces';
import { MClassification } from '@shared/models/classification.model';
import { APIServices } from '@shared/services/api.service';
import { ToastServices } from '@shared/services/toast.service';
import axios, { AxiosError, AxiosResponse } from 'axios';
import * as Redux from 'redux';
import { classificationTypes } from 'store/admin/classification/classification.action-type';

const CLASSIFICATIONS = '/admin/classifications';

const setClassifications = (
  type: EClassification,
  payload: MClassification[],
) => {
  return (dispatch: Redux.Dispatch) => {
    switch (type) {
      // get sectors
      case EClassification.SECTOR:
        return dispatch({ type: classificationTypes.GET_SECTORS, payload });
      case EClassification.PILLAR:
        return dispatch({ type: classificationTypes.GET_PILLARS, payload });
      case EClassification.PROJECT_STATUS:
        return dispatch({
          type: classificationTypes.GET_PROJECT_STATUS,
          payload,
        });
      case EClassification.ORGANIZATION:
        return dispatch({
          type: classificationTypes.GET_ORGANIZATIONS,
          payload,
        });
      case EClassification.REFERENCE_FILE_TYPE:
        return dispatch({
          type: classificationTypes.GET_REFERENCE_FILE_TYPES,
          payload,
        });
      default:
        break;
    }
  };
};

const getClassifications = (
  type: EClassification,
  payload?: ICommonQueries,
) => {
  return (dispatch: Redux.Dispatch) => {
    APIServices.axiosConfig();
    const params = { type, ...payload };
    axios
      .get(CLASSIFICATIONS, { params })
      .then((res: AxiosResponse) => {
        const classification = res?.data?.data?.map(
          (c: MClassification) => new MClassification(c),
        );
        dispatch(setClassifications(type, classification) as any);
      })
      .catch((errors: AxiosError) => {
        const message = errors?.response?.data?.message;
        ToastServices.error(message || 'Unspecific errors!');
      });
  };
};

const classificationActions = { getClassifications };

export default classificationActions;
