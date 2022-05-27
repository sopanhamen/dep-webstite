/* eslint-disable react/display-name */
// HOC/withAuth.jsx
import { EAdminPermissions } from '@shared/enum/auth.enum';
import { useRouter } from 'next/router';
import { useStore } from 'react-redux';

const protectedRoute = (WrappedComponent: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks

  return (props: any) => {
    // using this while we cannot work with mapStateToProps in custom-hook
    const store = useStore();
    const user = store?.getState()?.auth?.user;

    // checks whether we are on client / browser or server.
    if (typeof window !== 'undefined') {
      const Router = useRouter();

      // If there is no access token we redirect to "/" page.
      if (!user?.permissions?.includes(EAdminPermissions.LOGIN)) {
        Router.replace('/login');
        return null;
      }

      // If this is an accessToken we just render the component that was passed with all its props
      return <WrappedComponent {...props} />;
    }

    // If we are on server, return null
    return null;
  };
};

export default protectedRoute;
