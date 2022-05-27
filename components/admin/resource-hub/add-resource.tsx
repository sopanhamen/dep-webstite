import ModificationModal from '@shared/components/modals/modification-modal';
import React, { useEffect, useState } from 'react';
import { IDefaultForm } from '@shared/interfaces';
import { MLocaleParent } from '@shared/models/common.model';
import moment from 'moment';
import { useFieldArray, useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import * as Redux from 'redux';
import ResourceHubActions from 'store/admin/resource-hub/resource-hub.action';
import { IResourceMetadata } from '@shared/interfaces/resource-hub';
import ResourceForm from './resource-form';

interface IAddResourceHubProps {
  isShow: boolean;
  onClose: () => void;
  createResource: (body: IResourceHubBody) => Promise<void>;
}

export interface IResourceHubBody {
  title?: string;
  description?: string;
  resourceOrg?: string;
  publishedBy?: string;
  publishedAt?: string;
  pillar?: string;
  sectors?: [];
  stakeholders?: [];
  languages?: [];
  files?: IFileBody[];
  imageId?: string;
  metadata?: {
    additionalInfos: IResourceMetadata[];
  };
  locale?: MLocaleParent;
}

interface IFileBody {
  fileId?: string;
  referenceFileTypes?: [];
  isPreview?: boolean;
}

export interface IResourceHubForm extends Partial<IDefaultForm> {
  publicDate?: string | Date;
  reference?: string;
  language?: [];
  publishedBy?: string;
  pillar?: string;
  sector?: [];
  stakeholder?: [];
  imageId?: string;
  imageUrl?: string;
  uploadFiles?: IFileUploadForm[];
  additionalInfo?: IAdditionalInfoForm[];
}

export interface IFileUploadForm {
  id?: string;
  url?: string;
  name?: string;
  originalName?: string;
  fileId?: string;
  referenceFileType?: [];
}

export interface IAdditionalInfoForm {
  en: IChildAdditionalInfoForm;
  km: IChildAdditionalInfoForm;
}

export interface IChildAdditionalInfoForm {
  label?: string;
  value?: string;
}

const defaultValues: IResourceHubForm = {
  titleEn: '',
  titleKh: '',
  descriptionEn: '',
  descriptionKh: '',
  publicDate: '',
  reference: '',
  language: [],
  publishedBy: '',
  pillar: '',
  sector: [],
  stakeholder: [],
  imageId: '',
  imageUrl: '',
  uploadFiles: [],
  additionalInfo: [],
};

function AddResource(props: IAddResourceHubProps) {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({ defaultValues });

  const uploadFileArray = useFieldArray({
    control,
    name: 'uploadFiles',
  });

  const additionalInfo = useFieldArray({
    control,
    name: 'additionalInfo',
  });

  const { isShow, onClose, createResource } = props;
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    reset();
    setIsSubmit(false);
  }, [onClose]);

  const handleCloseModal = () => {
    onClose();
  };

  const onSubmit = (formData: IResourceHubForm) => {
    if (!formData?.uploadFiles?.length) return;

    const additionalForm = formData?.additionalInfo?.map(
      (item: IAdditionalInfoForm) => {
        return {
          field: item?.en?.label,
          value: item?.en?.value,
          locale: {
            en: {
              field: item?.en?.label,
              value: item?.en?.value,
            },
            km: {
              field: item?.km?.label,
              value: item?.km?.value,
            },
          },
        };
      },
    );

    const newFile =
      formData?.uploadFiles?.length &&
      formData?.uploadFiles.map((f: IFileUploadForm) => {
        return {
          fileId: f?.fileId,
          referenceFileTypes: f?.referenceFileType || [],
        };
      });

    const body = {
      title: formData?.titleEn,
      description: formData?.descriptionEn,
      resourceOrg: formData?.reference,
      publishedBy: formData?.publishedBy,
      publishedAt: formData?.publicDate
        ? moment(formData.publicDate).toISOString()
        : '',
      pillar: formData?.pillar,
      sectors: formData?.sector || [],
      stakeholders: formData?.stakeholder || [],
      languages: formData?.language || [],
      files: newFile,
      imageId: formData?.imageId || '',
      metadata: {
        additionalInfos: additionalForm,
      },
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
    } as IResourceHubBody;

    !additionalForm?.length && delete body.metadata;

    createResource(body).then(() => {
      onClose();
      reset();
    });
  };

  return (
    <ModificationModal
      title="Add Resource"
      isShow={isShow}
      onClose={handleCloseModal}
      size="xl"
    >
      <ModificationModal.Body>
        <form
          onSubmit={() => {
            handleSubmit(onSubmit)();
            setIsSubmit(true);
          }}
        >
          <ResourceForm
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
            uploadFileArray={uploadFileArray}
            additionalInfoArray={additionalInfo}
            isSubmit={isSubmit}
          />
        </form>
      </ModificationModal.Body>
      <ModificationModal.Footer>
        <button
          className="admin-btn-add bth-submit mt-2"
          type="submit"
          onClick={() => {
            handleSubmit(onSubmit)();
            setIsSubmit(true);
          }}
        >
          Add
        </button>
      </ModificationModal.Footer>
    </ModificationModal>
  );
}

const mapDispatchToProps = (dispatch: Redux.Dispatch) => {
  const { createResourceHub } = ResourceHubActions;

  return {
    createResource: (body: IResourceHubBody) =>
      dispatch(createResourceHub(body) as any),
  };
};

export default connect(null, mapDispatchToProps)(AddResource);
