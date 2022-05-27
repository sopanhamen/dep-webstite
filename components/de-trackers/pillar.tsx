import Link from 'next/link';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';

function Pillar() {
  let { t } = useTranslation();
  const router = useRouter();

  return (
    <>
      <div className="row g-0">
        <div className="col">
          <Link href="/de-trackers/digital-government">
            <div
              className={
                'flex-column flex-md-row between p-3 p-md-5 bg-gradient-blue cursor-pointer position-relative ' +
                (router.pathname !== '/de-trackers/digital-government' &&
                router.pathname !== '/de-trackers'
                  ? 'bg-overlay'
                  : '')
              }
            >
              <p className="fs-5 text-white">
                {t('common:pillars.digital')}
                <br /> <b>{t('common:pillars.government')}</b>
              </p>
              <img
                src="/assets/de-trackers/government icon 1.png"
                height={95}
                alt="icon"
              />
            </div>
          </Link>
        </div>
        <div className="col">
          <Link href="/de-trackers/digital-citize">
            <div
              className={
                'flex-column flex-md-row between p-3 p-md-5 bg-gradient-green cursor-pointer position-relative ' +
                (router.pathname !== '/de-trackers/digital-citize' &&
                router.pathname !== '/de-trackers'
                  ? 'bg-overlay'
                  : '')
              }
            >
              <p className="fs-5 text-white">
                {t('common:pillars.digital')}
                <br /> <b>{t('common:pillars.citizen')}</b>
              </p>
              <img
                src="/assets/de-trackers/citizen.png"
                height={95}
                alt="icon"
              />
            </div>
          </Link>
        </div>
        <div className="col">
          <Link href="/de-trackers/digital-business">
            <div
              className={
                'flex-column flex-md-row between p-3 p-md-5 bg-gradient-red cursor-pointer position-relative ' +
                (router.pathname !== '/de-trackers/digital-business' &&
                router.pathname !== '/de-trackers'
                  ? 'bg-overlay'
                  : '')
              }
            >
              <p className="fs-5 text-white">
                {t('common:pillars.digital')}
                <br /> <b>{t('common:pillars.business')}</b>
              </p>
              <img
                src="/assets/de-trackers/business.png"
                height={95}
                alt="icon"
              />
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
export default Pillar;
