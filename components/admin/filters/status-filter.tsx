import SelectFilter from '@shared/components/filters/select-filter';
import React from 'react';

interface IFilterStatusProps {
  forAdmin?: boolean;
  multiple?: boolean;
  value?: any;
  onChange?: (data: any) => void;
}

export default function StatusFilter({
  forAdmin = true,
  multiple = true,
  value,
  onChange,
}: IFilterStatusProps) {
  const options = [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' },
  ];

  return (
    <>
      <SelectFilter
        forAdmin={forAdmin}
        value={value}
        isClearAll={true}
        isMulti={multiple}
        label="Status"
        options={options}
        onChange={onChange}
      />
    </>
  );
}
