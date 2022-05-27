import { ICompanyBackgroundBody } from '@components/admin/about-us/company-background/add-company-background';
import { metadataConstant } from '@shared/constant';
import { IMetadata } from '@shared/interfaces';
import { MCompanyBackground } from '@shared/models/about-us/company-background';
import { companyBackgroundTypes } from './company-background.action-types';

export interface CompanyBackgroundState {
  companyBackground: MCompanyBackground[];
  metadata: IMetadata;
  isLoading: boolean;
  companyBackgroundDetail: ICompanyBackgroundBody;
}

const initialStates: CompanyBackgroundState = {
  companyBackground: [],
  metadata: metadataConstant,
  isLoading: false,
  companyBackgroundDetail: {},
};

const CompanyBackgroundReducer = (state = initialStates, action: any) => {
  switch (action.type) {
    case companyBackgroundTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case companyBackgroundTypes.GET_COMPANY_BACKGROUND:
      return {
        ...state,
        companyBackground: action.payload.companyBackground,
        metadata: action.payload.metadata,
      };
    case companyBackgroundTypes.GET_COMPANY_BACKGROUND_DETAIL:
      return { ...state, companyBackgroundDetail: action.data };
    default:
      return state;
  }
};

export default CompanyBackgroundReducer;
