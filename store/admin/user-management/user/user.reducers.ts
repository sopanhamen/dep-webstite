import { metadataConstant } from '@shared/constant/index';
import { EStatus } from '@shared/enum';
import { ICommonFilter, IMetadata } from '@shared/interfaces';
import { MRole, MSelectOption } from '@shared/models/common.model';
import { Organization } from '@shared/models/user-management/organization.model';
import { MUser, MUserDetail } from '@shared/models/users.model';
import { userTypes } from 'store/admin/user-management/user/user.action-types';
export interface UserState {
  // put here all the state to be manipulated
  users: MUser[];
  user: MUserDetail;
  queries: ICommonFilter;
  metadata: IMetadata;
  isLoading: boolean;
  roles: MSelectOption[];
  organizations: Organization[];
  projects: MSelectOption[];
  sectors: MSelectOption[];
  rolesOpts: MRole[];
}

const initialQueries: ICommonFilter = {
  limit: 10,
  offset: 0,
  search: '',
  page: 1,
  orders: '',
  groupBy: '',
  roleIds: [],
  statuses: `${EStatus.ACTIVE}|${EStatus.INACTIVE}`,
};

const initialStates: UserState = {
  users: [],
  user: new MUserDetail({}),
  queries: initialQueries,
  metadata: metadataConstant,
  isLoading: false,
  roles: [],
  rolesOpts: [],
  organizations: [],
  projects: [],
  sectors: [],
};

const UserReducer = (state = initialStates, action: any) => {
  switch (action.type) {
    case userTypes.GET_USERS:
      return { ...state, ...action.payload };
    case userTypes.GET_USER:
      return { ...state, user: action.payload };
    case userTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case userTypes.SET_FILTER:
      return { ...state, queries: action.payload };
    case userTypes.RESET_FILTER:
      return { ...state, queries: initialQueries };
    case userTypes.GET_USER_ROLES:
      return { ...state, ...action.payload };
    case userTypes.GET_ORGANIZATION:
      return { ...state, organizations: action.payload };
    case userTypes.GET_PROJECTS:
      return { ...state, projects: action.payload };

    default:
      return state;
  }
};

export default UserReducer;
