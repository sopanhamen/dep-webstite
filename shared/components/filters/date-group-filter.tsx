import { cmsFilterOpt } from '@shared/constant/filter-data.constants';
import { ISelectFilterOptions } from '@shared/interfaces';
import clsx from 'clsx';
import moment from 'moment';
import useTranslation from 'next-translate/useTranslation';
import React, { useEffect, useState } from 'react';
import DateFilter from './date-filter';
import SelectFilter from './select-filter';

export interface IDateGroupFilterData {
  dateType?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
}

interface IDateGroupFilterProps extends IDateGroupFilterData {
  forAdmin?: boolean;
  maxDate?: Date;
  minDate?: Date;
  onChange?: (data: IDateGroupFilterData) => void;
}

interface IDateGroupFilterValue<T> {
  [key: string]: T;
  LAST_7_DAY: T;
  THIS_MONTH: T;
  LAST_MONTH: T;
  LAST_3_MONTH: T;
  LAST_6_MONTH: T;
  THIS_YEAR: T;
  PAST_YEAR: T;
  CUSTOM: T;
}

export const dateGroupFilterValue: IDateGroupFilterValue<IDateGroupFilterData> =
  {
    LAST_7_DAY: {
      dateType: 'LAST_7_DAY',
      startDate: new Date(
        moment().subtract(7, 'd').startOf('day').toISOString(),
      ),
      endDate: new Date(moment().subtract(1, 'd').endOf('day').toISOString()),
    },

    THIS_MONTH: {
      dateType: 'THIS_MONTH',
      startDate: new Date(moment().startOf('month').toISOString()),
      endDate: new Date(moment().toISOString()),
    },

    LAST_MONTH: {
      dateType: 'LAST_MONTH',
      startDate: new Date(
        moment().subtract(1, 'months').startOf('month').toISOString(),
      ),
      endDate: new Date(
        moment().subtract(1, 'months').endOf('month').toISOString(),
      ),
    },

    LAST_3_MONTH: {
      dateType: 'LAST_3_MONTH',
      startDate: new Date(
        moment().subtract(3, 'months').startOf('month').toISOString(),
      ),
      endDate: new Date(
        moment().subtract(3, 'months').endOf('month').toISOString(),
      ),
    },

    LAST_6_MONTH: {
      dateType: 'LAST_6_MONTH',
      startDate: new Date(
        moment().subtract(6, 'months').startOf('month').toISOString(),
      ),
      endDate: new Date(
        moment().subtract(6, 'months').endOf('month').toISOString(),
      ),
    },

    THIS_YEAR: {
      dateType: 'THIS_YEAR',
      startDate: new Date(moment().startOf('year').toISOString()),
      endDate: new Date(moment().toISOString()),
    },

    PAST_YEAR: {
      dateType: 'PAST_YEAR',
      startDate: new Date(
        moment().subtract(1, 'years').startOf('year').toISOString(),
      ),
      endDate: new Date(
        moment().subtract(1, 'years').endOf('year').toISOString(),
      ),
    },

    CUSTOM: {
      dateType: 'CUSTOM',
      startDate: null,
      endDate: null,
    },
  };

export default function DateGroupFilter({
  forAdmin = true,
  dateType = dateGroupFilterValue?.CUSTOM?.dateType,
  startDate,
  endDate,
  onChange,
}: IDateGroupFilterProps) {
  const { t } = useTranslation();

  const types: ISelectFilterOptions[] = cmsFilterOpt?.dateFilterOpts?.map(
    (opt) => {
      return { ...opt, label: t(opt.label + '') };
    },
  );

  const [isCustom, setIsCustom] = useState(false);

  /*========== Submit data to parent ==========*/
  const submitChange = (data: IDateGroupFilterData) => {
    onChange && onChange(data);
  };

  /*========== Submit data when change custom date ==========*/
  const changeDate = (name: string, value: Date) => {
    if (name === 'START') submitChange({ dateType, endDate, startDate: value });
    else {
      if (value) {
        const now = moment();
        const end = moment(value);
        const different = now.diff(end, 'day');

        if (different === 0) value = new Date();
        else value = new Date(moment(value).endOf('day').toISOString());
      }

      submitChange({ dateType, startDate, endDate: value });
    }
  };

  /*========== Submit data depends on Type ==========*/
  const changeType = (type: string) => {
    setIsCustom(type === dateGroupFilterValue?.CUSTOM?.dateType);
    const types: string[] = [
      dateGroupFilterValue?.LAST_7_DAY?.dateType + '',
      dateGroupFilterValue?.THIS_MONTH?.dateType + '',
      dateGroupFilterValue?.LAST_MONTH?.dateType + '',
      dateGroupFilterValue?.LAST_3_MONTH?.dateType + '',
      dateGroupFilterValue?.LAST_6_MONTH?.dateType + '',
      dateGroupFilterValue?.THIS_YEAR?.dateType + '',
      dateGroupFilterValue?.PAST_YEAR?.dateType + '',
      dateGroupFilterValue?.CUSTOM?.dateType + '',
    ];

    if (types.includes(type)) {
      if (type === dateGroupFilterValue?.CUSTOM.dateType) {
        submitChange({ dateType: type, startDate, endDate });
      } else {
        submitChange({ dateType: type, startDate, endDate });
        const value = dateGroupFilterValue[type];
        submitChange(value);
      }
    } else submitChange({ dateType: null, startDate, endDate });
  };

  useEffect(() => {
    setIsCustom(dateType === dateGroupFilterValue?.CUSTOM.dateType);
  }, [dateType]);

  return (
    <>
      <div className="row g-3 ">
        <div className={clsx(isCustom ? 'col-md-4' : 'col-md-12')}>
          <SelectFilter
            forAdmin={forAdmin}
            label={t('common:filter.date')}
            isClearAll={false}
            isMulti={false}
            options={types}
            value={dateType}
            onChange={changeType}
          />
        </div>
        {isCustom ? (
          <>
            <div className="col-md-4">
              <DateFilter
                forAdmin={forAdmin}
                label={t('common:filter.from')}
                isClearAll={true}
                onChange={(d) => {
                  changeDate('START', d);
                }}
                value={startDate}
                maxDate={endDate}
              />
            </div>
            <div className="col-md-4">
              <DateFilter
                forAdmin={forAdmin}
                label={t('common:filter.to')}
                isClearAll={true}
                onChange={(d) => {
                  changeDate('END', d);
                }}
                value={endDate}
                minDate={startDate}
              />
            </div>
          </>
        ) : (
          ''
        )}
      </div>
    </>
  );
}
