import DatePicker from '@shared/components/datePicker';
import BaseInput from '@shared/components/form/base-input';
import Quill from '@shared/components/rich-text-editor';
import UploadImages from '@shared/components/upload-image/upload-images';
import { ELanguage } from '@shared/enum';
import { MImage } from '@shared/models/image-model';
import { FormService } from '@shared/services/form.service';
import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';

interface ICompanyBackgroundFormProps {
  watch: any;
  control: any;
  errors: any;
  disabled?: boolean;
  setValue?: any;
  reset?: any;
}

function CompanyBackgroundForm(props: ICompanyBackgroundFormProps) {
  const { watch, control, errors, disabled, setValue } = props;
  const [eventImage, setEventImage] = useState<MImage>(new MImage({}));

  const watchImageUrl = watch('imageUrl');
  const ac = new AbortController();

  useEffect(() => {
    setEventImage((pre) => ({ ...pre, url: watchImageUrl }));
    return () => {
      ac.abort();
    };
  }, [watchImageUrl]);

  const handleImageChange = (data: MImage) => {
    if (disabled) return;
    setEventImage(data);
    setValue('imageId', data?.id);
    setValue('imageUrl', data?.url);
  };

  return (
    <div className="row">
      <div className="col-12 mb-3">
        <UploadImages
          imageData={handleImageChange}
          label="Image"
          imageSrc={eventImage.url}
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
              label="Company Background Title KH"
              isRequired={true}
              refs={ref}
              value={value}
              disabled={disabled}
              onChange={onChange}
              error={errors?.titleKh && true}
              helperText={FormService.getErrorMessage(
                errors,
                'titleKh',
                'Company Background Title KH',
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
              label="Company Background Title EN"
              isRequired={true}
              refs={ref}
              value={value}
              disabled={disabled}
              onChange={onChange}
              error={errors?.titleEn && true}
              helperText={FormService.getErrorMessage(
                errors,
                'titleEn',
                'Company Background Title EN',
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
    </div>
  );
}

export default CompanyBackgroundForm;
