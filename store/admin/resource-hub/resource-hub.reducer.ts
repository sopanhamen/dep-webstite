import { dateGroupFilterValue } from '@shared/components/filters/date-group-filter';
import { metadataConstant } from '@shared/constant';
import { IMetadata, ISharedCommonQueries } from '@shared/interfaces';
import { IResourceHub } from '@shared/interfaces/resource-hub';
import { EPillar } from '@shared/enum';
import { ResourceHubCardModel } from '@shared/models/resource-hub-card.model';
import {
  IResourceHubDetail,
  MResourceHub,
} from '@shared/models/resource-hub.model';
import { resourceActionTypes } from 'store/admin/resource-hub/resource-hub.action-types';

export interface ResourceHubState {
  data: ResourceHubCardModel[];
  resourceHubs: MResourceHub[];
  queries: ISharedCommonQueries;
  metadata: IMetadata;
  isLoading: boolean;
  organizations: [];
  resourceHubDetail: IResourceHub;
  localStates: ISharedCommonQueries;
  resourceHubClientDetail?: IResourceHubDetail | null;
}

const initialQueries: ISharedCommonQueries = {
  limit: 10,
  offset: 0,
  search: '',
  page: 1,
  dateType: dateGroupFilterValue.CUSTOM.dateType,
  startCreatedAt: dateGroupFilterValue.CUSTOM.startDate,
  endCreatedAt: dateGroupFilterValue.CUSTOM.endDate,
  orders: '',
  pillars: [],
  sectors: [],
  regoin: [],
  province: [],
  fileTypes: [],
  extensions: [],
};

const initialStates: ResourceHubState = {
  data: [],
  resourceHubs: [],
  queries: initialQueries,
  metadata: metadataConstant,
  isLoading: false,
  organizations: [],
  resourceHubDetail: {},
  localStates: { page: 1, total: 0 },
  resourceHubClientDetail: null,
};

const ResourceHubReducer = (state = initialStates, action: any) => {
  switch (action.type) {
    case resourceActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case resourceActionTypes.SET_FILTER:
      return { ...state, queries: action.payload };
    case resourceActionTypes.RESET_FILTER:
      return { ...state, queries: initialQueries };
    case resourceActionTypes.GET_ORGANZATIONS:
      return { ...state, organizations: action.payload };
    case resourceActionTypes.GET_RESOURCE_HUB_DETAIL:
      return { ...state, resourceHubDetail: action.data };

    /*==========Client List ==========*/
    case resourceActionTypes.SET_RESOURCE_QUERIES:
      return { ...state, queries: { ...state.queries, ...action.payload } };
    case resourceActionTypes.GET_RESOURCE_HUBS:
      return {
        ...state,
        ...action.payload,
      };

    case resourceActionTypes.RESET_RESOURCE_HUBS_QUERIES:
      return { ...state, queries: initialQueries };
    case resourceActionTypes.SET_RESOURCE_HUBS_LOCAL_STATES:
      return {
        ...state,
        localStates: { ...state.localStates, ...action.payload },
      };

    case resourceActionTypes.GET_RESOURCE_HUBS_LIST:
      return {
        ...state,
        data: action.payload,
      };

    case resourceActionTypes.GET_RESOURCE_HUBS_DETAIL:
      return { ...state, resourceHubDetail: action.data as any };

    default:
      return state;
  }
};

export default ResourceHubReducer;
