import { FormService } from '@shared/services/form.service';
import useTranslation from 'next-translate/useTranslation';
import React, { useState, useEffect } from 'react';
import { Button, FloatingLabel, Form } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import * as Redux from 'redux';
import { connect } from 'react-redux';
import ContactsAction from 'store/client/actions/contacts.action';
import BaseTextArea from '../form/base-textarea';
import BasePhoneInput from '../form/base-phone-input';
import { isValidPhoneNumber } from '@shared/custom-function/common';
import BaseInput from '../form/base-input';

interface IForm {
  name: string;
  email: string;
  phone: string;
  message: string;
  type: string;
  status: string;
}

interface IReportIssue {
  getAuthorization: () => Promise<void>;
  getPublicToken: () => Promise<void>;
  onSubmiteReport: (body: IForm) => Promise<void>;
}

function FormReport(props: IReportIssue): JSX.Element {
  const { getAuthorization, getPublicToken, onSubmiteReport } = props;

  let { t } = useTranslation();

  const [isValue, setIsValue] = useState(false);
  const [purposeValue, setPurposeValue] = useState(0);
  const [dialCode, setDialCode] = useState(0);

  const defaultValues: IForm = {
    name: '',
    email: '',
    phone: '',
    message: '',
    type: 'ISSUE',
    status: 'ACTIVE',
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  useEffect(() => {
    getAuthorization().then(() => {
      getPublicToken().then(() => {
        onSubmiteReport;
      });
    });
  }, []);

  const handleOnChange = (value: any, data: any) => {
    setDialCode(data.dialCode.length);
  };

  const onSubmit = async (formData: IForm) => {
    const body = {
      name: formData?.name,
      email: formData?.email,
      phone: `+${formData?.phone}`,
      message: formData?.message,
      type: 'ISSUE',
      status: 'ACTIVE',
    };

    onSubmiteReport(body).then();
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          defaultValue=""
          rules={{
            required: true,
          }}
          render={({ field: { ref, value, onChange, ...field } }: any) => (
            <BaseInput
              {...field}
              label={t(`common:sign_up.full_name`)}
              className="mb-3"
              refs={ref}
              value={value}
              onChange={onChange}
              error={errors?.name && true}
              helperText={FormService.getErrorMessage(
                errors,
                'name',
                'Full Name',
              )}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          defaultValue=""
          rules={{
            required: true,
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Email is invalid.',
            },
          }}
          render={({ field: { ref, value, onChange, ...field } }: any) => (
            <BaseInput
              label={t(`common:sign_up.email`)}
              className="mb-3"
              refs={ref}
              value={value}
              onChange={onChange}
              error={errors?.email && true}
              helperText={FormService.getErrorMessage(
                errors,
                'email',
                'Email',
                'Email is invalid',
              )}
            />
          )}
        />

        <Controller
          name="phone"
          control={control}
          defaultValue=""
          rules={{
            required: true,
            minLength: 8 + dialCode,
            maxLength: 9 + dialCode,
            validate: (value) => isValidPhoneNumber(value),
          }}
          render={({ field: { ref, value, onChange, ...field } }: any) => (
            <div className="mb-3">
              <BasePhoneInput
                refs={ref}
                containerClass="mb-2"
                country={'kh'}
                value={value}
                onChange={(evt: any, country: any) => {
                  onChange(evt);
                  handleOnChange(evt, country);
                }}
                specialLabel={t(`common:sign_up.phone_number`)}
                error={errors?.phone && true}
                countryCodeEditable={false}
                helperText={FormService.getErrorMessage(
                  errors,
                  'phone',
                  'Phone Number',
                  errors?.phone?.type === 'minLength'
                    ? 'Phone Number should contain 8 numbers'
                    : errors?.phone?.type === 'validate'
                    ? 'Phone Number should not start with zero'
                    : errors?.phone?.type === 'maxLength'
                    ? 'Phone Number should with maximum length of 9'
                    : '',
                )}
              />
            </div>
          )}
        />

        <Controller
          name="message"
          control={control}
          defaultValue=""
          rules={{
            required: true,
            maxLength: 200,
          }}
          render={({ field: { ref, value, onChange, ...field } }: any) => (
            <BaseTextArea
              {...field}
              label="Comment"
              placeholder="Have any Comment, text here."
              className="mb-3"
              refs={ref}
              value={value}
              onChange={(evt: any) => {
                onChange(evt);
                setPurposeValue(evt?.target.value?.length);
              }}
              isRequired={true}
              error={errors?.message && true}
              helperText={FormService.getErrorMessage(
                errors,
                'message',
                'Message',
                'Message should contain 200 characters',
              )}
            />
          )}
        />

        <p className="label-hint mb-3">
          {t(`common:sign_up.characters_left`)}{' '}
          <span>{200 - purposeValue > 0 ? 200 - purposeValue : 0}</span>
        </p>

        <Button type="submit" className={`base-btn w-100 bg-blue`}>
          {t('common:buttons.submit')}
        </Button>
      </Form>
    </>
  );
}

const mapDispatchToProps = (dispatch: Redux.Dispatch) => {
  const { getAuthorization, getPublicToken, onSubmiteReport } = ContactsAction;
  return {
    getAuthorization: () => dispatch(getAuthorization() as any),
    getPublicToken: () => dispatch(getPublicToken() as any),
    onSubmiteReport: (body: IForm) => dispatch(onSubmiteReport(body) as any),
  };
};

export default connect(null, mapDispatchToProps)(FormReport);
