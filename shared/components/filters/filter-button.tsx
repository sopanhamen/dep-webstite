import { ICON_URL } from '@shared/constant';
import clsx from 'clsx';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';

interface IFilterButtonProps {
  forAdmin?: boolean;
  isShow?: boolean;
  hasClearButton?: boolean;
  onToggle?: (e: any) => void;
  onClear?: (e: any) => void;
}

export default function FilterButton({
  forAdmin = true,
  isShow = false,
  hasClearButton = true,
  onToggle,
  onClear,
}: IFilterButtonProps) {
  const { t } = useTranslation();

  return (
    <>
      <button
        className={clsx([
          `${
            forAdmin ? 'admin' : 'client'
          }-btn-filter text-nowrap overflow-hidden ctrl-mr ctrl-mb`,
          isShow && 'color-main-red',
        ])}
        data-bs-toggle="collapse"
        onClick={() => onToggle && onToggle(!isShow)}
        aria-expanded={isShow}
      >
        <img src={ICON_URL?.FILTER} alt="icon" />
        {t('common:filter.filter')}
      </button>
      {hasClearButton && (
        <button
          className={`${
            forAdmin ? 'admin' : 'client'
          }-btn-clear-filter ctrl-mb text-nowrap`}
          onClick={(e) => onClear && onClear(e)}
        >
          <img src={ICON_URL?.ROLLBACK} alt="icon" />
          {t('common:filter.reset_filter')}
        </button>
      )}
    </>
  );
}
