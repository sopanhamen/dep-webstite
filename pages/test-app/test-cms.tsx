import OrganizationFilter from '@components/admin/filters/organization-filter';
import PillarFilter from '@components/admin/filters/pillar-filter';
import SectorFilter from '@components/admin/filters/sector-filter';
import StatusFilter from '@components/admin/filters/status-filter';
import AdminPagination from '@components/admin/table/admin-pagination';
import AppTable from '@components/admin/table/app-table';
import AdminListCard from '@shared/components/cards/admin-list-card';
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
import DownloadModal from '@shared/components/modals/download-modal';
import AdminOverlayTooltip from '@shared/components/table/admin-overlay-tooltip';
import { testTableHeaders } from '@shared/constant/test-fix-data';
import { formatISODate, toTitleCase } from '@shared/custom-function/conversion';
import { EDownloadType, EStatus, ETextColor } from '@shared/enum';
import {
  IAction,
  IAdminPaginationData,
  ISelectFilterOptions,
  ISharedCommonQueries,
  ITableHeader,
  IToggle,
} from '@shared/interfaces';
import AdminLayout from 'layouts/admin';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { StoreState } from 'store/root-reducer';
import { testCMSActions } from 'store/test-app/test-cms/test-cms.actions';
import { TestCMSState } from 'store/test-app/test-cms/test-cms.reducers';

interface ITestCMSProps extends TestCMSState {
  setQueries: (queries: ISharedCommonQueries) => void;
  resetQueries: () => void;
  getTestCMSList: () => void;
  toggleTestCMSStatus: (id: string, payload: IToggle) => void;
}

function TestCMS(props: ITestCMSProps) {
  const {
    data,
    isFetching,
    queries,
    localStates,
    setQueries,
    resetQueries,
    getTestCMSList,
    toggleTestCMSStatus,
  } = props;

  const sortOpts: ISelectFilterOptions[] = [
    {
      label: <SortOrderOption label="CreatedAt" order="ASC" />,
      value: 'createdAt:ASC',
    },
    {
      label: <SortOrderOption label="CreatedAt" order="DESC" />,
      value: 'createdAt:DESC',
    },
  ];

  const [isShowFilter, setIsShowFilter] = useState(false);

  const tableHeaders: ITableHeader[] = testTableHeaders;

  const changePage = (pageData: IAdminPaginationData) => {
    const filters = {
      limit: pageData.limit,
      offset: pageData.limit * (pageData.activePage - 1),
      page: pageData.activePage,
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
      setQueries(payload);
    }
  };

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

  useEffect(() => {
    getTestCMSList();
  }, [queries]); // eslint-disable-line react-hooks/exhaustive-deps

  const changeFilters = (payload: Object) => {
    setQueries(payload);
  };

  /*===== Start of Downloading Testing =====*/
  const [dwlData, setDwlData] = useState({
    itemId: '',
    referenceFileId: '',
    fileId: '',
    filename: '',
    extension: '',
  });

  const [showDownload, setShowDownload] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const openModalDWL = (number: number) => {
    if (number === 1) {
      /// excel.
      setDwlData({
        itemId: '541e6d22-133f-4dd2-a174-8588a41fcd27',
        referenceFileId: '0ff947a6-3ba9-449f-a0e9-59137be69961',
        fileId: '799ad5f4-64dd-4fa2-a8a6-c896042dde8b',
        filename: 'inventory-new-template',
        extension: 'xlsx',
      });
    } else {
      /// pdf.
      setDwlData({
        itemId: '541e6d22-133f-4dd2-a174-8588a41fcd27',
        referenceFileId: '16ce3cac-2c8a-49c1-9821-7f9ad0753e7d',
        fileId: '0242422b-dbe7-49b4-ba71-4e28036fd96a',
        filename: 'DMS Api Requirement V2',
        extension: 'pdf',
      });
    }
    setShowDownload(true);
  };
  /*===== End of Downloading Testing =====*/

  return (
    <>
      <AdminLayout>
        <AdminListCard>
          {/*========== Card Header (Fix) ==========*/}
          <AdminListCard.Header>
            <div className="d-flex flex-wrap align-items-center justify-content-between">
              <h6 className="fw-bold">Test CMS (Project)</h6>
              <button className="admin-btn-add">Add Button</button>
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
              <button
                className="admin-btn-cancel ctrl-ml ctrl-mb"
                onClick={() => openModalDWL(1)}
                disabled={downloading}
              >
                File Excel
              </button>
              <button
                className="admin-btn-cancel ctrl-ml ctrl-mb"
                onClick={() => openModalDWL(2)}
                disabled={downloading}
              >
                File PDF
              </button>
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
                    queries?.endCreatedAt
                      ? new Date(queries?.endCreatedAt)
                      : null
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
                      onChange={(data) => {
                        changeFilters({ statuses: data });
                      }}
                    />
                  </AdminFilterBox.Col>
                  <AdminFilterBox.Col>
                    <PillarFilter
                      value={queries?.pillars}
                      onChange={(data) => {
                        changeFilters({ pillars: data });
                      }}
                    />
                  </AdminFilterBox.Col>
                  <AdminFilterBox.Col>
                    <SectorFilter
                      value={queries?.sectors}
                      onChange={(data) => {
                        changeFilters({ sectors: data });
                      }}
                    />
                  </AdminFilterBox.Col>
                  <AdminFilterBox.Col>
                    <OrganizationFilter
                      label="Project Owner"
                      value={queries?.owners}
                      onChange={(data) => {
                        changeFilters({ owners: data });
                      }}
                    />
                  </AdminFilterBox.Col>
                  <AdminFilterBox.ColFull>
                    <OrganizationFilter
                      label="Implement Partner"
                      value={queries?.partners}
                      onChange={(data) => {
                        changeFilters({ partners: data });
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
                <tr key={index}>
                  <td>{d?.locale?.en?.name}</td>
                  <td>{d?.locale?.km?.name}</td>
                  <td>{d?.pillar?.name}</td>
                  <td>
                    {d?.sectors?.map((st, sectorIndex) => (
                      <p key={`${sectorIndex} cms-sector`}>{st?.name}</p>
                    ))}
                  </td>
                  <td className={`color-${d?.status?.toLowerCase()}`}>
                    {toTitleCase(d?.status)}
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
                  <td>{formatISODate(d.updatedAt)}</td>
                  <td>{formatISODate(d.createdAt)}</td>
                  <td>
                    <MoreDropDown
                      actions={moreOptionToDisplay(d?.status + '')}
                      selectedActions={(status: string) => {
                        if (status in EStatus) {
                          const payload = { status: status as EStatus };
                          toggleTestCMSStatus(d?.id + '', payload);
                        } else {
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
      </AdminLayout>

      {/*===== Start of Downloading Testing =====*/}
      <DownloadModal
        itemId={dwlData?.itemId}
        referenceFileId={dwlData?.referenceFileId}
        fileId={dwlData?.fileId}
        filename={dwlData?.filename}
        extension={dwlData?.extension}
        isShow={showDownload}
        downloadType={EDownloadType.RESOURCE_HUB}
        onClose={() => setShowDownload(false)}
        getDownloading={setDownloading}
      />
      {/*===== end of Downloading Testing =====*/}
    </>
  );
}

const mapStateToProps = (store: StoreState) => {
  return { ...store.testCMS };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const {
    setListQueriesAction,
    resetListQueriesAction,
    getTestCMSListAction,
    toggleTestCMSStatusAction,
  } = testCMSActions;

  return {
    setQueries: (queries: ISharedCommonQueries) =>
      dispatch(setListQueriesAction(queries) as any),
    resetQueries: () => dispatch(resetListQueriesAction() as any),
    getTestCMSList: () => dispatch(getTestCMSListAction() as any),
    toggleTestCMSStatus: (id: string, payload: IToggle) =>
      dispatch(toggleTestCMSStatusAction(id, payload) as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TestCMS);
