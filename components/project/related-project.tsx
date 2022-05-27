import ProjectNewsCard from '@shared/components/cards/projects-news';
import { IProjectNewsCardCommon } from '@shared/interfaces';
import { ProjectNewsCardModel } from '@shared/models/project-news-card.model';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';

interface IRelatedProject extends IProjectNewsCardCommon {
  data: ProjectNewsCardModel[];
  loadingCards: number;
}

function RelatedProject({
  data,
  isLoading,
  loadingCards = 4,
  showImage,
}: IRelatedProject): JSX.Element {
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
            {t('common:related.related_project')}
          </h4>
          <div className="border-bottom"></div>
        </div>

        <section className="project">
          <div className="row my-4">
            {currentData.map((e, i) => (
              <div className="col-12 col-md-6" key={i}>
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
              </div>
            ))}
          </div>
        </section>

        <div className="w-100 text-center mb-5">
          <button
            className="w-auto px-5 py-2 font-18 border rounded-3 cursor-pointer"
            onClick={() => router.push('/projects')}
          >
            {t('common:buttons.show_all')}
          </button>
        </div>
      </div>
    </div>
  );
}
export default RelatedProject;
