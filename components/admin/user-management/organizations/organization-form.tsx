import BaseInput from '@shared/components/form/base-input';
import BaseSelectColor from '@shared/components/form/base-select-color';
import BaseSelect from '@shared/components/form/base-select-creatable';
import UploadImages from '@shared/components/upload-image/upload-images';
import { statusConstant } from '@shared/constant';
import { MSelectOption } from '@shared/models/common.model';
import { MImage } from '@shared/models/image-model';
import { FormService } from '@shared/services/form.service';
import React, { useEffect, useState } from 'react';
import {
  Control,
  Controller,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { connect } from 'react-redux';
import { StoreState } from 'store/root-reducer';

interface IOrganizationForm {
  setValue: UseFormSetValue<any>;
  control: Control<any, object>;
  errors: any;
  from?: 'user' | 'organization';
  disabled?: boolean;
  imageSrc?: string;
  imageAlt?: string;

  // redux props
  sectors?: MSelectOption[];
  pillars?: MSelectOption[];
  organizations?: MSelectOption[];
}

// add organization type when you want to re-use it in organization module
function OrganizationForm(props: IOrganizationForm) {
  const {
    setValue,
    control,
    errors,
    from = 'organization',
    sectors,
    pillars,
    organizations,
    disabled,
    imageSrc,
    imageAlt = 'Organization Image',
  } = props;

  const handleImageChange = (data: MImage) => {
    if (disabled) return;

    // check field image from different modules (users, organizations)
    const imgField = from === 'user' ? 'organization.imageId' : 'imageId';
    const imgUrlField = from === 'user' ? 'organization.imageUrl' : 'imageUrl';
    setValue(imgField, data?.id, { shouldValidate: true });
    setValue(imgUrlField, data?.url, { shouldValidate: true });
  };

  return (
    <div>
      <div>
        <UploadImages
          imageData={handleImageChange}
          label="Organization Icon"
          imageSrc={imageSrc}
          imageAlt={imageAlt}
          disabled={disabled}
        />
      </div>
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <Controller
            name={from === 'user' ? 'organization.name' : 'name'}
            control={control}
            defaultValue=""
            rules={{
              required: true,
            }}
            render={({ field: { ref, value, onChange } }: any) => (
              <BaseInput
                label="Name"
                refs={ref}
                value={value}
                onChange={onChange}
                helperText={FormService.getErrorMessage(
                  errors,
                  from === 'user' ? 'organization.name' : 'name',
                  'Name',
                )}
                disabled={disabled}
              />
            )}
          />
        </div>
        <div className="col-md-6 col-sm-12">
          <Controller
            name={from === 'user' ? 'organization.type' : 'type'}
            control={control}
            defaultValue=""
            rules={{
              required: true,
            }}
            render={({ field: { ref, value, onChange } }: any) => (
              <BaseSelect
                label="Organization Type"
                refs={ref}
                value={value}
                onChange={onChange}
                options={organizations}
                isCreatable={true}
                helperText={FormService.getErrorMessage(
                  errors,
                  from === 'user' ? 'organization.type' : 'type',
                  'Organization Type',
                )}
                disabled={disabled}
              />
            )}
          />
        </div>
        <div className="col-md-6 col-sm-12">
          <Controller
            name={from === 'user' ? 'organization.pillar' : 'pillar'}
            control={control}
            defaultValue=""
            rules={{
              required: true,
            }}
            render={({ field: { ref, value, onChange } }: any) => (
              <BaseSelect
                label="Organization Pillar"
                refs={ref}
                value={value}
                onChange={onChange}
                options={pillars}
                helperText={FormService.getErrorMessage(
                  errors,
                  from === 'user' ? 'organization.pillar' : 'pillar',
                  'Organization Pillar',
                )}
                disabled={disabled}
              />
            )}
          />
        </div>
        <div className="col-md-6 col-sm-12">
          <Controller
            name={from === 'user' ? 'organization.sectors' : 'sectors'}
            control={control}
            defaultValue=""
            rules={{
              required: false,
            }}
            render={({ field: { ref, value, onChange } }: any) => (
              <BaseSelect
                label="Organization Sectors"
                refs={ref}
                isMulti
                value={value}
                options={sectors}
                onChange={onChange}
                isCreatable={true}
                helperText={FormService.getErrorMessage(
                  errors,
                  from === 'user' ? 'organization.sectors' : 'sectors',
                  'Organization Sectors',
                )}
                disabled={disabled}
              />
            )}
          />
        </div>
        <div className="col-md-6 col-sm-12">
          <Controller
            name={from === 'user' ? 'organization.website' : 'website'}
            control={control}
            defaultValue=""
            rules={{
              required: true,
              pattern: {
                value:
                  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
                message: 'Link is invalid',
              },
            }}
            render={({ field: { ref, value, onChange } }: any) => (
              <BaseInput
                label="Link To Web"
                refs={ref}
                value={value}
                onChange={onChange}
                helperText={FormService.getErrorMessage(
                  errors,
                  from === 'user' ? 'organization.website' : 'website',
                  'Link To Web',
                  'Link is invalid',
                )}
                disabled={disabled}
              />
            )}
          />
        </div>
        <div className="col-md-6 col-sm-12">
          <Controller
            name={from === 'user' ? 'organization.description' : 'description'}
            control={control}
            defaultValue=""
            rules={{
              required: true,
            }}
            render={({ field: { ref, value, onChange } }: any) => (
              <BaseInput
                label="Description"
                refs={ref}
                value={value}
                onChange={onChange}
                helperText={FormService.getErrorMessage(
                  errors,
                  from === 'user' ? 'organization.description' : 'description',
                  'Description',
                )}
                disabled={disabled}
              />
            )}
          />
        </div>
        <div className="col-md-6 col-sm-12">
          <Controller
            name={from === 'user' ? 'organization.status' : 'status'}
            control={control}
            defaultValue=""
            rules={{
              required: true,
            }}
            render={({ field: { ref, value, onChange } }: any) => (
              <BaseSelect
                label="Status"
                refs={ref}
                value={value}
                options={statusConstant}
                onChange={onChange}
                helperText={FormService.getErrorMessage(
                  errors,
                  from === 'user' ? 'organization.status' : 'status',
                  'Status',
                )}
                disabled={disabled}
              />
            )}
          />
        </div>
        <div className="col-md-6 col-sm-12">
          <Controller
            name={
              from === 'user'
                ? 'organization.metadata.colorCode'
                : 'metadata.colorCode'
            }
            control={control}
            defaultValue=""
            rules={{
              required: true,
            }}
            render={({ field: { value, onChange } }: any) => (
              <BaseSelectColor
                onChange={onChange}
                value={value}
                helperText={FormService.getErrorMessage(
                  errors,
                  from === 'user'
                    ? 'organization.metadata.colorCode'
                    : 'metadata.colorCode',
                  'Color',
                )}
                disabled={disabled}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}

// store section
const mapStateToProps = (store: StoreState) => {
  return { ...store?.classification };
};

export default connect(mapStateToProps, null)(OrganizationForm);
