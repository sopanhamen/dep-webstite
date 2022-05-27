import AddResource from '@components/admin/resource-hub/add-resource';
import ResourceHubTable from '@components/admin/resource-hub/resource-hub-table';
import AdminPagination from '@components/admin/table/admin-pagination';
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
import {
  IAdminPaginationData,
  IMetadata,
  ISelectFilterOptions,
  ISharedCommonQueries,
} from '@shared/interfaces';
import useDebounce from 'hooks/use-debounce';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import ResourceHubActions from 'store/admin/resource-hub/resource-hub.action';
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
// =============== end static data ================

interface IResourceHub {
  // redux props
  getResourceHubs: () => void;
  setFilter: (queries: ISharedCommonQueries) => void;
  resetFilter: () => void;
  metadata: IMetadata;
  queries: ISharedCommonQueries;
}

const ResourceHub = (props: IResourceHub) => {
  const { getResourceHubs, setFilter, resetFilter, queries, metadata } = props;

  // states section
  const [toggleFilter, setToggleFilter] = useState(false);
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);

  // hooks section
  useDebounce(() => {
    getResourceHubs();
  }, [queries]);

  // function section
  const onHandleSearch = (search: string) => {
    setFilter({ search, offset: 0, page: 1 });
  };

  const changePage = (data: IAdminPaginationData) => {
    const offset = +(data.limit || 10) * ((data.activePage || 1) - 1);
    setFilter({ page: data.activePage, limit: data.limit, offset });
  };

  const onFilterChanged = (
    evt: IDateGroupFilterData,
    type: 'FILTER' | 'SORT',
  ) => {
    switch (type) {
      case 'FILTER':
        const payload: ISharedCommonQueries = {
          dateType: evt?.dateType,
          startCreatedAt: evt?.startDate,
          endCreatedAt: evt?.endDate,
        };
        setFilter({ ...payload });
        break;
      case 'SORT':
        setFilter({ orders: evt as string, offset: 0, page: 1 });
        break;

      default:
        break;
    }
  };

  const clearAllFilter = () => {
    setToggleFilter(false);
    resetFilter();
  };

  // end function section

  return (
    <>
      <AddResource
        isShow={showAddResourceModal}
        onClose={() => setShowAddResourceModal(false)}
      />

      <AdminListCard>
        <AdminListCard.Header>
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <h6 className="fw-bold">Resource Hub</h6>
            <button
              className="admin-btn-add"
              onClick={() => setShowAddResourceModal(true)}
            >
              Add Resource
            </button>
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
              options={sortOpts}
              onChange={(evt) => onFilterChanged(evt, 'SORT')}
              value={queries?.orders}
            />
            <FilterButton
              onToggle={() => setToggleFilter(!toggleFilter)}
              onClear={clearAllFilter}
            />
          </AdminFilterSection>

          <AdminFilterBox isShow={toggleFilter}>
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
                onChange={(evt) => onFilterChanged(evt, 'FILTER')}
              />
            </AdminFilterBox.Basic>
          </AdminFilterBox>
        </AdminListCard.Header>
        <AdminListCard.Body>
          <ResourceHubTable />
        </AdminListCard.Body>
        <AdminListCard.Footer>
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

// store section
const mapStateToProps = (state: StoreState) => {
  return { ...state?.resourceHub };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const { getResourceHubs, setFilter, resetFilter } = ResourceHubActions;
  return {
    getResourceHubs: () => dispatch(getResourceHubs() as any),
    setFilter: (queries: ISharedCommonQueries) =>
      dispatch(setFilter(queries) as any),
    resetFilter: () => dispatch(resetFilter() as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResourceHub);
