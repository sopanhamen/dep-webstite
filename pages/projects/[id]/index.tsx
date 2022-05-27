import RelatedNews from '@components/project/related-news';
import RelatedProject from '@components/project/related-project';
import RelatedResourceHub from '@components/project/related-resource-hub';
import { ICON_URL } from '@shared/constant';
import { getLanguage, getLocale } from '@shared/custom-function/common';
import { formatISODate } from '@shared/custom-function/conversion';
import { ProjectNewsCardModel } from '@shared/models/project-news-card.model';
import { IProjectDetail } from '@shared/models/project.model';
import { ResourceHubCardModel } from '@shared/models/resource-hub-card.model';
import clsx from 'clsx';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as Redux from 'redux';
import { projectActions } from 'store/admin/project/project.actions';
import { ProjectState } from 'store/admin/project/project.reducers';
import { StoreState } from 'store/root-reducer';

interface IProjectProps extends ProjectState {
  getProjectDetail: (id: string) => void;
  event: IProjectDetail | null;
}

function ProjectDetail({
  getProjectDetail,
  event,
  isFetching,
}: IProjectProps): JSX.Element {
  let { t } = useTranslation();
  const router = useRouter();
  const id = router?.query?.id as string;
  const [relatedProject, setRelatedProject] = useState<ProjectNewsCardModel[]>(
    [],
  );
  const [relatedNews, setRelatedNews] = useState<ProjectNewsCardModel[]>();
  const [relatedResourceHub, setRelatedResourceHub] =
    useState<ResourceHubCardModel[]>();
  const language = getLanguage();

  useEffect(() => {
    if (id) getProjectDetail(id);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const prods = event?.relatedProjects?.map((d, i) => {
      return {
        className: 'mw-100 w-100 relate-card mb-3',
        description: d?.description,
        id: d?.id,
        lastUpdate: false || '',
        lineClamp: 3,
        readMore: false,
        tag: d?.pillar,
        title: d?.name,
        status: d?.status,
        locale: d?.locale,
        pillar: d?.pillar,
      };
    }) as ProjectNewsCardModel[];

    setRelatedProject(prods);

    const prodsNews = event?.relatedNews?.map((n) => {
      return {
        className: 'relate-card-new mw-100 w-100 relate-card mb-3',
        description: n?.description,
        imageUrl: '/assets/flags/cambodia.webp',
        lastUpdate: false || '',
        lineClamp: 3,
        readMore: false,
        tag: n?.pillar,
        status: n?.status,
        locale: n?.locale,
        pillar: n?.pillar,
      };
    }) as ProjectNewsCardModel[];

    setRelatedNews(prodsNews);

    const prodsResourceHub = event?.relatedResourceHubs?.map((r) => {
      return {
        className: 'mw-100 relate-card mb-3 resourceHub-card',
        description: false || '',
        imageUrl: r?.imageUrl || ICON_URL.BROKEN,
        languages: r?.languages || ICON_URL.BROKEN,
        extensions: r?.extensions,
        resourceOrg: r?.resourceOrg,
        publishedAt: r?.publishedAt,
        lineClamp: 3,
        tag: r?.tagIconUrl,
        title: r?.title,
        locale: r?.locale,
      };
    }) as ResourceHubCardModel[];

    setRelatedResourceHub(prodsResourceHub);
  }, [event]);

  return (
    <section className="section-detail py-5">
      <div className="container">
        <h4
          className="m-b-20 color-blue fw-bold wow fadeIn"
          data-wow-delay=".30s"
        >
          {getLocale(event?.locale?.en?.name, event?.locale?.km?.name)}
        </h4>
        <img
          src={ICON_URL.BROKEN_RECTANGLE || event?.imageUrl}
          alt="photo"
          className="img-fluid w-100 detail-image"
        />

        <div className="header-detail my-4">
          <div className="d-flex justify-content-between">
            <div>
              <div className="mb-2">
                <h6 className="fw-bold mb-1">
                  {t('common:project.project_name')}
                </h6>
                <p>
                  {' '}
                  {getLocale(event?.locale?.en?.name, event?.locale?.km?.name)}
                </p>
              </div>
              <div className="mb-2">
                <h6 className="fw-bold mb-1">{t('common:project.sector')}</h6>
                <p>{event?.sectors?.map((e) => e?.name)}</p>
              </div>
              <div className="mb-2">
                <h6 className="fw-bold mb-1">
                  {t('common:project.project_duration')}
                </h6>
                <p>{event?.duration}</p>
              </div>
              <div className="mb-2">
                <h6 className="fw-bold mb-1">
                  {t('common:project.start_date')}
                </h6>
                <p>{formatISODate(event?.startDate)}</p>
              </div>
              <div className="mb-2">
                <h6 className="fw-bold mb-1">{t('common:project.end_date')}</h6>
                <p>{formatISODate(event?.endDate)}</p>
              </div>
            </div>
            <div>
              <div className="mb-2">
                <h6 className="fw-bold mb-1">{t('common:project.status')}</h6>
                <p
                  className={`py-1 px-2 rounded-1 font-10 w-fit-content text-center text-capitalize bg-gradient-${event?.status?.toLowerCase()} color-${event?.status?.toLowerCase()}`}
                >
                  {event?.status}
                </p>
              </div>
              <div className="mb-2">
                <h6 className="fw-bold mb-1">{t('common:project.pillar')}</h6>
                <p
                  className={clsx(
                    'py-1 px-2 rounded-1 w-fit-content text-center font-10',
                    event?.pillar?.name === 'Digital Citizen'
                      ? 'bg-gradient-planning color-planning'
                      : '',
                    event?.pillar?.name === 'Digital Government'
                      ? 'bg-gradient-active color-blue'
                      : 'bg-gradient-delete color-delete',
                  )}
                >
                  {event?.pillar?.name}
                </p>
              </div>
              <div className="mb-2">
                <h6 className="fw-bold mb-1">
                  {t('common:project.project_owner')}
                </h6>
                <p className={clsx('py-1 text-left font-10')}>
                  {event?.owners?.map((e, i) => (
                    <span key={i}>{e?.name}</span>
                  ))}
                </p>
              </div>
              <div className="mb-2">
                <h6 className="fw-bold mb-1">
                  {t('common:project.implement_partner')}
                </h6>
                <p className={clsx('py-1 text-left font-10')}>
                  {event?.partners?.map((e, i) => (
                    <span key={i}>{e?.name}</span>
                  ))}
                </p>
              </div>
            </div>

            <div>
              <img
                src={event?.tagIconUrl || ICON_URL.BROKEN}
                alt="icon"
                className="img-fluid"
              />
            </div>
          </div>
        </div>

        <div className="list mb-4">
          <div
            dangerouslySetInnerHTML={{
              __html:
                getLocale(
                  event?.locale?.en?.description,
                  event?.locale?.km?.description,
                ) + '',
            }}
          ></div>
        </div>
      </div>

      {relatedProject?.length ? (
        <RelatedProject
          data={relatedProject}
          isLoading={isFetching}
          showImage={true}
          loadingCards={4}
        />
      ) : null}

      {relatedResourceHub?.length ? (
        <RelatedResourceHub
          data={relatedResourceHub}
          isLoading={isFetching}
          showImage={false}
          loadingCards={4}
        />
      ) : null}

      {relatedNews?.length ? (
        <RelatedNews
          data={relatedNews}
          isLoading={isFetching}
          showImage={false}
          loadingCards={4}
        />
      ) : null}
    </section>
  );
}

const mapStateToProps = (store: StoreState) => {
  const projectDetail = store?.project?.projectDetail;
  return {
    event: projectDetail,
  };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch) => {
  const { getProjectDetail } = projectActions;

  return {
    getProjectDetail: (id: string) => dispatch(getProjectDetail(id) as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetail);
