import React from 'react';
import clsx from 'clsx';
import { ICommonElementProps } from '@shared/interfaces';

interface IClientFilterCardProps extends ICommonElementProps {}

export default function ClientFilterCard({
  className,
  style,
  children,
}: IClientFilterCardProps) {
  return (
    <section
      className={clsx('bg-client-filter-container', className)}
      style={style}
    >
      <div className="container">{children}</div>
    </section>
  );
}
