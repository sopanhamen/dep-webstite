import { dateGroupFilterValue } from '@shared/components/filters/date-group-filter';
import { metadataConstant } from '@shared/constant';
import { ISharedCommonQueries } from '@shared/interfaces';
import { ActivityStream } from '@shared/models/user-management/activity-stream.model';
import { activityActionType } from './activity-stream.action-types';

export interface ActivityStreamState {
  data: ActivityStream[];
  isFetching: boolean;
  localStates: ISharedCommonQueries;
  queries: ISharedCommonQueries;
}

const initialQueries: ISharedCommonQueries = {
  ...metadataConstant,
  search: '',
  page: 1,
  dateType: dateGroupFilterValue.CUSTOM.dateType,
  startCreatedAt: dateGroupFilterValue.CUSTOM.startDate,
  endCreatedAt: dateGroupFilterValue.CUSTOM.endDate,
  roles: [],
};

const initialStates: ActivityStreamState = {
  data: [],
  isFetching: false,
  queries: { ...initialQueries },
  localStates: { page: 1, total: 0 },
};

const ActivityStreamReducer = (state = initialStates, action: any) => {
  switch (action.type) {
    /*========== Loading ==========*/
    case activityActionType.SET_LOADING_LIST:
      return { ...state, isFetching: action.payload };

    case activityActionType.SET_LOADING_SUBMIT:
      return { ...state, isSubmitting: action.payload };

    /*========== List ==========*/
    case activityActionType.SET_ACTIVITY_LOCAL_STATES:
      return {
        ...state,
        localStates: { ...state.localStates, ...action.payload },
      };

    case activityActionType.SET_ACTIVITY_QUERIES:
      return { ...state, queries: { ...state.queries, ...action.payload } };

    case activityActionType.RESET_ACTIVITY_QUERIES:
      return { ...state, queries: initialQueries };

    case activityActionType.GET_ACTIVITY_LIST:
      return {
        ...state,
        data: action.payload,
      };
    default:
      return state;
  }
};

export default ActivityStreamReducer;
