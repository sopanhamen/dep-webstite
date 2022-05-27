import Hero from '@shared/components/web-layout/hero';
import { EWebLayout } from '@shared/enum';
import {
  IAdminPaginationData,
  ICommonQueries,
  ISelectFilterOptions,
  ISharedCommonQueries,
} from '@shared/interfaces';
import ClientFilterCard from '@shared/components/cards/client-filter-card';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { ResourceHubState } from 'store/admin/resource-hub/resource-hub.reducer';
import ResourceHubActions from 'store/admin/resource-hub/resource-hub.action';
import { StoreState } from 'store/root-reducer';

import AdminFilterBox from '@shared/components/filters/admin-filter-box';
import AdminFilterSection from '@shared/components/filters/admin-filter-section';
import AdminSearch from '@shared/components/filters/admin-search';
import DateGroupFilter, {
  IDateGroupFilterData,
} from '@shared/components/filters/date-group-filter';
import FilterButton from '@shared/components/filters/filter-button';
import SortButton from '@shared/components/filters/sort-button';
import SortOrderOption from '@shared/components/filters/sort-order-option';

import PillarFilter from '@components/admin/filters/pillar-filter';
import SectorFilter from '@components/admin/filters/sector-filter';
import OrganizationFilter from '@components/admin/filters/organization-filter';
import TypeFilter from '@components/admin/filters/type-filter';
import ExtensionFilter from '@components/admin/filters/extension-filter';

import ClientPillarTabs from '@shared/components/cards/client-pillar-tabs';
import ClientPagination from '@shared/components/pagination/client-pagination';
import ResourceHubList from '@components/resourceHub/resource-hub-list';
import useDebounce from 'hooks/use-debounce';
import SelectFilter from '@shared/components/filters/select-filter';
import classificationActions from 'store/admin/classification/classification.action';
import ClientFileTypeTabs from '@shared/components/cards/client-file-type-tabs';

interface IResourceHubProps extends ResourceHubState {
  setQueries: (queries: ISharedCommonQueries) => void;
  resetQueries: () => void;
  getResourceHubList: () => void;
}

function ResourceHub({
  data,
  localStates,
  queries,
  isLoading,
  setQueries,
  resetQueries,
  getResourceHubList,
}: IResourceHubProps): JSX.Element {
  let { t } = useTranslation();
  const [isShowFilter, setIsShowFilter] = useState(false);

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

  const changePage = (pageData: IAdminPaginationData) => {
    const filters = {
      limit: pageData?.limit,
      offset: pageData?.limit * (pageData?.activePage - 1),
      page: pageData?.activePage,
    };

    setQueries(filters);
  };

  const changeFilters = (payload: Object) => {
    setQueries(payload);
  };

  useDebounce(() => {
    getResourceHubList();
  }, queries);

  return (
    <>
      <Hero
        backgroundImage="/assets/backgrounds/homepage.png"
        titleToTranslate={EWebLayout.RESOURCE}
      />

      <section className="sectin-file bg-white py-4">
        <div className="container">
          <div className="center">
            <div className="text-center">
              <h3 className="mb-2 fw-bold">
                {t('common:download.file_download')}
              </h3>
              <p className="bg-concrete rounded-3 px-2 py-1">
                {t('common:download.download_free')}:
                <span className="color-main-red">
                  {' '}
                  PDF, PNG, SVG, JPG, JPEG, DOC, CSV
                </span>{' '}
              </p>
            </div>
          </div>
        </div>
      </section>

      <ClientFilterCard>
        <AdminFilterSection forAdmin={false}>
          <AdminSearch
            forAdmin={false}
            className="ctrl-mr ctrl-mb"
            text={queries?.search}
            onChangeText={(data) => {
              changeFilters({ search: data?.text });
            }}
          />
          <SortButton
            forAdmin={false}
            options={sortOpts}
            value={''}
            onChange={(data) => {
              changeFilters({ orders: data });
            }}
          />
          <FilterButton
            forAdmin={false}
            isShow={isShowFilter}
            onToggle={setIsShowFilter}
            onClear={resetQueries}
          />
        </AdminFilterSection>

        <AdminFilterBox forAdmin={false} isShow={isShowFilter}>
          <AdminFilterBox.Basic>
            <DateGroupFilter
              forAdmin={false}
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

          <AdminFilterBox.Advance forAdmin={false}>
            <AdminFilterBox.Row>
              <AdminFilterBox.Col>
                <TypeFilter
                  forAdmin={false}
                  value={queries?.fileTypes}
                  onChange={(v) => {
                    changeFilters({ fileTypes: v });
                  }}
                />
              </AdminFilterBox.Col>

              <AdminFilterBox.Col>
                <ExtensionFilter
                  forAdmin={false}
                  value={queries?.extensions}
                  onChange={(v) => {
                    changeFilters({ extensions: v });
                  }}
                />
              </AdminFilterBox.Col>
              <AdminFilterBox.Col>
                <PillarFilter
                  forAdmin={false}
                  value={queries?.pillars}
                  onChange={(v) => {
                    changeFilters({ pillars: v });
                  }}
                />
              </AdminFilterBox.Col>
              <AdminFilterBox.Col>
                <SectorFilter
                  forAdmin={false}
                  value={queries?.sectors}
                  onChange={(v) => {
                    changeFilters({ sectors: v });
                  }}
                />
              </AdminFilterBox.Col>

              <AdminFilterBox.Col>
                <SelectFilter
                  forAdmin={false}
                  label="Regoin"
                  isMulti={true}
                  value={queries?.province}
                  isClearAll={true}
                  onChange={(v) => v}
                />
              </AdminFilterBox.Col>

              <AdminFilterBox.Col>
                <SelectFilter
                  forAdmin={false}
                  label="Province"
                  isMulti={true}
                  value={queries?.province}
                  isClearAll={true}
                  onChange={(v) => v}
                />
              </AdminFilterBox.Col>

              <AdminFilterBox.Col>
                <SelectFilter
                  forAdmin={false}
                  label="City"
                  isMulti={true}
                  value={queries?.province}
                  isClearAll={true}
                  onChange={(v) => v}
                />
              </AdminFilterBox.Col>

              <AdminFilterBox.Col>
                <OrganizationFilter
                  forAdmin={false}
                  label="Project Owner"
                  value={queries?.owners}
                  onChange={(v) => {
                    changeFilters({ owners: v });
                  }}
                />
              </AdminFilterBox.Col>
            </AdminFilterBox.Row>
          </AdminFilterBox.Advance>
        </AdminFilterBox>
      </ClientFilterCard>

      <ClientFileTypeTabs
        selectedFileType={queries?.fileTypes}
        onChange={(v) => {
          changeFilters({ fileTypes: v });
        }}
      />

      <ResourceHubList data={data} isLoading={isLoading} showImage={true} />

      <ClientPagination
        activePage={queries?.page || 0}
        limit={queries?.limit || 0}
        totalItem={localStates?.total || 0}
        onChange={(e) => changePage(e)}
      />
    </>
  );
}

const mapStateToProps = (store: StoreState) => {
  return { ...store?.resourceHub };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const { getClassifications } = classificationActions;
  const { resetFilter, setFilter, getClientResourceHubsList } =
    ResourceHubActions;

  return {
    setQueries: (queries: ISharedCommonQueries) =>
      dispatch(setFilter(queries) as any),
    resetQueries: () => dispatch(resetFilter() as any),
    getResourceHubList: () => dispatch(getClientResourceHubsList() as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResourceHub);
