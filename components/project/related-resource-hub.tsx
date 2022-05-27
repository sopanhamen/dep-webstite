import ResourcehubCard from '@shared/components/cards/resource-hub';
import { IProjectNewsCardCommon } from '@shared/interfaces';
import { ResourceHubCardModel } from '@shared/models/resource-hub-card.model';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';

interface IRelatedResourceHub extends IProjectNewsCardCommon {
  data: ResourceHubCardModel[];
  loadingCards: number;
}

function RelatedResourceHub({
  data,
  isLoading,
  loadingCards = 4,
  showImage,
}: IRelatedResourceHub): JSX.Element {
  let { t } = useTranslation();
  const router = useRouter();
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
            {t('common:related.related_resource_hub')}
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
        <div className="w-100 text-center mb-5">
          <button
            className="w-auto px-5 py-2 font-18 border rounded-3"
            onClick={() => router.push('/resource-hub')}
          >
            {t('common:buttons.show_all')}
          </button>
        </div>
      </div>
    </div>
  );
}
export default RelatedResourceHub;
