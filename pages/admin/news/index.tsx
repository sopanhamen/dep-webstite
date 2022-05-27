import PillarFilter from '@components/admin/filters/pillar-filter';
import SectorFilter from '@components/admin/filters/sector-filter';
import StatusFilter from '@components/admin/filters/status-filter';
import CreateNewsModal from '@components/admin/news/create-news-modal';
import AdminPagination from '@components/admin/table/admin-pagination';
import AppTable from '@components/admin/table/app-table';
import AdminListCard from '@shared/components/cards/admin-list-card';
import CmsPageTitle from '@shared/components/cards/cms-page-title';
import MoreDropDown from '@shared/components/drop-down-button';
import AdminFilterBox from '@shared/components/filters/admin-filter-box';
import AdminFilterSection from '@shared/components/filters/admin-filter-section';
import AdminSearch from '@shared/components/filters/admin-search';
import DateGroupFilter, {
  IDateGroupFilterData,
} from '@shared/components/filters/date-group-filter';
import FilterButton from '@shared/components/filters/filter-button';
import SortButton from '@shared/components/filters/sort-button';
import SortOrderOption from '@shared/components/filters/sort-order-option';
import AdminOverlayTooltip from '@shared/components/table/admin-overlay-tooltip';
import { newsHeaders } from '@shared/constant';
import {
  commonMoreOptionToDisplay,
  permissionChecker,
} from '@shared/custom-function/common';
import { formatISODate, toTitleCase } from '@shared/custom-function/conversion';
import { EStatus } from '@shared/enum';
import {
  IAdminPaginationData,
  ISelectFilterOptions,
  ISharedCommonQueries,
  ITableHeader,
  IToggle,
} from '@shared/interfaces';
import useDebounce from 'hooks/use-debounce';
import router from 'next/router';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { newsActions } from 'store/admin/news/news.actions';
import { NewsState } from 'store/admin/news/news.reducers';
import { StoreState } from 'store/root-reducer';

export interface INewsProps extends NewsState {
  getNewsList: () => void;
  reset: () => void;
  resetQueries: () => void;
  setQueries: (queries: ISharedCommonQueries) => void;
  toggleNewsStatus: (id: string, payload: IToggle) => void;
}

function CMSNews({
  data,
  isFetching,
  localStates,
  queries,
  getNewsList,
  reset,
  resetQueries,
  setQueries,
  toggleNewsStatus,
}: INewsProps) {
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

  const [showAddNewsModal, setShowAddNewsModal] = useState(false);

  const tableHeaders: ITableHeader[] = newsHeaders;

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

  /*========== If modal closed with new created data, reretrive list ==========*/
  const closeModal = (isCreatedSuccess: boolean) => {
    isCreatedSuccess && getNewsList();
    setShowAddNewsModal(false);
  };

  useDebounce(() => {
    getNewsList();
  }, queries);

  return (
    <div>
      <AdminListCard>
        {/*========== Card Header (Fix) ==========*/}
        <AdminListCard.Header>
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <CmsPageTitle title="News" hasBackIcon={false} />
            {permissionChecker('WEB-NEWS-CREATE') && (
              <button
                className="admin-btn-add"
                onClick={() => {
                  setShowAddNewsModal(true);
                }}
              >
                Add News
              </button>
            )}
          </div>

          {/*========== filters section ==========*/}
          <AdminFilterSection>
            <AdminSearch
              className="ctrl-mr ctrl-mb"
              text={queries?.search}
              onChangeText={(e) => changeFilters({ search: e?.text })}
            />
            <SortButton
              options={sortOpts}
              value={queries?.orders}
              onChange={(e) => changeFilters({ orders: e })}
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
            <AdminFilterBox.Advance>
              <AdminFilterBox.Row>
                <AdminFilterBox.Col>
                  <StatusFilter
                    value={queries?.statuses}
                    onChange={(v) => {
                      changeFilters({ statuses: v });
                    }}
                  />
                </AdminFilterBox.Col>
                <AdminFilterBox.Col>
                  <PillarFilter
                    value={queries?.pillars}
                    onChange={(v) => {
                      changeFilters({ pillars: v });
                    }}
                  />
                </AdminFilterBox.Col>
                <AdminFilterBox.ColFull>
                  <SectorFilter
                    value={queries?.sectors}
                    onChange={(v) => {
                      changeFilters({ sectors: v });
                    }}
                  />
                </AdminFilterBox.ColFull>
              </AdminFilterBox.Row>
            </AdminFilterBox.Advance>
          </AdminFilterBox>
          {/*========== End of filters section ==========*/}
        </AdminListCard.Header>

        {/*========== Card Body (Scrollable) ==========*/}
        <AdminListCard.Body>
          <AppTable
            headers={tableHeaders}
            loading={isFetching}
            total={localStates?.total}
          >
            {data?.map((d, index) => (
              <tr
                key={index}
                onClick={() => router.push(`news/${d.id}`)}
                className="cursor-pointer"
              >
                <td>{d?.locale?.en?.title}</td>
                <td>{d?.locale?.km?.title}</td>
                <td>{d?.pillar?.label}</td>
                <td className="cursor-pointer">
                  <AdminOverlayTooltip
                    placement="bottom"
                    text={d?.description}
                  />
                </td>
                <td>{formatISODate(d?.publishedAt)}</td>
                <td className={`color-${d?.status?.toLowerCase()}`}>
                  {toTitleCase(d?.status)}
                </td>
                <td>{formatISODate(d?.updatedAt)}</td>
                <td>{formatISODate(d?.createdAt)}</td>
                <td
                  onClick={(evt) => {
                    evt.preventDefault();
                    evt.stopPropagation();
                  }}
                >
                  <MoreDropDown
                    actions={commonMoreOptionToDisplay(d?.status + '', [
                      'WEB-NEWS-APPROVE',
                      'WEB-NEWS-DELETE',
                      'WEB-NEWS-UPDATE',
                    ])}
                    selectedActions={(status: string) => {
                      if (status in EStatus) {
                        const payload = { status: status as EStatus };
                        toggleNewsStatus(d?.id + '', payload);
                      } else {
                        router.push(`news/${d.id}`);
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
      </AdminListCard>

      <CreateNewsModal
        isShow={showAddNewsModal}
        onClose={closeModal}
      ></CreateNewsModal>
    </div>
  );
}

const mapStateToProps = (store: StoreState) => {
  return { ...store.news };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const {
    setListQueriesAction,
    resetListQueriesAction,
    getNewsListAction,
    toggleNewsStatusAction,
  } = newsActions;

  return {
    setQueries: (queries: ISharedCommonQueries) =>
      dispatch(setListQueriesAction(queries) as any),
    resetQueries: () => dispatch(resetListQueriesAction() as any),
    getNewsList: () => dispatch(getNewsListAction() as any),
    toggleNewsStatus: (id: string, payload: IToggle) =>
      dispatch(toggleNewsStatusAction(id, payload) as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CMSNews);
