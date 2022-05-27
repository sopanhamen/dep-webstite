import { getLocale } from '@shared/custom-function/common';
import { EPillar, EStatus, EWebLayout } from '@shared/enum';
import { BannerQuery } from '@shared/interfaces';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { bannerActions } from 'store/admin/banners/banner.actions';
import { BannerState } from 'store/admin/banners/banner.reducers';
import { StoreState } from 'store/root-reducer';

export interface IHero extends BannerState {
  backgroundImage: string;
  latest?: boolean;
  titleToTranslate: EWebLayout;

  // redux
  getBanner: (payload: BannerQuery) => void;
}

/**
 * @param currentBanner type of Banner Model
 * @param latest will check if lastest will be display at the botoom
 * @param titleToTranslate titile to be translated, type of EWebLayout, this will also set the titleToTranslate for the image
 */
function Hero({
  titleToTranslate,
  currentBanner,
  getBanner,
}: IHero): JSX.Element {
  let { t } = useTranslation();

  const router = useRouter();

  useEffect(() => {
    const payload: BannerQuery = {
      page: getPageFiles(titleToTranslate),
      status: EStatus.ACTIVE,
    };

    getBanner(payload);
  }, [titleToTranslate]);

  const getPageFiles = (page: EWebLayout): EPillar => {
    switch (page) {
      case EWebLayout.ABOUT:
        return EPillar.ABOUT_US;
      case EWebLayout.DE_TRACKER:
        return EPillar.TRACKER;
      case EWebLayout.NEWS:
        return EPillar.NEWS;
      case EWebLayout.PROJECT:
        return EPillar.PROJECT;
      case EWebLayout.RESOURCE:
        return EPillar.RESOURCE_HUB;
      default:
        return EPillar.HOME;
    }
  };

  return (
    <section className="hero">
      <div
        className={`hero__container hero--overlay-${titleToTranslate} position-relative`}
      >
        <div
          className="hero__container__bg"
          style={{ backgroundImage: `url(${currentBanner?.url})` }}
        />

        <div className="hero__container__caption center">
          <div
            dangerouslySetInnerHTML={{
              __html: getLocale(
                currentBanner?.locale?.en?.description,
                currentBanner?.locale?.km?.description,
              ),
            }}
          ></div>
        </div>
      </div>
    </section>
  );
}

const mapStateToProps = (store: StoreState) => {
  return { ...store.banner };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const { getCurrentClientBanner } = bannerActions;

  return {
    getBanner: (payload: BannerQuery) =>
      dispatch(getCurrentClientBanner(payload) as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Hero);
