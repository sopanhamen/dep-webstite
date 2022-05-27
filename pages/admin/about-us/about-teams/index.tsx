import AdminListCard from '@shared/components/cards/admin-list-card';
import AdminFilterSection from '@shared/components/filters/admin-filter-section';
import AdminSearch from '@shared/components/filters/admin-search';
import React, { useState } from 'react';
import useDebounce from 'hooks/use-debounce';
import {
  IAdminPaginationData,
  IMetadata,
  ISharedCommonQueries,
} from '@shared/interfaces';
import AdminPagination from '@components/admin/table/admin-pagination';
import AboutTeamTable from '@components/admin/about-us/about-team/about-team-table';
import { StoreState } from 'store/root-reducer';
import { Dispatch } from 'redux';
import AboutTeamActions from 'store/admin/about-us/about-teams/about-team.actions';
import { connect } from 'react-redux';

interface IAboutTeamsProps {
  metadata: IMetadata;
  queries: ISharedCommonQueries;
  setFilter: (queries: ISharedCommonQueries) => void;
  getAboutTeams: () => void;
}

function AboutTeams(props: IAboutTeamsProps) {
  const { setFilter, getAboutTeams, metadata, queries } = props;

  // hooks section
  useDebounce(() => {
    getAboutTeams();
  }, [queries]);

  // function section
  const onHandleSearch = (search: string) => {
    setFilter({ search, offset: 0, page: 1 });
  };

  const changePage = (data: IAdminPaginationData) => {
    const offset = +(data.limit || 10) * ((data.activePage || 1) - 1);
    setFilter({ page: data.activePage, limit: data.limit, offset });
  };

  return (
    <>
      <AdminListCard>
        <AdminListCard.Header>
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <h6 className="fw-bold">About Teams</h6>
          </div>

          {/*================== filter section ====================*/}
          <AdminFilterSection>
            {/* ========= search ======= */}
            <AdminSearch
              className="ctrl-mr ctrl-mb flex-fill"
              text={queries.search}
              onChangeText={(evt) => onHandleSearch(evt?.text)}
            />
          </AdminFilterSection>
        </AdminListCard.Header>
        <AdminListCard.Body>
          <AboutTeamTable />
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
}

// store section
const mapStateToProps = (state: StoreState) => {
  return { ...state?.aboutUs?.aboutTeams };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const { getAboutTeams, setFilter } = AboutTeamActions;
  return {
    getAboutTeams: () => dispatch(getAboutTeams() as any),
    setFilter: (queries: ISharedCommonQueries) =>
      dispatch(setFilter(queries) as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AboutTeams);
