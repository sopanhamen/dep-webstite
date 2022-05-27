import { IAdminPaginationProps } from '@shared/interfaces';
import React from 'react';
import ReactPaginate from 'react-paginate';

interface IClientPaginationProps extends IAdminPaginationProps {}

export default function ClientPagination({
  activePage = 1,
  limit = 10,
  totalItem = 0,
  onChange,
}: IClientPaginationProps) {
  const changePage = ({ selected }: any) => {
    onChange && onChange(getReturnData(selected + 1, limit));
  };

  /*========== Returned object to parent when any changes happen ==========*/
  const getReturnData = (page: number, limit: number) => {
    return {
      activePage: page,
      limit: limit,
      totalItem: totalItem,
      totalPage: getTotalPages(),
    };
  };

  const getTotalPages = () => {
    if (!totalItem) return 1;
    if (totalItem < limit) {
      return 1;
    } else {
      let totalPage = totalItem / limit;
      const remain = totalItem % limit;

      if (remain > 0) {
        totalPage = Math.ceil(totalPage);
      }
      return totalPage;
    }
  };

  return (
    <>
      <section className="client-pagination center my-5">
        <ReactPaginate
          forcePage={activePage - 1}
          breakLabel="..."
          nextLabel={<i className="fa fa-chevron-right" aria-hidden="true"></i>}
          onPageChange={changePage}
          pageRangeDisplayed={2}
          pageCount={getTotalPages()}
          previousLabel={
            <i className="fa fa-chevron-left" aria-hidden="true"></i>
          }
          renderOnZeroPageCount={undefined}
          pageClassName="page-item ctrl-radius-client"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
        />
      </section>
    </>
  );
}
