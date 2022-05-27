import withoutAuth from '@components/auth/without-auth';
import BaseInput from '@shared/components/form/base-input';
import { EAdminPermissions } from '@shared/enum/auth.enum';
import { IUser } from '@shared/models/auth.model';
import { FormService } from '@shared/services/form.service';
import { ToastServices } from '@shared/services/toast.service';
import AuthLayout from 'layouts/auth/auth-layout';
import Image from 'next/image';
import Router from 'next/router';
import React from 'react';
import { Button } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import AuthAction from 'store/auth/auth.action';
import { AuthState } from 'store/auth/auth.reducer';
import { StoreState } from 'store/root-reducer';

interface ILogin extends AuthState {
  getAuthorization: () => Promise<void>;
  login: (body: ILoginBody) => Promise<IUser>;
  logout: () => void;
}
export interface ILoginBody {
  email: string;
  password: string;
}

function Login(props: ILogin) {
  const { login, getAuthorization } = props;
  const defaultValues: ILoginBody = {
    email: '',
    password: '',
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const onSubmit = (data: ILoginBody) => {
    getAuthorization().then(() => {
      login(data).then((user) => {
        if (user?.permissions?.includes(EAdminPermissions.LOGIN)) {
          Router.push('/admin/dashboard');
        } else {
          ToastServices.error('Unknown user!');
          localStorage.clear();
        }
      });
    });
  };

  return (
    <AuthLayout>
      <Image
        src="/images/logo.svg"
        className="mw-100"
        alt="Digital Economy"
        width={150}
        height={80}
      />
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
          name="password"
          control={control}
          defaultValue=""
          rules={{ required: true, minLength: 8 }}
          render={({ field: { ref, value, onChange } }: any) => (
            <BaseInput
              label="Password"
              type="password"
              className="mb-4"
              refs={ref}
              value={value}
              onChange={onChange}
              error={errors?.password && true}
              helperText={FormService.getErrorMessage(
                errors,
                'password',
                'Password',
                'Password should contain 8 characters',
              )}
            />
          )}
        />
        <Button type="submit" className="base-btn w-100">
          Log In
        </Button>
      </form>
      <a
        href="#"
        className="forget-pwd-link mt-3"
        onClick={() => Router.push('/forgot-password')}
      >
        Forgot Password
      </a>
    </AuthLayout>
  );
}

const mapStateToProps = (store: StoreState) => {
  const { user } = store.auth;

  return { user };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const { getAuthorization, login, logout } = AuthAction;

  return {
    getAuthorization: () => dispatch(getAuthorization() as any),
    login: (userLogin: ILoginBody) => dispatch(login(userLogin) as any),
    logout: () => dispatch(logout() as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withoutAuth(Login));
