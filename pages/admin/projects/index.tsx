import OrganizationFilter from '@components/admin/filters/organization-filter';
import PillarFilter from '@components/admin/filters/pillar-filter';
import SectorFilter from '@components/admin/filters/sector-filter';
import StatusFilter from '@components/admin/filters/status-filter';
import AddProject from '@components/admin/projects/add-project';
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
import ModificationModal from '@shared/components/modals/modification-modal';
import AdminOverlayTooltip from '@shared/components/table/admin-overlay-tooltip';
import { projectHeaders } from '@shared/constant';
import {
  commonMoreOptionToDisplay,
  permissionChecker,
} from '@shared/custom-function/common';
import { formatISODate, toTitleCase } from '@shared/custom-function/conversion';
import { EStatus, ETextColor } from '@shared/enum';
import {
  IAction,
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
import { projectActions } from 'store/admin/project/project.actions';
import { ProjectState } from 'store/admin/project/project.reducers';
import { StoreState } from 'store/root-reducer';

export interface IProjectProps extends ProjectState {
  getProjectList: () => void;
  reset: () => void;
  resetQueries: () => void;
  setQueries: (queries: ISharedCommonQueries) => void;
  toggleProjectStatus: (id: string, payload: IToggle) => void;
}

function CMSProject({
  data,
  isFetching,
  localStates,
  queries,
  getProjectList,
  reset,
  resetQueries,
  setQueries,
  toggleProjectStatus,
}: IProjectProps) {
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

  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  const tableHeaders: ITableHeader[] = projectHeaders;

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

  const moreOptionToDisplay = (status: string): IAction[] => {
    let value: IAction[] = [];

    if (status === EStatus.ACTIVE) {
      value = [
        {
          name: 'Private',
          color: ETextColor.RED,
        },
      ];
    } else {
      value = [
        {
          name: 'Public',
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

  useDebounce(() => {
    getProjectList();
  }, queries);

  return (
    <div>
      <ModificationModal
        title="Add Project"
        isShow={showAddProjectModal}
        onClose={() => setShowAddProjectModal(false)}
        size="xl"
      >
        <ModificationModal.Body className="pb-0">
          <AddProject
            closeModal={() => setShowAddProjectModal(false)}
            isBeingEdited={true}
          />
        </ModificationModal.Body>
      </ModificationModal>

      <AdminListCard>
        {/*========== Card Header (Fix) ==========*/}
        <AdminListCard.Header>
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <CmsPageTitle title="Project" hasBackIcon={false} />
            {permissionChecker('WEB-PROJECT-CREATE') && (
              <button
                className="admin-btn-add"
                onClick={() => {
                  setShowAddProjectModal(true);
                  reset();
                }}
              >
                Add Project
              </button>
            )}
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
                <AdminFilterBox.Col>
                  <SectorFilter
                    value={queries?.sectors}
                    onChange={(v) => {
                      changeFilters({ sectors: v });
                    }}
                  />
                </AdminFilterBox.Col>
                <AdminFilterBox.Col>
                  <OrganizationFilter
                    label="Project Owner"
                    value={queries?.owners}
                    onChange={(v) => {
                      changeFilters({ owners: v });
                    }}
                  />
                </AdminFilterBox.Col>
                <AdminFilterBox.ColFull>
                  <OrganizationFilter
                    label="Implement Partner"
                    value={queries?.partners}
                    onChange={(v) => {
                      changeFilters({ partners: v });
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
                onClick={() => router.push(`projects/${d.id}`)}
                className="cursor-pointer"
              >
                <td>{d?.locale?.en?.name}</td>
                <td>{d?.locale?.km?.name}</td>
                <td>{d?.pillar?.label}</td>
                <td>
                  {d?.sectors?.map((st, sectorIndex) => (
                    <p key={`${sectorIndex} cms-sector`}>{st?.label}</p>
                  ))}
                </td>
                <td
                  className={`color-${d?.projectStatus?.value?.toLowerCase()}`}
                >
                  {toTitleCase(d?.projectStatus?.label)}
                </td>
                <td className="cursor-pointer">
                  <AdminOverlayTooltip
                    placement="bottom"
                    text={d?.description}
                  />
                </td>
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
                      'WEB-PROJECT-DELETE',
                      'WEB-PROJECT-UPDATE',
                      'WEB-PROJECT-UPDATE-ASSIGNED',
                    ])}
                    selectedActions={(status: string) => {
                      if (status in EStatus) {
                        const payload = { status: status as EStatus };
                        toggleProjectStatus(d?.id + '', payload);
                      } else {
                        router.push(`projects/${d.id}`);
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
    </div>
  );
}

const mapStateToProps = (store: StoreState) => {
  return { ...store.project };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const {
    setListQueriesAction,
    resetListQueriesAction,
    getProjectListAction,
    toggleProjectStatusAction,
    resetProjectModal,
  } = projectActions;

  return {
    setQueries: (queries: ISharedCommonQueries) =>
      dispatch(setListQueriesAction(queries) as any),
    resetQueries: () => dispatch(resetListQueriesAction() as any),
    getProjectList: () => dispatch(getProjectListAction() as any),
    toggleProjectStatus: (id: string, payload: IToggle) =>
      dispatch(toggleProjectStatusAction(id, payload) as any),
    reset: () => dispatch(resetProjectModal() as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CMSProject);
