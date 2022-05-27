import DigitalEconomyHelp from '@shared/components/web-layout/dep-help';
import Hero from '@shared/components/web-layout/hero';
import WhereToFindUs from '@shared/components/web-layout/where-to-find-us';
import { ICON_URL } from '@shared/constant';
import { ELanguage, EStatus, EWebLayout } from '@shared/enum';
import { ICommonQueries } from '@shared/interfaces';
import { Organization } from '@shared/models/user-management/organization.model';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { IOrganizationList } from 'pages/admin/user-management/organizations';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import { Dispatch } from 'redux';
import { organizationActions } from 'store/admin/user-management/organization/organization.actions';
import { StoreState } from 'store/root-reducer';

function AboutUs({
  organizations,
  getOrganizationList,
}: IOrganizationList): JSX.Element {
  let { t } = useTranslation();

  const [isTop, setIsTop] = useState(true);

  const [imgSrc, setImgSrc] = useState(false);

  useEffect(() => {
    window.onscroll = () => setIsTop(window.pageYOffset === 0);
  }, [isTop]);

  useEffect(() => {
    const payload: ICommonQueries = {
      limit: 5,
      offset: 0,
      status: EStatus.ACTIVE,
    };

    getOrganizationList(payload);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const settings = {
    autoplay: !isTop,
    dots: false,
    infinite: true,
    slidesToShow: 3,
    speed: 500,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="position-relative">
      <Hero
        backgroundImage="/assets/backgrounds/homepage.png"
        latest={false}
        titleToTranslate={EWebLayout.ABOUT}
      />

      <DigitalEconomyHelp />

      <section className="about-dep web-main-container">
        <div className="about-dep__top m-b-60 p-x-60">
          <div className="about-dep__top__left">
            <h1 className="m-b-20 wow fadeIn" data-wow-delay=".30s">
              {t('common:about_us.digital_economy')}
            </h1>
            <p className="wow fadeIn" data-wow-delay=".40s">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.Duis
              aute irure dolor in reprehenderit in voluptate velit esse cillum
              dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
              non proident, sunt in culpa qui officia deserunt mollit anim id
              est laborum.
            </p>
          </div>
          <div className="about-dep__top__right wow fadeIn" data-wow-delay="1s">
            <Image
              src={'/assets/backgrounds/homepage.png'}
              height={366}
              width={559}
              alt="About Us"
            />
          </div>
        </div>

        <div className="about-dep__bottom">
          <h1 className="text-center">{t('common:about_us.our_team')}</h1>

          <Slider {...settings}>
            {organizations.map((e: Organization, i: number) => (
              <div
                key={i}
                data-wow-delay={`${i + 0.3}s`}
                className={`info d-flex wow fadeInDown`}
              >
                <div className="info__content">
                  <div
                    className="info__logo"
                    style={{ backgroundColor: e.bgColor }}
                  >
                    {e.imageUrl ? (
                      <div className="image-wrapper">
                        <Image
                          src={imgSrc ? ICON_URL.BROKEN : e.imageUrl}
                          height={80}
                          width={80}
                          alt="About Us"
                          key={i}
                          onError={() => setImgSrc(true)}
                        />
                      </div>
                    ) : (
                      <i
                        className="info__icon fa fa-user-circle"
                        aria-hidden="true"
                        key={i}
                      />
                    )}
                  </div>

                  <div className="info__back">
                    <p>{e.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      <WhereToFindUs />
    </section>
  );
}

const mapStateToProps = (store: StoreState) => {
  return { ...store.userManagement.organization };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const { getOrganizationListAction } = organizationActions;

  return {
    getOrganizationList: (payload: ICommonQueries) =>
      dispatch(
        getOrganizationListAction(payload, ELanguage.ENGLISH, true) as any,
      ),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AboutUs);
