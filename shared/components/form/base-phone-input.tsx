import clsx from 'clsx';
import React from 'react';
import { Form } from 'react-bootstrap';
import PhoneInput, { PhoneInputProps } from 'react-phone-input-2';

type IBasePhoneInput = PhoneInputProps & {
  isRequired?: boolean;
  refs?: any;
  error?: boolean;
  helperText?: string;
  className?: string;
};

function BasePhoneInput(props: IBasePhoneInput) {
  const {
    isRequired = false,
    refs,
    error,
    helperText,
    className,
    ...rest
  } = props;
  return (
    <>
      <div
        className={clsx(
          'base-phone-input',
          className,
          isRequired ? 'phone-required' : '',
        )}
      >
        <PhoneInput {...rest} />
      </div>
      <Form.Text className="error-text">{helperText}</Form.Text>
    </>
  );
}

export default BasePhoneInput;
