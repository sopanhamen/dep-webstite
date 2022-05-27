import { metadataConstant } from '@shared/constant';
import { IMetadata, IReducerAction } from '@shared/interfaces';
import { UserRole } from '@shared/models/user-management/user-role.model';
import { userRoleActionsTypes } from './user-role.action-types';

export interface UserRoleState {
  isFetching: boolean;
  metadata: IMetadata;
  userRoles: UserRole[];
}

const initialStates: UserRoleState = {
  isFetching: false,
  metadata: metadataConstant,
  userRoles: [],
};

const UserRoleReducer = (
  state = initialStates,
  action: IReducerAction<UserRole>,
) => {
  switch (action.type) {
    case userRoleActionsTypes.GET_USER_USER_ROLE_REQUEST:
      return { ...state, isFetching: true };
    case userRoleActionsTypes.GET_USER_USER_ROLE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        metadata: action.data.metadata,
        userRoles: action.data.userRoles,
      };
      break;
    case userRoleActionsTypes.GET_USER_USER_ROLE_FAILED:
      return { ...state, isFetching: false };
    default:
      return state;
  }
};

export default UserRoleReducer;
