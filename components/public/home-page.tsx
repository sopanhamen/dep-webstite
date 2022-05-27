import EventsCard from '@shared/components/cards/events.card';
import DigitalEconomyHelp from '@shared/components/web-layout/dep-help';
import { IHero } from '@shared/components/web-layout/hero';
import WhereToFindUs from '@shared/components/web-layout/where-to-find-us';
import { homepagePillars } from '@shared/constant/web-layout.constant';
import { BannerMediaType, EPillar, EStatus } from '@shared/enum';
import { BannerQuery } from '@shared/interfaces';
import { Banner } from '@shared/models/banner.model';
import clsx from 'clsx';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import { Dispatch } from 'redux';
import { bannerActions } from 'store/admin/banners/banner.actions';
import { StoreState } from 'store/root-reducer';

interface IHomePage extends Partial<IHero> {
  publicToken?: string;
}

function HomePage({ publicToken, banners, getBanner }: IHomePage): JSX.Element {
  const ac = new AbortController();

  let { t } = useTranslation();

  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    window.onscroll = () => setIsTop(window.pageYOffset === 0);

    return () => ac.abort();
  }, [isTop]);

  useEffect(() => {
    const payload: BannerQuery = {
      page: EPillar.HOME,
      status: EStatus.ACTIVE,
    };

    if (publicToken) getBanner && getBanner(payload);
  }, [publicToken]);

  const animationDelay = (index: number): number => {
    switch (index) {
      case 0:
        return 60;
      case 1:
        return 40;
      default:
        return 80;
    }
  };

  const renderCarousel = (data: Banner[]): JSX.Element => {
    return (
      <Slider {...settings}>
        {data.map((list, index) => (
          <div key={index}>
            <img src={list.url} alt="photo" />
          </div>
        ))}
      </Slider>
    );
  };

  const renderVideo = (data: Banner[]): JSX.Element => {
    return (
      <video
        autoPlay
        className="lazy slid-video"
        height="100%"
        id="video"
        loop
        muted
        playsInline
        preload="none"
        width="100%"
      >
        <source src={data[0].url} type="video/mp4" />
      </video>
    );
  };

  const rednderHero = (isVideo: boolean, data: Banner[]): JSX.Element => {
    return isVideo ? renderVideo(data) : renderCarousel(data);
  };

  const settings = {
    autoplay: true,
    dots: false,
    fade: true,
    infinite: true,
    slidesToScroll: 1,
    slidesToShow: 1,
    speed: 3500,
  };

  return (
    <article className="position-relative">
      <EventsCard />
      <section className="banner position-relative">
        <div className="trackers">
          <div className="trackers__container">
            <div className="title">
              <h1 className="text-uppercase text-center">
                {t('common:header.de')}
              </h1>
            </div>
            <div className="pillar-container">
              {homepagePillars.map((e, i) => {
                return (
                  <div
                    className={clsx(
                      'pillars',
                      `pillars--${e.source}`,
                      `wow ${e.animation}`,
                    )}
                    key={i}
                    data-wow-delay={`.${animationDelay(i)}s`}
                  >
                    <div className="pillars__wrapper">
                      <h4>{t('common:pillars.digital')}</h4>
                      <h2 className="text-capitalize">
                        {t(`common:pillars.${e.source}`)}
                      </h2>
                    </div>
                    <div className="pillars__icon">
                      <Image
                        src={`/assets/icons/${e.source}.svg`}
                        height={e.height}
                        width={e.width}
                        alt={e.source}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {banners && banners.length ? (
          <>{rednderHero(banners[0].type === BannerMediaType.VIDEO, banners)}</>
        ) : (
          <div className="banner__loading" />
        )}
      </section>

      <div className="web-main-container">
        <section className="project"></section>
        <section className="resource-hub"></section>
        <section className="news"></section>
      </div>

      <DigitalEconomyHelp />

      <WhereToFindUs />

      <button
        className="back-to-top wow fadeIn"
        onClick={() => {
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
        }}
        data-wow-delay="1.5s"
      >
        <i className="fa fa-chevron-up" aria-hidden="true" />
        <h5>{t('common:buttons.back')}</h5>
        <h6>{t('common:buttons.to')}</h6>
        <h5>{t('common:buttons.top')}</h5>
      </button>
    </article>
  );
}

const mapStateToProps = (store: StoreState) => {
  const publicToken = store.auth.publicToken;

  return { ...store.banner, publicToken };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const { getCurrentClientBanner } = bannerActions;

  return {
    getBanner: (payload: BannerQuery) =>
      dispatch(getCurrentClientBanner(payload) as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
