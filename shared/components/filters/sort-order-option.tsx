import React from 'react';

interface ISortOrderProps {
  label?: string;
  order?: 'ASC' | 'DESC';
}

export default function SortOrderOption({
  label = 'Sort',
  order = 'ASC',
}: ISortOrderProps) {
  return (
    <>
      <div className="d-flex align-items-center justify-content-between">
        <span>
          {label} ({order?.toUpperCase()})
        </span>
        <i
          className={`fa fa-sort-amount-${order?.toLowerCase()} color-icon`}
          aria-hidden="true"
        ></i>
      </div>
    </>
  );
}
