import ModificationModal from '@shared/components/modals/modification-modal';
import { IDefaultForm } from '@shared/interfaces';
import { MLocaleParent } from '@shared/models/common.model';
import React from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import * as Redux from 'redux';
import CompanyBackgroundActions from 'store/admin/about-us/company-background/company-background.actions';
import CompanyBackgroundForm from './company-background-form';

interface IAddCompanyBackgroundProps {
  isShow: boolean;
  onClose: () => void;
  createCompanyBackground: (body: ICompanyBackgroundBody) => Promise<void>;
}

export interface ICompanyBackgroundBody {
  title?: string;
  description?: string;
  imageId?: string;
  type?: string;
  locale?: MLocaleParent;
  alias?: string;
}

export interface ICompanyBackgroundForm extends Partial<IDefaultForm> {
  imageId?: string;
  imageUrl?: string;
}

const defaultValues: ICompanyBackgroundForm = {
  imageId: '',
  imageUrl: '',
  titleEn: '',
  titleKh: '',
  descriptionEn: '',
  descriptionKh: '',
};

function AddCompanyBackground(props: IAddCompanyBackgroundProps) {
  const { isShow, onClose, createCompanyBackground } = props;

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({ defaultValues });

  const handleCloseModal = () => {
    onClose();
  };

  const onSubmit = (formData: ICompanyBackgroundForm) => {
    const body = {
      title: formData?.titleEn,
      description: formData?.descriptionEn,
      imageId: formData?.imageId,
      type: 'ABOUT-US',
      locale: {
        en: {
          title: formData?.titleEn,
          description: formData?.descriptionEn,
        },
        km: {
          title: formData?.titleKh,
          description: formData?.descriptionKh,
        },
      },
    } as ICompanyBackgroundBody;

    createCompanyBackground(body).then(() => {
      onClose();
      reset();
    });
  };

  return (
    <ModificationModal
      title="Add Company Background"
      isShow={isShow}
      onClose={handleCloseModal}
      size="lg"
    >
      <ModificationModal.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CompanyBackgroundForm
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />
        </form>
      </ModificationModal.Body>
      <ModificationModal.Footer>
        <button
          className="admin-btn-add bth-submit"
          type="submit"
          onClick={() => handleSubmit(onSubmit)()}
        >
          Add
        </button>
      </ModificationModal.Footer>
    </ModificationModal>
  );
}

const mapDispatchToProps = (dispatch: Redux.Dispatch) => {
  const { createCompanyBackground } = CompanyBackgroundActions;

  return {
    createCompanyBackground: (body: ICompanyBackgroundBody) =>
      dispatch(createCompanyBackground(body) as any),
  };
};

export default connect(null, mapDispatchToProps)(AddCompanyBackground);
