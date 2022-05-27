import AppTable from '@components/admin/table/app-table';
import AdminListCard from '@shared/components/cards/admin-list-card';
import MoreDropDown from '@shared/components/drop-down-button';
import BaseImage from '@shared/components/images/base-image';
import ModificationModal from '@shared/components/modals/modification-modal';
import Quill from '@shared/components/rich-text-editor';
import AdminTableImg from '@shared/components/table/admin-table-img';
import UploadImages from '@shared/components/upload-image/upload-images';
import UploadVideos from '@shared/components/upload-image/upload-video';
import VideoPlayer from '@shared/components/video/video-player';
import { bannerHeader, ICON_URL } from '@shared/constant';
import { permissionChecker } from '@shared/custom-function/common';
import { toTitleCase } from '@shared/custom-function/conversion';
import {
  BannerMediaType,
  ELanguage,
  EPillar,
  EStatus,
  ETextColor,
} from '@shared/enum';
import { BannerQuery, IAction, IUploadPayload } from '@shared/interfaces';
import { Banner } from '@shared/models/banner.model';
import { MImage, MVideo } from '@shared/models/image-model';
import clsx from 'clsx';
import * as _ from 'lodash';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { bannerActions } from 'store/admin/banners/banner.actions';
import { BannerState } from 'store/admin/banners/banner.reducers';
import { StoreState } from 'store/root-reducer';

enum EUploadType {
  IMAGE,
  VIDEO,
}

interface IBanners extends BannerState {
  permissions?: string[];
  getBanner: (payload: BannerQuery) => void;
  upload: (payload: IUploadPayload) => void;
}

function Banners({
  banners,
  isFetching,
  permissions,
  getBanner,
  upload,
}: IBanners) {
  const [page, setPage] = useState(EPillar.HOME);
  const [showModal, setShowModal] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<MImage[]>([]);
  const [uploadedImage, setUploadedImage] = useState<MImage | null>(null);
  const [video, setVideoUrl] = useState<MVideo | null>(null);
  const [uploadType, setUploadType] = useState<EUploadType>();
  const [isHome, setIshome] = useState(false);
  const [descEn, setDescEn] = useState('');
  const [descKm, setDescKm] = useState('');

  useEffect(() => {
    const payload: BannerQuery = {
      page,
      status: EStatus.ACTIVE,
    };

    setIshome(page === EPillar.HOME);

    getBanner(payload);
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (page !== EPillar.HOME && banners?.length) {
      setDescEn(String(banners[0]?.locale?.en.description));
      setDescKm(String(banners[0]?.locale?.km.description));
      setUploadedImage({
        id: banners[0]?.id,
        name: banners[0]?.name,
        status: banners[0]?.status,
        url: banners[0]?.url ?? ICON_URL.BROKEN,
      });
    }
  }, [banners]); // eslint-disable-line react-hooks/exhaustive-deps

  const moreOptionToDisplay = (): IAction[] => {
    if (isHome) {
      return [
        {
          name: 'Change Banner',
          color: ETextColor.BLUE,
        },
        {
          name: 'Change Video',
          color: ETextColor.BLUE,
        },
      ];
    } else {
      return [
        {
          name: 'Edit',
          color: ETextColor.RED,
        },
      ];
    }
  };

  const handleDropdownAction = (action: string) => {
    setUploadedImages([]);

    setShowModal(true);

    action === 'Change Video'
      ? setUploadType(EUploadType.VIDEO)
      : setUploadType(EUploadType.IMAGE);
  };

  // elements section
  const dropDown = (): JSX.Element => {
    return (
      <>
        {/* check user permissions */}
        {permissionChecker(['WEB-BANNER-CREATE', 'WEB-BANNER-UPDATE']) && (
          <td>
            <MoreDropDown
              actions={moreOptionToDisplay()}
              selectedActions={handleDropdownAction}
            />
          </td>
        )}
      </>
    );
  };

  const ImageElement = (): JSX.Element => (
    <>
      {isHome ? (
        uploadedImages?.map((image: MImage) => {
          return (
            <div className="image-viewer" key={image?.id}>
              <BaseImage
                src={image?.url}
                alt={image?.name}
                width={150}
                height={150}
              />
            </div>
          );
        })
      ) : (
        <>
          {uploadedImage && (
            <BaseImage
              alt={uploadedImage?.name}
              src={String(uploadedImage?.url)}
              height={400}
              width={1440}
            />
          )}
        </>
      )}

      <div className="image-viewer mt-5">
        <UploadImages
          imageData={(images: MImage[] | MImage) => {
            _.isArray(images)
              ? setUploadedImages((pre) => [...pre, ...images])
              : setUploadedImage(images);
          }}
          multiple={isHome}
        />
      </div>
    </>
  );

  const VideoElement = (): JSX.Element => (
    <>
      {video ? (
        <VideoPlayer src={video.url} className="video-player" />
      ) : (
        <UploadVideos videoData={(val: MVideo) => setVideoUrl(val)} />
      )}
    </>
  );

  const saveUploadedImage = (): void => {
    let payload: IUploadPayload = {
      page: page.split('_').join('-'),
      pillar: '',
      position: 'NONE',
      description: `Upload ${new Date()}`,
    };

    if (isHome) {
      if (uploadType === EUploadType.IMAGE) {
        payload = {
          ...payload,
          name: 'Homepage Images',
          files: uploadedImages.map((e: MImage, i: number) => {
            return {
              fileId: e.id,
              referenceFileType: '',
              isPreview: true,
              sequence: i,
            };
          }),
        };
      } else {
        payload = {
          ...payload,
          files: [
            {
              fileId: String(video?.id),
              referenceFileType: '',
              isPreview: true,
              sequence: 1,
            },
          ],
        };
      }

      upload(payload);
    } else {
      payload = {
        ...payload,
        locale: {
          km: { description: descKm },
          en: { description: descEn },
        },
        files: [
          {
            fileId: String(uploadedImage?.id),
            referenceFileType: '',
            isPreview: true,
            sequence: 1,
          },
        ],
      };

      upload(payload);
    }

    setShowModal(false);
  };

  // Start of the Banners Display
  // this will display the video, or the images if user is in the homepage tab
  const isHomeDisplay = (): JSX.Element => {
    return (
      <>
        {banners?.map((e: Banner, i: number) => (
          <tr key={`banner-image-${i}`}>
            <td
              className={clsx(
                'position-relative',
                'm-2',
                isHome && 'banner-image',
                `banner-image--${page.toLowerCase()}`,
              )}
            >
              {e.type === BannerMediaType.IMAGE ? (
                <Image src={e.url} alt={e.name} layout="fill" />
              ) : (
                <VideoPlayer src={e.url} className="video-player" />
              )}
            </td>
            {i === 0 && dropDown()}
          </tr>
        ))}
      </>
    );
  };

  // this will display the all the images of the pillars
  const isNotHomeDisplay = (): JSX.Element => {
    return (
      <>
        {banners?.map((e: Banner, i: number) => (
          <tr key={i}>
            <td className={clsx('position-relative')}>
              <AdminTableImg
                src={e.url}
                alt={e?.name}
                height={400}
                width={1440}
                layout="fixed"
              />
            </td>
            <td
              dangerouslySetInnerHTML={{
                __html: String(e.locale?.en.description),
              }}
            />
            <td
              dangerouslySetInnerHTML={{
                __html: String(e.locale?.km.description),
              }}
            />
            {dropDown()}
          </tr>
        ))}
      </>
    );
  };

  // this will display if the banners does not exist
  const emptyDisplay = (): JSX.Element => {
    return (
      <tr>
        <td></td>
        {!isHome && (
          <>
            <td></td>
            <td></td>
          </>
        )}
        {dropDown()}
      </tr>
    );
  };

  // collection of the home and non homepage display,
  // added this just to lessen nested ternary operator
  const tableDisplay = (): JSX.Element => {
    return isHome ? isHomeDisplay() : isNotHomeDisplay();
  };

  // End of the Banners Display

  return (
    <>
      {showModal && (
        <ModificationModal
          className="modification-modal--banner"
          dialogClassName="modal-80w"
          hint={`To get the maximum resolution on the client side banner, please upload images ${
            isHome ? 'that occupies the whole screen' : '1440px by 400px'
          } `}
          isShow={showModal}
          onClose={() => setShowModal(false)}
          size="lg"
          title={`Modify ${toTitleCase(page.split('_').join(' '))}`}
        >
          <ModificationModal.Body>
            <div
              className={clsx(
                'media-container',
                uploadType === EUploadType.IMAGE
                  ? 'images-section'
                  : 'video-section',
              )}
            >
              {uploadType === EUploadType.IMAGE ? (
                <div
                  className={clsx('d-flex', !isHome && 'flex-column', 'mb-2')}
                >
                  <ImageElement />
                  {!isHome && (
                    <div className="d-flex gap-20 mt-10">
                      <div className="d-flex gap-10">
                        <div className="col-md-6 col-sm-12">
                          <Quill
                            currentValue={descEn || ''}
                            label="Banner Titile in English"
                            placeholder="Type your title here"
                            language={ELanguage.ENGLISH}
                            updatedValue={(e) => setDescEn(e as string)}
                          />
                        </div>

                        <div className="col-md-6 col-sm-12">
                          <Quill
                            currentValue={descKm || ''}
                            label="Banner Titile ជាភាសាខ្មែរ"
                            placeholder="វាយចំណងជើងរបស់អ្នកនៅទីនេះ"
                            language={ELanguage.KHMER}
                            updatedValue={(e) => setDescKm(e as string)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <VideoElement />
              )}
            </div>
          </ModificationModal.Body>
          <ModificationModal.Footer>
            <button
              className="admin-btn-add center"
              onClick={() => saveUploadedImage()}
            >
              Save
            </button>
          </ModificationModal.Footer>
        </ModificationModal>
      )}

      <AdminListCard>
        <AdminListCard.Header>
          {/* DOCS: https://react-bootstrap.github.io/components/tabs/ */}
          <Tabs
            defaultActiveKey={page}
            className="mb-3 section-admin-tabs client-pillars-tab borderColor"
            onSelect={(e) => setPage(e as EPillar)}
          >
            <Tab eventKey={EPillar.HOME} title="Home" />
            <Tab eventKey={EPillar.TRACKER} title="De Progress Tracker" />
            <Tab eventKey={EPillar.PROJECT} title="Project" />
            <Tab eventKey={EPillar.RESOURCE_HUB} title="Resource Hub" />
            <Tab eventKey={EPillar.NEWS} title="News" />
            <Tab eventKey={EPillar.ABOUT_US} title="About us" />
          </Tabs>
        </AdminListCard.Header>
        <AdminListCard.Body>
          <AppTable
            headers={bannerHeader(
              isHome,
              permissionChecker(['WEB-BANNER-CREATE', 'WEB-BANNER-UPDATE']),
            )}
            loading={isFetching}
            total={1}
          >
            <>{banners.length ? tableDisplay() : emptyDisplay()}</>
          </AppTable>
        </AdminListCard.Body>
      </AdminListCard>
    </>
  );
}

const mapStateToProps = (store: StoreState) => {
  const permissions = store.auth.user?.permissions;

  return { ...store.banner, permissions };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const { getBannerAction, uploadBanner } = bannerActions;

  return {
    getBanner: (payload: BannerQuery) =>
      dispatch(getBannerAction(payload) as any),

    upload: (payload: IUploadPayload) => dispatch(uploadBanner(payload) as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Banners);
