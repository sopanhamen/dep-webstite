import BaseImage from '@shared/components/images/base-image';
import { ICON_URL } from '@shared/constant';
import clsx from 'clsx';
import React from 'react';

interface IFormArrayAction {
  onClick?: (e: any) => void;
  title?: string;
  className?: string;
  variant?: 'add' | 'remove';
}

function FormArrayAction({
  onClick,
  title = 'Add Array Item',
  className,
  variant = 'add',
}: IFormArrayAction) {
  return (
    <>
      {variant === 'add' ? (
        <span
          className={clsx('d-inline-flex align-items-center', className)}
          onClick={onClick}
        >
          <BaseImage
            src={ICON_URL.BTN_ADD}
            width={20}
            height={20}
            className="cursor-pointer"
          />
          <span className="ms-2 color-active fa-action-add">{title}</span>
        </span>
      ) : (
        <span className={clsx('fa-action-remove', className)} onClick={onClick}>
          <i className="fa fa-trash-o" aria-hidden="true" />
        </span>
      )}
    </>
  );
}

export default FormArrayAction;
