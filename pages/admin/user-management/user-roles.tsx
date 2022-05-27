import AdminPagination from '@components/admin/table/admin-pagination';
import AppTable from '@components/admin/table/app-table';
import AdminListCard from '@shared/components/cards/admin-list-card';
import AdminSearch from '@shared/components/filters/admin-search';
import { userRoleHeader } from '@shared/constant';
import { activePage, removeFalseyObject } from '@shared/custom-function/common';
import { formatISODate } from '@shared/custom-function/conversion';
import { ELanguage } from '@shared/enum';
import { IAdminPaginationData, ICommonQueries } from '@shared/interfaces';
import { UserRole } from '@shared/models/user-management/user-role.model';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { UserRoleActions } from 'store/admin/user-management/user-roles/user-role.actions';
import { UserRoleState } from 'store/admin/user-management/user-roles/user-role.reducers';
import { StoreState } from 'store/root-reducer';

interface IUserPermissions extends UserRoleState {
  getUserRoleList: (payload: ICommonQueries) => Promise<void>;
}

function UserRoleList({
  isFetching,
  metadata,
  userRoles,
  getUserRoleList,
}: IUserPermissions): JSX.Element {
  const [search, setSearch] = useState('');

  useEffect(() => {
    const payload: ICommonQueries = {
      limit: metadata.limit,
      offset: metadata.offset,
      search,
    };

    getUserRoleList(removeFalseyObject(payload));
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const pagination = (e: IAdminPaginationData) => {
    const payload: ICommonQueries = {
      limit: e.limit,
      offset: e.limit * (e.activePage - 1),
      search,
    };

    getUserRoleList(removeFalseyObject(payload));
  }; // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AdminListCard>
      <AdminListCard.Header>
        <div className="d-flex justify-content-between">
          <AdminSearch
            className="ctrl-mr ctrl-mb width-300"
            text={search}
            onChangeText={(d) => {
              setSearch(d.text);
            }}
          />
        </div>
      </AdminListCard.Header>
      <AdminListCard.Body>
        <AppTable
          headers={userRoleHeader}
          loading={isFetching}
          total={metadata.total}
        >
          {userRoles?.map((e: UserRole, i: number) => (
            <tr key={e.id + i}>
              <td>{e.name}</td>
              <td>{formatISODate(e.createdAt)}</td>
            </tr>
          ))}
        </AppTable>
      </AdminListCard.Body>
      <AdminListCard.Footer>
        <AdminPagination
          activePage={activePage(metadata)}
          limit={metadata.limit}
          totalItem={metadata.total}
          onChange={pagination}
        />
      </AdminListCard.Footer>
    </AdminListCard>
  );
}

const mapStateToProps = (store: StoreState) => {
  return { ...store.userManagement.userRole };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const { getUserRolesAction } = UserRoleActions;

  return {
    getUserRoleList: (payload: ICommonQueries) =>
      dispatch(getUserRolesAction(payload, ELanguage.ENGLISH) as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRoleList);
