import SelectFilter from '@shared/components/filters/select-filter';
import { ISelectFilterOptions, ISharedCommonQueries } from '@shared/interfaces';
import useTranslation from 'next-translate/useTranslation';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { filterActions } from 'store/admin/filter/filter.actions';
import { FilterState } from 'store/admin/filter/filter.reducers';
import { StoreState } from 'store/root-reducer';

interface IFilterTypeProps extends FilterState {
  forAdmin?: boolean;
  multiple?: boolean;
  value?: any;
  onChange?: (data: any) => void;
  resetType: (forAdmin: boolean, params: ISharedCommonQueries) => void;
}

function TypeFilter({
  forAdmin = false,
  multiple = true,
  value,
  onChange,
  limit = 0,
  offset = 0,
  data,
  isFetching,
  resetType,
}: IFilterTypeProps) {
  const { t } = useTranslation();
  const [options, setOptions] = useState<ISelectFilterOptions[]>();

  const getParams = () => {
    return {
      limit,
      offset,
    } as ISharedCommonQueries;
  };

  useEffect(() => {
    resetType(forAdmin, getParams());
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
        label="Type"
        options={options}
        onChange={onChange}
      />
    </>
  );
}

const mapStateToProps = (store: StoreState) => {
  return { ...store.filter.fileType };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const { resetTypeFilterListAction } = filterActions;

  return {
    resetType: (forAdmin: boolean = true, params: ISharedCommonQueries) =>
      dispatch(resetTypeFilterListAction(forAdmin, params) as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TypeFilter);
