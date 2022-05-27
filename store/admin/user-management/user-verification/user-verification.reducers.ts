import { metadataConstant } from '@shared/constant';
import { IMetadata, IReducerAction } from '@shared/interfaces';
import { UserVerification } from '@shared/models/user-management/user-verification.modal';
import { userVerificationType } from './user-verification.action-types';

export interface UserVerificationState {
  isRequesting: boolean;
  metadata: IMetadata;
  userVerifications: UserVerification[];
}

const initialStates: UserVerificationState = {
  isRequesting: false,
  userVerifications: [],
  metadata: metadataConstant,
};

const UserVerificationReducer = (
  state = initialStates,
  action: IReducerAction<UserVerification>,
) => {
  switch (action.type) {
    case userVerificationType.USER_VERIFICATION_REQUEST:
      return { ...state, isRequesting: true };
    case userVerificationType.USER_VERIFICATION_SUCCESS:
      return {
        ...state,
        isRequesting: false,
        metadata: action.data.metadata,
        userVerifications: action.data.userVerifications,
      };
    case userVerificationType.USER_VERIFICATION_FAILED:
      state.isRequesting = false;
      return {
        ...state,
      };
    case userVerificationType.TOGGLE_USER_VERIFICATION_STATUS_REQUEST:
    case userVerificationType.TOGGLE_USER_VERIFICATION_STATUS_FAILED:
      return { ...state, isRequesting: false };
    case userVerificationType.TOGGLE_USER_VERIFICATION_STATUS_SUCCESS:
      return {
        ...state,
        userVerifications: [...action.data.userVerifications],
      };
    case userVerificationType.USER_VERIFICATION_FAILED:
      return { ...state, isRequesting: false };
    default:
      return state;
  }
};

export default UserVerificationReducer;
