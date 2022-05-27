import DatePicker from '@shared/components/datePicker';
import BaseInput from '@shared/components/form/base-input';
import Quill from '@shared/components/rich-text-editor';
import { PATTERNS } from '@shared/constant';
import { ELanguage } from '@shared/enum';
import { MNewsForm } from '@shared/models/news.model';
import { FormService } from '@shared/services/form.service';
import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import PillarSelect from 'components/admin/selects/pillar-select';

export const defaultNewsFormValues: MNewsForm = {
  titleEn: '',
  titleKh: '',
  descriptionEn: '',
  descriptionKh: '',
  sourceLinkEn: '',
  sourceLinkKh: '',
  publishedAt: undefined,
  pillar: '',
};

interface INewsFormProps {
  control: Control<MNewsForm>;
  errors: FieldErrors;
  editable: boolean;
}

export default function NewsForm({
  control,
  errors,
  editable = true,
}: INewsFormProps) {
  return (
    <>
      <div className="row">
        <div className="col-md-6">
          <Controller
            name="titleEn"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { ref, value, onChange } }: any) => (
              <BaseInput
                label="Title English"
                refs={ref}
                value={value}
                onChange={onChange}
                helperText={FormService.getErrorMessage(
                  errors,
                  'titleEn',
                  'Title English',
                )}
                isRequired
                disabled={!editable}
              />
            )}
          />
        </div>
        <div className="col-md-6">
          <Controller
            name="titleKh"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { ref, value, onChange } }: any) => (
              <BaseInput
                label="Title Khmer"
                refs={ref}
                value={value}
                onChange={onChange}
                helperText={FormService.getErrorMessage(
                  errors,
                  'titleKh',
                  'Title Khmer',
                )}
                isRequired
                disabled={!editable}
              />
            )}
          />
        </div>
        <div className="col-md-6">
          <Controller
            name="descriptionEn"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field: { value, onChange } }: any) => (
              <Quill
                isRequired
                disabled={!editable}
                currentValue={value}
                updatedValue={onChange}
                language={ELanguage.ENGLISH}
                label="Description English"
                placeholder=""
                helperText={FormService.getErrorMessage(
                  errors,
                  'descriptionEn',
                  'Description English',
                )}
              />
            )}
          />
        </div>
        <div className="col-md-6">
          <Controller
            name="descriptionKh"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field: { value, onChange } }: any) => (
              <Quill
                isRequired
                disabled={!editable}
                currentValue={value}
                updatedValue={onChange}
                language={ELanguage.ENGLISH}
                label="Description English"
                placeholder=""
                helperText={FormService.getErrorMessage(
                  errors,
                  'descriptionKh',
                  'Description Khmer',
                )}
              />
            )}
          />
        </div>
        <div className="col-md-6">
          <Controller
            name="sourceLinkEn"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { ref, value, onChange } }: any) => (
              <BaseInput
                label="Source Link English"
                refs={ref}
                value={value}
                onChange={onChange}
                helperText={FormService.getErrorMessage(
                  errors,
                  'sourceLinkEn',
                  'Source Link English',
                )}
                isRequired
                disabled={!editable}
              />
            )}
          />
        </div>
        <div className="col-md-6">
          <Controller
            name="sourceLinkKh"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { ref, value, onChange } }: any) => (
              <BaseInput
                label="Source Link Khmer"
                refs={ref}
                value={value}
                onChange={onChange}
                helperText={FormService.getErrorMessage(
                  errors,
                  'sourceLinkKh',
                  'Source Link Khmer',
                )}
                isRequired
                disabled={!editable}
              />
            )}
          />
        </div>
        <div className="col-md-6">
          <Controller
            name="publishedAt"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { ref, value, onChange } }: any) => (
              <DatePicker
                label="Published On"
                onChange={(d: any) => {
                  onChange(d);
                }}
                value={value}
                dateFormat={PATTERNS?.DATE_FORM_NO_TIME}
                className="floating-label"
                showTimeInput={false}
                isDisabled={!editable}
                isRequired
                helperText={FormService.getErrorMessage(
                  errors,
                  'publishedAt',
                  'Published On',
                )}
              />
            )}
          />
        </div>
        <div className="col-md-6">
          <Controller
            name="pillar"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { ref, value, onChange } }: any) => (
              <PillarSelect
                errors={errors}
                isMulti={false}
                isRequired
                onChange={(d: any) => {
                  onChange(d);
                }}
                value={value}
                disable={!editable}
              />
            )}
          />
        </div>
      </div>
    </>
  );
}
