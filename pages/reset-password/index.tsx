import { FormService } from '@shared/services/form.service';
import AuthLayout from 'layouts/auth/auth-layout';
import { FloatingLabel, Form, Button } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import Router from 'next/router';
import { useRouter } from 'next/router';
import * as Redux from 'redux';
import AuthAction from 'store/auth/auth.action';
import { connect } from 'react-redux';
import withoutAuth from '@components/auth/without-auth';
import BaseInput from '@shared/components/form/base-input';

export interface IResetPasswordBody {
  token?: string | string[];
  password?: string;
}
interface IResetPasswordProps {
  getAuthorization: () => Promise<void>;
  resetPassword: (body: IResetPasswordBody) => Promise<void>;
}

interface IResetPasswordForm {
  password: string;
  confirmPassword: string;
}

function ResetPassword(props: IResetPasswordProps) {
  const { getAuthorization, resetPassword } = props;
  const defaultValues: IResetPasswordForm = {
    password: '',
    confirmPassword: '',
  };

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues });

  const watchPassword = watch('password');
  const router = useRouter();
  const { token } = router.query;

  const passwordPattern =
    // eslint-disable-next-line no-useless-escape
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

  const onSubmit = (formData: any) => {
    const body: IResetPasswordBody = {
      token,
      password: formData.password.trim(),
    };
    getAuthorization().then(() => {
      resetPassword(body).then(() => {
        Router.push('/login');
      });
    });
  };

  return (
    <AuthLayout>
      <h5 className="forgot-pwd-title">Reset Password</h5>
      <p className="text text--forgot-pwd-text">
        Please enter your new password
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="password"
          control={control}
          defaultValue=""
          rules={{ required: true, minLength: 8, pattern: passwordPattern }}
          render={({ field: { ref, value, onChange, ...field } }: any) => (
            <BaseInput
              label="New Password"
              type="password"
              className="mb-3"
              refs={ref}
              value={value}
              onChange={onChange}
              error={errors?.password && true}
              helperText={FormService.getErrorMessage(
                errors,
                'password',
                'New Password',
                errors?.password?.type === 'pattern'
                  ? `New Password at least contain one upper case, one lower case, one digit and one special character`
                  : 'New Password should contain 8 characters',
              )}
            />
          )}
        />
        <Controller
          name="confirmPassword"
          control={control}
          defaultValue=""
          rules={{
            required: true,
            minLength: 8,
            validate: (value) => value === watchPassword,
            pattern: passwordPattern,
          }}
          render={({ field: { ref, value, onChange, ...field } }: any) => (
            <BaseInput
              label="Confirm Password"
              type="password"
              className="mb-3"
              refs={ref}
              value={value}
              onChange={onChange}
              error={errors?.confirmPassword && true}
              helperText={FormService.getErrorMessage(
                errors,
                'confirmPassword',
                'Confirm Password',
                // eslint-disable-next-line no-nested-ternary
                errors?.confirmPassword?.type === 'pattern'
                  ? `Confirm Password at least contain one upper case, one lower case,
                     one digit and one special character`
                  : errors?.confirmPassword?.type === 'validate'
                  ? 'Passwords do not match'
                  : 'Confirm Password should contain 8 characters',
              )}
            />
          )}
        />
        <Button type="submit" className="base-btn w-100">
          Reset Password
        </Button>
      </form>
    </AuthLayout>
  );
}

const mapDispatchToProps = (dispatch: Redux.Dispatch) => {
  const { getAuthorization, resetPassword } = AuthAction;
  return {
    getAuthorization: () => dispatch(getAuthorization() as any),
    resetPassword: (body: IResetPasswordBody) =>
      dispatch(resetPassword(body) as any),
  };
};

export default connect(null, mapDispatchToProps)(withoutAuth(ResetPassword));
