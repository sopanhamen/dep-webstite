import BaseImage from '@shared/components/images/base-image';
import VideoPlayer from '@shared/components/video/video-player';
import { EDownloadType, EFileExtension } from '@shared/enum';
import clsx from 'clsx';
import useTranslation from 'next-translate/useTranslation';
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import CommonServices, {
  IDownloadPayload,
} from 'store/services/common.service';
import DownloadModal from '../modals/download-modal';

interface IViewerDownloadMedia {
  downloadBody?: any;
  filename: string;
  show: boolean;
  src: string;
  type?: EFileExtension;
  fileId: string;
  onClose: () => void;
}

const ViewerDownloadMedia = ({
  downloadBody,
  filename,
  show,
  src,
  type,
  fileId,
  onClose,
}: IViewerDownloadMedia) => {
  let { t } = useTranslation();
  const [showDownload, setShowDownload] = useState(false);
  const [downloadFile, setDownloadFile] = useState<any>();

  const embeddedLink = () => {
    const embeddedString = '&embedded=true';
    const embeddedExcelLink =
      'https://view.officeapps.live.com/op/embed.aspx?src=';

    const embeddedPdf = 'http://docs.google.com/gview?url=';

    if (!src) return;

    if (type === EFileExtension.PDF) {
      return embeddedPdf + src + embeddedString;
    }

    if (
      type === EFileExtension.XLSX ||
      type === EFileExtension.CSV ||
      EFileExtension.DOC
    ) {
      return embeddedExcelLink + src + embeddedString;
    }
  };

  // check extensions
  const isImage = () => {
    return type === EFileExtension?.JPEG || type === EFileExtension.PNG;
  };

  const isVideo = () => {
    return type === EFileExtension?.AVI || type === EFileExtension.MP4;
  };

  const isFile = () => {
    return (
      type === EFileExtension.CSV ||
      type === EFileExtension.DOC ||
      type === EFileExtension.XLSX ||
      type === EFileExtension.PDF
    );
  };

  const handleDownload = (file: any) => {
    setShowDownload(true);
    setDownloadFile(file);
  };

  const downloading = (id: string) => {
    if (id === downloadFile?.fileId)
      return downloadFile?.downloading as boolean;
  };

  return (
    <>
      <Modal
        show={show}
        onHide={onClose}
        centered
        backdrop="static"
        size="xl"
        className={clsx('modal-viewer-download-media')}
      >
        <Modal.Header className="border-0 text-center" closeButton>
          <Modal.Title className="w-100">
            <div className="d-flex justify-content-between align-items-center px-3">
              <h5 className="title">{type?.toUpperCase()}</h5>
              <button
                className="btn-download"
                onClick={() => handleDownload(downloadBody)}
                disabled={downloading(downloadFile?.fileId)}
              >
                {t('common:download.download_now')}
              </button>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={clsx('p-0', isImage() && 'min-h-45vh')}>
          {/* show file */}
          {isFile() && (
            <iframe
              src={embeddedLink()}
              style={{ width: '100%', height: '70vh' }}
            />
          )}

          {/* show video */}
          {isVideo() && <VideoPlayer src={src} className="video-player" />}

          {/* show image */}
          {isImage() && <BaseImage src={src} layout="fill" />}
        </Modal.Body>
      </Modal>

      <DownloadModal
        itemId={fileId}
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
    </>
  );
};

export default ViewerDownloadMedia;
