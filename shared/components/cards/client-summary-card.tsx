import { ICON_URL } from '@shared/constant';
import { getLocale } from '@shared/custom-function/common';
import { formatISODate } from '@shared/custom-function/conversion';
import { IClientSummaryCardProps } from '@shared/interfaces';
import BaseImage from '../images/base-image';

function ClientSummaryCard({
  data,
  isLoading = false,
  showImage = true,
  showPillar = true,
  showStatus = true,
  showDate = true,
  showBreakline = true,
}: IClientSummaryCardProps): JSX.Element {
  return (
    <>
      {!isLoading ? (
        /*========== Real Data ==========*/
        <div className="row gx-3 h-100 client-project-summary">
          {
            /*===== Image =====*/
            showImage && (
              <div className="col-4 col-md-5 col-lg-4 mb-3">
                <div className="summary-img border rounded position-relative w-100 h-100 overflow-hidden">
                  <BaseImage
                    src={data?.imageUrl || ICON_URL?.BROKEN}
                    objectFit="cover"
                    layout="fill"
                  />
                </div>
              </div>
            )
          }

          {/*===== Info =====*/}
          <div
            className={`d-flex flex-column mb-3 ${
              showImage ? 'col-8 col-md-7 col-lg-8' : 'col-12'
            }`}
          >
            {/*===== Title =====*/}
            <a
              className="summary-title"
              href={getLocale(data?.titleLinkEn, data?.titleLinkKh)}
              target={data?.linkTarget || '_self'}
            >
              <h1>{getLocale(data?.titleEn, data?.titleKh)}</h1>
            </a>

            {/*===== Description =====*/}
            <div className="summary-info mb-2">
              <div
                className="summary-info__description"
                dangerouslySetInnerHTML={{
                  __html:
                    getLocale(data?.descriptionEn, data?.descriptionKh) + '',
                }}
              />
            </div>

            <div className="mt-auto">
              {
                /*===== Pillar =====*/
                showPillar && (
                  <span
                    className={`common-tag tag-${(
                      data?.pillarCode + ''
                    )?.toLowerCase()}`}
                  >
                    {data?.pillarLabel}
                  </span>
                )
              }

              {
                /*===== Status =====*/
                showStatus && (
                  <span
                    className={`common-tag tag-${(
                      data?.statusCode + ''
                    )?.toLowerCase()}`}
                  >
                    {data?.statusLabel}
                  </span>
                )
              }

              {
                /*===== Date =====*/
                showDate && (
                  <span className="common-tag tag-date">
                    <i className="fa fa-clock-o me-1" aria-hidden="true"></i>
                    {data?.dateLabel} {formatISODate(data?.date)}
                  </span>
                )
              }
            </div>
          </div>
        </div>
      ) : (
        /*========== Skeleton ==========*/
        <div className="row gx-3 h-100 client-project-skeleton">
          <div className="col-md-5 col-lg-4 mb-3">
            <div className="skeleton-img w-100 h-100 overflow-hidden"></div>
          </div>
          <div className="col-md-7 col-lg-8 d-flex flex-column mb-3">
            <div className="skeleton-title mb-3"></div>
            <div className="skeleton-info mb-3">
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div className="mt-auto">
              <div className="skeleton-pillar me-3"></div>
              <div className="skeleton-pillar"></div>
            </div>
          </div>
        </div>
      )}

      {showBreakline && <div className="border-bottom"></div>}
    </>
  );
}

export default ClientSummaryCard;
