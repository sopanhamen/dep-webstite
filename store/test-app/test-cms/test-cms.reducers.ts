import { dateGroupFilterValue } from '@shared/components/filters/date-group-filter';
import { metadataConstant } from '@shared/constant';
import { ISharedCommonQueries } from '@shared/interfaces';
import { TestCMSProject } from '@shared/models/test-cms.model';
import { testCMSTypes } from './test-cms.action-types';

export interface TestCMSState {
  data: TestCMSProject[];
  isFetching: boolean;
  isSubmitting: boolean;
  queries: ISharedCommonQueries;
  localStates: ISharedCommonQueries;
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
  sectors: [],
  owners: [],
  partners: [],
};

export const testCMSInitialStates: TestCMSState = {
  data: [],
  isFetching: false,
  isSubmitting: false,
  queries: {
    ...initialQueries,
  },
  localStates: {
    page: 1,
    total: 0,
  },
};

const TestCMSReducer = (state = testCMSInitialStates, action: any) => {
  switch (action.type) {
    /*========== Loading ==========*/
    case testCMSTypes.SET_LOADING_LIST:
      return { ...state, isFetching: action.payload };

    case testCMSTypes.SET_LOADING_SUBMIT:
      return { ...state, isSubmitting: action.payload };

    /*========== List ==========*/
    case testCMSTypes.SET_TEST_CMS_LIST_LOCAL_STATES:
      return {
        ...state,
        localStates: { ...state.localStates, ...action.payload },
      };

    case testCMSTypes.SET_TEST_CMS_LIST_QUERIES:
      return { ...state, queries: { ...state.queries, ...action.payload } };

    case testCMSTypes.RESET_TEST_CMS_LIST_QUERIES:
      return { ...state, queries: initialQueries };

    case testCMSTypes.GET_TEST_CMS_LIST:
      return {
        ...state,
        data: action.payload,
      };

    case testCMSTypes.TOGGLE_TEST_CMS_STATUS:
      return { ...state, data: action.payload };

    default:
      return state;
  }
};

export default TestCMSReducer;
