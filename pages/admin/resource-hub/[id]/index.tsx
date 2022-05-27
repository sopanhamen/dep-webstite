import {
  IAdditionalInfoForm,
  IFileUploadForm,
  IResourceHubBody,
  IResourceHubForm,
} from '@components/admin/resource-hub/add-resource';
import ResourceForm from '@components/admin/resource-hub/resource-form';
import AdminListCard from '@shared/components/cards/admin-list-card';
import CmsPageTitle from '@shared/components/cards/cms-page-title';
import { covertToStringArray } from '@shared/custom-function/conversion';
import {
  IResourceHub,
  IResourceMetadata,
} from '@shared/interfaces/resource-hub';
import { APIServices } from '@shared/services/api.service';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import * as Redux from 'redux';
import ResourceHubActions from 'store/admin/resource-hub/resource-hub.action';
import { StoreState } from 'store/root-reducer';

interface IResourceHubProps {
  getResourceHubDetail: (id: string) => void;
  updateResource: (id: string, body: IResourceHubBody) => Promise<void>;
  resource: IResourceHub;
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
  uploadFiles: [
    {
      id: '',
      fileId: '',
      url: '',
      name: '',
      originalName: '',
      referenceFileType: [],
    },
  ],
  additionalInfo: [],
};

function ResourceHubDetail(props: IResourceHubProps) {
  const { getResourceHubDetail, updateResource, resource } = props;

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

  const ac = new AbortController();
  const router = useRouter();
  const id = router?.query?.id as string;
  const [isEdit, setIsEdit] = useState(false);
  const [filesDetail, setFilesDetail] = useState<IFileUploadForm[]>([]);
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    if (id) getResourceHubDetail(id);
    setIsSubmit(false);
    return () => {
      APIServices.axiosCancelToken();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const newFiles =
      resource?.files?.length &&
      resource?.files.map((x: any) => {
        return {
          id: x?.fileId || '',
          url: x?.fileUrl || '',
          name: x?.name || '',
          originalName: x?.name || '',
          fileId: x?.fileId || '',
          referenceFileType: x?.referenceFileTypes || [],
        };
      });

    newFiles && setFilesDetail(newFiles);

    const setAdditionalForm = resource?.metadata?.additionalInfos?.map(
      (item: IResourceMetadata) => {
        return {
          en: {
            label: item?.locale?.en?.field,
            value: item?.locale?.en?.value,
          },
          km: {
            label: item?.locale?.km?.field,
            value: item?.locale?.km?.value,
          },
        };
      },
    );

    const detail = {
      titleEn: resource?.locale?.en?.title || '',
      titleKh: resource?.locale?.km?.title || '',
      descriptionEn: resource?.locale?.en?.description || '',
      descriptionKh: resource?.locale?.km?.description || '',
      publicDate: resource?.publishedAt ? new Date(resource?.publishedAt) : '',
      reference: resource?.resourceOrg?.code || '',
      language: covertToStringArray(resource?.languages) || [],
      publishedBy: resource?.publishedBy?.code || '',
      pillar: resource?.pillar?.code || '',
      sector: covertToStringArray(resource?.sectors) || [],
      stakeholder: covertToStringArray(resource?.stakeholders) || [],
      uploadFiles: newFiles,
      imageId: resource?.imageId || '',
      imageUrl: resource?.imageUrl || '',
      additionalInfo: setAdditionalForm || [],
    } as IResourceHubForm;

    reset(detail);

    return () => {
      ac.abort();
    };
  }, [resource]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleButtonChange = () => {
    if (!isEdit) return setIsEdit(true);
    setIsSubmit(true);
    handleSubmit(onSubmit)();
  };

  const onSubmit = (formData: IResourceHubForm) => {
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

    updateResource(id, body).then(() => {
      setIsEdit(!isEdit);
      setIsSubmit(false);
      getResourceHubDetail(id);
    });
  };

  const onCancel = () => {
    setIsEdit(!isEdit);
    setIsSubmit(false);
    getResourceHubDetail(id);
  };

  return (
    <>
      <AdminListCard>
        <AdminListCard.Header className="d-flex flex-wrap align-items-center justify-content-between">
          <CmsPageTitle title="Resource Hub Detail" hasBackIcon />
          <div className="d-flex flex-wrap align-items-center">
            {isEdit && (
              <button className="admin-btn-cancel ctrl-mr" onClick={onCancel}>
                Cancel
              </button>
            )}
            <button className="admin-btn-add" onClick={handleButtonChange}>
              {isEdit ? 'Save' : 'Edit'}
            </button>
          </div>
        </AdminListCard.Header>
        <hr className="break-line ctrl-mt" />
        <AdminListCard.Body xScrollable={false} className="pt-3">
          <form>
            <ResourceForm
              control={control}
              errors={errors}
              watch={watch}
              setValue={setValue}
              reset={reset}
              disabled={!isEdit}
              uploadFileArray={uploadFileArray}
              filesDetail={filesDetail || []}
              additionalInfoArray={additionalInfo}
              isSubmit={isSubmit}
            />
          </form>
        </AdminListCard.Body>
      </AdminListCard>
    </>
  );
}

const mapStateToProps = (store: StoreState) => {
  const { resourceHubDetail } = store?.resourceHub;

  return {
    resource: resourceHubDetail,
  };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch) => {
  const { getResourceHubDetail, updateResourceHub } = ResourceHubActions;

  return {
    getResourceHubDetail: (id: string) =>
      dispatch(getResourceHubDetail(id) as any),
    updateResource: (id: string, body: IResourceHubBody) =>
      dispatch(updateResourceHub(id, body) as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResourceHubDetail);
