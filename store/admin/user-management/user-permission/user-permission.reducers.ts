import { userPermissionType } from './user-permission.action-types';

export interface UserPermissionState {
  permissions: [];
  loading: boolean;
  queryParams: {
    search: string;
  };
}

const initialStates: UserPermissionState = {
  permissions: [],
  queryParams: { search: '' },
  loading: false,
};

const UserPermissionReducer = (state = initialStates, action: any) => {
  switch (action.type) {
    case userPermissionType.GET_USER_PERMISSIONS:
      return { ...state, permissions: action.payload };
    case userPermissionType.SELECT_USER_PERMISSIONS:
      return { ...state, permissions: action.payload };
    case userPermissionType.SET_LOADING:
      return { ...state, loading: action.payload };
    case userPermissionType.SET_PERMISSION_PARAMS:
      return { ...state, queryParams: { ...action.params } };
    default:
      return state;
  }
};

export default UserPermissionReducer;
