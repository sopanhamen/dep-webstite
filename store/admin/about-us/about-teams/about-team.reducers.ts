import { metadataConstant } from '@shared/constant';
import { IMetadata, ISharedCommonQueries } from '@shared/interfaces';
import { MAboutTeams } from '@shared/models/about-us/about-team';
import { aboutTeamTypes } from './about-team.action-types';

export interface AboutTeamState {
  aboutTeams: MAboutTeams[];
  metadata: IMetadata;
  isLoading: boolean;
  queries: ISharedCommonQueries;
}

const initialQueries: ISharedCommonQueries = {
  limit: 10,
  offset: 0,
  search: '',
  page: 1,
  orders: '',
};

const initialStates: AboutTeamState = {
  aboutTeams: [],
  queries: initialQueries,
  isLoading: false,
  metadata: metadataConstant,
};

const AboutTeamReducer = (state = initialStates, action: any) => {
  switch (action.type) {
    case aboutTeamTypes.GET_ABOUT_TEAMS:
      return {
        ...state,
        ...action.payload,
      };
    case aboutTeamTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case aboutTeamTypes.SET_FILTER:
      return { ...state, queries: action.payload };
    default:
      return state;
  }
};

export default AboutTeamReducer;
