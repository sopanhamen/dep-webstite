import ProjectNewsCard from '@shared/components/cards/projects-news';
import { IProjectNewsCardCommon } from '@shared/interfaces';
import { ProjectNewsCardModel } from '@shared/models/project-news-card.model';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';

interface IRelatedNew extends IProjectNewsCardCommon {
  data: ProjectNewsCardModel[];
  loadingCards: number;
}

function RelatedNews({
  data,
  isLoading,
  loadingCards = 4,
  showImage,
}: IRelatedNew): JSX.Element {
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
            {t('common:related.related_news')}
          </h4>
          <div className="border-bottom"></div>
        </div>

        <div className="row mt-2 mb-4 gy-4 gx-5">
          {currentData?.map((e, i) => (
            <div className="col-12 col-md-6" key={i}>
              <section className="project" key={i}>
                <Fragment key={i}>
                  <ProjectNewsCard
                    data={e}
                    index={i}
                    isLoading={isLoading}
                    showImage={showImage}
                    showMore={false}
                    showUpdate={false}
                    readLessMore={(x) => {}}
                  />
                </Fragment>
              </section>
            </div>
          ))}
        </div>

        <div className="w-100 text-center mb-5">
          <button
            className="w-auto px-5 py-2 font-18 border rounded-3"
            onClick={() => router.push('/news')}
          >
            {t('common:buttons.show_all')}
          </button>
        </div>
      </div>
    </div>
  );
}
export default RelatedNews;
