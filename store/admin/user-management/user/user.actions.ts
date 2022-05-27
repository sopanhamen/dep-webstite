import { EStatus } from '@shared/enum';
import { ICommonQueries } from '@shared/interfaces';
import { MClassification } from '@shared/models/classification.model';
import { IUpdate, MRole, MSelectOption } from '@shared/models/common.model';
import { Organization } from '@shared/models/user-management/organization.model';
import { IUserPayload, MUser, MUserDetail } from '@shared/models/users.model';
import { APIServices } from '@shared/services/api.service';
import { ToastServices } from '@shared/services/toast.service';
import axios, { AxiosError, AxiosResponse } from 'axios';
import * as _ from 'lodash';
import * as Redux from 'redux';
import { classificationTypes } from 'store/admin/classification/classification.action-type';
import { userTypes } from 'store/admin/user-management/user/user.action-types';
import { StoreState } from 'store/root-reducer';

const USERS = `/admin/users`;
const ROLES = '/admin/roles';
const ORGANIZATION = '/admin/organizations';
const PROJECTS = '/admin/projects';

const setLoading = (payload: boolean) => {
  return (dispatch: Redux.Dispatch) => {
    dispatch({ type: userTypes.SET_LOADING, payload });
  };
};

const setFilter = (queries: ICommonQueries) => {
  return (dispatch: Redux.Dispatch, getState: () => StoreState) => {
    const userQueries = getState()?.userManagement?.user?.queries;
    const payload = { ...userQueries, ...queries };
    dispatch({ type: userTypes.SET_FILTER, payload });
  };
};

const resetFilter = () => {
  return (dispatch: Redux.Dispatch) => {
    dispatch({ type: userTypes.RESET_FILTER });
  };
};

const getUsers = () => {
  return (dispatch: Redux.Dispatch, getState: () => StoreState) => {
    APIServices.axiosConfig();
    dispatch(setLoading(true) as any);
    const queries = _.cloneDeep(getState()?.userManagement?.user?.queries);
    const roleIds = queries?.roleIds?.length ? queries?.roleIds?.join('|') : [];

    // remove page field before send it to API
    const params = {
      ..._.omit(queries, ['page', 'groupBy', queries?.orders ? '' : 'orders']),
      roleIds,
    };

    axios
      .get(USERS, { params })
      .then((res: AxiosResponse) => {
        const users = res?.data?.data?.map((user: MUser) => new MUser(user));
        const metadata = res?.data?.metadata;
        const payload = { users, metadata };
        dispatch({ type: userTypes.GET_USERS, payload });
        dispatch(setLoading(false) as any);
      })
      .catch((errors: AxiosError) => {
        dispatch(setLoading(false) as any);
        const message = errors?.response?.data?.message;
        ToastServices.error(message || 'Unspecific errors!');
      });
  };
};

const setInitialSelectOpts = ({ data }: AxiosResponse) => {
  return (dispatch: Redux.Dispatch) => {
    const { primaryRole, organization, projects: resProjects } = data;

    const type = organization?.type;
    const pillar = organization?.pillar;
    const resSectors = organization?.sectors;

    const roles = [new MRole(primaryRole)];
    const organizations = [new MSelectOption(organization)];
    const projects = [
      ...resProjects?.map(
        (project: MSelectOption) => new MSelectOption(project),
      ),
    ];
    const types = [new MClassification(type)];
    const pillars = [new MClassification(pillar)];
    const sectors = resSectors?.map(
      (sector: MClassification) => new MClassification(sector),
    );

    // set users selection while the API request for classification processing
    dispatch({
      type: userTypes.GET_USER_ROLES,
      payload: { roles, rolesOpts: roles },
    });
    dispatch({ type: userTypes.GET_ORGANIZATION, payload: organizations });
    dispatch({ type: userTypes.GET_PROJECTS, payload: projects });

    // set classifications for users selection while the API request for classification processing
    dispatch({ type: classificationTypes.GET_ORGANIZATIONS, payload: types });
    dispatch({ type: classificationTypes.GET_PILLARS, payload: pillars });
    dispatch({ type: classificationTypes.GET_SECTORS, payload: sectors });
  };
};

const getUser = (userId: string) => {
  return (dispatch: Redux.Dispatch) => {
    APIServices.axiosConfig();

    return new Promise((resolve, reject) => {
      axios
        .get(`${USERS}/${userId}`)
        .then((res: AxiosResponse) => {
          const payload = new MUserDetail(res?.data);
          dispatch(setInitialSelectOpts(res) as any);
          dispatch({ type: userTypes.GET_USER, payload });
          resolve(res);
        })
        .catch((errors: AxiosError) => {
          const message = errors?.response?.data?.message;
          ToastServices.error(message || 'Unspecific errors!');
          reject(errors);
        });
    });
  };
};

const createUser = (payload: IUserPayload) => {
  return (dispatch: Redux.Dispatch, getState: () => StoreState) => {
    APIServices.axiosConfig();
    return new Promise((resolve, reject) => {
      axios
        .post(USERS, payload)
        .then((res: AxiosResponse) => {
          ToastServices.success('User Created');
          dispatch(resetFilter() as any);
          dispatch(getUsers() as any);
          resolve(res);
        })
        .catch((errors: AxiosError) => {
          const message = errors?.response?.data?.message;
          ToastServices.error(message || 'Unspecific errors!');
          reject(errors);
        });
    });
  };
};

const updateUser = (payload: IUpdate<IUserPayload>) => {
  return () => {
    APIServices.axiosConfig();
    return new Promise((resolve, reject) => {
      axios
        .put(`${USERS}/${payload.id}`, payload.body)
        .then((res: AxiosResponse) => {
          ToastServices.success('User Updated');
          resolve(res);
        })
        .catch((errors: AxiosError) => {
          const message = errors?.response?.data?.message;
          ToastServices.error(message || 'Unspecific errors!');
          reject(errors);
        });
    });
  };
};

const getRoles = () => {
  return (dispatch: Redux.Dispatch) => {
    APIServices.axiosConfig();
    const params = { status: 'ACTIVE' };
    axios
      .get(ROLES, { params })
      .then((res: AxiosResponse) => {
        const { data } = res?.data;
        const roles = data?.map(
          (role: MSelectOption) => new MSelectOption(role),
        );
        const rolesOpts = data?.map((role: MRole) => new MRole(role));
        const payload = { roles, rolesOpts };
        dispatch({ type: userTypes.GET_USER_ROLES, payload });
      })
      .catch((errors: AxiosError) => {
        const message = errors?.response?.data?.message;
        ToastServices.error(message || 'Unspecific errors!');
      });
  };
};

const getOrganizations = () => {
  return (dispatch: Redux.Dispatch) => {
    APIServices.axiosConfig();
    const params = { status: 'ACTIVE' };
    axios
      .get(ORGANIZATION, { params })
      .then((res: AxiosResponse) => {
        const payload = res?.data?.data?.map(
          (organization: Organization) => new Organization(organization),
        );
        dispatch({ type: userTypes.GET_ORGANIZATION, payload });
      })
      .catch((errors: AxiosError) => {
        const message = errors?.response?.data?.message;
        ToastServices.error(message || 'Unspecific errors!');
      });
  };
};

const getProjects = () => {
  return (dispatch: Redux.Dispatch) => {
    APIServices.axiosConfig();
    const params = { status: 'ACTIVE' };
    axios
      .get(PROJECTS, { params })
      .then((res: AxiosResponse) => {
        const payload = res?.data?.data?.map(
          (project: MSelectOption) => new MSelectOption(project),
        );
        dispatch({ type: userTypes.GET_PROJECTS, payload });
      })
      .catch((errors: AxiosError) => {
        const message = errors?.response?.data?.message;
        ToastServices.error(message || 'Unspecific errors!');
      });
  };
};

const toggleUser = (id: string) => {
  return (dispatch: Redux.Dispatch, getState: () => StoreState) => {
    const { users, metadata } = getState()?.userManagement?.user;
    dispatch(setLoading(true) as any);
    axios
      .delete(`${USERS}/${id}`)
      .then(() => {
        const newUsers = users?.map((user: MUser) => {
          const checkedStatus =
            user?.status === EStatus.ACTIVE ? EStatus.INACTIVE : EStatus.ACTIVE;
          return {
            ...user,
            status: user?.id === id ? checkedStatus : user?.status,
          };
        });
        const payload = { users: newUsers, metadata };
        dispatch({ type: userTypes.GET_USERS, payload });
        ToastServices.success('User Updated');
        dispatch(setLoading(false) as any);
      })
      .catch((errors: AxiosError) => {
        dispatch(setLoading(false) as any);
        const message = errors?.response?.data?.message;
        ToastServices.error(message || 'Unspecific errors!');
      });
  };
};

export const userActions = {
  getUsers,
  getUser,
  setFilter,
  resetFilter,
  getRoles,
  getOrganizations,
  createUser,
  getProjects,
  updateUser,
  toggleUser,
};
