import { ICON_URL } from '@shared/constant';
import { ISelectFilterOptions } from '@shared/interfaces';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import { Dropdown } from 'react-bootstrap';

type labelFunctionType = () => string;

interface ISortButtonProps {
  forAdmin?: boolean;
  label?: string | labelFunctionType;
  iconURL?: string;
  value?: any;
  options?: ISelectFilterOptions[];
  onChange?: (e: any) => void;
}

export default function SortButton({
  forAdmin = true,
  label = '',
  iconURL = ICON_URL.SORT,
  value,
  options = [],
  onChange,
}: ISortButtonProps) {
  const { t } = useTranslation();

  return (
    <>
      <Dropdown className="raw-dropdown no-caret">
        <Dropdown.Toggle
          className={`${
            forAdmin ? 'admin' : 'client'
          }-btn-sort text-nowrap overflow-hidden ctrl-mr ctrl-mb text-black`}
        >
          <img src={iconURL} alt="icon" />
          {label || t('common:filter.sort')}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {options?.map((opt) => (
            <Dropdown.Item
              active={opt?.value === value}
              key={opt?.value}
              onClick={() => {
                onChange && onChange(opt?.value);
              }}
            >
              {opt?.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}
