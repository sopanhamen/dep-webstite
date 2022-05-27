import { FormService } from '@shared/services/form.service';
import useTranslation from 'next-translate/useTranslation';
import React, { useEffect } from 'react';
import { Button, FloatingLabel, Form } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import * as Redux from 'redux';
import ContactsAction from 'store/client/actions/contacts.action';
import BaseTextArea from '../form/base-textarea';

interface IForm {
  name: string;
  email: string;
  message: string;
  type: string;
  status: string;
}

interface IContact {
  getAuthorization: () => Promise<void>;
  getPublicToken: () => Promise<void>;
  onSubmiteReport: (body: IForm) => Promise<void>;
}

function FormContact(props: IContact): JSX.Element {
  const { getAuthorization, getPublicToken, onSubmiteReport } = props;

  let { t } = useTranslation();

  const defaultValues: IForm = {
    name: '',
    email: '',
    message: '',
    type: '',
    status: '',
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

  const onSubmit = async (formData: IForm) => {
    const body = {
      name: formData?.name,
      email: formData?.email,
      message: formData?.message,
      type: 'CONTACT',
      status: 'ACTIVE',
    };
    onSubmiteReport(body).then((res) => {
      reset(defaultValues);
    });
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
            <FloatingLabel label="Your Name" className="mb-3 base-input">
              <Form.Control
                type="text"
                placeholder="Your Name"
                {...field}
                ref={ref}
                value={value}
                onChange={onChange}
                error={errors?.name}
              />
              {errors?.name ? (
                <Form.Text className="error-text">
                  {FormService.getErrorMessage(errors, 'name', 'Name')}
                </Form.Text>
              ) : null}
            </FloatingLabel>
          )}
        />

        <Controller
          name="message"
          control={control}
          defaultValue=""
          rules={{ required: true }}
          render={({ field: { ref, value, onChange, ...field } }: any) => (
            <BaseTextArea
              {...field}
              row="1"
              label="Comment"
              placeholder="Have any Comment, text here."
              className="mb-3 custom-h-textarea"
              refs={ref}
              value={value}
              onChange={onChange}
              error={errors?.message}
              helperText={FormService.getErrorMessage(
                errors,
                'message',
                'Message',
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
            <FloatingLabel label="Email address" className="mb-3 base-input">
              <Form.Control
                type="email"
                placeholder="Email address"
                {...field}
                ref={ref}
                value={value}
                onChange={onChange}
                error={errors?.email}
              />
              {errors?.email ? (
                <Form.Text className="error-text">
                  {FormService.getErrorMessage(
                    errors,
                    'email',
                    'Email',
                    'Email is invalid',
                  )}
                </Form.Text>
              ) : null}
            </FloatingLabel>
          )}
        />

        <div className="d-flex">
          <Button type="submit" className={`base-btn w-100 'bg-blue' `}>
            {t('common:buttons.submit')}
          </Button>
        </div>
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

export default connect(null, mapDispatchToProps)(FormContact);
