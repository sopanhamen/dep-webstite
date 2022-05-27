import { IUser } from '@shared/models/auth.model';
import { ISelectOption } from '@shared/models/common.model';
import { IOrganization } from '@shared/models/organization.model';
import { AuthActionTypes } from './auth.action-types';

export interface AuthState {
  authToken?: string;
  user?: IUser;
  accessToken?: string;
  publicToken?: string;
  isLoading?: boolean;
  organizationNames?: IOrganization[];
  OrganizationTypes?: ISelectOption[];
  pillars?: ISelectOption[];
  sectors?: ISelectOption[];
}

const initialStates: AuthState = {
  authToken: '',
  user: {},
  accessToken: '',
  publicToken: '',
  isLoading: false,
  organizationNames: [],
  OrganizationTypes: [],
  pillars: [],
  sectors: [],
};

const AuthReducer = (state = initialStates, action: any) => {
  switch (action.type) {
    case AuthActionTypes.GET_AUTHORIZE_TOKEN:
      return { ...state, publicToken: '', authToken: action.payload };
    case AuthActionTypes.GET_PUBLIC_TOKEN:
      return { ...state, publicToken: action.payload };
    case AuthActionTypes.LOGIN:
      return {
        ...state,
        ...action.payload,
      };
    case AuthActionTypes.LOGOUT:
      return { ...state, ...initialStates };
    case AuthActionTypes.SET_GLOBAL_LOADING:
      return { ...state, isLoading: action.payload };
    case AuthActionTypes.GET_ORGANIZATION_NAMES:
      return { ...state, organizationNames: action.payload };
    case AuthActionTypes.GET_ORGANIZATION_TYPES:
      return { ...state, OrganizationTypes: action.payload };
    case AuthActionTypes.GET_PILLARS:
      return { ...state, pillars: action.payload };
    case AuthActionTypes.GET_SECTORS:
      return { ...state, sectors: action.payload };
    default:
      return state;
  }
};

export default AuthReducer;
