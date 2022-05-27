import { combineReducers } from 'redux';
import ActivityStreamReducer, {
  ActivityStreamState,
} from './activity-stream/activity-stream.reducers';
import EventsReducer, { EventState } from './events/event.reducers';
import OrganizationReducer, {
  OrganizationState,
} from './organization/organization.reducers';
import UserPermissionReducer, {
  UserPermissionState,
} from './user-permission/user-permission.reducers';
import UserRoleReducer, {
  UserRoleState,
} from './user-roles/user-role.reducers';
import UserVerificationReducer, {
  UserVerificationState,
} from './user-verification/user-verification.reducers';
import UserReducer, { UserState } from './user/user.reducers';

export interface UserManagementState {
  activityStream: ActivityStreamState;
  event: EventState;
  organization: OrganizationState;
  user: UserState;
  userPermission: UserPermissionState;
  userRole: UserRoleState;
  userVerification: UserVerificationState;
}

const userManagementReducer = combineReducers<UserManagementState>({
  activityStream: ActivityStreamReducer,
  event: EventsReducer,
  organization: OrganizationReducer,
  userPermission: UserPermissionReducer,
  userRole: UserRoleReducer,
  userVerification: UserVerificationReducer,
  user: UserReducer,
});

export default userManagementReducer;
