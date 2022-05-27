import AppTable from '@components/admin/table/app-table';
import ExploreMore from '@components/resourceHub/explore-more';
import ViewerDownloadMedia from '@shared/components/media/viewer-download-media';
import DownloadModal from '@shared/components/modals/download-modal';
import { clientResourceHubHeader, ICON_URL } from '@shared/constant';
import { getLocale } from '@shared/custom-function/common';
import { formatISODate } from '@shared/custom-function/conversion';
import { EDownloadType, EFileExtension } from '@shared/enum/index';
import { IResourceHubDetail } from '@shared/models/resource-hub.model';
import clsx from 'clsx';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ProgressBar, Tab, Tabs } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as Redux from 'redux';
import ResourceHubActions from 'store/admin/resource-hub/resource-hub.action';
import { ResourceHubState } from 'store/admin/resource-hub/resource-hub.reducer';
import { StoreState } from 'store/root-reducer';

interface IResourceHubProps extends ResourceHubState {
  getResourceHubDetail: (id: string) => void;
  resource: IResourceHubDetail | null;
}

function ResourceHubDetail({
  getResourceHubDetail,
  resource,
  isLoading,
}: IResourceHubProps): JSX.Element {
  let { t } = useTranslation();
  const router = useRouter();
  const id = router?.query?.id as string;
  const [isKey, setIsKey] = useState('EDUCATIONAL-MATERIALS');
  const [isShow, setShow] = useState(false);
  const [isId, setId] = useState('');
  const [showDownload, setShowDownload] = useState(false);
  const [isFile, setFile] = useState<any>();
  const [downloadFile, setDownloadFile] = useState<any>();
  const [isCount, setCount] = useState(0);

  useEffect(() => {
    if (id) getResourceHubDetail(id);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleViewFile = (file: any) => {
    setShow(!isShow);
    setId(id);
    setFile(file);
  };

  const handleDownload = (file: any) => {
    setShowDownload(true);
    setDownloadFile(file);
  };

  const downloading = (id: string) => {
    if (id === downloadFile?.fileId) return downloadFile?.downloading;
  };

  return (
    <>
      <article className="header-hub py-3">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="/resource-hub">
                  <a className="text-decoration-none">
                    {t('common:header.resource')}
                  </a>
                </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {getLocale(resource?.title, resource?.locale?.km?.title)}
              </li>
            </ol>
          </nav>
        </div>
      </article>
      <section className="section-resource-hub py-5">
        <div className="container">
          <h4
            className="m-b-20 color-blue fw-bold wow fadeIn"
            data-wow-delay=".30s"
          >
            {getLocale(resource?.title, resource?.locale?.km?.title)}
          </h4>

          <p>
            <label className="fw-bold me-1 mb-2">
              {t('common:resourceHub.published_by')} :
            </label>
            {resource?.publishedBy?.name}
          </p>

          <div
            dangerouslySetInnerHTML={{
              __html:
                getLocale(
                  resource?.description,
                  resource?.locale?.km?.description,
                ) + '',
            }}
          ></div>

          <div className="border-bottom my-4"></div>

          <div className="list-section">
            <div className="d-flex mb-2">
              <p className="fw-bold add-width">
                {t('common:resourceHub.publice_date')} :{' '}
              </p>
              <span>{formatISODate(resource?.publishedAt)}</span>
            </div>

            <div className="d-flex mb-2">
              <p className="fw-bold add-width">
                {t('common:resourceHub.available_language_for_download')} :{' '}
              </p>
              {resource?.languages?.map((e, i) => (
                <div className="center ms-1" key={i}>
                  <Image
                    key={i}
                    className="rounded-circle p-1 object-cover"
                    src={
                      e.code === 'EN'
                        ? ICON_URL.FLAG_EN
                        : ICON_URL.FLAG_KM || e.imageUrl
                    }
                    height="25"
                    width="25"
                    alt={e?.name}
                  />
                  <span className="ms-1">{e?.name}</span>
                </div>
              ))}
            </div>

            <div className="d-flex mb-2">
              <p className="fw-bold add-width">
                {t('common:resourceHub.resource_from')} :{' '}
              </p>
              <span>{formatISODate(resource?.publishedAt)}</span>
            </div>

            <div className="d-flex mb-2">
              <p className="fw-bold add-width">
                {t('common:project.pillar')} :{' '}
              </p>
              <span>{resource?.pillar?.name}</span>
            </div>

            <div className="d-flex mb-2">
              <p className="fw-bold add-width">
                {t('common:project.sector')} :{' '}
              </p>
              <span>
                {resource?.sectors?.map((e, i) => (
                  <label key={i}>{e?.name}</label>
                ))}
              </span>
            </div>

            <div className="d-flex mb-2">
              <p className="fw-bold add-width">
                {t('common:resourceHub.stakeholders')} :{' '}
              </p>
              <span>
                {resource?.stakeholders?.map((e, i) => (
                  <label key={i}>{e?.name}</label>
                ))}
              </span>
            </div>

            <div className="d-flex mb-2">
              <p className="fw-bold add-width">
                {t('common:resourceHub.available_file_for_download')} :{' '}
              </p>
              {resource?.extensions?.map((e, i) => (
                <button
                  key={i}
                  className={clsx(
                    'px-3 py-1 m-r-4 border-0 text-white rounded-2 font-12 text-uppercase',
                    e === 'pdf' ? 'bg-file-extension' : '',
                    e === 'png' || e === 'jpg' || e === 'svg' || e === 'jpeg'
                      ? 'bg-img-extension'
                      : '',
                    e === 'xlsx' || e === 'doc' || e === 'csv'
                      ? 'bg-blue'
                      : '' || e === 'mp4'
                      ? 'bg-vdo-extension'
                      : '',
                  )}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="border-bottom my-4"></div>

          <div className="bg-tabs-hub overflow-auto">
            <Tabs
              defaultActiveKey={isKey}
              transition={false}
              id="noanim-tab-example"
              className="mb-3"
            >
              {resource?.fileTypes?.map((e, i) => (
                <Tab eventKey={e.code} title={e.name} key={i}>
                  <div className="m-5">
                    {e?.files?.map((b, i) => (
                      <div className="card bg-white p-3 mb-3" key={i}>
                        <div className="row g-0">
                          <div className="col-auto">
                            <div className="blk-file position-relative">
                              {b?.extension === EFileExtension.JPEG ||
                              b?.extension === EFileExtension.PNG ? (
                                <Image
                                  src="/assets/jpeg-file.png"
                                  width={80}
                                  height={110}
                                  className="card-img-top"
                                  alt="..."
                                />
                              ) : b?.extension === EFileExtension.PDF ? (
                                <Image
                                  src="/assets/pdf.png"
                                  width={80}
                                  height={110}
                                  className="card-img-top"
                                  alt="..."
                                />
                              ) : (
                                <Image
                                  src="/assets/file.png"
                                  width={80}
                                  height={110}
                                  className="card-img-top"
                                  alt="..."
                                />
                              )}
                              <p className="text-file">{b?.extension}</p>
                            </div>
                          </div>

                          <div className="col">
                            <div className="card-body">
                              <h5 className="card-title color-blue mb-2">
                                {b.name}
                              </h5>
                              <div className="d-flex">
                                <button
                                  className="card-link bg-active py-2 px-4 border-0 rounded-3 text-white"
                                  onClick={() => handleViewFile(b)}
                                >
                                  {t('common:download.view_file')}
                                </button>
                                <button
                                  className="card-link bg-reject py-2 px-4 border-0 rounded-3 text-white"
                                  disabled={downloading(b?.fileId)}
                                  onClick={() => handleDownload(b)}
                                >
                                  {downloading(b?.fileId)
                                    ? `${t('common:download.Downloading')}`
                                    : `${t('common:download.download_now')}`}
                                </button>
                              </div>
                              <div className="progress my-2">
                                <ProgressBar now={0} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Tab>
              ))}
            </Tabs>
          </div>

          {resource?.metadata ? (
            <div className="table-list my-4">
              <p>{t('common:resourceHub.general_meta_data_fields')}</p>

              <div className="border mt-2">
                <AppTable
                  headers={clientResourceHubHeader}
                  loading={isLoading}
                  total={1}
                >
                  {resource?.metadata?.additionalInfos?.map(
                    (d: any, i: any) => (
                      <tr key={i}>
                        <td>
                          <div
                            dangerouslySetInnerHTML={{
                              __html:
                                getLocale(
                                  d?.locale?.en?.field,
                                  d?.locale?.km?.field,
                                ) + '',
                            }}
                          ></div>
                        </td>
                        <td>
                          <div
                            dangerouslySetInnerHTML={{
                              __html:
                                getLocale(
                                  d?.locale?.en?.value,
                                  d?.locale?.km?.value,
                                ) + '',
                            }}
                          ></div>
                        </td>
                      </tr>
                    ),
                  )}
                </AppTable>
              </div>
            </div>
          ) : null}

          <div className="section-more mt-5">
            {resource?.relatedResourceHubs?.length ? (
              <ExploreMore
                data={resource?.relatedResourceHubs}
                isLoading={isLoading}
                showImage={false}
                loadingCards={4}
              />
            ) : null}
          </div>
        </div>

        <ViewerDownloadMedia
          show={isShow}
          downloadBody={isFile}
          onClose={() => setShow(false)}
          filename={isFile?.name}
          fileId={isId}
          src={isFile?.fileUrl}
          type={isFile?.extension}
        />

        <DownloadModal
          itemId={id}
          referenceFileId={downloadFile?.referenceFileId}
          fileId={downloadFile?.fileId}
          filename={downloadFile?.name}
          extension={downloadFile?.extension}
          isShow={showDownload}
          downloadType={EDownloadType.RESOURCE_HUB}
          onClose={() => setShowDownload(false)}
          getDownloading={(isDownloading) => {
            setDownloadFile({ ...downloadFile, downloading: isDownloading });
          }}
        />
      </section>
    </>
  );
}

const mapStateToProps = (store: StoreState) => {
  const resourceHubDetail = store?.resourceHub?.resourceHubDetail as any;
  return {
    resource: resourceHubDetail,
  };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch) => {
  const { getClientResourceHubDetail } = ResourceHubActions;

  return {
    getResourceHubDetail: (id: string) =>
      dispatch(getClientResourceHubDetail(id) as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResourceHubDetail);
