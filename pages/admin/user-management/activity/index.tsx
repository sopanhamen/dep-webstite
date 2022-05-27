import AdminPagination from '@components/admin/table/admin-pagination';
import AppTable from '@components/admin/table/app-table';
import AdminListCard from '@shared/components/cards/admin-list-card';
import AdminFilterBox from '@shared/components/filters/admin-filter-box';
import AdminFilterSection from '@shared/components/filters/admin-filter-section';
import AdminSearch from '@shared/components/filters/admin-search';
import DateGroupFilter, {
  IDateGroupFilterData,
} from '@shared/components/filters/date-group-filter';
import FilterButton from '@shared/components/filters/filter-button';
import SortButton from '@shared/components/filters/sort-button';
import SortOrderOption from '@shared/components/filters/sort-order-option';
import { activityHeader } from '@shared/constant';
import {
  dateFromNow,
  formatISODate,
  toTitleCase,
} from '@shared/custom-function/conversion';
import {
  IAdminPaginationData,
  ISelectFilterOptions,
  ISharedCommonQueries,
} from '@shared/interfaces';
import { ActivityStream } from '@shared/models/user-management/activity-stream.model';
import useDebounce from 'hooks/use-debounce';
import { useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { activityStreamActions } from 'store/admin/user-management/activity-stream/activity-stream.actions';
import { ActivityStreamState } from 'store/admin/user-management/activity-stream/activity-stream.reducers';
import { StoreState } from 'store/root-reducer';

export interface IEventList extends ActivityStreamState {
  getActivityStreamList: () => void;
  reset: () => void;
  resetQueries: () => void;
  setQueries: (queries: ISharedCommonQueries) => void;
}

function EventList({
  data,
  isFetching,
  localStates,
  queries,
  getActivityStreamList,
  resetQueries,
  setQueries,
}: IEventList): JSX.Element {
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

  const [isShowFilter, setIsShowFilter] = useState(false);

  /*========== Change queries beside pagination, need to set page to 1 ==========*/
  const changeFilters = (payload: Object) => {
    const queries = { ...payload, page: 1, offset: 0 };
    setQueries(queries);
  };

  const changePage = (pageData: IAdminPaginationData) => {
    const filters = {
      limit: pageData?.limit,
      offset: pageData?.limit * (pageData?.activePage - 1),
      page: pageData?.activePage,
    };

    setQueries(filters);
  };

  const changeDateGroup = (dateData: IDateGroupFilterData) => {
    if (dateData) {
      const payload: ISharedCommonQueries = {
        dateType: dateData?.dateType,
        startCreatedAt: dateData?.startDate,
        endCreatedAt: dateData?.endDate,
      };
      changeFilters(payload);
    }
  };

  useDebounce(() => {
    getActivityStreamList();
  }, queries);

  return (
    <AdminListCard>
      <AdminListCard.Header>
        <div className="d-flex flex-wrap align-items-center justify-content-between">
          <h6 className="fw-bold">Activity Stream</h6>
        </div>
        {/*========== filters section ==========*/}
        <AdminFilterSection>
          <AdminSearch
            className="ctrl-mr ctrl-mb"
            text={queries?.search}
            onChangeText={(data) => {
              changeFilters({ search: data?.text });
            }}
          />
          <SortButton
            options={sortOpts}
            value={queries?.orders}
            onChange={(data) => {
              changeFilters({ orders: data });
            }}
          />
          <FilterButton
            isShow={isShowFilter}
            onToggle={setIsShowFilter}
            onClear={resetQueries}
          />
        </AdminFilterSection>

        <AdminFilterBox isShow={isShowFilter}>
          {/*========== filter-basic ==========*/}
          <AdminFilterBox.Basic>
            <DateGroupFilter
              dateType={queries?.dateType}
              startDate={
                queries?.startCreatedAt
                  ? new Date(queries?.startCreatedAt)
                  : null
              }
              endDate={
                queries?.endCreatedAt ? new Date(queries?.endCreatedAt) : null
              }
              onChange={changeDateGroup}
            />
          </AdminFilterBox.Basic>

          {/*========== filter-advance ==========*/}
          <AdminFilterBox.Advance>Comming soon...</AdminFilterBox.Advance>
        </AdminFilterBox>
        {/*========== End of filters section ==========*/}
      </AdminListCard.Header>
      <AdminListCard.Body>
        <AppTable
          headers={activityHeader}
          loading={isFetching}
          total={localStates?.total}
        >
          {data?.map((e: ActivityStream, i: number) => (
            <tr key={i + 'acti-stre'}>
              <td className="text-capitalize">{e?.name}</td>
              <td>{e?.role}</td>
              <td>
                <ul className="m-0">
                  {e?.activities?.map((f, j) => (
                    <li className={j !== data.length ? '' : ''} key={j}>
                      <b>
                        {toTitleCase(f.action.split('-').join(' '))}{' '}
                        {toTitleCase(f.referenceType.split('-').join(' '))}:{' '}
                      </b>{' '}
                      {formatISODate(e.createdAt)}
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                <p>{formatISODate(e.createdAt)}</p>
                <p>{dateFromNow(e.createdAt)}</p>
              </td>
            </tr>
          ))}
        </AppTable>
      </AdminListCard.Body>
      {/*========== Card Footer (Fix) ==========*/}
      <AdminListCard.Footer>
        <AdminPagination
          activePage={queries?.page || 0}
          limit={queries?.limit || 0}
          totalItem={localStates?.total || 0}
          onChange={(e) => changePage(e)}
        ></AdminPagination>
      </AdminListCard.Footer>
    </AdminListCard>
  );
}

const mapStateToProps = (store: StoreState) => {
  return { ...store.userManagement.activityStream };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const {
    setListQueriesAction,
    resetListQueriesAction,
    getActivityListAction,
  } = activityStreamActions;

  return {
    setQueries: (queries: ISharedCommonQueries) =>
      dispatch(setListQueriesAction(queries) as any),
    resetQueries: () => dispatch(resetListQueriesAction() as any),
    getActivityStreamList: () => dispatch(getActivityListAction() as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventList);
