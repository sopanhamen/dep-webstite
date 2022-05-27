import AdminPagination from '@components/admin/table/admin-pagination';
import AddUser from '@components/admin/user-management/users/add-user';
import UserTable from '@components/admin/user-management/users/user-table';
import AdminListCard from '@shared/components/cards/admin-list-card';
import AdminFilterBox from '@shared/components/filters/admin-filter-box';
import AdminFilterSection from '@shared/components/filters/admin-filter-section';
import AdminSearch from '@shared/components/filters/admin-search';
import FilterButton from '@shared/components/filters/filter-button';
import SelectFilter from '@shared/components/filters/select-filter';
import SortButton from '@shared/components/filters/sort-button';
import SortOrderOption from '@shared/components/filters/sort-order-option';
import { ICON_URL } from '@shared/constant';
import { permissionChecker } from '@shared/custom-function/common';
import {
  IAdminPaginationData,
  ICommonFilter,
  IMetadata,
  ISelectFilterOptions,
} from '@shared/interfaces';
import { MSelectOption } from '@shared/models/common.model';
import { MUser } from '@shared/models/users.model';
import { APIServices } from '@shared/services/api.service';
import useDebounce from 'hooks/use-debounce';
import { omit } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as Redux from 'redux';
import { userActions } from 'store/admin/user-management/user/user.actions';
import { StoreState } from 'store/root-reducer';

// ================ static data ===================
const sortOpts: ISelectFilterOptions[] = [
  {
    label: <SortOrderOption label="Created On" order="ASC" />,
    value: 'createdAt:ASC',
  },
  {
    label: <SortOrderOption label="Created On" order="DESC" />,
    value: 'createdAt:DESC',
  },
];

const groupFilterOpts: ISelectFilterOptions[] = [
  {
    label: 'User Roles',
    value: 'USER_ROLES',
  },
  {
    label: 'Status',
    value: 'STATUS',
  },
];

const addUserPermission: string[] = [
  'WEB-USER-CREATE-ADMIN',
  'WEB-USER-CREATE-MODERATOR',
  'WEB-USER-CREATE',
  'WEB-USER-CREATE-PROJECT-OWNER',
  'WEB-USER-CREATE-SUPER-ADMIN',
];

// =============== end static data ================

interface IUsers {
  // redux props
  getUsers: () => void;
  setFilter: (queries: ICommonFilter) => void;
  resetFilter: () => void;
  getRoles: () => void;
  users: MUser[];
  metadata: IMetadata;
  isLoading: boolean;
  queries: ICommonFilter;
  roles: MSelectOption[];
}

const Users = (props: IUsers) => {
  const {
    getUsers,
    setFilter,
    resetFilter,
    getRoles,
    metadata,
    queries,
    roles,
  } = props;

  const [toggleFilter, setToggleFilter] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  useDebounce(() => {
    getUsers();
  }, omit(queries, ['groupBy']));

  useEffect(() => {
    getRoles();

    return () => {
      APIServices.axiosCancelToken();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // functions section
  /**
   * @param evt value got from btn/select action
   * @param type data passing for check
   */
  const onFilterChanged = (
    evt: string | string[],
    type: 'FILTER' | 'GROUP' | 'SORT',
  ) => {
    switch (type) {
      case 'FILTER':
        setFilter({ roleIds: (evt || []) as string[], offset: 0, page: 1 });
        break;
      case 'GROUP':
        return setFilter({ groupBy: evt as string, offset: 0, page: 1 });
      case 'SORT':
        setFilter({ orders: evt as string, offset: 0, page: 1 });
        break;

      default:
        break;
    }
  };

  /**
   * pagination action
   * @param data pagination metadata
   */
  const changePage = (data: IAdminPaginationData) => {
    const offset = +(data.limit || 10) * ((data.activePage || 1) - 1);
    setFilter({ page: data.activePage, limit: data.limit, offset });
  };

  const clearAllFilter = () => {
    setToggleFilter(false);
    resetFilter();
  };

  const onHandleSearch = (search: string) => {
    setFilter({ search, offset: 0, page: 1 });
  };

  const groupLabelGenerated = useCallback(() => {
    let generatedLabel = 'Group';
    if (queries?.groupBy === 'STATUS') generatedLabel = 'Status';
    if (queries?.groupBy === 'USER_ROLES') generatedLabel = 'User Roles';
    return generatedLabel;
  }, [queries?.groupBy]);
  //   end function section

  return (
    <>
      <AddUser
        isShow={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
      />

      <AdminListCard>
        <AdminListCard.Header>
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <h6 className="fw-bold">Users</h6>

            {permissionChecker(addUserPermission) && (
              <button
                className="admin-btn-add"
                onClick={() => setShowAddUserModal(true)}
              >
                Add User
              </button>
            )}
          </div>

          {/*================== filter section ====================*/}
          <AdminFilterSection>
            {/* ========= search ======= */}
            <AdminSearch
              className="ctrl-mr ctrl-mb flex-fill"
              text={queries.search}
              onChangeText={(evt) => onHandleSearch(evt?.text)}
            />

            {/* ========== sort ========= */}
            <SortButton
              options={groupFilterOpts}
              onChange={(evt) => onFilterChanged(evt, 'GROUP')}
              label={groupLabelGenerated()}
              iconURL={ICON_URL.GROUP}
              value={queries?.groupBy}
            />
            <SortButton
              options={sortOpts}
              value={queries?.orders}
              onChange={(evt) => onFilterChanged(evt, 'SORT')}
            />
            <FilterButton
              onToggle={() => setToggleFilter(!toggleFilter)}
              onClear={clearAllFilter}
            />
          </AdminFilterSection>
          <AdminFilterBox isShow={toggleFilter}>
            <AdminFilterBox.Basic>
              <AdminFilterBox.Row>
                <AdminFilterBox.Col>
                  <SelectFilter
                    label="User Roles"
                    isMulti={true}
                    value={queries?.roleIds}
                    options={roles}
                    isClearAll={true}
                    onChange={(evt) => onFilterChanged(evt, 'FILTER')}
                  />
                </AdminFilterBox.Col>
              </AdminFilterBox.Row>
            </AdminFilterBox.Basic>
          </AdminFilterBox>
        </AdminListCard.Header>

        {/*==== table section ====*/}
        <AdminListCard.Body>
          <UserTable />
        </AdminListCard.Body>
        <AdminListCard.Footer>
          {/*==== pagination ====*/}
          <AdminPagination
            activePage={queries?.page || 1}
            limit={queries?.limit || 10}
            totalItem={metadata?.total}
            onChange={changePage}
          />
        </AdminListCard.Footer>
      </AdminListCard>
    </>
  );
};

// =============== store section ====================
const mapStateToProps = (store: StoreState) => {
  return { ...store?.userManagement?.user };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch) => {
  const { getUsers, setFilter, resetFilter, getRoles } = userActions;

  return {
    getUsers: () => dispatch(getUsers() as any),
    setFilter: (queries: ICommonFilter) => dispatch(setFilter(queries) as any),
    resetFilter: () => dispatch(resetFilter() as any),
    getRoles: () => dispatch(getRoles() as any),
  };
};
// =============== end store section =================

export default connect(mapStateToProps, mapDispatchToProps)(Users);
