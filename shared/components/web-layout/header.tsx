import { ICON_URL } from '@shared/constant';
import { navigations } from '@shared/constant/web-layout.constant';
import { ELanguage } from '@shared/enum';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import AuthAction from 'store/auth/auth.action';
import { StoreState } from 'store/root-reducer';
import ModalPopUp from '../modals/pop-up.modal';
import SignUpForm from './sign-up-form';

interface IHeaderProp {
  getAuthorization: () => Promise<void>;
  getPublicToken: () => Promise<void>;
}

function Header(props: IHeaderProp): JSX.Element {
  const { getAuthorization, getPublicToken } = props;
  let { t } = useTranslation();
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);

  const getAuth = () => {
    getAuthorization().then(() => {
      getPublicToken();
    });
  };

  useEffect(() => {
    getAuth();
  }, []);

  const handleRoute = (locale: ELanguage) =>
    router.push(router.asPath, router.asPath, {
      locale: locale,
      scroll: false,
    });

  // components
  const languageSelector = (): JSX.Element => {
    return (
      <div className="languages d-flex">
        <figure
          className="center cursor-pointer m-0"
          onClick={() => {
            const language =
              String(router.locale) === ELanguage.ENGLISH
                ? ELanguage.KHMER
                : ELanguage.ENGLISH;

            handleRoute(language);
          }}
        >
          <img
            src={
              String(router.locale) === ELanguage.ENGLISH
                ? ICON_URL.KM_FLAG
                : ICON_URL.EN_FLAG
            }
            alt="Flag"
            height={30}
            width={30}
          />
        </figure>
      </div>
    );
  };

  return (
    <header className="header-container border-bottom shadow-sm">
      <div
        className="logo-container cursor-pointer"
        onClick={() => router.push('/')}
      >
        <img src="/images/logo.svg" alt="Digital Economy" />
      </div>
      <div className="web-container">
        <div className="navigation-container cursor-pointer">
          {navigations.map((e, i) => {
            return (
              <Link href={`/${e.link === '/' ? '' : e.link}`} key={i}>
                <span
                  className={
                    router.pathname.startsWith(`/${e.link}`) ||
                    router.pathname === e.link
                      ? 'active'
                      : ''
                  }
                >
                  {t(`common:header.${e.translateTitle}`)}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="justify-content-between d-flex">
          {languageSelector()}

          <button
            className="admin-btn-add sign-up"
            onClick={() => setShowModal(true)}
          >
            <h3 className="color-white">{t(`common:header.signUp`)}</h3>
          </button>
        </div>
        {showModal && (
          <ModalPopUp
            closeSelf={() => setShowModal(false)}
            isShow={showModal}
            title={t(`common:header.signUp`)}
          >
            <SignUpForm onSubmitSuccess={() => setShowModal(false)} />
          </ModalPopUp>
        )}
      </div>

      <div className="mobile-container">
        <Dropdown>
          <Dropdown.Toggle>
            <i className="fa fa-bars m-0 cursor-pointer" aria-hidden="true" />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {navigations.map((e, i) => {
              return (
                <Dropdown.Item
                  href={`/${e.link === '/' ? '' : e.link}`}
                  key={i}
                >
                  <span
                    className={
                      router.pathname.startsWith(`/${e.link}`) ||
                      router.pathname === e.link
                        ? 'active'
                        : ''
                    }
                  >
                    {t(`common:header.${e.translateTitle}`)}
                  </span>
                </Dropdown.Item>
              );
            })}

            <Dropdown.Item className="sign-up">
              {languageSelector()}
            </Dropdown.Item>

            <Dropdown.Item
              className="sign-up"
              onClick={() => setShowModal(true)}
            >
              <h3>{t(`common:header.signUp`)}</h3>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </header>
  );
}

const mapStateToProps = (store: StoreState) => {
  const { publicToken, authToken } = store.auth;

  return {
    publicToken,
    authToken,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const { getAuthorization, getPublicToken } = AuthAction;

  return {
    getAuthorization: () => dispatch(getAuthorization() as any),
    getPublicToken: () => dispatch(getPublicToken() as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
