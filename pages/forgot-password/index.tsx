import withoutAuth from '@components/auth/without-auth';
import BaseInput from '@shared/components/form/base-input';
import { FormService } from '@shared/services/form.service';
import AuthLayout from 'layouts/auth/auth-layout';
import Image from 'next/image';
import Router from 'next/router';
import React from 'react';
import { Button, FloatingLabel, Form } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import * as Redux from 'redux';
import AuthAction from 'store/auth/auth.action';

interface IForgetPwdProps {
  getAuthorization: () => Promise<void>;
  forgotPassword: (body: IForgotPasswordBody) => Promise<any>;
}

export interface IForgotPasswordBody {
  email?: string;
  resetUrl?: string;
}

function ForgotPassword(props: IForgetPwdProps) {
  const { getAuthorization, forgotPassword } = props;
  const defaultValues: IForgotPasswordBody = {
    email: '',
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const onSubmit = (formData: any) => {
    const body = {
      email: formData.email.trim(),
      resetUrl: `${window.location.origin}/reset-password`,
    };
    getAuthorization().then(() => {
      forgotPassword(body).then((res) => {
        Router.push('/login');
      });
    });
  };
  return (
    <AuthLayout>
      <div
        className="d-flex align-items-center back-arrow cursor-pointer"
        onClick={() => Router.push('/login')}
      >
        <Image
          src="/images/icons/arrow.svg"
          className="mw-100"
          alt="Digital Economy"
          width={8}
          height={14}
        />
        <span className="text text--back-text">Back</span>
      </div>
      <h5 className="forgot-pwd-title">Forgot Password</h5>
      <p className="text text--forgot-pwd-text">
        Please enter your email address
        <br /> to reset password
      </p>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
          render={({ field: { ref, value, onChange } }: any) => (
            <BaseInput
              label="Email"
              className="mb-4"
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

        <Button type="submit" className="base-btn w-100">
          Forgot Password
        </Button>
      </form>
    </AuthLayout>
  );
}

const mapDispatchToProps = (dispatch: Redux.Dispatch) => {
  const { getAuthorization, forgotPassword } = AuthAction;
  return {
    getAuthorization: () => dispatch(getAuthorization() as any),
    forgotPassword: (body: IForgotPasswordBody) =>
      dispatch(forgotPassword(body) as any),
  };
};

export default connect(null, mapDispatchToProps)(withoutAuth(ForgotPassword));
