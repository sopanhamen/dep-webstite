import { dateGroupFilterValue } from '@shared/components/filters/date-group-filter';
import { metadataConstant } from '@shared/constant';
import { EChartType } from '@shared/enum';
import { ISharedCommonQueries } from '@shared/interfaces';
import { IDEPillarsDetail, MDETracker } from '@shared/models/de-tracker.model';
import { MFileImport } from '@shared/models/common.model';
import { deTrackerActionType } from './de-trackers.action-types';

export interface DETrackerState {
  listPillars: MDETracker[];
  data: MDETracker[];
  isFetching: boolean;
  queries: ISharedCommonQueries;
  localStates: ISharedCommonQueries;
  pillarsDetail: IDEPillarsDetail | null;
  formArrayChartTypes: EChartType[];
  importedFiles: MFileImport[];
  chartsData: any[];
}

const initialQueries: ISharedCommonQueries = {
  ...metadataConstant,
  search: '',
  page: 1,
  pillar: '',
  statuses: ['ACTIVE'],
};

export const deTrackerInitialStates: DETrackerState = {
  listPillars: [],
  data: [],
  isFetching: false,
  queries: { ...initialQueries },
  localStates: { page: 1, total: 0 },
  pillarsDetail: null,
  formArrayChartTypes: [EChartType?.PIE],
  importedFiles: [],
  chartsData: [],
};

const DETrackerReducer = (state = deTrackerInitialStates, action: any) => {
  switch (action.type) {
    /*========== Loading ==========*/
    case deTrackerActionType.SET_LOADING_LIST:
      return { ...state, isFetching: action.payload };

    /*========== Pillars List ==========*/
    case deTrackerActionType.GET_PILLAR_TRACKER_LIST:
      return {
        ...state,
        listPillars: action.payload,
      };

    /*==========Tracker by Pillars  ==========*/

    case deTrackerActionType.SET_TRACKER_BY_PILLARS_LOCAL_STATES:
      return {
        ...state,
        localStates: { ...state.localStates, ...action.payload },
      };

    case deTrackerActionType.SET_TRACKER_BY_PILLARS_QUERIES:
      return { ...state, queries: { ...state.queries, ...action.payload } };

    case deTrackerActionType.RESET_TRACKER_BY_PILLARS_QUERIES:
      return { ...state, queries: initialQueries };

    case deTrackerActionType.GET_TRACKER_BY_PILLARS_LIST:
      return {
        ...state,
        data: action.payload,
      };

    /*==========Pillars Detail ==========*/
    case deTrackerActionType.SET_PILLAR_DETAIL:
      return { ...state, pillarsDetail: action?.payload };

    case deTrackerActionType.SET_CURRENT_CHART_TYPE:
      return { ...state, formArrayChartTypes: action?.payload };

    case deTrackerActionType.SET_IMPORTED_FILES:
      return { ...state, importedFiles: action?.payload };

    case deTrackerActionType.SET_CHARTS_DATA:
      return { ...state, chartsData: action?.payload };

    default:
      return state;
  }
};

export default DETrackerReducer;
