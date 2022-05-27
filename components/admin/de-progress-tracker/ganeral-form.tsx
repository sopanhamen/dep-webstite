import Quill from '@shared/components/rich-text-editor';
import { ELanguage } from '@shared/enum';
import { FormService } from '@shared/services/form.service';
import {
  IDEPillarsDetail,
  MDETracker,
  MPillarForm,
} from '@shared/models/de-tracker.model';
import { Control, Controller, FieldErrors, useForm } from 'react-hook-form';

export const defaultPillarsFormValues: MPillarForm = {
  descriptionEn: '',
  descriptionKh: '',
};

interface IGaneralFormProps {
  control: Control<MPillarForm>;
  errors: any;
  editable: boolean;
}

function GaneralForm({ control, errors, editable }: IGaneralFormProps) {
  return (
    <>
      <div className="row">
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
                label="Description khmer"
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
      </div>
    </>
  );
}

export default GaneralForm;
