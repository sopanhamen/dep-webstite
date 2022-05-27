import DatePicker from '@shared/components/datePicker';
import BaseInput from '@shared/components/form/base-input';
import Quill from '@shared/components/rich-text-editor';
import UploadImages from '@shared/components/upload-image/upload-images';
import { ELanguage } from '@shared/enum';
import { MImage } from '@shared/models/image-model';
import { FormService } from '@shared/services/form.service';
import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';

interface IEventFormProp {
  watch: any;
  control: any;
  errors: any;
  disabled?: boolean;
  setValue?: any;
  reset?: any;
}

function EventForm(props: IEventFormProp) {
  const { watch, control, errors, disabled, setValue } = props;
  const [eventImage, setEventImage] = useState<MImage>(new MImage({}));

  const watchImageUrl = watch('imageUrl');
  const watchStartDate = watch('startDate');
  const watchEndDate = watch('endDate');

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
          name="titleEn"
          control={control}
          defaultValue=""
          rules={{
            required: true,
          }}
          render={({ field: { ref, value, onChange } }: any) => (
            <BaseInput
              label="Event Title EN"
              isRequired={true}
              refs={ref}
              value={value}
              disabled={disabled}
              onChange={onChange}
              error={errors?.titleEn && true}
              helperText={FormService.getErrorMessage(
                errors,
                'titleEn',
                'Event Title EN',
              )}
            />
          )}
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
              label="Event Title KH"
              isRequired={true}
              refs={ref}
              value={value}
              disabled={disabled}
              onChange={onChange}
              error={errors?.titleKh && true}
              helperText={FormService.getErrorMessage(
                errors,
                'titleKh',
                'Event Title KH',
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
          name="startDate"
          control={control}
          defaultValue=""
          rules={{ required: true }}
          render={({ field: { value, onChange } }: any) => (
            <DatePicker
              label="Start Date"
              isRequired={true}
              onChange={(d: any) => {
                onChange(d);
              }}
              value={value}
              minDate={new Date()}
              maxDate={watchEndDate}
              dateFormat={'dd MMM, yyyy h:mm aa'}
              className="floating-label"
              showTimeInput={true}
              isDisabled={disabled}
              helperText={FormService.getErrorMessage(
                errors,
                'startDate',
                'Start Date',
              )}
            />
          )}
        />
      </div>

      <div className="col-lg-6 col-md-12 mb-3">
        <Controller
          name="endDate"
          control={control}
          defaultValue=""
          rules={{ required: true }}
          render={({ field: { value, onChange, ref } }: any) => (
            <DatePicker
              label="End Date"
              isRequired={true}
              onChange={(d: any) => {
                onChange(d);
              }}
              value={value}
              minDate={watchStartDate || new Date()}
              dateFormat={'dd MMM, yyyy h:mm aa'}
              className="floating-label"
              showTimeInput={true}
              isDisabled={disabled}
              helperText={FormService.getErrorMessage(
                errors,
                'endDate',
                'End Date',
              )}
            />
          )}
        />
      </div>

      <div className="col-lg-6 col-md-12 mb-3">
        <Controller
          name="locationLink"
          control={control}
          defaultValue=""
          render={({ field: { ref, value, onChange } }: any) => (
            <BaseInput
              label="Location Link"
              refs={ref}
              value={value}
              disabled={disabled}
              onChange={onChange}
              error={errors?.locationLink && true}
              helperText={FormService.getErrorMessage(
                errors,
                'locationLink',
                'Location Link',
              )}
            />
          )}
        />
      </div>

      <div className="col-lg-6 col-md-12 mb-3">
        <Controller
          name="meetingLink"
          control={control}
          defaultValue=""
          render={({ field: { ref, value, onChange } }: any) => (
            <BaseInput
              label="Meeting Link"
              refs={ref}
              value={value}
              disabled={disabled}
              onChange={onChange}
              error={errors?.meetingLink && true}
              helperText={FormService.getErrorMessage(
                errors,
                'meetingLink',
                'Meeting Link',
              )}
            />
          )}
        />
      </div>
    </div>
  );
}

export default EventForm;
