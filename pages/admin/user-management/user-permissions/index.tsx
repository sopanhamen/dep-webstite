import AppTable from '@components/admin/table/app-table';
import AdminListCard from '@shared/components/cards/admin-list-card';
import AdminSearch from '@shared/components/filters/admin-search';
import BaseCheckbox from '@shared/components/form/base-check-box';
import { userPermissionHeader } from '@shared/constant';
import { toTitleCase } from '@shared/custom-function/conversion';
import { ERoles } from '@shared/enum/role.enum';
import { ICommonQueries } from '@shared/interfaces';
import { IRole, IUserPermission } from '@shared/models/user-permission.model';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import UserPermissionActions from 'store/admin/user-management/user-permission/user-permission.actions';
import { StoreState } from 'store/root-reducer';

interface IUserPermissionProps {
  getPermissions: () => void;
  setPermissionParams: (params: ICommonQueries) => void;
  selectPermissions: (params: IRole) => void;
  updatePermission: (params: IUserPermissionBody) => Promise<void>;
  permissions: IUserPermission[];
  loading: boolean;
}

interface IPermissionBody {
  permissionId: string;
  permissionCode: string;
}

export interface IUserPermissionBody {
  roleId?: string;
  permissions?: IPermissionBody[];
}

const UserPermission = (props: IUserPermissionProps) => {
  const {
    getPermissions,
    selectPermissions,
    updatePermission,
    setPermissionParams,
    permissions,
    loading,
  } = props;
  const [search, setSearch] = useState('');
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    getPermissions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setPermissionParams({ search: search });
    getPermissions();
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCheckboxChange = (
    evt: any,
    permissionId: string,
    role: IRole,
  ) => {
    const item = {
      ...role,
      permissionId,
    };
    selectPermissions(item);
  };

  const handleCancel = () => {
    setDisabled(true);
    getPermissions();
  };

  const handleSubmit = () => {
    const result = permissions[0].roles?.map((role) => {
      const permission = permissions.filter((per) => {
        const roles = per.roles?.find((r) => r.has && r.id === role.id);
        return !!roles;
      });
      return {
        roleId: role.id,
        permissions: permission.map((x) => ({
          permissionCode: x.code,
          permissionId: x.id,
        })),
      };
    });
    const finalResult = result?.filter(
      (item) => item?.permissions?.length,
    ) as IUserPermissionBody;

    updatePermission(finalResult).then(() => {
      setDisabled(true);
    });
  };

  return (
    <>
      <AdminListCard>
        <AdminListCard.Header>
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <h6 className="fw-bold">User Permission</h6>
            <div>
              {disabled && (
                <button
                  className="admin-btn-add"
                  onClick={() => setDisabled(false)}
                >
                  Edit
                </button>
              )}
              {!disabled && (
                <button
                  className="admin-btn-cancel me-2"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              )}
              {!disabled && (
                <button className="admin-btn-add" onClick={handleSubmit}>
                  Save
                </button>
              )}
            </div>
          </div>
          <hr className="break-line ctrl-mt mb-3" />
          <section>
            <div className="d-flex align-items-center mb-3">
              <AdminSearch
                className="flex-fill"
                text={search}
                onChangeText={(d) => {
                  setSearch(d.text);
                }}
              ></AdminSearch>
            </div>
          </section>
        </AdminListCard.Header>
        <AdminListCard.Body>
          <AppTable
            headers={userPermissionHeader}
            total={permissions?.length}
            loading={loading}
          >
            {permissions?.length > 0 &&
              permissions?.map((item: IUserPermission, index) => {
                return (
                  <tr key={item?.id}>
                    <td>
                      {item?.type !== permissions?.[index - 1]?.type &&
                        toTitleCase(item?.type || '')}
                    </td>
                    <td>{item?.name}</td>
                    {item?.roles
                      ?.filter(
                        (role: IRole) =>
                          role?.code !== ERoles.USER &&
                          role?.code !== ERoles.SUPER_ADMIN,
                      )
                      ?.map((role: IRole) => {
                        return (
                          <td key={role?.id}>
                            <BaseCheckbox
                              checked={role?.has}
                              disabled={disabled}
                              onClick={(evt: any) =>
                                handleCheckboxChange(evt, item.id, role)
                              }
                            />
                          </td>
                        );
                      })}
                  </tr>
                );
              })}
          </AppTable>
        </AdminListCard.Body>
      </AdminListCard>
    </>
  );
};

const mapStateToProps = (store: StoreState) => {
  const { permissions, loading } = store.userManagement.userPermission;

  return { permissions, loading };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const {
    getPermissions,
    selectPermissions,
    updatePermission,
    setPermissionParams,
  } = UserPermissionActions;

  return {
    getPermissions: () => dispatch(getPermissions() as any),
    selectPermissions: (payload: IRole) =>
      dispatch(selectPermissions(payload) as any),
    updatePermission: (payload: IUserPermissionBody) =>
      dispatch(updatePermission(payload) as any),
    setPermissionParams: (payload: ICommonQueries) =>
      dispatch(setPermissionParams(payload) as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserPermission);
