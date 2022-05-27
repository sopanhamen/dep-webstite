import AdminListCard from '@shared/components/cards/admin-list-card';
import CmsPageTitle from '@shared/components/cards/cms-page-title';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { StoreState } from 'store/root-reducer';
import CompanyBackgroundForm from './company-background-form';
import { Dispatch } from 'redux';
import {
  ICompanyBackgroundBody,
  ICompanyBackgroundForm,
} from './add-company-background';
import { connect } from 'react-redux';
import { MCompanyBackground } from '@shared/models/about-us/company-background';
import CompanyBackgroundActions from 'store/admin/about-us/company-background/company-background.actions';

interface ICompanyBackgroundDetailProps {
  getCompanyBackgrounds: () => void;
  getCompanyBgDetail?: (id: string) => void;
  createCompanyBackground: (body: ICompanyBackgroundBody) => Promise<void>;
  updateCompanyBackground: (
    id: string,
    body: ICompanyBackgroundBody,
  ) => Promise<void>;
  companyBackgroundDetail: ICompanyBackgroundBody;
  companyBackground: MCompanyBackground[];
}

const defaultValues: ICompanyBackgroundForm = {
  imageId: '',
  imageUrl: '',
  titleEn: '',
  titleKh: '',
  descriptionEn: '',
  descriptionKh: '',
};

function CompanyBackgroundDetail(props: ICompanyBackgroundDetailProps) {
  const {
    getCompanyBgDetail,
    updateCompanyBackground,
    getCompanyBackgrounds,
    createCompanyBackground,
    companyBackgroundDetail,
    companyBackground,
  } = props;

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({ defaultValues });

  const [isEdit, setIsEdit] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [companyBgDetail, setCompanyBgDetail] = useState<MCompanyBackground>(
    new MCompanyBackground({}),
  );

  useEffect(() => {
    getCompanyBackgrounds();
  }, []);

  useEffect(() => {
    if (companyBackground?.length) {
      setIsEdit(false);
      setCompanyBgDetail(companyBackground[0]);
      const detail = {
        imageId: companyBgDetail?.imageId,
        imageUrl: companyBgDetail?.imageUrl,
        titleEn: companyBgDetail?.titleEn,
        titleKh: companyBgDetail?.titleKh,
        descriptionEn: companyBgDetail?.descriptionEn,
        descriptionKh: companyBgDetail?.descriptionKh,
      };
      reset(detail);
    } else {
      setIsEdit(true);
      setCompanyBgDetail(new MCompanyBackground({}));
      const detail = {
        imageId: '',
        imageUrl: '',
        titleEn: '',
        titleKh: '',
        descriptionEn: '',
        descriptionKh: '',
      };
      reset(detail);
    }
  }, [companyBackground]);

  const handleButtonChange = () => {
    if (!isEdit) return setIsEdit(true);
    setIsSubmit(true);
    handleSubmit(onSubmit)();
  };

  const onCancel = () => {
    const detail = {
      imageId: companyBgDetail?.imageId,
      imageUrl: companyBgDetail?.imageUrl,
      titleEn: companyBgDetail?.titleEn,
      titleKh: companyBgDetail?.titleKh,
      descriptionEn: companyBgDetail?.descriptionEn,
      descriptionKh: companyBgDetail?.descriptionKh,
    };
    reset(detail);
    setIsEdit(!isEdit);
    setIsSubmit(false);
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

    if (companyBackground?.length) {
      updateCompanyBackground(companyBgDetail?.id, body).then(() => {
        setIsEdit(!isEdit);
      });
    } else {
      createCompanyBackground(body).then(() => {
        setIsEdit(!isEdit);
      });
    }
  };

  return (
    <>
      <AdminListCard>
        <AdminListCard.Header className="d-flex flex-wrap align-items-center justify-content-between">
          <CmsPageTitle title="Company Background" />
          <div className="d-flex flex-wrap align-items-center">
            {companyBackground?.length ? (
              <>
                {isEdit && (
                  <button
                    className="admin-btn-cancel ctrl-mr"
                    onClick={onCancel}
                  >
                    Cancel
                  </button>
                )}
                {
                  <button
                    className="admin-btn-add"
                    onClick={handleButtonChange}
                  >
                    {isEdit ? 'Save' : 'Edit'}
                  </button>
                }
              </>
            ) : (
              <button
                className="admin-btn-add"
                onClick={() => handleSubmit(onSubmit)()}
              >
                Add Company Background
              </button>
            )}
          </div>
        </AdminListCard.Header>
        <hr className="break-line ctrl-mt" />
        <AdminListCard.Body xScrollable={false} className="pt-3">
          <form>
            <CompanyBackgroundForm
              control={control}
              errors={errors}
              watch={watch}
              setValue={setValue}
              reset={reset}
              disabled={!isEdit}
            />
          </form>
        </AdminListCard.Body>
      </AdminListCard>
    </>
  );
}

const mapStateToProps = (state: StoreState) => {
  const { companyBackgroundDetail, companyBackground } =
    state?.aboutUs?.companyBackground;

  return { companyBackgroundDetail, companyBackground };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const {
    getCompanyBackgrounds,
    getCompanyBackgroundDetail,
    updateCompanyBackground,
    createCompanyBackground,
  } = CompanyBackgroundActions;

  return {
    getCompanyBackgrounds: () => dispatch(getCompanyBackgrounds() as any),
    getCompanyBackgroundDetail: (id: string) =>
      dispatch(getCompanyBackgroundDetail(id) as any),
    createCompanyBackground: (body: ICompanyBackgroundBody) =>
      dispatch(createCompanyBackground(body) as any),
    updateCompanyBackground: (id: string, body: ICompanyBackgroundBody) =>
      dispatch(updateCompanyBackground(id, body) as any),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CompanyBackgroundDetail);
