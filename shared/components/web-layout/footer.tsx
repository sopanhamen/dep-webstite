import {
  navigations,
  socialMedias,
} from '@shared/constant/web-layout.constant';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { useState } from 'react';
import ModalPopUp from '../modals/pop-up.modal';
import FormReport from './form-report';

function Footer(): JSX.Element {
  let { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const title = `${t('common:footer.report')}`;
  const handleSubmit = () => {};

  return (
    <footer className="footer-container">
      <div className="footer footer--upper">
        <div className="footer--upper__left">
          <div className="socials">
            <div className="socials__logo">
              <img src="/assets/admin/logo.png" alt="Digital Economy" />
            </div>

            <div className="socials__media">
              <p>{t('common:footer.follow')}</p>
              <div className="socials__media__container">
                {socialMedias.map((e, i) => {
                  return (
                    <div className="social-circle-container center" key={i}>
                      <i className={`fa ${e}`} aria-hidden="true" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="navigation-container cursor-pointer">
            {navigations.map((e, i) => {
              return (
                <Link href={e.link} key={i}>
                  <a>{t(`common:header.${e.translateTitle}`)}</a>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="footer--upper__right">
          <div className="information">
            <div className="information__title">
              <h3>{t('common:footer.disclaimer')}</h3>
            </div>
            <div className="information__description">
              <p>{t('common:footer.description')}</p>
            </div>
          </div>
          <div className="issue">
            <div className="issue__container">
              <img
                src="/assets/icons/report-issue.svg"
                alt="Report Issue"
                className="m-t-3"
              />
              <h3 className="cursor-pointer" onClick={() => setShowModal(true)}>
                {t('common:footer.report')}
              </h3>
              <ModalPopUp
                closeSelf={() => setShowModal(false)}
                isShow={showModal}
                title={title}
                buttonName={() => handleSubmit()}
              >
                <FormReport />
              </ModalPopUp>
            </div>
          </div>
        </div>
      </div>
      <div className="footer footer--lower center">
        <p>© 2021 Digital Economy</p>
      </div>
    </footer>
  );
}

export default Footer;
