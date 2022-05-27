import { ICommonElementProps } from '@shared/interfaces';
import clsx from 'clsx';
import React from 'react';

interface IAdminFilterSectionProps extends ICommonElementProps {}

export default function AdminFilterSection({
  forAdmin = true,
  className,
  children,
}: IAdminFilterSectionProps) {
  return (
    <>
      {forAdmin && <hr className="break-line ctrl-mt" />}
      <div
        className={clsx([
          'd-flex flex-wrap align-items-center ctrl-pt',
          className,
        ])}
      >
        {children}
      </div>
    </>
  );
}
