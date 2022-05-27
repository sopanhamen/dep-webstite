import BaseSelect from '@shared/components/form/base-select-creatable';
import { arrayToPipeString } from '@shared/custom-function/conversion';
import { ISelectFilterOptions, ISharedCommonQueries } from '@shared/interfaces';
import { FormService } from '@shared/services/form.service';
import useTranslation from 'next-translate/useTranslation';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { filterActions } from 'store/admin/filter/filter.actions';
import { FilterState } from 'store/admin/filter/filter.reducers';
import { StoreState } from 'store/root-reducer';

interface ISelectPillarProps extends FilterState {
  forAdmin?: boolean;
  isMulti?: boolean;
  value?: any;
  disable?: boolean;
  ref?: any;
  errors?: any;
  isRequired?: boolean;
  onChange?: (data: any) => void;
  resetPillars: (forAdmin: boolean, params: ISharedCommonQueries) => void;
}

function PillarSelect({
  forAdmin = true,
  isRequired = false,
  isMulti = true,
  value,
  disable = false,
  ref,
  errors,
  limit = 0,
  offset = 0,
  search = '',
  statuses = ['ACTIVE'],
  data,
  isFetching,
  onChange,
  resetPillars,
}: ISelectPillarProps) {
  const { t } = useTranslation();
  const [options, setOptions] = useState<ISelectFilterOptions[]>();

  const getParams = () => {
    return {
      limit,
      offset,
      search,
      statuses: arrayToPipeString(statuses),
    } as ISharedCommonQueries;
  };

  useEffect(() => {
    !data?.length && resetPillars(forAdmin, getParams());
  }, []);

  useEffect(() => {
    const opts: ISelectFilterOptions[] = data?.map((d) => {
      return { label: d.name, value: d.code };
    });
    setOptions(opts);
  }, [data]);

  return (
    <>
      <BaseSelect
        isRequired={isRequired}
        disabled={disable}
        label={t('common:project.pillar')}
        className="mb-3"
        refs={ref}
        isMulti={isMulti}
        isLoading={isFetching}
        value={value}
        options={options}
        onChange={onChange}
        helperText={FormService.getErrorMessage(errors, 'pillar', 'Pillar')}
      />
    </>
  );
}

const mapStateToProps = (store: StoreState) => {
  return { ...store.filter.pillar };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const { resetPillarFilterListAction } = filterActions;

  return {
    resetPillars: (forAdmin: boolean = true, params: ISharedCommonQueries) =>
      dispatch(resetPillarFilterListAction(forAdmin, params) as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PillarSelect);
