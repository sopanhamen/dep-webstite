import ClientFilterCard from '@shared/components/cards/client-filter-card';
import AdminFilterBox from '@shared/components/filters/admin-filter-box';
import AdminFilterSection from '@shared/components/filters/admin-filter-section';
import AdminSearch from '@shared/components/filters/admin-search';
import DateGroupFilter, {
  IDateGroupFilterData,
} from '@shared/components/filters/date-group-filter';
import FilterButton from '@shared/components/filters/filter-button';
import PillarFilter from '@components/admin/filters/pillar-filter';
import SortButton from '@shared/components/filters/sort-button';
import SortOrderOption from '@shared/components/filters/sort-order-option';
import Hero from '@shared/components/web-layout/hero';
import { EWebLayout } from '@shared/enum';
import {
  IAdminPaginationData,
  IClientSummaryCardData,
  ISelectFilterOptions,
  ISharedCommonQueries,
} from '@shared/interfaces';
import useDebounce from 'hooks/use-debounce';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import { NewsState } from 'store/admin/news/news.reducers';
import ClientPillarTabs from '@shared/components/cards/client-pillar-tabs';
import ClientSummaryArray from '@shared/components/cards/client-summary-array';
import ClientPagination from '@shared/components/pagination/client-pagination';
import { connect } from 'react-redux';
import { newsActions } from 'store/admin/news/news.actions';
import { Dispatch } from 'redux';
import { StoreState } from 'store/root-reducer';
import { MNews } from '@shared/models/news.model';

interface INewsProps extends NewsState {
  setQueries: (queries: ISharedCommonQueries) => void;
  resetQueries: () => void;
  getNewsList: () => void;
}

function News({
  data,
  isFetching,
  queries,
  localStates,
  setQueries,
  resetQueries,
  getNewsList,
}: INewsProps): JSX.Element {
  const { t } = useTranslation();
  const [isShowFilter, setIsShowFilter] = useState(false);
  const [displayedData, setDisplayedData] = useState<IClientSummaryCardData[]>(
    [],
  );

  const sortOpts: ISelectFilterOptions[] = [
    {
      label: (
        <SortOrderOption label={t('common:filter.published_on')} order="ASC" />
      ),
      value: 'publishedAt:ASC',
    },
    {
      label: (
        <SortOrderOption label={t('common:filter.published_on')} order="DESC" />
      ),
      value: 'publishedAt:DESC',
    },
  ];

  /*===== Change any queries beside pagination, need to set page to 1 =====*/
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
        startPublishedAt: dateData?.startDate,
        endPublishedAt: dateData?.endDate,
      };
      changeFilters(payload);
    }
  };

  /*===== Reretrieve data when queries change =====*/
  useDebounce(() => {
    getNewsList();
  }, queries);

  useEffect(() => {
    const mapped: IClientSummaryCardData[] = data?.map((d: MNews) => {
      return {
        id: d?.id,
        titleEn: d?.locale?.en?.title,
        titleKh: d?.locale?.km?.title,
        titleLinkEn: d?.locale?.en?.sourceOrg,
        titleLinkKh: d?.locale?.km?.sourceOrg,
        linkTarget: '_blank',
        descriptionEn: d?.locale?.en?.description,
        descriptionKh: d?.locale?.km?.description,
        pillarCode: d?.pillar?.value,
        pillarLabel: d?.pillar?.label,
        date: d?.publishedAt,
      };
    });

    setDisplayedData(mapped || []);
  }, [data]);

  return (
    <>
      <Hero
        backgroundImage="/assets/backgrounds/homepage.png"
        titleToTranslate={EWebLayout.NEWS}
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
                queries?.startPublishedAt
                  ? new Date(queries?.startPublishedAt)
                  : null
              }
              endDate={
                queries?.endPublishedAt
                  ? new Date(queries?.endPublishedAt)
                  : null
              }
              onChange={changeDateGroup}
            />
          </AdminFilterBox.Basic>

          <AdminFilterBox.Advance forAdmin={false}>
            <AdminFilterBox.Row>
              <AdminFilterBox.ColFull>
                <PillarFilter
                  forAdmin={false}
                  value={queries?.pillars}
                  onChange={(v) => {
                    changeFilters({ pillars: v });
                  }}
                />
              </AdminFilterBox.ColFull>
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
        showImage={false}
        showStatus={false}
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
  return { ...store?.news };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const {
    setListQueriesAction,
    resetListQueriesAction,
    getClientNewsListAction,
  } = newsActions;

  return {
    setQueries: (queries: ISharedCommonQueries) =>
      dispatch(setListQueriesAction(queries) as any),
    resetQueries: () => dispatch(resetListQueriesAction() as any),
    getNewsList: () => dispatch(getClientNewsListAction() as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(News);
