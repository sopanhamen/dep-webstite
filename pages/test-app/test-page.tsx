import AdminPagination from '@components/admin/table/admin-pagination';
import AppTable from '@components/admin/table/app-table';
import AdminListCard from '@shared/components/cards/admin-list-card';
import AdminSearch from '@shared/components/filters/admin-search';
import { testTableHeaders, testUsers } from '@shared/constant/test-fix-data';
import { formatISODate, toTitleCase } from '@shared/custom-function/conversion';
import { ITableHeader } from '@shared/interfaces';
import AdminLayout from 'layouts/admin';
import Link from 'next/link';
import React from 'react';
import { Dropdown } from 'react-bootstrap';

export default function TestPage() {
  const fakeData = testUsers;
  const tableHeaders: ITableHeader[] = testTableHeaders;
  let loading = false;

  return (
    <>
      <AdminLayout>
        <AdminListCard>
          <AdminListCard.Header>
            {/*========== Title and filters ==========*/}
            <div className="d-flex flex-wrap align-items-center justify-content-between">
              <AdminSearch className="ctrl-mb ctrl-mr"></AdminSearch>
              <Link href="/test-app/test-user">Go To (Test User)</Link>
              <button className="admin-btn-add ctrl-mb">Add Project</button>
            </div>
            <hr className="break-line ctrl-mb" />
            <button className="admin-btn-clear-filter ctrl-mb">
              Clear All Filter
            </button>
            <hr className="break-line ctrl-mb" />
          </AdminListCard.Header>

          <AdminListCard.Body>
            {/*========== Data table ==========*/}
            <AppTable
              headers={tableHeaders}
              loading={loading}
              total={fakeData?.length}
            >
              {fakeData?.map((d, index) => (
                <tr key={d?.id + index}>
                  <td>{d?.id}</td>
                  <td>
                    <img
                      className="app-table-img"
                      src={d?.image}
                      alt="image"
                    ></img>
                  </td>
                  <td>{d?.titleKh}</td>
                  <td>{d?.titleEn}</td>
                  <td>{formatISODate(d?.startedAt)}</td>
                  <td>{formatISODate(d?.endedAt)}</td>
                  <td>{d?.duration}</td>
                  <td>{d?.sector}</td>
                  <td>{d?.projectStatus}</td>
                  <td>{d?.stackholder}</td>
                  <td>{d?.implementPartners}</td>
                  <td>{d?.pillar}</td>
                  <td>
                    <img
                      className="app-table-img"
                      src={d?.tagsIcon}
                      alt="image"
                    ></img>
                  </td>
                  <td>{d?.descKh}</td>
                  <td>{d?.descEn}</td>
                  <td>{formatISODate(d?.createdAt)}</td>
                  <td>{formatISODate(d?.updatedAt)}</td>
                  <td
                    className={
                      d?.status == 'active' ? 'color-active' : 'color-inactive'
                    }
                  >
                    {toTitleCase(d?.status)}
                  </td>
                  <td>
                    <Dropdown className="app-table-dropdown">
                      <Dropdown.Toggle variant="link" id="dropdown-basic">
                        More
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                        <Dropdown.Item>Action 2</Dropdown.Item>
                        <Dropdown.Item href="#/action-3">
                          Action 3
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
              <tr></tr>
            </AppTable>
          </AdminListCard.Body>

          <AdminListCard.Footer>
            <AdminPagination
              activePage={1}
              limit={15}
              totalItem={fakeData?.length}
            ></AdminPagination>
          </AdminListCard.Footer>
        </AdminListCard>
      </AdminLayout>
    </>
  );
}
