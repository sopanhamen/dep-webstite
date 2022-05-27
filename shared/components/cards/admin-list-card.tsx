import React from 'react';
import clsx from 'clsx';
import { ICommonElementProps } from '@shared/interfaces';

interface IAdminListCardProps extends ICommonElementProps {}

interface IAdminListCardHeaderProps extends ICommonElementProps {}

interface IAdminListCardBodyProps extends ICommonElementProps {
  xScrollable?: boolean;
  yScrollable?: boolean;
}

interface IAdminListCardFooterProps extends ICommonElementProps {}

export default function AdminListCard({
  className,
  style,
  children,
}: IAdminListCardProps) {
  return (
    <div
      className={clsx('bg-white p-3 border ctrl-radius', className)}
      style={{ height: 'calc(100vh - 75px)', ...style }}
    >
      <div className="d-flex flex-column h-100">{children}</div>
    </div>
  );
}

/*========== Card's header component ==========*/
AdminListCard.Header = ({
  className,
  style,
  children,
}: IAdminListCardHeaderProps) => (
  <div className={className} style={style}>
    {children}
  </div>
);

/*========== Card's body component ==========*/
AdminListCard.Body = ({
  className,
  style,
  children,
  xScrollable = true,
  yScrollable = true,
}: IAdminListCardBodyProps) => (
  <div
    className={clsx('flex-fill', className)}
    style={{
      overflowY: yScrollable ? 'auto' : 'hidden',
      overflowX: xScrollable ? 'auto' : 'hidden',
      ...style,
    }}
  >
    {children}
  </div>
);

/*========== Card's footer component ==========*/
AdminListCard.Footer = ({
  className,
  style,
  children,
}: IAdminListCardFooterProps) => (
  <div className={clsx('mt-auto', className)} style={style}>
    {children}
  </div>
);
