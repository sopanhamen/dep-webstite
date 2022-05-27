/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import CreatableSelect from 'react-select/creatable';
import clsx from 'clsx';
import { useEffect } from 'react';
import { ISelectOption } from '@shared/models/common.model';
import RequiredFormIcon from './required-form-icon';

interface IBaseCreatableSelect {
  options?: any;
  label?: string;
  value?: any;
  onChange?: any;
  isCreatable?: boolean;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  refs?: any;
  isMulti?: boolean;
  isRequired?: boolean;
}

function BaseSelect(props: IBaseCreatableSelect) {
  const {
    options = [],
    label = 'Select ...',
    value,
    onChange,
    isCreatable = false,
    helperText,
    error,
    fullWidth,
    className,
    disabled,
    isLoading,
    refs,
    isMulti = false,
    isRequired = false,
  } = props;

  const [focus, setFocus] = useState(false);
  const [validCreate, setValidCreate] = useState(false);
  const [retrieveValue, setRetrieveValue] = useState<any>();

  useEffect(() => {
    if (value && !isMulti) {
      const obj = options.find((i: ISelectOption) => i?.value === value);
      if (obj) {
        setRetrieveValue(obj);
      } else {
        setRetrieveValue(value);
      }
    } else if (value && isMulti) {
      if (value?.length) {
        let arr = [];
        for (const x of value) {
          const val = options?.find((i: ISelectOption) => i?.value === x);
          if (val) {
            arr.push(val);
          } else {
            arr.push(x);
          }
          setRetrieveValue(arr);
        }
      } else {
        setRetrieveValue(null);
      }
    } else if (!value) {
      setRetrieveValue(null);
    }
  }, [value]);

  const onChangeSelect = (e: any) => {
    let newValue: any;
    // eslint-disable-next-line no-underscore-dangle
    if (e?.__isNew__) {
      if (e?.value === newValue) return;
      return onChange(e);
    }

    if (isMulti) {
      newValue =
        e && e?.length
          ? e.map((item: ISelectOption) =>
              item?.__isNew__ ? item : item?.value,
            )
          : null;
    } else {
      newValue = e?.value || null;
    }
    onChange(newValue);
  };

  return (
    <div>
      <Form.Group
        className={clsx(
          'select-create-form-control',
          className,
          disabled && 'disabled-select',
        )}
      >
        <Form.Label
          className={clsx(focus || retrieveValue ? 'label-shrink' : null)}
        >
          {label}
          {isRequired && <RequiredFormIcon />}
        </Form.Label>
        <CreatableSelect
          menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }} /***** use these two lines to avoid hidden dropdown behind overflow parent *****/
          ref={refs}
          options={options}
          value={retrieveValue}
          onChange={onChangeSelect}
          isClearable={true}
          className={clsx('creatable-component')}
          classNamePrefix="creatable"
          placeholder=""
          onFocus={(evt: any) => {
            setFocus(evt?.type === 'focus');
          }}
          onBlur={(evt: any) => {
            setFocus(evt?.type !== 'blur');
          }}
          isLoading={isLoading}
          isDisabled={disabled}
          onInputChange={(inputValue: string, actionMeta: any) => {
            if (actionMeta?.action === 'input-change' && inputValue) {
              return setValidCreate(true);
            }
            return setValidCreate(false);
          }}
          isValidNewOption={() => isCreatable && validCreate}
          isMulti={isMulti}
        />
        <Form.Text className="error-text">{helperText}</Form.Text>
      </Form.Group>
    </div>
  );
}

export default BaseSelect;
