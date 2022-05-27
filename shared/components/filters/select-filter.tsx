import { ISelectFilterOptions } from '@shared/interfaces';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import Select, { components } from 'react-select';

export interface ISelectFilterProps {
  forAdmin?: boolean;
  containerClass?: string;
  className?: string;
  label?: string;
  placeholder?: string;
  value?: any;
  isDisabled?: boolean;
  isLoading?: boolean;
  isClearAll?: boolean;
  isSearchable?: boolean;
  isMulti?: boolean;
  options?: ISelectFilterOptions[];
  onChange?: (data: any) => void;
}

const Option = (props: any) => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{' '}
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
};

export default function SelectFilter({
  forAdmin = true,
  containerClass,
  className,
  label = '',
  placeholder = '',
  value,
  isDisabled = false,
  isLoading = false,
  isClearAll = false,
  isSearchable = true,
  isMulti = false,
  options = [],
  onChange,
}: ISelectFilterProps) {
  const [selected, setSelected] = useState();

  const clearAll = () => {
    onChange && onChange(null);
  };

  /*========== It returns value or value array converting from the option obj ==========*/
  const change = (e: any) => {
    let value: any;
    if (isMulti) {
      value =
        e && e.length ? e.map((i: ISelectFilterOptions) => i.value) : null;
    } else value = e && e.hasOwnProperty('value') ? e.value : null;

    onChange && onChange(value);
  };

  /*========== It accepts value or value array and convert to option obj ==========*/
  const mapValue = () => {
    if (!options?.length) return value;

    let final: any;
    if (isMulti && value?.length) {
      let selections: any = [];

      value?.forEach((v: any) => {
        const match = options?.filter((o) => o?.value == v);
        selections = [...selections, ...match];
      });

      final = selections;
    } else final = options?.filter((o) => o.value == value)[0] || null;

    setSelected(final);
  };

  useEffect(() => {
    mapValue();
  }, [value]);

  return (
    <>
      <section
        className={clsx(
          `${forAdmin ? 'admin' : 'client'}-select-filter`,
          containerClass,
        )}
      >
        <div className="d-flex align-items-center justify-content-between">
          <span>{label}</span>
          <span className="color-main-red cursor-pointer" onClick={clearAll}>
            {isClearAll && selected ? 'Clear' : ''}
          </span>
        </div>
        <Select
          menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }} /***** use these two lines to avoid hidden dropdown behind overflow parent *****/
          className={className}
          classNamePrefix="dep"
          placeholder={placeholder}
          value={selected}
          isDisabled={isDisabled}
          isLoading={isLoading}
          isClearable={false}
          isSearchable={isSearchable}
          closeMenuOnSelect={!isMulti}
          hideSelectedOptions={false}
          isMulti={isMulti}
          options={options}
          components={
            isMulti
              ? {
                  Option,
                }
              : {}
          }
          theme={(theme) => ({
            ...theme,
            primary: 'black',
          })}
          onChange={change}
        />
      </section>
    </>
  );
}
