import { ICON_URL } from '@shared/constant';
import { getLocale } from '@shared/custom-function/common';
import { IProjectNewsCardCommon } from '@shared/interfaces';
import { ProjectNewsCardModel } from '@shared/models/project-news-card.model';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface IProjectNewsCard extends IProjectNewsCardCommon {
  data: ProjectNewsCardModel;
  index: number;
  readLessMore(index: number): void;
  showUpdate?: boolean;
  showMore?: boolean;
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
function ProjectNewsCard({
  data,
  index,
  isLoading,
  showImage,
  readLessMore,
  showUpdate,
  showMore,
}: IProjectNewsCard): JSX.Element {
  /**
   *
   * @param tag value to check for style display
   * @returns string tag value for scss
   */

  const router = useRouter();

  const checkTag = (tag: string): string => {
    switch (tag) {
      case 'Digital Citizen':
        return 'citizen';
      case 'Digital Government':
        return 'government';
      case 'Digital Business':
        return 'business';
      default:
        return 'citizen';
    }
  };

  return (
    <>
      <div className={`project-container ${data.className}`}>
        {showImage && (
          <div className="image-container">
            {isLoading ? (
              <div className="image-container__skeleton" />
            ) : (
              <Image
                src={data.imageUrl || ICON_URL.BROKEN}
                height="150"
                width="150"
                alt={data.title}
                loader={() => data.imageUrl || ICON_URL.BROKEN}
              />
            )}
          </div>
        )}

        <div className={`information ${showImage ? 'm-l-44 m-l-sm-0' : ''}`}>
          <div className="information__title m-b-4">
            {isLoading ? (
              <div className="information__title-skeleton" />
            ) : (
              <a onClick={() => router.push(`${data.id}`)}>
                <h1 className="font-16 cursor-pointer">
                  {getLocale(data?.locale?.en?.name, data?.locale?.km?.name)}
                </h1>
              </a>
            )}
          </div>

          <div
            className={`information__description ${
              data.readMore ? 'open' : ''
            }`}
          >
            {isLoading ? (
              <div className="information__description-skeleton" />
            ) : (
              // to use the clamp with animation the parent should have the open class or it's css
              <div
                className={`clamp-${data.lineClamp}-animate`}
                dangerouslySetInnerHTML={{
                  __html: getLocale(
                    data?.locale?.en?.description,
                    data?.locale?.km?.description,
                  ),
                }}
              ></div>
            )}
          </div>

          <div className="information__tags m-t-8 position-relative">
            {showMore && !isLoading && (
              <>
                {!data.readMore ? (
                  <p
                    className="read read--more"
                    onClick={() => readLessMore(index)}
                  >
                    ...<span>Read More</span>
                  </p>
                ) : (
                  <p
                    className="read read--less"
                    onClick={() => readLessMore(index)}
                  >
                    Read less
                  </p>
                )}
              </>
            )}

            {isLoading ? (
              <div className="information__tags__citizen-skeleton m-r-12" />
            ) : (
              <div
                className={`common-tag d-flex tag-${(
                  data?.pillar.code + ''
                )?.toLowerCase()}`}
              >
                <span className="font-10 px-1">{data?.pillar?.name} </span>
              </div>
            )}

            {isLoading ? (
              <div className="information__status" />
            ) : (
              <div
                className={`information__status bg-gradient-${data?.status?.toLowerCase()} color-${data?.status?.toLowerCase()}`}
              >
                <span className="font-10 font-w-300 text-capitalize">
                  {data?.status}
                </span>
              </div>
            )}
            {showUpdate && (
              <div>
                {isLoading ? (
                  <div className="information__tags__date-skeleton" />
                ) : (
                  <div className="information__tags__date">
                    <i className="fa fa-clock-o" aria-hidden="true" />
                    <p className="font-12 font-w-300">
                      <span className="font-w-400">Last Update:</span>
                      {data.lastUpdate}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProjectNewsCard;
