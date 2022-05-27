import AdminListCard from '@shared/components/cards/admin-list-card';
import MoreDropDown from '@shared/components/drop-down-button';
import AdminFilterBox from '@shared/components/filters/admin-filter-box';
import AdminFilterSection from '@shared/components/filters/admin-filter-section';
import AdminSearch from '@shared/components/filters/admin-search';
import FilterButton from '@shared/components/filters/filter-button';
import SortButton from '@shared/components/filters/sort-button';
import SortOrderOption from '@shared/components/filters/sort-order-option';
import AdminTableImg from '@shared/components/table/admin-table-img';
import { deTrackerHeaders } from '@shared/constant';
import { toTitleCase } from '@shared/custom-function/conversion';
import { EStatus, ETextColor } from '@shared/enum';
import {
  IAction,
  IAdminPaginationData,
  ISelectFilterOptions,
  ISharedCommonQueries,
  ITableHeader,
  IToggle,
} from '@shared/interfaces';
import { MDETracker } from '@shared/models/de-tracker.model';
import useDebounce from 'hooks/use-debounce';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { deTrackerActions } from 'store/admin/de-trackers/de-trackers.actions';
import { StoreState } from 'store/root-reducer';
import StatusFilter from '../filters/status-filter';
import AdminPagination from '../table/admin-pagination';
import router from 'next/router';
import AppTable from '../table/app-table';

interface ITrackerList {
  pCode: any;
  getTrackerListByPillar?: (pCode: ISharedCommonQueries) => void;
  reset?: () => void;
  resetQueries?: () => void;
  setQueries?: (queries: ISharedCommonQueries) => void;
  toggleTrackerStatus?: (id: string, payload: IToggle) => void;
  data?: MDETracker[];
  isFetching?: boolean;
  queries?: ISharedCommonQueries;
  localStates?: ISharedCommonQueries;
}

function TrackerList({
  pCode,
  data,
  isFetching,
  queries,
  localStates,
  getTrackerListByPillar,
  resetQueries,
  setQueries,
  toggleTrackerStatus,
}: ITrackerList) {
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
  const tableHeaders: ITableHeader[] = deTrackerHeaders;

  /*========== Change queries beside pagination, need to set page to 1 ==========*/
  const changeFilters = (payload: Object) => {
    const queries = { ...payload, page: 1, offset: 0 };
    setQueries && setQueries(queries);
  };

  const changePage = (pageData: IAdminPaginationData) => {
    const filters = {
      limit: pageData?.limit,
      offset: pageData?.limit * (pageData?.activePage - 1),
      page: pageData?.activePage,
    };

    setQueries && setQueries(filters);
  };

  useEffect(() => {
    getTrackerListByPillar && getTrackerListByPillar(pCode);
  }, [queries, pCode]);

  useDebounce(() => {
    getTrackerListByPillar && getTrackerListByPillar(pCode);
  }, [queries, pCode]);

  const moreOptionToDisplay = (status: string): IAction[] => {
    let value: IAction[] = [];
    if (status === EStatus.ACTIVE) {
      value = [
        {
          name: 'Deactivate',
          color: ETextColor.RED,
        },
      ];
    } else {
      value = [
        {
          name: 'Activate',
          color: ETextColor.BLUE,
        },
      ];
    }

    value.unshift({
      name: 'Edit',
      color: ETextColor.BLUE,
    });

    return value;
  };

  return (
    <>
      {/*========== filters section ==========*/}
      <AdminListCard.Header>
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
            <StatusFilter
              value={queries?.statuses}
              onChange={(v) => {
                changeFilters({ statuses: v });
              }}
            />
          </AdminFilterBox.Basic>
        </AdminFilterBox>
      </AdminListCard.Header>

      <AdminListCard.Body style={{ height: '60vh' }}>
        <AppTable
          headers={tableHeaders}
          loading={isFetching}
          total={localStates?.total}
        >
          {data?.map((d: any, index: any) => (
            <tr key={index} className="cursor-pointer">
              <td>
                {' '}
                <AdminTableImg src={d?.iconUrl} alt="icon" />
              </td>
              <td>{d?.title}</td>
              <td>{d?.locale?.km?.title}</td>
              <td>
                <input
                  type="color"
                  disabled
                  className="form-control-color p-0 width-20 height-20 overflow-hidden rounded-3"
                  value={d?.metadata?.color}
                />
              </td>
              <td className={`color-${d?.status?.toLowerCase()}`}>
                {toTitleCase(d?.status)}
              </td>

              <td
                onClick={(evt) => {
                  evt.preventDefault();
                  evt.stopPropagation();
                }}
              >
                <MoreDropDown
                  actions={moreOptionToDisplay(d?.status + '')}
                  selectedActions={(status: string) => {
                    if (status in EStatus) {
                      const payload = { status: status as EStatus };
                      toggleTrackerStatus &&
                        toggleTrackerStatus(d?.id + '', payload);
                    } else {
                      // router.push(`/admin/de-progress-tracker`);
                    }
                  }}
                />
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
    </>
  );
}

const mapStateToProps = (store: StoreState) => {
  return { ...(store.deTrackers as any) };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const {
    setListQueriesAction,
    resetListQueriesAction,
    getTrackerListByPillarAction,
    toggleTrackerStatusAction,
  } = deTrackerActions;

  return {
    setQueries: (queries: ISharedCommonQueries) =>
      dispatch(setListQueriesAction(queries) as any),
    resetQueries: () => dispatch(resetListQueriesAction() as any),
    getTrackerListByPillar: (payload: ISharedCommonQueries) =>
      dispatch(getTrackerListByPillarAction(payload) as any),
    toggleTrackerStatus: (id: string, payload: IToggle) =>
      dispatch(toggleTrackerStatusAction(id, payload) as any),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(TrackerList);
