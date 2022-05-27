import { IReducerAction } from '@shared/interfaces';
import { Banner } from '@shared/models/banner.model';
import { BannerTypes } from './banner.action-types';

export interface BannerState {
  banners: Banner[];
  currentBanner: Banner | null;
  isFetching: boolean;
}

const initialStates: BannerState = {
  banners: [],
  currentBanner: null,
  isFetching: false,
};

const BannerReducer = (
  state = initialStates,
  action: IReducerAction<Banner>,
) => {
  switch (action.type) {
    case BannerTypes.GET_BANNERS_REQUEST:
    case BannerTypes.CREATE_BANNERS_REQUEST:
    case BannerTypes.GET_CLIENT_BANNERS_REQUEST:
      return { ...state, isFetching: true };
    case BannerTypes.GET_BANNERS_SUCCESS:
    case BannerTypes.CREATE_BANNERS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        banners: action.data?.banners,
      };
    case BannerTypes.GET_BANNERS_FAILED:
    case BannerTypes.CREATE_BANNERS_FAILED:
    case BannerTypes.GET_CLIENT_BANNERS_FAILED:
      return { ...state, isFetching: false };

    // start of get banner client
    case BannerTypes.GET_CLIENT_BANNERS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        currentBanner: action.data.currentSelectedValue,
      };
    // end of get banner client

    default:
      return state;
  }
};

export default BannerReducer;
