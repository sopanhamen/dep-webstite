import { APIServices } from '@shared/services/api.service';
import { ToastServices } from '@shared/services/toast.service';
import axios, { Axios, AxiosError, AxiosResponse } from 'axios';
import { Dispatch } from 'redux';
import { StoreState } from 'store/root-reducer';
import { userPermissionType } from './user-permission.action-types';
import * as _ from 'lodash';
import { IRole, IUserPermission } from '@shared/models/user-permission.model';
import { ICommonQueries } from '@shared/interfaces';
import { IUserPermissionBody } from 'pages/admin/user-management/user-permissions';

const url = `${APIServices.apiUrlV1}`;

export const setLoading = (payload: boolean) => {
  return (dispatch: Dispatch) => {
    dispatch({ type: userPermissionType.SET_LOADING, payload });
  };
};

const getPermissions = () => {
  return (dispatch: Dispatch, getState: () => StoreState) => {
    dispatch(setLoading(true) as any);
    const queryParams = getState()?.userManagement?.userPermission?.queryParams;

    const params = {
      limit: 0,
      orders: 'type:asc|name:asc',
      ...queryParams,
    };

    APIServices.axiosConfig();
    axios
      .get(`${url}/admin/permissions/roles`, { params })
      .then((res: AxiosResponse) => {
        dispatch(setLoading(false) as any);

        dispatch({
          type: userPermissionType.GET_USER_PERMISSIONS,
          payload: res.data?.data,
        });
      })
      .catch((errors: AxiosError) => {
        dispatch(setLoading(false) as any);
        const message = errors?.response?.data?.message;
        ToastServices.error(message || 'Unspecific errors!');
      });
  };
};

const selectPermissions = (role: IRole) => {
  return (dispatch: Dispatch, getState: () => StoreState) => {
    const newData = _.cloneDeep(
      getState()?.userManagement?.userPermission?.permissions,
    );

    newData.forEach((per: IUserPermission) => {
      if (per.id == role.permissionId) {
        const newRole = per?.roles?.find((r: IRole) => r.id === role.id);
        return newRole && (newRole.has = !newRole.has);
      }
    });

    dispatch({
      type: userPermissionType.SELECT_USER_PERMISSIONS,
      payload: newData,
    });
  };
};

const updatePermission = (payload: IUserPermissionBody) => {
  return (dispatch: Dispatch) => {
    dispatch(setLoading(true) as any);
    APIServices.axiosConfig();
    return new Promise((resolve, reject) => {
      axios
        .post(`${url}/admin/roles/bulks/permissions`, { data: payload })
        .then((res: AxiosResponse) => {
          dispatch(setLoading(false) as any);
          resolve(res);
          ToastServices.success('User Permission Updated Successfully.');
        })
        .catch((err: AxiosError) => {
          dispatch(setLoading(false) as any);
          const message = err?.response?.data?.message;
          ToastServices.error(message || 'Unspecific errors!');
          reject(err?.response);
        });
    });
  };
};

const setPermissionParams = (params: ICommonQueries) => {
  return (dispatch: Dispatch) => {
    dispatch({
      type: userPermissionType.SET_PERMISSION_PARAMS,
      params,
    });
  };
};

const UserPermissionActions = {
  getPermissions,
  selectPermissions,
  updatePermission,
  setPermissionParams,
};

export default UserPermissionActions;
