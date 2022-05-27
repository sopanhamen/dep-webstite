import { IProjectNewsCardCommon } from '@shared/interfaces';
import { MLocaleParent } from '@shared/models/common.model';
import { ProjectNewsCardModel } from '@shared/models/project-news-card.model';
import React, { Fragment, useEffect, useState } from 'react';
import ProjectNewsCard from './projects-news';

interface IProjectNewsArray extends IProjectNewsCardCommon {
  data: ProjectNewsCardModel[];
  loadingCards: number;
}

/**
 *
 * @param data value to display, model of ProjectNewsCardModel
 * @param isLoading show loading style if true else data
 * @param loadingCards number of loading cards to show if loading, default 6
 * @param showImage show or hide image
 *
 */
function ProjectNewsArray({
  data,
  isLoading,
  loadingCards = 6,
  showImage,
}: IProjectNewsArray): JSX.Element {
  const [currentData, setCurrentData] = useState(data);

  useEffect(() => {
    setCurrentData(data);
  }, [data]);

  const loadingPlaceholder: ProjectNewsCardModel = {
    className: 'm-auto',
    description: '',
    imageUrl: '',
    lastUpdate: '',
    lineClamp: 3,
    readMore: false,
    tag: '',
    title: '',
    pillar: {},
    status: '',
    name: '',
    locale: new MLocaleParent({}),
  };

  return (
    <section className="project m-auto container">
      {isLoading ? (
        <>
          {[...Array(loadingCards)].map((e, i) => (
            <Fragment key={i}>
              <ProjectNewsCard
                data={loadingPlaceholder}
                index={i}
                isLoading={true}
                showImage={showImage}
                readLessMore={(x) => {}}
              />
            </Fragment>
          ))}
          \
        </>
      ) : (
        <>
          {currentData.map((e, i) => (
            <Fragment key={i}>
              <ProjectNewsCard
                data={e}
                index={i}
                isLoading={false}
                showImage={showImage}
                readLessMore={(x) => {
                  const read = currentData.map((f, j) => {
                    return x === j
                      ? {
                          ...f,
                          readMore: !f.readMore,
                        }
                      : { ...f };
                  });
                  setCurrentData(read);
                }}
              />
            </Fragment>
          ))}
        </>
      )}
    </section>
  );
}

export default ProjectNewsArray;
