import AppTable from '@components/admin/table/app-table';
import MoreDropDown from '@shared/components/drop-down-button';
import { userTableHeaders } from '@shared/constant';
import { statusFilterOpts } from '@shared/constant/filter-data.constants';
import { formatISODate, toTitleCase } from '@shared/custom-function/conversion';
import { EStatus, ETextColor } from '@shared/enum';
import {
  IAction,
  ICommonFilter,
  IMetadata,
  ISelectFilterOptions,
} from '@shared/interfaces';
import { MSelectOption } from '@shared/models/common.model';
import { MUser } from '@shared/models/users.model';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as Redux from 'redux';
import { userActions } from 'store/admin/user-management/user/user.actions';
import { StoreState } from 'store/root-reducer';

// ================ static data ===================
const activeAction: IAction = {
  name: 'Public',
  color: ETextColor.BLUE,
};
const inactiveAction: IAction = {
  name: 'Private',
  color: ETextColor.RED,
};

// =============== end static data ================

// =============== user without group component ================
interface IUsersWithoutGroups {
  goToDetail: (userId: string) => void;
  moreActions: (status: string) => void;
  users: MUser[];
}

const UsersWithoutGroups = (props: IUsersWithoutGroups) => {
  const { goToDetail, moreActions, users } = props;
  return (
    <>
      {users?.map((user, index) => {
        return (
          <tr
            key={user?.id}
            onClick={() => goToDetail(user?.id)}
            className="cursor-pointer"
          >
            <td>{user?.name}</td>
            <td>{user?.userRole}</td>
            <td>{user?.email}</td>
            <td>{formatISODate(user?.createdAt)}</td>
            <td className={`color-${user?.status?.toLowerCase()}`}>
              {toTitleCase(user?.status)}
            </td>
            <td
              onClick={(evt) => {
                evt.preventDefault();
                evt.stopPropagation();
              }}
            >
              <MoreDropDown
                actions={[
                  user?.status === EStatus.ACTIVE
                    ? inactiveAction
                    : activeAction,
                ]}
                selectedActions={() => moreActions(user?.id)}
              />
            </td>
          </tr>
        );
      })}
    </>
  );
};
// ============ end user without group component ===============

// =============== user with group component ================
interface IUserWithGroup {
  goToDetail: (userId: string) => void;
  moreActions: (id: string) => void;
  users: IMappedUser[];
  dropDownActions?: IAction[];
}

const UserWithGroup = (props: IUserWithGroup) => {
  const { goToDetail, moreActions, users } = props;
  return (
    <>
      {users?.map((userGroup) => {
        return (
          <Fragment key={userGroup?.group}>
            <tr className="users-group-by">
              <td colSpan={userTableHeaders?.length}>
                {toTitleCase(userGroup?.group)}
              </td>
            </tr>
            <UsersWithoutGroups
              users={userGroup?.users}
              goToDetail={goToDetail}
              moreActions={moreActions}
            />
          </Fragment>
        );
      })}
    </>
  );
};
// ============= end user with group component ==============

interface IMappedUser {
  group: string;
  users: MUser[];
}

interface IUserTable {
  // redux props
  toggleUser?: (id: string) => void;
  isLoading?: boolean;
  users?: MUser[];
  metadata?: IMetadata;
  queries?: ICommonFilter;
  roles?: MSelectOption[];
}

const UserTable = (props: IUserTable) => {
  const { toggleUser, isLoading, users, metadata, queries, roles } = props;
  const router = useRouter();
  const ac = new AbortController();

  const [groupByUsers, setGroupByUsers] = useState<IMappedUser[]>([]);

  const generatedUserByGroup = (groupBy: 'USER_ROLES' | 'STATUS') => {
    let mappedUsers = [];

    if (groupBy === 'USER_ROLES') {
      const mappedRoles = roles?.map((role: MSelectOption) => role?.label);
      mappedUsers = mappedRoles
        ?.map((role) => {
          const mu = users?.filter((user: MUser) => user?.userRole === role);
          return { group: role, users: mu };
        })
        ?.filter((group) => group?.users?.length) as IMappedUser[];
    } else {
      const mappedStatus = statusFilterOpts?.map(
        (status: ISelectFilterOptions) => status?.value,
      );
      mappedUsers = mappedStatus
        ?.map((status) => {
          const mu = users?.filter((user: MUser) => user?.status === status);
          return { group: status, users: mu };
        })
        ?.filter((group) => group?.users?.length) as IMappedUser[];
    }

    setGroupByUsers(mappedUsers);
  };

  useEffect(() => {
    if (queries?.groupBy) {
      generatedUserByGroup(queries?.groupBy as 'USER_ROLES' | 'STATUS');
    } else {
      setGroupByUsers([]);
    }

    return () => {
      ac.abort();
    };
  }, [queries?.groupBy, users]);

  const goToDetail = (id: string) => {
    router.push(`users/${id}`);
  };

  const handleMoreActions = (id: string) => {
    if (toggleUser) toggleUser(id);
  };

  return (
    <AppTable
      headers={userTableHeaders}
      loading={isLoading}
      total={users?.length}
    >
      {users && users?.length > 0 ? (
        groupByUsers?.length ? (
          <UserWithGroup
            users={groupByUsers || []}
            goToDetail={goToDetail}
            moreActions={handleMoreActions}
          />
        ) : (
          <UsersWithoutGroups
            users={users || []}
            goToDetail={goToDetail}
            moreActions={handleMoreActions}
          />
        )
      ) : (
        <tr>
          <td colSpan={userTableHeaders?.length} className="text-center">
            No data
          </td>
        </tr>
      )}
    </AppTable>
  );
};

const mapStateToProps = (store: StoreState) => {
  return { ...store?.userManagement?.user };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch) => {
  const { toggleUser } = userActions;
  return {
    toggleUser: (id: string) => dispatch(toggleUser(id) as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserTable);
