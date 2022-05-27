import { ALERT_MESSAGE } from '@shared/constant';
import { ICommonQueries } from '@shared/interfaces';
import { APIServices } from '@shared/services/api.service';
import { ToastServices } from '@shared/services/toast.service';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Dispatch } from 'redux';
import { StoreState } from 'store/root-reducer';
import { aboutTeamTypes } from './about-team.action-types';
import _ from 'lodash';
import { MAboutTeams } from '@shared/models/about-us/about-team';

const ABOUT_TEAMS = 'admin/organizations';

const setLoading = (payload: boolean) => {
  return (dispatch: Dispatch) => {
    dispatch({ type: aboutTeamTypes.SET_LOADING, payload });
  };
};

const setFilter = (queries: ICommonQueries) => {
  return (dispatch: Dispatch, getState: () => StoreState) => {
    const aboutUsQueries = getState()?.aboutUs?.aboutTeams?.queries;
    const payload = { ...aboutUsQueries, ...queries };
    dispatch({ type: aboutTeamTypes.SET_FILTER, payload });
  };
};

const getAboutTeams = () => {
  return (dispatch: Dispatch, getState: () => StoreState) => {
    APIServices.axiosConfig();
    dispatch(setLoading(true) as any);
    const queries = _.cloneDeep(getState()?.aboutUs?.aboutTeams?.queries);

    // remove page field before send it to API
    const params = {
      ..._.omit(queries, ['page', queries?.orders ? '' : 'orders']),
    };

    axios
      .get(ABOUT_TEAMS, { params: { ...params, status: 'ACTIVE' } })
      .then((res: AxiosResponse) => {
        const { data, metadata } = res?.data;
        const aboutTeams = data?.map(
          (data: MAboutTeams) => new MAboutTeams(data),
        );
        const payload = { aboutTeams, metadata };
        dispatch({ type: aboutTeamTypes.GET_ABOUT_TEAMS, payload });
        dispatch(setLoading(false) as any);
      })
      .catch((errors: AxiosError) => {
        const message = errors?.response?.data?.message;
        ToastServices.error(message || ALERT_MESSAGE.UNKNOWN_ERROR_RETRY);
        dispatch(setLoading(false) as any);
      });
  };
};

const AboutTeamActions = {
  setLoading,
  getAboutTeams,
  setFilter,
};

export default AboutTeamActions;
