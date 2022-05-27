import { metadataConstant } from '@shared/constant';
import { IMetadata, IReducerAction } from '@shared/interfaces';
import { Organization } from '@shared/models/user-management/organization.model';
import { OrganizationTypes } from './organization.action-types';

export interface OrganizationState {
  isFetching: boolean;
  metadata: IMetadata;
  organizations: Organization[];
  organization: Organization | null;
}

const initialStates: OrganizationState = {
  isFetching: false,
  metadata: metadataConstant,
  organizations: [],
  organization: null,
};

const OrganizationReducer = (
  state = initialStates,
  action: IReducerAction<Organization>,
) => {
  switch (action.type) {
    case OrganizationTypes.GET_USER_ORGANIZATION_REQUEST:
      return { ...state, isFetching: true };
    case OrganizationTypes.GET_USER_ORGANIZATION_SUCCESS:
      return {
        ...state,
        isFetching: false,
        metadata: action.data.metadata,
        organizations: action.data.organizations,
      };
    case OrganizationTypes.GET_USER_ORGANIZATION_FAILED:
      return { ...state, isFetching: false };
    case OrganizationTypes.TOGGLE_USER_ORGANIZATION_STATUS_REQUEST:
    case OrganizationTypes.TOGGLE_USER_ORGANIZATION_STATUS_FAILED:
      return { ...state };
    case OrganizationTypes.TOGGLE_USER_ORGANIZATION_STATUS_SUCCESS:
      return {
        ...state,
        organizations: [...action.data.organizations],
      };
    case OrganizationTypes.GET_USER_ORGANIZATION:
      return {
        ...state,
        organization: { ...action.data.organizations[0] },
      };
    default:
      return state;
  }
};

export default OrganizationReducer;
