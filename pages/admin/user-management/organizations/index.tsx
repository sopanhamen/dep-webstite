import AdminPagination from '@components/admin/table/admin-pagination';
import AppTable from '@components/admin/table/app-table';
import AddOrganization from '@components/admin/user-management/organizations/add-organization';
import AdminListCard from '@shared/components/cards/admin-list-card';
import MoreDropDown from '@shared/components/drop-down-button';
import AdminFilterSection from '@shared/components/filters/admin-filter-section';
import AdminSearch from '@shared/components/filters/admin-search';
import AdminTableImg from '@shared/components/table/admin-table-img';
import { organizationHeader } from '@shared/constant';
import { activePage, removeFalseyObject } from '@shared/custom-function/common';
import { toTitleCase } from '@shared/custom-function/conversion';
import { ELanguage, EStatus, ETextColor } from '@shared/enum';
import {
  IAction,
  IAdminPaginationData,
  ICommonQueries,
  IToggle,
} from '@shared/interfaces';
import { Organization } from '@shared/models/user-management/organization.model';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { organizationActions } from 'store/admin/user-management/organization/organization.actions';
import { OrganizationState } from 'store/admin/user-management/organization/organization.reducers';
import { StoreState } from 'store/root-reducer';

export interface IOrganizationList extends OrganizationState {
  getOrganizationList: (payload: ICommonQueries) => void;
  toggle: (id: string, payload: IToggle) => void;
}

function OrganizationLists({
  isFetching,
  metadata,
  organizations,
  getOrganizationList,
  toggle,
}: IOrganizationList): JSX.Element {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const payload: ICommonQueries = {
      limit: metadata.limit,
      offset: metadata.offset,
      search,
    };

    getOrganizationList(removeFalseyObject(payload));
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const pagination = (e: IAdminPaginationData) => {
    const payload: ICommonQueries = {
      limit: e.limit,
      offset: e.limit * (e.activePage - 1),
      search,
    };

    getOrganizationList(removeFalseyObject(payload));
  };

  const moreOptionToDisplay = (status: string): IAction => {
    let value: IAction;
    if (status === EStatus.ACTIVE) {
      value = {
        name: 'Private',
        color: ETextColor.RED,
      };
    } else {
      value = {
        name: 'Public',
        color: ETextColor.BLUE,
      };
    }

    return value;
  };

  const goToDetail = (id: string) => {
    router.push(`organizations/${id}`);
  };

  return (
    <>
      <AddOrganization isShow={openModal} onClose={() => setOpenModal(false)} />
      <AdminListCard>
        <AdminListCard.Header>
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <h6 className="fw-bold">Organization</h6>
            <button
              className="admin-btn-add"
              onClick={() => setOpenModal(true)}
            >
              Add Organization
            </button>
          </div>
          <AdminFilterSection>
            <AdminSearch
              className="ctrl-mr ctrl-mb width-300"
              text={search}
              onChangeText={(d) => {
                setSearch(d.text);
              }}
            />
          </AdminFilterSection>
        </AdminListCard.Header>
        <AdminListCard.Body>
          <AppTable
            headers={organizationHeader}
            loading={isFetching}
            total={metadata?.total}
          >
            {organizations?.map((e: Organization, i: number) => (
              <tr
                key={i + 'org-data'}
                onClick={() => goToDetail(e?.id as string)}
                className="cursor-pointer"
              >
                <td>{metadata?.offset + i + 1}</td>
                <td>
                  <AdminTableImg src={e?.imageUrl} alt={e?.name} />
                </td>
                <td>{e?.name}</td>
                <td>{e?.type}</td>
                <td>{e?.pillar}</td>
                <td>
                  {e?.sector?.map((e, i) => (
                    <p key={i}>{e}</p>
                  ))}
                </td>
                <td
                  onClick={(evt) => {
                    evt.stopPropagation();
                  }}
                >
                  <a href={e?.website} target="_blank" rel="noreferrer">
                    {e?.website}
                  </a>
                </td>
                <td>{e?.description}</td>
                <td className={`color-${e?.status?.toLowerCase()}`}>
                  {toTitleCase(e?.status)}
                </td>
                <td
                  onClick={(evt) => {
                    evt.preventDefault();
                    evt.stopPropagation();
                  }}
                >
                  <MoreDropDown
                    actions={[moreOptionToDisplay(e?.status)]}
                    selectedActions={(status: EStatus) => {
                      const payload = { status };
                      if (e.id) toggle(e.id, payload);
                    }}
                  />
                </td>
              </tr>
            ))}
          </AppTable>
        </AdminListCard.Body>
        <AdminListCard.Footer>
          <AdminPagination
            activePage={activePage(metadata)}
            limit={metadata.limit}
            totalItem={metadata.total}
            onChange={pagination}
          />
        </AdminListCard.Footer>
      </AdminListCard>
    </>
  );
}

const mapStateToProps = (store: StoreState) => {
  return { ...store.userManagement.organization };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const { getOrganizationListAction, toggleStatusAction } = organizationActions;

  return {
    getOrganizationList: (payload: ICommonQueries) =>
      dispatch(getOrganizationListAction(payload, ELanguage.ENGLISH) as any),

    toggle: (id: string, payload: IToggle) =>
      dispatch(toggleStatusAction(id, payload) as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationLists);
