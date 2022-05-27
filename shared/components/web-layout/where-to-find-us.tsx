import {
  contactUsInfo,
  socialMedias,
} from '@shared/constant/web-layout.constant';
import { toTitleCase } from '@shared/custom-function/conversion';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import FormContact from './form-contact';

function WhereToFindUs(): JSX.Element {
  let { t } = useTranslation();

  const renderTooltip = (props: any): JSX.Element => (
    <Tooltip id="button-tooltip" {...props}>
      {t('common:find_us.location')}
    </Tooltip>
  );

  return (
    <section className="find-us">
      <div className="find-us__container">
        <h1 className="wow fadeInDown" data-wow-delay=".30s">
          <span>{t('common:find_us.title')}</span>
        </h1>
        <div className="location center">
          <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip}
          >
            <a
              target="_blank"
              href="https://www.google.com/maps/place/EWMI-CCSS,+and+Open+Development+Cambodia+Office/@11.5613855,104.9205121,17z/data=!3m1!4b1!4m5!3m4!1s0x310951393f94445f:0xd0cf70e20911d32b!8m2!3d11.5613477!4d104.9227116"
              rel="noopener noreferrer"
            />
          </OverlayTrigger>
        </div>

        <div className="forms">
          <div
            className="form form--email wow fadeInLeft"
            data-wow-delay=".40s"
          >
            <h4 className="fw-bold font-18">
              {t('common:find_us.form.title')}
            </h4>
            <FormContact />
          </div>

          <div
            className="form form--contact-us wow fadeInRight"
            data-wow-delay=".40s"
          >
            <h4>{t('common:find_us.contact_us')}</h4>
            <div className="infromation">
              {contactUsInfo.map((e, i) => {
                return (
                  <figure key={i}>
                    <Image
                      src={`/assets/icons/${e.logo}.svg`}
                      alt={toTitleCase(e.logo)}
                      height={e.height}
                      width={e.width}
                    />
                    <figcaption>
                      <p>{e.caption}</p>
                    </figcaption>
                  </figure>
                );
              })}
            </div>

            <div className="d-flex">
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
      </div>
    </section>
  );
}

export default WhereToFindUs;
