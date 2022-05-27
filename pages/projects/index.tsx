import Hero from '@shared/components/web-layout/hero';
import { EWebLayout } from '@shared/enum';
import {
  IAdminPaginationData,
  IClientSummaryCardData,
  ISelectFilterOptions,
  ISharedCommonQueries,
} from '@shared/interfaces';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { projectActions } from 'store/admin/project/project.actions';
import { ProjectState } from 'store/admin/project/project.reducers';
import { StoreState } from 'store/root-reducer';
import AdminFilterSection from '@shared/components/filters/admin-filter-section';
import AdminSearch from '@shared/components/filters/admin-search';
import SortButton from '@shared/components/filters/sort-button';
import FilterButton from '@shared/components/filters/filter-button';
import AdminFilterBox from '@shared/components/filters/admin-filter-box';
import DateGroupFilter, {
  IDateGroupFilterData,
} from '@shared/components/filters/date-group-filter';
import PillarFilter from '@components/admin/filters/pillar-filter';
import SectorFilter from '@components/admin/filters/sector-filter';
import OrganizationFilter from '@components/admin/filters/organization-filter';
import SortOrderOption from '@shared/components/filters/sort-order-option';
import ClientSummaryArray from '@shared/components/cards/client-summary-array';
import ClientFilterCard from '@shared/components/cards/client-filter-card';
import ClientPillarTabs from '@shared/components/cards/client-pillar-tabs';
import ClientPagination from '@shared/components/pagination/client-pagination';
import useDebounce from 'hooks/use-debounce';
import useTranslation from 'next-translate/useTranslation';
import { Project } from '@shared/models/project.model';

interface IProjectProps extends ProjectState {
  setQueries: (queries: ISharedCommonQueries) => void;
  resetQueries: () => void;
  getProjectList: () => void;
}
function Projects({
  data,
  isFetching,
  queries,
  localStates,
  setQueries,
  resetQueries,
  getProjectList,
}: IProjectProps): JSX.Element {
  const { t } = useTranslation();
  const [isShowFilter, setIsShowFilter] = useState(false);
  const [displayedData, setDisplayedData] = useState<IClientSummaryCardData[]>(
    [],
  );

  const sortOpts: ISelectFilterOptions[] = [
    {
      label: (
        <SortOrderOption label={t('common:filter.created_on')} order="ASC" />
      ),
      value: 'createdAt:ASC',
    },
    {
      label: (
        <SortOrderOption label={t('common:filter.created_on')} order="DESC" />
      ),
      value: 'createdAt:DESC',
    },
  ];

  /*========== Change any queries beside pagination, need to set page to 1 ==========*/
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

  /*========== Reretrieve data when language or queries change ==========*/
  useDebounce(() => {
    getProjectList();
  }, queries);

  useEffect(() => {
    const mapped: IClientSummaryCardData[] = data?.map((d: Project) => {
      return {
        id: d?.id,
        imageUrl: d?.imageUrl,
        titleEn: d?.locale?.en?.name,
        titleKh: d?.locale?.km?.name,
        titleLinkEn: `/projects/${d?.id}`,
        titleLinkKh: `/projects/${d?.id}`,
        linkTarget: '_self',
        descriptionEn: d?.locale?.en?.description,
        descriptionKh: d?.locale?.km?.description,
        pillarCode: d?.pillar?.value,
        pillarLabel: d?.pillar?.label,
        statusCode: d?.projectStatus?.value,
        statusLabel: d?.projectStatus?.label,
        date: d?.updatedAt,
        dateLabel: 'Last Updated :',
      };
    });

    setDisplayedData(mapped || []);
  }, [data]);

  return (
    <>
      <Hero
        backgroundImage="/assets/backgrounds/homepage.png"
        titleToTranslate={EWebLayout.PROJECT}
      />
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
            value={queries?.orders}
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
                <OrganizationFilter
                  forAdmin={false}
                  label={t('common:project.project_owner')}
                  value={queries?.owners}
                  onChange={(v) => {
                    changeFilters({ owners: v });
                  }}
                />
              </AdminFilterBox.Col>
              <AdminFilterBox.Col>
                <OrganizationFilter
                  forAdmin={false}
                  label={t('common:project.implement_partner')}
                  value={queries?.partners}
                  onChange={(v) => {
                    changeFilters({ partners: v });
                  }}
                />
              </AdminFilterBox.Col>
            </AdminFilterBox.Row>
          </AdminFilterBox.Advance>
        </AdminFilterBox>
      </ClientFilterCard>

      <ClientPillarTabs
        selectedPillars={queries?.pillars}
        onChange={(v) => {
          changeFilters({ pillars: v });
        }}
      />

      <ClientSummaryArray
        dataArray={displayedData}
        isLoading={isFetching}
        showDate={false}
      />

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
  return { ...store?.project };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const {
    setListQueriesAction,
    resetListQueriesAction,
    getClientProjectListAction,
  } = projectActions;

  return {
    setQueries: (queries: ISharedCommonQueries) =>
      dispatch(setListQueriesAction(queries) as any),
    resetQueries: () => dispatch(resetListQueriesAction() as any),
    getProjectList: () => dispatch(getClientProjectListAction() as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
