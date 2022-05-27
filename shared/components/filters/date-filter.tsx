import clsx from 'clsx';
import React from 'react';
import DatePicker from 'react-datepicker';

export interface IDateFilterProps {
  forAdmin?: boolean;
  containerClass?: string;
  className?: string;
  label?: string;
  placeholder?: string;
  defaultValue?: any;
  isDisabled?: boolean;
  value?: Date | null;
  minDate?: Date | null;
  maxDate?: Date | null;
  dateFormat?: string;
  isClearAll?: boolean;
  onChange?: (data: any) => void;
}

export default function DateFilter({
  forAdmin = true,
  containerClass,
  label = '',
  placeholder = '',
  isDisabled = false,
  value,
  minDate,
  maxDate,
  dateFormat = 'dd MMM, yyyy',
  isClearAll = false,
  onChange,
}: IDateFilterProps) {
  const clearAll = () => {
    value && onChange && onChange(null);
  };

  const change = (e: any) => {
    onChange && onChange(e);
  };

  return (
    <section
      className={clsx(
        `${forAdmin ? 'admin' : 'client'}-date-filter`,
        containerClass,
      )}
    >
      <div className="d-flex align-items-center justify-content-between">
        <span>{label}</span>
        <span className="color-main-red cursor-pointer" onClick={clearAll}>
          {isClearAll && value ? 'Clear' : ''}
        </span>
      </div>
      <DatePicker
        className={clsx('control', containerClass)}
        popperProps={{
          strategy: 'fixed',
        }} /***** use this to avoid hidden dropdown behind overflow parent *****/
        placeholderText={placeholder}
        disabled={isDisabled}
        dateFormat={dateFormat}
        selected={value}
        minDate={minDate}
        maxDate={maxDate}
        onChange={change}
      />
      <i className="icon fa fa-calendar-minus-o" aria-hidden="true"></i>
    </section>
  );
}
