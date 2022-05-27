import NewsForm, {
  defaultNewsFormValues,
} from '@components/admin/news/news-form';
import AdminListCard from '@shared/components/cards/admin-list-card';
import CmsPageTitle from '@shared/components/cards/cms-page-title';
import AppLoading from '@shared/components/loadings/app-loading';
import { INewsAPIBody, MNewsForm } from '@shared/models/news.model';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { newsActions } from 'store/admin/news/news.actions';
import { NewsState } from 'store/admin/news/news.reducers';
import { StoreState } from 'store/root-reducer';

interface ICMSNewDetailsProps extends NewsState {
  getNewsDetail: (id: string) => void;
  updateNews: (id: string, body: INewsAPIBody) => Promise<void>;
}

function CMSNewDetails({
  isFetching = false,
  isSubmitting = false,
  newsDetail,
  getNewsDetail,
  updateNews,
}: ICMSNewDetailsProps) {
  const router = useRouter();
  const id = router?.query?.id as string;
  const [editable, setEditable] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: defaultNewsFormValues });

  const refreshPage = () => {
    setEditable(false);
    if (!id) return;
    getNewsDetail(id);
  };

  const cancelEdit = () => {
    refreshPage();
  };

  const submit = (formData: MNewsForm) => {
    if (!formData) return;
    const body: INewsAPIBody = {
      title: formData?.titleEn,
      description: formData?.descriptionEn,
      pillar: formData?.pillar,
      publishedAt: moment(formData?.publishedAt).startOf('day').toISOString(),
      locale: {
        en: {
          title: formData?.titleEn,
          description: formData?.descriptionEn,
          sourceOrg: formData?.sourceLinkEn,
        },
        km: {
          title: formData?.titleKh,
          description: formData?.descriptionKh,
          sourceOrg: formData?.sourceLinkKh,
        },
      },
    };

    updateNews(newsDetail?.id + '', body).then((r) => {
      refreshPage();
    });
  };

  useEffect(() => {
    refreshPage();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!newsDetail) return;
    const news = new MNewsForm(newsDetail);
    reset(news);
  }, [newsDetail]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="position-relative">
      <AdminListCard>
        <AdminListCard.Header>
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <CmsPageTitle title="News Detail" hasBackIcon />
            <div>
              {editable ? (
                <>
                  <button
                    className="admin-btn-cancel ctrl-mr"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                  <button
                    className="admin-btn-save"
                    onClick={handleSubmit(submit)}
                    disabled={isSubmitting}
                  >
                    Save
                  </button>
                </>
              ) : (
                <button
                  className="admin-btn-edit"
                  onClick={() => setEditable(!editable)}
                  disabled={!id || isFetching}
                >
                  Edit
                </button>
              )}
            </div>
          </div>
          <hr className="break-line ctrl-mt mx-n3" />
        </AdminListCard.Header>
        <AdminListCard.Body xScrollable={false}>
          <NewsForm control={control} errors={errors} editable={editable} />
        </AdminListCard.Body>
      </AdminListCard>
      {isFetching && <AppLoading />}
    </div>
  );
}

const mapStateToProps = (store: StoreState) => {
  return { ...store.news };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const { getCMSNewsDetail, updateNews } = newsActions;

  return {
    getNewsDetail: (id: string) => dispatch(getCMSNewsDetail(id) as any),
    updateNews: (id: string, body: INewsAPIBody) =>
      dispatch(updateNews(id, body) as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CMSNewDetails);
