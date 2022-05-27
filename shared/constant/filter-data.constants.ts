import { EStatus } from '@shared/enum';
import { ISelectFilterOptions } from '@shared/interfaces';

export const dateFilterOpts: ISelectFilterOptions[] = [
  { value: 'LAST_7_DAY', label: 'common:filter.last_7_days' },
  { value: 'THIS_MONTH', label: 'common:filter.this_month' },
  { value: 'LAST_MONTH', label: 'common:filter.last_month' },
  { value: 'LAST_3_MONTH', label: 'common:filter.last_3_months' },
  { value: 'LAST_6_MONTH', label: 'common:filter.last_6_months' },
  { value: 'THIS_YEAR', label: 'common:filter.this_year' },
  { value: 'PAST_YEAR', label: 'common:filter.last_year' },
  { value: 'CUSTOM', label: 'common:filter.custom' },
];

export const pillarFilterOpts: ISelectFilterOptions[] = [
  { value: 'DIGITAL_GOVERNMENT', label: 'Digital Government' },
  { value: 'DIGITAL_CITIZEN', label: 'Digital Citizen' },
  { value: 'DIGITAL_BUSINESS', label: 'Digital Business' },
];

export const statusFilterOpts: ISelectFilterOptions[] = [
  {
    value: EStatus.ACTIVE,
    label: 'Active',
  },
  {
    value: EStatus.INACTIVE,
    label: 'Inactive',
  },
  {
    value: EStatus.BLOCKED,
    label: 'Block',
  },
  {
    value: EStatus.DELETED,
    label: 'Delete',
  },
  {
    value: EStatus.PENDING,
    label: 'Pending',
  },
  {
    value: EStatus.REJECT,
    label: 'Reject',
  },
];

/*========== Just import this one to use above declarations ==========*/
export const cmsFilterOpt = {
  dateFilterOpts,
  pillarFilterOpts,
};
