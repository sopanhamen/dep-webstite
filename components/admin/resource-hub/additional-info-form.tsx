import BaseInput from '@shared/components/form/base-input';
import FormArrayAction from '@shared/components/form/form-array-action';
import BaseImage from '@shared/components/images/base-image';
import Quill from '@shared/components/rich-text-editor';
import { ICON_URL } from '@shared/constant';
import { ELanguage } from '@shared/enum';
import { FormService } from '@shared/services/form.service';
import React, { useEffect } from 'react';
import { Controller } from 'react-hook-form';

interface IAdditionalInfoFormProps {
  additionalInfo?: any;
  control: any;
  watch: any;
  errors: any;
  disabled?: boolean;
  setValue?: any;
  reset?: any;
}

function AdditionalInfoForm(props: IAdditionalInfoFormProps) {
  const { additionalInfo, control, watch, errors, disabled, setValue, reset } =
    props;

  const handleAddForm = () => {
    additionalInfo?.append({});
  };

  const handleRemoveForm = (index: number) => {
    additionalInfo.remove(index);
  };

  return (
    <>
      {additionalInfo?.fields?.length > 0 && (
        <>
          <p className="base-label mb-3">Additional Info</p>
          <div className="additional-into-wrapper">
            {additionalInfo?.fields?.map((item: any, index: number) => (
              <div
                className="mb-2 position-relative"
                key={item?.id || 'additional' + `${index}`}
              >
                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <Controller
                      name={`additionalInfo.${index}.km.label`}
                      control={control}
                      defaultValue=""
                      rules={{
                        required: true,
                      }}
                      render={({ field: { ref, value, onChange } }: any) => (
                        <BaseInput
                          label="Field Name KH"
                          isRequired={true}
                          refs={ref}
                          value={value}
                          disabled={disabled}
                          onChange={onChange}
                          error={errors?.additionalInfo?.[index] && true}
                          helperText={FormService.getErrorMessage(
                            errors?.additionalInfo?.[index],
                            'km.label',
                            'Field Name KH',
                          )}
                        />
                      )}
                    />
                  </div>
                  <div className="col-12 col-md-6 mb-3">
                    <Controller
                      name={`additionalInfo.${index}.en.label`}
                      control={control}
                      defaultValue=""
                      rules={{
                        required: true,
                      }}
                      render={({ field: { ref, value, onChange } }: any) => (
                        <BaseInput
                          label="Field Name EN"
                          isRequired={true}
                          refs={ref}
                          value={value}
                          disabled={disabled}
                          onChange={onChange}
                          error={errors?.additionalInfo?.[index] && true}
                          helperText={FormService.getErrorMessage(
                            errors?.additionalInfo?.[index],
                            'en.label',
                            'Field Name EN',
                          )}
                        />
                      )}
                    />
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <Controller
                      name={`additionalInfo.${index}.km.value`}
                      control={control}
                      defaultValue=""
                      rules={{
                        required: true,
                      }}
                      render={({ field: { ref, value, onChange } }: any) => (
                        <Quill
                          language={ELanguage.KHMER}
                          label="Value KH"
                          isRequired={true}
                          currentValue={value}
                          updatedValue={onChange}
                          disabled={disabled}
                          helperText={FormService.getErrorMessage(
                            errors?.additionalInfo?.[index],
                            'km.value',
                            'Value KH',
                          )}
                        />
                      )}
                    />
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <Controller
                      name={`additionalInfo.${index}.en.value`}
                      control={control}
                      defaultValue=""
                      rules={{
                        required: true,
                      }}
                      render={({ field: { ref, value, onChange } }: any) => (
                        <Quill
                          language={ELanguage.ENGLISH}
                          label="Value EN"
                          isRequired={true}
                          currentValue={value}
                          updatedValue={onChange}
                          disabled={disabled}
                          helperText={FormService.getErrorMessage(
                            errors?.additionalInfo?.[index],
                            'en.value',
                            'Value EN',
                          )}
                        />
                      )}
                    />
                  </div>
                </div>
                {!disabled && (
                  <i
                    className="addition-btn-close fa fa-trash-o ms-2"
                    aria-hidden="true"
                    onClick={() => handleRemoveForm(index)}
                  ></i>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      {!disabled && (
        <FormArrayAction
          title="Add Additional Info"
          onClick={() => handleAddForm()}
          className="my-3"
        />
      )}
    </>
  );
}

export default AdditionalInfoForm;
