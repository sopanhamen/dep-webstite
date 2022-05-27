import clsx from 'clsx';
import React from 'react';
import { FloatingLabel, Form } from 'react-bootstrap';
import RequiredFormIcon from './required-form-icon';

interface IBaseInputProps {
  label: string;
  placeholder?: string;
  value?: any;
  onChange?: any;
  helperText?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  refs?: any;
  type?: string;
  isRequired?: boolean;
}

function BaseInput(props: IBaseInputProps) {
  const {
    label,
    placeholder,
    value,
    onChange,
    helperText,
    className,
    disabled,
    error,
    refs,
    type = 'text',
    isRequired = false,
  } = props;
  return (
    <FloatingLabel
      label={
        <>
          {label}
          {isRequired && <RequiredFormIcon />}
        </>
      }
      className={clsx('base-input', className)}
    >
      <Form.Control
        type={type}
        placeholder={placeholder || label}
        value={value}
        onChange={onChange}
        ref={refs}
        disabled={disabled}
      />
      <Form.Text className="error-text">{helperText}</Form.Text>
    </FloatingLabel>
  );
}

export default BaseInput;
