import SelectFilter from '@shared/components/filters/select-filter';
import { arrayToPipeString } from '@shared/custom-function/conversion';
import { ISelectFilterOptions, ISharedCommonQueries } from '@shared/interfaces';
import useTranslation from 'next-translate/useTranslation';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { filterActions } from 'store/admin/filter/filter.actions';
import { FilterState } from 'store/admin/filter/filter.reducers';
import { StoreState } from 'store/root-reducer';

interface IFilterSectorProps extends FilterState {
  forAdmin?: boolean;
  multiple?: boolean;
  value?: any;
  onChange?: (data: any) => void;
  resetSectors: (forAdmin: boolean, params: ISharedCommonQueries) => void;
}

function SectorFilter({
  forAdmin = true,
  multiple = true,
  value,
  onChange,
  limit = 0,
  offset = 0,
  search = '',
  statuses = ['ACTIVE'],
  data,
  isFetching,
  resetSectors,
}: IFilterSectorProps) {
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
    resetSectors(forAdmin, getParams());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const opts: ISelectFilterOptions[] = data?.map((d) => {
      return { label: d.name, value: d.code };
    });
    setOptions(opts);
  }, [data]);

  return (
    <>
      <SelectFilter
        forAdmin={forAdmin}
        value={value}
        isClearAll={true}
        isMulti={multiple}
        isLoading={isFetching}
        label={t('common:project.sector')}
        options={options}
        onChange={onChange}
      />
    </>
  );
}

const mapStateToProps = (store: StoreState) => {
  return { ...store.filter.sector };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const { resetSectorFilterListAction } = filterActions;

  return {
    resetSectors: (forAdmin: boolean = true, params: ISharedCommonQueries) =>
      dispatch(resetSectorFilterListAction(forAdmin, params) as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SectorFilter);
