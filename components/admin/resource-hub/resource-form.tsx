import BaseInput from '@shared/components/form/base-input';
import { FormService } from '@shared/services/form.service';
import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import Quill from '@shared/components/rich-text-editor';
import { ELanguage, EStatus } from '@shared/enum';
import DatePicker from '@shared/components/datePicker';
import UploadFiles from '@shared/components/upload-file/upload-files';
import { MDocument, MImage } from '@shared/models/image-model';
import FileDisplay from '@shared/components/upload-file/file-display';
import BaseSelect from '@shared/components/form/base-select-creatable';
import * as Redux from 'redux';
import { connect } from 'react-redux';
import classificationActions from 'store/admin/classification/classification.action';
import { EClassification } from '@shared/enum/classification.enum';
import { StoreState } from 'store/root-reducer';
import { MSelectOption } from '@shared/models/common.model';
import { languageConstant } from '@shared/constant';
import ResourceHubActions from 'store/admin/resource-hub/resource-hub.action';
import { IFileUploadForm } from './add-resource';
import UploadImages from '@shared/components/upload-image/upload-images';
import AdditionalInfoForm from './additional-info-form';
import BaseImage from '@shared/components/images/base-image';
import RequiredFormIcon from '@shared/components/form/required-form-icon';

interface IResourceHubFormProps {
  watch: any;
  control: any;
  errors: any;
  disabled?: boolean;
  setValue?: any;
  reset?: any;
  uploadFileArray?: any;
  additionalInfoArray?: any;
  referenceFileTypes?: MSelectOption[];
  pillars?: MSelectOption[];
  organizations?: MSelectOption[];
  sectors?: MSelectOption[];
  getReferenceFileTypes?: () => void;
  getOrganizations?: () => void;
  getPillars?: () => void;
  getSectors?: () => void;
  filesDetail?: IFileUploadForm[];
  isSubmit?: boolean;
}

function ResourceForm(props: IResourceHubFormProps) {
  const {
    watch,
    control,
    errors,
    disabled,
    setValue,
    reset,
    uploadFileArray,
    additionalInfoArray,
    referenceFileTypes,
    pillars,
    sectors,
    organizations,
    filesDetail,
    isSubmit = false,
    getReferenceFileTypes,
    getOrganizations,
    getPillars,
    getSectors,
  } = props;
  const [resourceFile, setResourceFile] = useState<IFileUploadForm[]>([]);
  const [resourceImage, setResourceImage] = useState<MImage>(new MImage({}));

  const [today, setToday] = useState(new Date());
  const ac = new AbortController();

  const watchUploadFiles = watch('uploadFileArray');
  const watchImageUrl = watch('imageUrl');

  useEffect(() => {
    getReferenceFileTypes && getReferenceFileTypes();
    getOrganizations && getOrganizations();
    getPillars && getPillars();
    getSectors && getSectors();
  }, []);

  useEffect(() => {
    filesDetail?.length && setResourceFile(filesDetail);
  }, [filesDetail]);

  useEffect(() => {
    setValue('uploadFiles', resourceFile);
    return () => {
      ac.abort();
    };
  }, [resourceFile]);

  useEffect(() => {
    setResourceImage((pre) => ({ ...pre, url: watchImageUrl }));
    return () => {
      ac.abort();
    };
  }, [watchImageUrl]);

  const handleFileChange = (data: MDocument[]) => {
    if (disabled) return;
    setResourceFile((prev) => [...prev, ...data]);
  };

  const handleImageChange = (data: MImage) => {
    if (disabled) return;
    setResourceImage(data);
    setValue('imageId', data?.id);
    setValue('imageUrl', data?.url);
  };

  const handleRemove = (index: number) => {
    uploadFileArray.remove(index);
    resourceFile.splice(index, 1);
  };

  return (
    <div className="row">
      <div className="col-12 mb-3">
        <UploadImages
          imageData={handleImageChange}
          label="Image"
          imageSrc={resourceImage.url}
          imageAlt="image"
          disabled={disabled}
        />
      </div>

      <div className="col-lg-6 col-md-12 mb-3">
        <Controller
          name="titleKh"
          control={control}
          defaultValue=""
          rules={{
            required: true,
          }}
          render={({ field: { ref, value, onChange } }: any) => (
            <BaseInput
              label="Resource Title KH"
              isRequired={true}
              refs={ref}
              value={value}
              disabled={disabled}
              onChange={onChange}
              error={errors?.titleKh && true}
              helperText={FormService.getErrorMessage(
                errors,
                'titleKh',
                'Resource Title KH',
              )}
            />
          )}
        />
      </div>

      <div className="col-lg-6 col-md-12 mb-3">
        <Controller
          name="titleEn"
          control={control}
          defaultValue=""
          rules={{
            required: true,
          }}
          render={({ field: { ref, value, onChange } }: any) => (
            <BaseInput
              label="Resource Title EN"
              isRequired={true}
              refs={ref}
              value={value}
              disabled={disabled}
              onChange={onChange}
              error={errors?.titleEn && true}
              helperText={FormService.getErrorMessage(
                errors,
                'titleEn',
                'Resource Title EN',
              )}
            />
          )}
        />
      </div>

      <div className="col-lg-6 col-md-12 mb-3">
        <Controller
          name="descriptionKh"
          control={control}
          defaultValue=""
          rules={{
            required: true,
          }}
          render={({ field: { ref, value, onChange } }: any) => (
            <Quill
              language={ELanguage.KHMER}
              label="Description KH"
              isRequired={true}
              disabled={disabled}
              currentValue={value}
              updatedValue={onChange}
              helperText={FormService.getErrorMessage(
                errors,
                'descriptionKh',
                'Description KH',
              )}
            />
          )}
        />
      </div>

      <div className="col-lg-6 col-md-12 mb-3">
        <Controller
          name="descriptionEn"
          control={control}
          defaultValue=""
          rules={{
            required: true,
          }}
          render={({ field: { ref, value, onChange } }: any) => (
            <Quill
              language={ELanguage.ENGLISH}
              label="Description EN"
              isRequired={true}
              currentValue={value}
              updatedValue={onChange}
              disabled={disabled}
              helperText={FormService.getErrorMessage(
                errors,
                'descriptionEn',
                'Description EN',
              )}
            />
          )}
        />
      </div>

      <div className="col-lg-6 col-md-12 mb-3">
        <Controller
          name="publicDate"
          control={control}
          defaultValue=""
          rules={{ required: true }}
          render={({ field: { value, onChange } }: any) => (
            <DatePicker
              label="Public Date"
              isRequired={true}
              onChange={(d: any) => {
                onChange(d);
              }}
              value={value}
              minDate={today}
              isDisabled={disabled}
              helperText={FormService.getErrorMessage(
                errors,
                'publicDate',
                'Public Date',
              )}
            />
          )}
        />
      </div>

      <div className="col-lg-6 col-md-12 mb-3">
        <Controller
          name="language"
          control={control}
          defaultValue={[]}
          rules={{ required: true }}
          render={({ field: { ref, value, onChange, ...field } }: any) => (
            <BaseSelect
              {...field}
              label="Language"
              isRequired={true}
              refs={ref}
              value={value}
              onChange={onChange}
              options={languageConstant}
              className="mb-3"
              error={errors?.language && true}
              disabled={disabled}
              isMulti={true}
              helperText={FormService.getErrorMessage(
                errors,
                'language',
                'Language',
              )}
            />
          )}
        />
      </div>

      <div className="col-lg-6 col-md-12 mb-3">
        <Controller
          name="reference"
          control={control}
          defaultValue=""
          rules={{
            required: true,
          }}
          render={({ field: { ref, value, onChange, ...field } }: any) => (
            <BaseSelect
              {...field}
              label="Reference"
              isRequired={true}
              refs={ref}
              value={value}
              onChange={onChange}
              options={organizations}
              className="mb-3"
              error={errors?.reference && true}
              disabled={disabled}
              helperText={FormService.getErrorMessage(
                errors,
                'reference',
                'Reference',
              )}
            />
          )}
        />
      </div>

      <div className="col-lg-6 col-md-12 mb-3">
        <Controller
          name="publishedBy"
          control={control}
          defaultValue=""
          rules={{
            required: true,
          }}
          render={({ field: { ref, value, onChange, ...field } }: any) => (
            <BaseSelect
              {...field}
              label="Publish By"
              isRequired={true}
              refs={ref}
              value={value}
              onChange={onChange}
              options={organizations}
              className="mb-3"
              error={errors?.publishedBy && true}
              disabled={disabled}
              helperText={FormService.getErrorMessage(
                errors,
                'publishedBy',
                'Publish By',
              )}
            />
          )}
        />
      </div>

      <div className="col-lg-6 col-md-12 mb-3">
        <Controller
          name="pillar"
          control={control}
          defaultValue=""
          rules={{
            required: true,
          }}
          render={({ field: { ref, value, onChange, ...field } }: any) => (
            <BaseSelect
              {...field}
              label="Pillar"
              isRequired={true}
              refs={ref}
              value={value}
              onChange={onChange}
              options={pillars}
              className="mb-3"
              error={errors?.pillar && true}
              disabled={disabled}
              helperText={FormService.getErrorMessage(
                errors,
                'pillar',
                'Pillar',
              )}
            />
          )}
        />
      </div>

      <div className="col-lg-6 col-md-12 mb-3">
        <Controller
          name="sector"
          control={control}
          defaultValue={[]}
          rules={{
            required: true,
          }}
          render={({ field: { ref, value, onChange, ...field } }: any) => (
            <BaseSelect
              {...field}
              label="Sector"
              isRequired={true}
              refs={ref}
              value={value}
              onChange={onChange}
              options={sectors}
              className="mb-3"
              error={errors?.sector && true}
              disabled={disabled}
              isMulti={true}
              helperText={FormService.getErrorMessage(
                errors,
                'sector',
                'Sector',
              )}
            />
          )}
        />
      </div>

      <div className="col-lg-6 col-md-12 mb-3">
        <Controller
          name="stakeholder"
          control={control}
          defaultValue={[]}
          rules={{
            required: true,
          }}
          render={({ field: { ref, value, onChange, ...field } }: any) => (
            <BaseSelect
              {...field}
              label="Stakeholder"
              isRequired={true}
              refs={ref}
              value={value}
              onChange={onChange}
              options={organizations}
              className="mb-3"
              error={errors?.stakeholder && true}
              disabled={disabled}
              isMulti={true}
              helperText={FormService.getErrorMessage(
                errors,
                'stakeholder',
                'Stakeholder',
              )}
            />
          )}
        />
      </div>

      {/* upload Files */}
      <div className="col-12 mb-3">
        <p className="base-label mb-3">
          <span className="d-inline-block">
            Upload File
            <RequiredFormIcon />
          </span>
          {resourceFile?.length == 0 && isSubmit && (
            <span className="ms-2 d-inline-block error-text">
              File is Required
            </span>
          )}
        </p>
        <div className="card form-input-container gx-0 p-2 border-0">
          <div className="card bg-white gx-0 p-2 border-0">
            <div className="row">
              <div className="col-12 col-lg-3">
                <UploadFiles
                  fileData={handleFileChange}
                  label="File"
                  multiple={true}
                  disabled={disabled}
                />
              </div>
              <div className="col-12 col-lg-9">
                {resourceFile?.length > 0 &&
                  uploadFileArray?.fields?.map((item: any, index: number) => (
                    <div className="row align-items-center" key={item?.fileId}>
                      <div className="col-4">
                        <FileDisplay value={item?.originalName} />
                      </div>
                      <div className="col-8">
                        <div className="position-relative">
                          <Controller
                            name={`uploadFiles.${index}.referenceFileType`}
                            control={control}
                            defaultValue={[]}
                            rules={{
                              required: true,
                            }}
                            render={({
                              field: { ref, value, onChange, ...field },
                            }: any) => (
                              <BaseSelect
                                {...field}
                                label="Type"
                                refs={ref}
                                value={value}
                                onChange={onChange}
                                options={referenceFileTypes}
                                className="mb-3 me-3"
                                error={errors?.uploadFiles?.[index] && true}
                                disabled={disabled}
                                isMulti={true}
                                helperText={FormService.getErrorMessage(
                                  errors?.uploadFiles?.[index],
                                  'referenceFileType',
                                  'Type',
                                )}
                              />
                            )}
                          />
                          {!disabled && (
                            <i
                              className="resource-btn-close fa fa-times ms-2"
                              aria-hidden="true"
                              onClick={() => handleRemove(index)}
                            ></i>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* additional Form */}
      <div className="col-12 mb-3">
        <AdditionalInfoForm
          additionalInfo={additionalInfoArray}
          control={control}
          errors={errors}
          watch={watch}
          setValue={setValue}
          reset={reset}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

const mapStateToProps = (store: StoreState) => {
  const { referenceFileTypes, pillars, sectors } = store?.classification;

  const { organizations } = store?.resourceHub;
  return {
    referenceFileTypes,
    organizations,
    pillars,
    sectors,
  };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch) => {
  const { getClassifications } = classificationActions;
  const { getOrganzations } = ResourceHubActions;

  return {
    getReferenceFileTypes: () =>
      dispatch(
        getClassifications(EClassification.REFERENCE_FILE_TYPE, {
          status: EStatus.ACTIVE,
          limit: 0,
        }) as any,
      ),

    getOrganizations: () => dispatch(getOrganzations() as any),

    getPillars: () =>
      dispatch(
        getClassifications(EClassification.PILLAR, {
          status: EStatus.ACTIVE,
          limit: 0,
        }) as any,
      ),

    getSectors: () =>
      dispatch(
        getClassifications(EClassification.SECTOR, {
          status: EStatus.ACTIVE,
          limit: 0,
        }) as any,
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResourceForm);
