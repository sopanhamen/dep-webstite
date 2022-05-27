import { IClassification, ISharedCommonQueries } from '@shared/interfaces';
import { filterTypes } from './filter.action-types';

export interface FilterState extends Partial<ISharedCommonQueries> {
  data: IClassification[];
  isFetching: boolean;
  queries: ISharedCommonQueries;
}

export interface AllFilterState {
  pillar: FilterState;
  sector: FilterState;
  organization: FilterState;
  role: FilterState;
  fileType: FilterState;
  extension: FilterState;
}

const initFilterState: FilterState = {
  data: [],
  isFetching: false,
  queries: {
    limit: 0,
    offset: 0,
    statuses: ['ACTIVE'],
  },
};

export const initAllFilterState: AllFilterState = {
  pillar: initFilterState,
  sector: initFilterState,
  organization: initFilterState,
  role: initFilterState,
  fileType: initFilterState,
  extension: initFilterState,
};

const FilterReducer = (state = initAllFilterState, action: any) => {
  switch (action.type) {
    /*========== Pillar ==========*/
    case filterTypes.SET_PILLAR_FILTER_LOADING:
      return {
        ...state,
        pillar: { ...state?.pillar, isFetching: action.payload },
      };

    case filterTypes.RESET_PILLAR_FILTER_LIST:
      return { ...state, pillar: { ...state?.pillar, data: action.payload } };

    /*========== Sector ==========*/
    case filterTypes.SET_SECTOR_FILTER_LOADING:
      return {
        ...state,
        sector: { ...state?.sector, isFetching: action.payload },
      };

    case filterTypes.RESET_SECTOR_FILTER_LIST:
      return { ...state, sector: { ...state?.sector, data: action.payload } };

    /*========== Organization ==========*/
    case filterTypes.SET_ORGANIZATION_FILTER_LOADING:
      return {
        ...state,
        organization: { ...state?.organization, isFetching: action.payload },
      };

    case filterTypes.RESET_ORGANIZATION_FILTER_LIST:
      return {
        ...state,
        organization: { ...state?.organization, data: action.payload },
      };

    /*========== Role ==========*/
    case filterTypes.SET_ROLE_FILTER_LOADING:
      return { ...state, role: { ...state?.role, isFetching: action.payload } };

    case filterTypes.RESET_ORGANIZATION_FILTER_LIST:
      return { ...state, role: { ...state?.role, data: action.payload } };

    /*========== File Type ==========*/
    case filterTypes.SET_REFERENCE_FILE_TYPE_FILTER_LOADING:
      return {
        ...state,
        fileType: { ...state?.fileType, isFetching: action.payload },
      };

    case filterTypes.RESET_REFERENCE_FILE_TYPE_FILTER_LIST:
      return {
        ...state,
        fileType: { ...state?.fileType, data: action.payload },
      };

    /*========== Extension ==========*/
    case filterTypes.SET_EXTENSIONS_FILTER_LOADING:
      return {
        ...state,
        extension: { ...state?.extension, isFetching: action.payload },
      };

    case filterTypes.RESET_EXTENSIONS_FILTER_LIST:
      return {
        ...state,
        extension: { ...state?.extension, data: action.payload },
      };

    default:
      return state;
  }
};

export default FilterReducer;
