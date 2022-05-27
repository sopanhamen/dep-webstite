import ResourcehubCard from '@shared/components/cards/resource-hub';
import { Fragment, useEffect, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { ResourceHubCardModel } from '@shared/models/resource-hub-card.model';
import { IProjectNewsCardCommon } from '@shared/interfaces';

interface IRelatedResourceHub extends IProjectNewsCardCommon {
  data: ResourceHubCardModel[];
  loadingCards: number;
}

function ExploreMore({
  data,
  isLoading,
  loadingCards = 4,
  showImage,
}: IRelatedResourceHub): JSX.Element {
  let { t } = useTranslation();
  const [currentData, setCurrentData] = useState(data);

  useEffect(() => {
    setCurrentData(data);
  }, [data]);

  return (
    <div className="section-related-project">
      <div className="container">
        <div className="related-title">
          <h4
            className="m-b-20 fw-bold wow fadeIn text-center"
            data-wow-delay=".30s"
          >
            {t('common:resourceHub.explore_more')}
          </h4>

          <div className="border-bottom"></div>
        </div>

        <div className="row my-4 g-3 g-md-4">
          {currentData?.map((e, i) => (
            <div className="col-12 col-md-6" key={i}>
              <Fragment key={i}>
                <ResourcehubCard
                  data={e}
                  index={i}
                  isLoading={true}
                  showImage={showImage}
                  readLessMore={(x) => {}}
                />
              </Fragment>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default ExploreMore;
