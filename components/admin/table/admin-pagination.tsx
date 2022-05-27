import { IAdminPaginationProps } from '@shared/interfaces';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

export default function AdminPagination({
  activePage,
  limit,
  totalItem,
  onChange,
}: IAdminPaginationProps) {
  const [stTimeout, setStTimeout] = useState<NodeJS.Timeout>();

  const [stPage, setStPage] = useState(activePage);

  const [stLimit, setStLimit] = useState(10);

  const limitData = [
    { id: 10, name: 10 },
    { id: 50, name: 50 },
    { id: 100, name: 100 },
  ];

  /***** Assign [activePage] prop's value to local state *****/
  useEffect(() => {
    if (activePage && activePage >= 1 && activePage <= getTotalPages())
      setStPage(activePage);
    else changePage(1);
  }, [activePage]);

  /***** Assign [limit] prop's value to local state *****/
  useEffect(() => {
    if (limit && limit >= 10) setStLimit(limit);
    else setStLimit(limitData[0].id);
  }, [limit]);

  const changeLimit = (evt: any) => {
    const inputLimit = +evt?.target?.value;
    if (onChange) onChange(getReturnData(1, inputLimit));
  };

  const changePage = (page: number) => {
    if (onChange) onChange(getReturnData(page, limit));
  };

  /***** Returned object to parent when any changes happen *****/
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

  /***** Validate input page number when key up *****/
  const keying = (evt: any) => {
    const newValue = evt.target.value;
    if (stTimeout) clearTimeout(stTimeout);
    const to = setTimeout(() => {
      if (
        !newValue ||
        isNaN(newValue) ||
        newValue <= 0 ||
        newValue > getTotalPages() ||
        +newValue === activePage
      ) {
        return;
      } else {
        changePage(+newValue);
      }
    }, 2000);
    setStTimeout(to);
  };

  /***** Allow number only when keypress *****/
  const isNumber = (evt: any, allowDot: boolean = false) => {
    evt = evt ? evt : window.event;
    const charCode = evt?.which ? evt?.which : evt?.keyCode;
    if (allowDot) {
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt?.preventDefault();
        return false;
      }
    } else if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      evt?.preventDefault();
      return false;
    }
  };

  /***** Reset the value of input box if it's invalid *****/
  const unFocus = (evt: any) => {
    const target = evt.target;
    const newValue = target?.value;
    if (
      !newValue ||
      isNaN(newValue) ||
      newValue <= 0 ||
      newValue > getTotalPages()
    ) {
      setStPage(activePage);
    } else {
      return;
    }
  };

  /***** Go to previous page *****/
  const goToPrevious = () => {
    if (activePage < 2) return;
    changePage(activePage - 1);
  };

  /***** Go to the next page *****/
  const goToNext = () => {
    if (activePage >= getTotalPages()) return;
    changePage(activePage + 1);
  };

  /***** Go to first page *****/
  const goToFirst = () => {
    if (activePage < 2) return;
    changePage(1);
  };

  /***** Go to the last page *****/
  const goToLast = () => {
    if (activePage >= getTotalPages()) return;
    changePage(getTotalPages());
  };

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center app-pagination">
        {1 ? (
          <>
            {/********** Limit dropdown **********/}
            <div className="mt-2">
              Row Per Page
              <select
                value={stLimit}
                onChange={(evt) => {
                  changeLimit(evt);
                }}
                className="ctrl-height ctrl-border ctrl-focus ctrl-radius ms-1"
                style={{ width: 55 }}
              >
                {limitData?.map((d) => (
                  <option key={d?.id} value={d?.id}>
                    {d?.name}
                  </option>
                ))}
              </select>
            </div>

            {/********** Page Btn Group **********/}
            <div className="mt-2">
              <div className="me-1 d-inline-block">
                <div className="d-flex align-items-center">
                  <button
                    disabled={activePage < 2}
                    className={clsx(
                      'ctrl-focus ctrl-height ctrl-radius ctrl-border px-3 ctrl-bg-gradient',
                      'no-pointer-event' && activePage < 2,
                    )}
                    onClick={goToFirst}
                  >
                    <i
                      className="fa fa-angle-double-left"
                      aria-hidden="true"
                    ></i>
                  </button>
                  <button
                    disabled={activePage < 2}
                    className={clsx(
                      'ctrl-focus ctrl-height ctrl-radius ctrl-border px-3 ctrl-bg-gradient ms-2',
                      'no-pointer-event' && activePage < 2,
                    )}
                    onClick={goToPrevious}
                  >
                    <i className="fa fa-angle-left" aria-hidden="true"></i>
                  </button>
                  <div className="d-flex align-items-center position-relative page-change-section  ctrl-focus ctrl-height ctrl-radius ctrl-border mx-2">
                    <input
                      autoComplete="off"
                      id="app-pagination-page"
                      type="text"
                      className=" text-center"
                      value={stPage}
                      onKeyPress={(evt) => isNumber(evt)}
                      onKeyUp={(evt) => keying(evt)}
                      onBlur={(evt) => unFocus(evt)}
                      onChange={(evt) => setStPage(+evt?.target?.value)}
                      disabled={getTotalPages() <= 1 ? true : undefined}
                    />
                    <label htmlFor="app-pagination-page" className="total-page">
                      {' '}
                      / {getTotalPages()}
                    </label>
                  </div>
                  <button
                    disabled={activePage >= getTotalPages()}
                    className={clsx(
                      'ctrl-focus ctrl-height ctrl-radius ctrl-border px-3 ctrl-bg-gradient me-2',
                      'no-pointer-event' && activePage >= getTotalPages(),
                    )}
                    onClick={goToNext}
                  >
                    <i className="fa fa-angle-right" aria-hidden="true"></i>
                  </button>
                  <button
                    disabled={activePage >= getTotalPages()}
                    className={clsx(
                      'ctrl-focus ctrl-height ctrl-radius ctrl-border px-3 ctrl-bg-gradient',
                      'no-pointer-event' && activePage >= getTotalPages(),
                    )}
                    onClick={goToLast}
                  >
                    <i
                      className="fa fa-angle-double-right"
                      aria-hidden="true"
                    ></i>
                  </button>
                </div>
              </div>
              <div className="d-inline-block ms-1">
                Showing {totalItem > 0 ? activePage * limit - (limit - 1) : 0}{' '}
                to {''}
                {limit < totalItem
                  ? activePage * limit < totalItem
                    ? activePage * limit
                    : totalItem
                  : totalItem}{' '}
                of {totalItem || 0} {totalItem > 1 ? 'rows' : 'row'}
              </div>
            </div>

            {/********** Space to put sth else on the right side **********/}
            <div className="mt-2"></div>
          </>
        ) : (
          <div className="mt-2"></div>
        )}
      </div>
    </>
  );
}
