import { dateGroupFilterValue } from '@shared/components/filters/date-group-filter';
import { metadataConstant } from '@shared/constant';
import { ISharedCommonQueries } from '@shared/interfaces';
import { INewsDetail, MNews } from '@shared/models/news.model';
import { newsActionType } from './news.action-types';

export interface NewsState {
  data: MNews[];
  isFetching: boolean;
  isSubmitting: boolean;
  localStates: ISharedCommonQueries;
  queries: ISharedCommonQueries;
  newsDetail?: INewsDetail;
}

const initialQueries: ISharedCommonQueries = {
  ...metadataConstant,
  search: '',
  page: 1,
  dateType: dateGroupFilterValue.CUSTOM.dateType,
  startCreatedAt: dateGroupFilterValue.CUSTOM.startDate,
  endCreatedAt: dateGroupFilterValue.CUSTOM.endDate,
  statuses: ['ACTIVE'],
  pillars: [],
};

export const newsInitialStates: NewsState = {
  data: [],
  isFetching: false,
  isSubmitting: false,
  queries: { ...initialQueries },
  localStates: { page: 1, total: 0 },
  newsDetail: undefined,
};

const NewsReducer = (state = newsInitialStates, action: any) => {
  switch (action.type) {
    /*========== Loading ==========*/
    case newsActionType.SET_LOADING_LIST:
      return { ...state, isFetching: action.payload };

    case newsActionType.SET_LOADING_SUBMIT:
      return { ...state, isSubmitting: action.payload };

    /*========== List ==========*/
    case newsActionType.SET_NEWS_LOCAL_STATES:
      return {
        ...state,
        localStates: { ...state.localStates, ...action.payload },
      };

    case newsActionType.SET_NEWS_QUERIES:
      return { ...state, queries: { ...state.queries, ...action.payload } };

    case newsActionType.RESET_NEWS_QUERIES:
      return { ...state, queries: initialQueries };

    case newsActionType.GET_NEWS_LIST:
      return {
        ...state,
        data: action.payload,
      };

    /*========== Detail ==========*/
    case newsActionType.SET_NEWS_DETAIL:
      return { ...state, newsDetail: action?.payload };

    default:
      return state;
  }
};

export default NewsReducer;
