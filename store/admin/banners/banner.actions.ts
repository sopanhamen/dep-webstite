import { ALERT_MESSAGE } from '@shared/constant';
import { EPillar } from '@shared/enum';
import { BannerQuery, IUploadPayload } from '@shared/interfaces';
import { Banner } from '@shared/models/banner.model';
import { MLocaleParent } from '@shared/models/common.model';
import { ToastServices } from '@shared/services/toast.service';
import { Dispatch } from 'redux';
import * as BannerService from 'store/services/banner.service';
import { BannerTypes } from './banner.action-types';

export const bannerActions = {
  getBannerAction(payload: BannerQuery) {
    return async function (dispatch: Dispatch) {
      dispatch({ type: BannerTypes.GET_BANNERS_REQUEST });

      try {
        const { data } = await BannerService.getBannerList(payload);

        let banners: Banner[];

        if (payload.page == EPillar.HOME) {
          banners = data.data.map((e: any) =>
            e.files.map((f: any) => new Banner(f)),
          )[0];
        } else {
          // get the image
          const bannersImage: Banner[] = data.data.map((e: any) =>
            e.files.map((f: any) => new Banner(f)),
          )[0];

          // get the locale
          const locale: MLocaleParent = data.data.map(
            (e: any) => new MLocaleParent(e.locale),
          )[0];

          // merge
          banners = [{ ...bannersImage[0], locale }];
        }

        return dispatch({
          type: BannerTypes.GET_BANNERS_SUCCESS,
          data: { banners },
        });
      } catch (e: unknown) {
        e instanceof Error
          ? ToastServices.error(e.message)
          : ToastServices.error(ALERT_MESSAGE.UNKNOWN_ERROR_RETRY);

        dispatch({ type: BannerTypes.GET_BANNERS_FAILED });
      }
    };
  },

  uploadBanner(payload: IUploadPayload) {
    return async function (dispatch: Dispatch) {
      dispatch({ type: BannerTypes.CREATE_BANNERS_REQUEST });

      try {
        const { data } = await BannerService.uploadBanner(payload);

        // get the image
        const bannersImage: Banner[] = data.data.files.map(
          (e: any) => new Banner(e),
        );

        // get the locale
        const locale: MLocaleParent = new MLocaleParent(data.data.locale);

        // merge
        const banners =
          payload.page === EPillar.HOME
            ? bannersImage
            : [{ ...bannersImage[0], locale }];

        return dispatch({
          type: BannerTypes.CREATE_BANNERS_SUCCESS,
          data: { banners },
        });
      } catch (e: unknown) {
        e instanceof Error
          ? ToastServices.error(e.message)
          : ToastServices.error(ALERT_MESSAGE.CREATE_SUCCESS);

        dispatch({ type: BannerTypes.CREATE_BANNERS_SUCCESS });
      }
    };
  },

  getCurrentClientBanner(payload: BannerQuery) {
    return async function (dispatch: Dispatch) {
      dispatch({ type: BannerTypes.GET_CLIENT_BANNERS_REQUEST });

      try {
        const { data } = await BannerService.getClientBanner(payload);

        if (payload.page === EPillar.HOME) {
          return dispatch({
            type: BannerTypes.GET_BANNERS_SUCCESS,
            data: {
              banners: data.data.map((e: any) =>
                e.files.map((f: any) => new Banner(f)),
              )[0],
            },
          });
        } else {
          const image = data.data.map((e: any) => {
            return {
              ...e.files[0],
              locale: e.locale,
            };
          });

          return dispatch({
            type: BannerTypes.GET_CLIENT_BANNERS_SUCCESS,
            data: { currentSelectedValue: new Banner(image[0]) },
          });
        }
      } catch (e: unknown) {
        e instanceof Error
          ? ToastServices.error(e.message)
          : ToastServices.error(ALERT_MESSAGE.UNKNOWN_ERROR_RETRY);

        dispatch({ type: BannerTypes.GET_CLIENT_BANNERS_FAILED });
      }
    };
  },
};
