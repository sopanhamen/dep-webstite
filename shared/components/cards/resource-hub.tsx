import { ICON_URL } from '@shared/constant';
import { getLocale } from '@shared/custom-function/common';
import { formatISODate } from '@shared/custom-function/conversion';
import { EFileExtension } from '@shared/enum/index';
import { IProjectNewsCardCommon } from '@shared/interfaces';
import { ResourceHubCardModel } from '@shared/models/resource-hub-card.model';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

interface IResourceHubeCard extends IProjectNewsCardCommon {
  data?: ResourceHubCardModel;
  index?: number;
  readLessMore(index: number): void;
}

/**
 *
 * @param data value to display, model of ProjectNewsCardModel
 * @param index to be used on toggle read more or read less
 * @param isLoading show loading style if true else data
 * @param showImage show or hide image
 *
 * @param readLessMore toggle to show or hide text
 */

function ResourcehubCard({
  data,
  index,
  isLoading,
  showImage,
  readLessMore,
}: IResourceHubeCard): JSX.Element {
  return (
    <>
      <div
        className={`project-container relate-card border rounded-3 p-3 h-100 ${data?.className}`}
      >
        {showImage && (
          <div className="image-container ">
            {!isLoading ? (
              <div className="image-container__skeleton" />
            ) : (
              <Image
                src={data?.imageUrl || ICON_URL.BROKEN}
                height="150"
                width="150"
                alt={data?.title}
                loader={() => data?.imageUrl || ICON_URL.BROKEN}
              />
            )}
          </div>
        )}

        <div className={`information  ${showImage ? 'm-l-20 m-l-sm-0' : ''}`}>
          <div className="information__title m-b-4">
            {!isLoading ? (
              <div className="information__title-skeleton" />
            ) : (
              <Link href={`/resource-hub/${data?.id}`}>
                <h1 className="font-16 cursor-pointer color-link">
                  {getLocale(
                    data?.locale?.en?.title,
                    data?.locale?.km?.title,
                  ) || data?.title}
                </h1>
              </Link>
            )}
          </div>

          <div className="d-flex align-items-center">
            <div className={`information__flag`}>
              {data?.languages?.map((e, i) => (
                <Image
                  key={i}
                  className="rounded-circle p-1 object-cover"
                  src={
                    e.code === 'EN'
                      ? ICON_URL.FLAG_EN
                      : ICON_URL.FLAG_KM || e.imageUrl
                  }
                  height="30"
                  width="30"
                  alt={e?.name}
                />
              ))}
            </div>

            <div className="information__tags__date">
              <div className="font-12 font-w-300 m-l-8">
                <span className="font-w-400 d-flex align-item-center bg-wild-sand px-2 py-1 rounded-1">
                  <Image
                    className="p-r-4"
                    src={'/assets/icons/Time.svg'}
                    width={18}
                    height={18}
                    alt="icon"
                  />
                  {formatISODate(data?.publishedAt)}
                </span>
              </div>
            </div>

            <div className="information__tags__file ms-2">
              <div className="font-w-400 d-flex align-item-center bg-wild-sand px-2 py-1 rounded-1 font-12">
                <Image
                  className="p-r-4"
                  src={'/assets/icons/file.svg'}
                  width={15}
                  height={15}
                  alt="icon"
                />
                <p>{data?.resourceOrg?.name}</p>
              </div>
            </div>
          </div>

          <div className={`information__extensions`}>
            {data?.extensions?.map((e, i) => (
              <button
                key={i}
                className={clsx(
                  'px-3 py-1 m-r-4 border-0 text-white rounded-2 font-12 text-uppercase',
                  e === EFileExtension.PDF ? 'bg-file-extension' : '',
                  e === EFileExtension.PNG || e === EFileExtension.JPEG
                    ? 'bg-img-extension'
                    : '',
                  e === EFileExtension.AVI ? 'bg-main-red' : '',
                  e === EFileExtension.XLSX ||
                    e === EFileExtension.DOC ||
                    e === EFileExtension.CSV
                    ? 'bg-blue'
                    : 'bg-pending',
                )}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default ResourcehubCard;
