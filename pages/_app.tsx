import '@styles/index.scss';
import AdminLayout from 'layouts/admin';
import LayoutLoading from 'layouts/layout-loading/layout-loading';
import WebLayout from 'layouts/web/web-layout';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PersistGate } from 'redux-persist/integration/react';
import store from 'store';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const router = useRouter();

  const routerPath = (): JSX.Element => {
    if (router.pathname.startsWith('/admin')) {
      return (
        <AdminLayout>
          <Component {...pageProps} />
        </AdminLayout>
      );
    }

    if (
      router.pathname.startsWith('/login') ||
      router.pathname.startsWith('/forgot-password') ||
      router.pathname.startsWith('/reset-password')
    )
      return <Component {...pageProps} />;

    /*===== This one will be removed once I finish using it. =====*/
    if (router.pathname.startsWith('/test-app'))
      return <Component {...pageProps} />;

    return (
      <WebLayout>
        <Component {...pageProps} />
      </WebLayout>
    );
  };

  return (
    <Provider store={store.state}>
      <PersistGate persistor={store.persistor} loading={null}>
        <LayoutLoading />
        <ToastContainer />
        <Head>
          <title>Digital Economy Platform</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/animate.css@3.5.2/animate.min.css"
          />
        </Head>
        {pageProps.protected}
        {routerPath()}
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
