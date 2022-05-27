import DatePicker from '@shared/components/datePicker';
import BaseInput from '@shared/components/form/base-input';
import BaseSelect from '@shared/components/form/base-select-creatable';
import ModificationModal from '@shared/components/modals/modification-modal';
import Quill from '@shared/components/rich-text-editor';
import UploadImages from '@shared/components/upload-image/upload-images';
import { removeFalseyObject } from '@shared/custom-function/common';
import {
  covertToStringArray,
  selectCreatableToStringArray,
} from '@shared/custom-function/conversion';
import { ELanguage, EStatus } from '@shared/enum';
import { EClassification } from '@shared/enum/classification.enum';
import { ICommonQueries } from '@shared/interfaces';
import { MSelectOption, MSelectOptionCode } from '@shared/models/common.model';
import { MImage } from '@shared/models/image-model';
import { IProjectForm, Project } from '@shared/models/project.model';
import { FormService } from '@shared/services/form.service';
import clsx from 'clsx';
import * as _ from 'lodash';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import * as Redux from 'redux';
import classificationActions from 'store/admin/classification/classification.action';
import { projectActions } from 'store/admin/project/project.actions';
import AuthAction from 'store/auth/auth.action';
import { StoreState } from 'store/root-reducer';

// ============ static data ==============
const defaultValues: IProjectForm = {};

type AddProjectPick = Pick<
  Project,
  | 'description'
  | 'endDate'
  | 'imageId'
  | 'locale'
  | 'name'
  | 'startDate'
  | 'tagIconId'
>;

export interface IAddProjectPayload extends AddProjectPick {
  owners: string[];
  partners: string[];
  pillar: string;
  projectStatus: string;
  sectors: string[];
}

interface IAddProject {
  isBeingEdited?: boolean;
  isCreateDone?: boolean;
  isDetailsPage?: boolean;
  isSubmitting?: boolean;
  organizationNames?: MSelectOption[];
  pillars?: MSelectOption[];
  projectInfoCMS?: Project;
  projectStatus?: MSelectOption[];
  sectors?: MSelectOption[];
  closeModal?: () => void;
  createProject: (body: IAddProjectPayload) => Promise<void>;
  getPillars: () => void;
  getProjectNames: (payload: ICommonQueries) => void;
  getProjectStatus: () => void;
  getSectors: () => void;
  isEditDone?: () => void;
  updateProjectDetailIdCMS: (
    id: string,
    payload: IAddProjectPayload,
  ) => Promise<void>;
  addProjectRef?: any;
}

function AddProject({
  isBeingEdited,
  isCreateDone,
  isDetailsPage = false,
  isSubmitting,
  organizationNames,
  pillars,
  projectInfoCMS,
  projectStatus,
  sectors,
  addProjectRef,
  closeModal,
  createProject,
  getPillars,
  getProjectNames,
  getProjectStatus,
  getSectors,
  isEditDone,
  updateProjectDetailIdCMS,
}: IAddProject) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm({ defaultValues });

  const [imgProject, setImgProject] = useState<MImage>(new MImage({}));

  const [iconProject, setIconProject] = useState<MImage>(new MImage({}));

  const [minEndDate, setMinEndDate] = useState<Date>(new Date());

  const router = useRouter();
  const { id } = router.query;
  const ac = new AbortController();

  useEffect(() => {
    // user select options
    if (getSectors && !sectors?.length) getSectors();
    if (getPillars && !pillars?.length) getPillars();
    if (getProjectStatus && !projectStatus?.length) getProjectStatus();

    const payload: ICommonQueries = {
      statuses: `${EStatus.ACTIVE}|${EStatus.INACTIVE}`,
    };

    getProjectNames(payload);

    if (!isDetailsPage) return;
    addProjectRef.current = handleSubmit(onSubmit);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isCreateDone) closeModal && closeModal();
  }, [isCreateDone]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isDetailsPage && projectInfoCMS) {
      const valueConstant = { name: '', originalName: '', status: '' };

      const mainImage: MImage = {
        ...valueConstant,
        id: projectInfoCMS.imageId,
        url: projectInfoCMS.imageUrl,
      };

      const tagImage: MImage = {
        ...valueConstant,
        id: projectInfoCMS.tagIconId,
        url: projectInfoCMS.tagIconUrl,
      };

      setImgProject(mainImage);
      setIconProject(tagImage);

      if (projectInfoCMS?.endDate && projectInfoCMS?.startDate) {
        setValue('endDate', new Date(projectInfoCMS?.endDate));
        setValue('startDate', new Date(projectInfoCMS?.startDate));
      }

      setValue('tagIconId', projectInfoCMS?.tagIconId);
      setValue('imageId', projectInfoCMS?.imageId);
      setValue('locale.km.name', String(projectInfoCMS.locale?.km?.name));
      setValue('locale.en.name', String(projectInfoCMS.locale?.en?.name));
      setValue('duration', String(projectInfoCMS.duration));
      setValue('sectors', covertToStringArray(projectInfoCMS.sectors, 'value'));
      setValue('projectStatus', projectInfoCMS.projectStatus);
      setValue('owners', covertToStringArray(projectInfoCMS.owners, 'value'));
      setValue(
        'partners',
        covertToStringArray(projectInfoCMS.partners, 'value'),
      );
      setValue('pillar', projectInfoCMS.pillar);
      setValue(
        'locale.km.description',
        String(projectInfoCMS.locale.km?.description),
      );
      setValue(
        'locale.en.description',
        String(projectInfoCMS.locale.en?.description),
      );
    }
  }, [projectInfoCMS]); // eslint-disable-line react-hooks/exhaustive-deps

  //  functions section

  const onSubmit = (formData: Project) => {
    const payload: Required<IAddProjectPayload> = {
      ...formData,
      description: String(formData.locale.en?.description),
      name: String(formData.locale.en?.name),
      owners: formData.owners as any[],
      partners: formData.partners as any[],
      pillar: _.isObject(formData.pillar)
        ? formData.pillar.value
        : formData.pillar,
      projectStatus: _.isObject(formData.projectStatus)
        ? formData.projectStatus.value
        : formData.projectStatus,
      sectors: selectCreatableToStringArray(formData.sectors),
      tagIconId: formData?.tagIconId,
      imageId: formData?.imageId,
    };

    const format = removeFalseyObject(payload) as IAddProjectPayload;

    // remove duaration
    _.omit(format, 'duration');

    isEditDone && isEditDone();

    isDetailsPage
      ? updateProjectDetailIdCMS(String(id), format).then(() => {
          router.replace(router.asPath);
        })
      : createProject(format).then(() => {
          reset(defaultValues);
          closeModal && closeModal();
        });
  };

  const handleImageChange = (data: MImage, type: string) => {
    if (type === 'logo') {
      setIconProject(data);
      setValue('tagIconId', data.id);
    } else {
      setImgProject(data);
      setValue('imageId', data.id);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="col-md-12 col-sm-12">
          <div className="row">
            <div className="col-md-5 col-sm-12">
              <UploadImages
                imageData={(e: MImage) => {
                  handleImageChange(e, 'image');
                }}
                label="Image"
                className="width-300 rounded-1"
                imageSrc={imgProject?.url}
                imageAlt={imgProject?.name}
                disabled={!isBeingEdited}
              />
            </div>
          </div>
        </div>

        <div className="col-md-6 col-sm-12">
          <Controller
            name="locale.km.name"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field: { ref, value, onChange } }: any) => (
              <BaseInput
                disabled={!isBeingEdited}
                label="Project Name Kh"
                refs={ref}
                value={value}
                onChange={onChange}
                helperText={FormService.getErrorMessage(
                  errors,
                  'locale.km.name',
                  'Project Name Kh',
                )}
              />
            )}
          />
        </div>

        <div className="col-md-6 col-sm-12">
          <Controller
            name="locale.en.name"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field: { ref, value, onChange } }: any) => (
              <BaseInput
                disabled={!isBeingEdited}
                label="Project Name Eng"
                className="mb-3"
                refs={ref}
                value={value}
                onChange={onChange}
                helperText={FormService.getErrorMessage(
                  errors,
                  'locale.en.name',
                  'Project Name Eng',
                )}
              />
            )}
          />
        </div>

        <div className="col-md-6 col-sm-12">
          <Controller
            name="startDate"
            control={control}
            defaultValue={undefined}
            rules={{ required: true }}
            render={({ field: { value, onChange } }: any) => (
              <DatePicker
                isDisabled={!isBeingEdited}
                label="Start Date"
                onChange={(d: any) => {
                  onChange(d);
                  setMinEndDate(d);
                  setValue('endDate', '');
                }}
                value={value}
                dateFormat={'dd MMM, yyyy'}
                className="floating-label"
                helperText={FormService.getErrorMessage(
                  errors,
                  'startDate',
                  'Starte Date',
                )}
              />
            )}
          />
        </div>

        <div className="col-md-6 col-sm-12">
          <Controller
            name="endDate"
            control={control}
            defaultValue={undefined}
            rules={{
              required: true,
            }}
            render={({ field: { value, onChange } }: any) => (
              <DatePicker
                isDisabled={!isBeingEdited}
                label="End Date"
                onChange={(d: any) => {
                  onChange(d);

                  // make suer time value is converted
                  const min = moment(minEndDate);
                  const max = moment(d);

                  // compute the diff in days
                  const diff = max.diff(min, 'days');

                  // check what to displays
                  const display = diff > 1 ? 'days' : 'day';

                  // set the value
                  setValue('duration', `${diff} ${display}`);
                }}
                value={value}
                minDate={minEndDate}
                dateFormat={'dd MMM, yyyy'}
                className="floating-label"
                helperText={FormService.getErrorMessage(
                  errors,
                  'endDate',
                  'End Date',
                )}
              />
            )}
          />
        </div>

        {isDetailsPage && (
          <div className="col-md-6 col-sm-12">
            <Controller
              name="duration"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field: { ref, value } }: any) => (
                <BaseInput
                  label="Duration"
                  className="mb-3"
                  refs={ref}
                  value={value}
                  disabled={true}
                />
              )}
            />
          </div>
        )}
        <div className="col-md-6 col-sm-12">
          <Controller
            name="sectors"
            control={control}
            defaultValue={undefined}
            rules={{ required: true }}
            render={({ field: { ref, value, onChange } }: any) => (
              <BaseSelect
                disabled={!isBeingEdited}
                label="Sector"
                className="mb-3"
                refs={ref}
                value={value}
                options={sectors}
                onChange={onChange}
                isMulti={true}
                isCreatable={true}
                helperText={FormService.getErrorMessage(
                  errors,
                  'sectors',
                  'Sector',
                )}
              />
            )}
          />
        </div>

        <div className="col-md-6 col-sm-12">
          <Controller
            name="projectStatus"
            control={control}
            defaultValue={undefined}
            rules={{ required: true }}
            render={({ field: { ref, value, onChange } }: any) => (
              <BaseSelect
                disabled={!isBeingEdited}
                label="Project Status"
                className="mb-3"
                refs={ref}
                value={value}
                onChange={onChange}
                options={projectStatus}
                isCreatable={true}
                helperText={FormService.getErrorMessage(
                  errors,
                  'projectStatus',
                  'Project status',
                )}
              />
            )}
          />
        </div>

        <div className="col-md-6 col-sm-12">
          <Controller
            name="owners"
            control={control}
            defaultValue={undefined}
            rules={{ required: true }}
            render={({ field: { ref, value, onChange } }: any) => (
              <BaseSelect
                disabled={!isBeingEdited}
                label="Project Owner"
                className="mb-3"
                refs={ref}
                value={value}
                onChange={onChange}
                options={organizationNames}
                isMulti={true}
                helperText={FormService.getErrorMessage(
                  errors,
                  'owners',
                  'Project owner',
                )}
              />
            )}
          />
        </div>

        <div className="col-md-6 col-sm-12">
          <Controller
            name="partners"
            control={control}
            defaultValue={undefined}
            rules={{ required: true }}
            render={({ field: { ref, value, onChange } }: any) => (
              <BaseSelect
                disabled={!isBeingEdited}
                label="Implementation Partners"
                className="mb-3"
                refs={ref}
                value={value}
                onChange={onChange}
                options={organizationNames}
                isMulti={true}
                helperText={FormService.getErrorMessage(
                  errors,
                  'partners',
                  'Implementation Partners',
                )}
              />
            )}
          />
        </div>

        <div className="col-md-6 col-sm-12">
          <Controller
            name="pillar"
            control={control}
            defaultValue={undefined}
            rules={{ required: true }}
            render={({ field: { ref, value, onChange } }: any) => (
              <BaseSelect
                disabled={!isBeingEdited}
                label="Pillar"
                className="mb-3"
                refs={ref}
                value={value}
                onChange={onChange}
                options={pillars}
                helperText={FormService.getErrorMessage(
                  errors,
                  'pillar',
                  'Pillar',
                )}
              />
            )}
          />
        </div>
        <div className="col-md-12 col-sm-12 mb-3">
          <UploadImages
            imageData={(e: MImage) => {
              handleImageChange(e, 'logo');
            }}
            label="Tags Icon"
            className="width-80 height-80 fs-6 rounded-1"
            imageSrc={iconProject?.url}
            imageAlt={iconProject?.name}
            disabled={!isBeingEdited}
            id="project-icon"
          />
        </div>
        <div className="col-md-6 col-sm-12">
          <Controller
            name="locale.km.description"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field: { value, onChange } }: any) => (
              <Quill
                disabled={!isBeingEdited}
                currentValue={value}
                updatedValue={onChange}
                language={ELanguage.KHMER}
                label="Description in Khmer"
                helperText={FormService.getErrorMessage(
                  errors,
                  'locale.km.description',
                  'Description in khmer',
                )}
              />
            )}
          />
        </div>
        <div className="col-md-6 col-sm-12">
          <Controller
            name="locale.en.description"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field: { value, onChange } }: any) => (
              <Quill
                disabled={!isBeingEdited}
                currentValue={value}
                updatedValue={onChange}
                language={ELanguage.ENGLISH}
                label="Description English"
                helperText={FormService.getErrorMessage(
                  errors,
                  'locale.en.description',
                  'Description in english',
                )}
              />
            )}
          />
        </div>
      </div>
      {!isDetailsPage && (
        <ModificationModal.Footer className={clsx('mt-5')}>
          <div className="text-center">
            <button
              className="admin-btn-add bth-submit"
              type="submit"
              disabled={isSubmitting}
            >
              Add
            </button>
          </div>
        </ModificationModal.Footer>
      )}
    </form>
  );
}

const mapStateToProps = (store: StoreState) => {
  const { sectors, pillars, projectStatus } = store.classification;
  const { organizationNames } = store.auth;

  return {
    ...store.userManagement.user,
    sectors: sectors.map((e) => new MSelectOptionCode(e)),
    pillars: pillars.map((e) => new MSelectOptionCode(e)),
    projectStatus: projectStatus.map((e) => new MSelectOptionCode(e)),
    organizationNames: organizationNames?.map((e) => new MSelectOptionCode(e)),
    isCreateDone: store.project.isCreateDone,
    isSubmitting: store.project.isSubmitting,
  };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch) => {
  const { createProjectCMS, updateProjectDetailIdCMS } = projectActions;

  const { getClassifications } = classificationActions;

  const { getOrganizationNames } = AuthAction;

  return {
    getSectors: () =>
      dispatch(
        getClassifications(EClassification.SECTOR, {
          status: EStatus.ACTIVE,
          limit: 0,
        }) as any,
      ),

    getPillars: () =>
      dispatch(
        getClassifications(EClassification.PILLAR, {
          status: EStatus.ACTIVE,
          limit: 0,
        }) as any,
      ),

    getProjectStatus: () =>
      dispatch(
        getClassifications(EClassification.PROJECT_STATUS, {
          status: EStatus.ACTIVE,
          limit: 0,
        }) as any,
      ),

    getProjectNames: (payload: ICommonQueries) =>
      dispatch(getOrganizationNames(payload) as any),

    createProject: (payload: IAddProjectPayload) =>
      dispatch(createProjectCMS(payload) as any),

    updateProjectDetailIdCMS: (id: string, payload: IAddProjectPayload) =>
      dispatch(updateProjectDetailIdCMS(id, payload) as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddProject);
