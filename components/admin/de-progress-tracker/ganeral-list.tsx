import AdminListCard from '@shared/components/cards/admin-list-card';
import { IDEPillarsDetail, MPillarForm } from '@shared/models/de-tracker.model';
import { FieldErrors, useForm, Control } from 'react-hook-form';
import { useEffect, useState } from 'react';
import GaneralForm, { defaultPillarsFormValues } from './ganeral-form';

export interface IGaneralList {
  control: Control<MPillarForm>;
  errors: FieldErrors;
  editable: boolean;
}

function GaneralList({ control, errors, editable = true }: IGaneralList) {
  return (
    <div>
      <AdminListCard.Body style={{ height: '63vh' }}>
        <GaneralForm control={control} errors={errors} editable={editable} />
      </AdminListCard.Body>
    </div>
  );
}
export default GaneralList;
