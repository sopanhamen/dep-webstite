import { ALERT_MESSAGE } from '@shared/constant';
import { ELanguage } from '@shared/enum';
import { ICommonQueries } from '@shared/interfaces';
import { UserRole } from '@shared/models/user-management/user-role.model';
import { ToastServices } from '@shared/services/toast.service';
import { Dispatch } from 'redux';
import * as UserRoleService from 'store/services/user-management/user-role.service';
import { userRoleActionsTypes } from './user-role.action-types';

export const UserRoleActions = {
  getUserRolesAction(payload: ICommonQueries, language: ELanguage) {
    return async function (dispatch: Dispatch) {
      dispatch({
        type: userRoleActionsTypes.GET_USER_USER_ROLE_REQUEST,
      });

      try {
        const result = await UserRoleService.getUserRoleList(payload, language);

        return dispatch({
          type: userRoleActionsTypes.GET_USER_USER_ROLE_SUCCESS,
          data: {
            userRoles: result.data.data.map((x) => new UserRole(x)),
            metadata: result.data.metadata,
          },
        });
      } catch (e: unknown) {
        const m =
          e instanceof Error ? e.message : ALERT_MESSAGE.UNKNOWN_ERROR_RETRY;

        ToastServices.error(m);

        dispatch({ type: userRoleActionsTypes.GET_USER_USER_ROLE_FAILED });
      }
    };
  },
};
