import ModificationModal from '@shared/components/modals/modification-modal';
import React from 'react';
import NewsForm, {
  defaultNewsFormValues,
} from '@components/admin/news/news-form';
import { useForm } from 'react-hook-form';
import { StoreState } from 'store/root-reducer';
import { Dispatch } from 'redux';
import { newsActions } from 'store/admin/news/news.actions';
import { INewsAPIBody, MNewsForm } from '@shared/models/news.model';
import { NewsState } from 'store/admin/news/news.reducers';
import { connect } from 'react-redux';
import moment from 'moment';

interface ICreateNewsModalProps extends NewsState {
  isShow?: boolean;
  onClose?: (isSuccessful: boolean) => void;
  createNews: (body: INewsAPIBody) => Promise<void>;
}

function CreateNewsModal({
  isSubmitting = false,
  isShow = false,
  onClose,
  createNews,
}: ICreateNewsModalProps) {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: defaultNewsFormValues });

  const resetAndClose = (isSuccessful: boolean) => {
    reset(defaultNewsFormValues);
    onClose && onClose(isSuccessful);
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

    createNews(body).then(() => {
      resetAndClose(true);
    });
  };

  return (
    <>
      <ModificationModal
        title="Add News"
        isShow={isShow}
        onClose={() => {
          resetAndClose(false);
        }}
        size="xl"
      >
        <ModificationModal.Body>
          <NewsForm control={control} errors={errors} editable={true} />
        </ModificationModal.Body>
        <ModificationModal.Footer>
          <div className="text-center">
            <button
              className="admin-btn-add mx-auto"
              onClick={handleSubmit(submit)}
              disabled={isSubmitting}
            >
              Add
            </button>
          </div>
        </ModificationModal.Footer>
      </ModificationModal>
    </>
  );
}

const mapStateToProps = (store: StoreState) => {
  return { ...store.news };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const { createNews } = newsActions;

  return {
    createNews: (body: INewsAPIBody) => dispatch(createNews(body) as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateNewsModal);
