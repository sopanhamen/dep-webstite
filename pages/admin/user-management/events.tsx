import AdminPagination from '@components/admin/table/admin-pagination';
import AppTable from '@components/admin/table/app-table';
import AddEvent from '@components/admin/user-management/events/add-event';
import AdminListCard from '@shared/components/cards/admin-list-card';
import MoreDropDown from '@shared/components/drop-down-button';
import AdminFilterSection from '@shared/components/filters/admin-filter-section';
import AdminSearch from '@shared/components/filters/admin-search';
import { eventsHeader } from '@shared/constant';
import { activePage, removeFalseyObject } from '@shared/custom-function/common';
import { formatISODate } from '@shared/custom-function/conversion';
import { ELanguage, EStatus, ETextColor } from '@shared/enum';
import {
  IAction,
  IAdminPaginationData,
  ICommonQueries,
  IToggle,
} from '@shared/interfaces';
import { MEvent } from '@shared/models/user-management/event.model';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import eventActions from 'store/admin/user-management/events/event.actions';
import { EventState } from 'store/admin/user-management/events/event.reducers';
import { StoreState } from 'store/root-reducer';

export interface IEvents extends EventState {
  getEventList: (payload: ICommonQueries, language: ELanguage) => void;
  toggle: (id: string, payload: IToggle) => void;
  getAuthorization: () => Promise<void>;
  getPublicToken: () => Promise<void>;
}

function Events({
  events,
  isFetching,
  metadata,
  getEventList,
  toggle,
}: IEvents) {
  const [search, setSearch] = useState('');
  const router = useRouter();
  const [showAddEventModal, setShowAddEventModal] = useState(false);

  useEffect(() => {
    const payload: ICommonQueries = {
      limit: metadata.limit,
      offset: metadata.offset,
      search,
    };

    getEventList(removeFalseyObject(payload), ELanguage.ENGLISH);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const pagination = (e: IAdminPaginationData) => {
    const payload: ICommonQueries = {
      limit: e.limit,
      offset: e.limit * (e.activePage - 1),
      search,
    };

    getEventList(removeFalseyObject(payload), ELanguage.ENGLISH);
  };

  const moreOptionToDisplay = (status: string): IAction[] => {
    let value: IAction[] = [];

    if (status === EStatus.ACTIVE) {
      value = [
        {
          name: 'Delete',
          color: ETextColor.RED,
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
      <AddEvent
        isShow={showAddEventModal}
        onClose={() => setShowAddEventModal(false)}
      />
      <AdminListCard>
        <AdminListCard.Header>
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            {/*================== filter section ====================*/}
            <h6 className="fw-bold">Event</h6>
            <button
              className="admin-btn-add"
              onClick={() => setShowAddEventModal(true)}
            >
              Add Events
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
            headers={eventsHeader}
            loading={isFetching}
            total={metadata.total}
          >
            {events?.map((e: MEvent, i: number) => (
              <tr key={i}>
                <td>{e.title}</td>
                <td>{formatISODate(e.startDate)}</td>
                <td>{formatISODate(e.endDate)}</td>
                <td className="text-capitalize">{e.status.toLowerCase()}</td>
                <td>
                  <MoreDropDown
                    actions={moreOptionToDisplay(e.status)}
                    selectedActions={(status: string) => {
                      if (status in EStatus) {
                        const payload = { status: EStatus.INACTIVE };
                        toggle(e.id, payload);
                      } else {
                        router.push(`events/${e?.id}`);
                      }
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
  return { ...store.userManagement.event };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const { getEventListAction, toggleStatusAction } = eventActions;

  return {
    getEventList: (payload: ICommonQueries, language: ELanguage) =>
      dispatch(getEventListAction(payload, language) as any),

    toggle: (id: string, payload: IToggle) =>
      dispatch(toggleStatusAction(id, payload) as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Events);
