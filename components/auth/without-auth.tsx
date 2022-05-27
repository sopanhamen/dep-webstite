/* eslint-disable react/display-name */
import { EAdminPermissions } from '@shared/enum/auth.enum';
import { useRouter } from 'next/router';
import { useStore } from 'react-redux';
import AuthLoading from '../../shared/components/loadings/auth-loading';

const withoutAuth = (WrappedComponent: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks

  return (props: any) => {
    const store = useStore();
    const user = store?.getState()?.auth?.user;

    if (typeof window !== 'undefined') {
      const Router = useRouter();

      if (user?.permissions?.includes(EAdminPermissions.LOGIN)) {
        Router.replace('/admin/dashboard');
        return <AuthLoading />;
      }

      return <WrappedComponent {...props} />;
    }

    // If we are on server, return null
    return null;
  };
};

export default withoutAuth;
