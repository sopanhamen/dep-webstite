import clsx from 'clsx';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { FloatingLabel, Form } from 'react-bootstrap';
import DateTimePicker from 'react-datepicker';
import RequiredFormIcon from '../form/required-form-icon';

interface IDatePickerProps {
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
  showTimeSelect?: boolean;
  showTimeInput?: boolean;
  helperText?: string;
  isRequired?: boolean;
  onChange?: (data: any) => void;
}

function DatePicker(props: IDatePickerProps) {
  const {
    containerClass,
    className,
    label = '',
    placeholder = '',
    isDisabled = false,
    value,
    minDate,
    maxDate,
    dateFormat = 'dd MMM, yyyy',
    showTimeSelect = false,
    showTimeInput = false,
    helperText,
    isRequired = false,
    onChange,
  } = props;

  const [focus, setFocus] = useState(false);

  const change = (e: any) => {
    onChange && onChange(e);
  };

  return (
    <FloatingLabel
      label={
        <>
          {label}
          {isRequired && <RequiredFormIcon />}
        </>
      }
      className={clsx(
        'base-input admin-date-filter date-floating',
        value || focus ? 'date-floating-focus' : '',
        className,
      )}
    >
      <DateTimePicker
        className={clsx('form-control')}
        placeholderText={placeholder}
        disabled={isDisabled}
        dateFormat={dateFormat}
        selected={value}
        minDate={minDate}
        maxDate={maxDate}
        onChange={change}
        showTimeSelect={showTimeSelect}
        showTimeInput={showTimeInput}
        onCalendarOpen={() => setFocus(true)}
        onCalendarClose={() => setFocus(false)}
      />
      <i className="icon fa fa-calendar-minus-o" aria-hidden="true"></i>
      <Form.Text className="error-text">{helperText}</Form.Text>
    </FloatingLabel>
  );
}
export default DatePicker;
