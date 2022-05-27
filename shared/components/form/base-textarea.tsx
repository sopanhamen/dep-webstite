import clsx from 'clsx';
import React from 'react';
import { FloatingLabel, Form } from 'react-bootstrap';
import RequiredFormIcon from './required-form-icon';

interface IBaseTextAreaProps {
  label: string;
  placeholder?: string;
  value?: any;
  onChange?: any;
  helperText?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  refs?: any;
  isRequired?: boolean;
  maxLength?: number;
}

function BaseTextArea(props: IBaseTextAreaProps) {
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
    isRequired = false,
    maxLength,
  } = props;
  return (
    <FloatingLabel
      label={
        <>
          {label}
          {isRequired && <RequiredFormIcon />}
        </>
      }
      className={clsx('base-textarea', className)}
    >
      <Form.Control
        as="textarea"
        placeholder={placeholder || label}
        ref={refs}
        value={value}
        onChange={onChange}
        disabled={disabled}
        maxLength={maxLength}
      />
      <Form.Text className="error-text">{helperText}</Form.Text>
    </FloatingLabel>
  );
}

export default BaseTextArea;
