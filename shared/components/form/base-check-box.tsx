import clsx from 'clsx';
import React from 'react';
import { Form, FormCheck } from 'react-bootstrap';

interface IBaseCheckbox {
  label?: string;
  onChange?: any;
  onClick?: any;
  value?: any;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  type?: any;
  name?: string;
  checked?: boolean;
}

const BaseCheckbox = (props: IBaseCheckbox) => {
  const {
    label,
    onChange,
    onClick,
    value,
    className,
    disabled = false,
    error,
    helperText,
    type = 'checkbox',
    name,
    checked,
  } = props;

  return (
    <Form.Group className={clsx('app-checkbox', className)}>
      <FormCheck.Label>
        <FormCheck.Input
          onChange={onChange}
          onClick={onClick}
          value={value}
          disabled={disabled}
          type={type}
          name={name}
          checked={checked}
        />
        {label && <span className="ms-2">{label || ''}</span>}
      </FormCheck.Label>
      {helperText && <Form.Text className="error-text">{helperText}</Form.Text>}
    </Form.Group>
  );
};

export default BaseCheckbox;
