import SelectFilter from '@shared/components/filters/select-filter';
import { ISelectFilterOptions, ISharedCommonQueries } from '@shared/interfaces';
import useTranslation from 'next-translate/useTranslation';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { filterActions } from 'store/admin/filter/filter.actions';
import { FilterState } from 'store/admin/filter/filter.reducers';
import { StoreState } from 'store/root-reducer';

interface IFilterExtensionProps extends FilterState {
  forAdmin?: boolean;
  multiple?: boolean;
  value?: any;
  onChange?: (data: any) => void;
  resetExtension: (forAdmin: boolean) => void;
}

function ExtensionFilter({
  forAdmin = true,
  multiple = true,
  value,
  onChange,
  limit = 0,
  offset = 0,
  data,
  isFetching,
  resetExtension,
}: IFilterExtensionProps) {
  const { t } = useTranslation();
  const [options, setOptions] = useState<ISelectFilterOptions[]>();

  const getParams = () => {
    return {
      limit,
      offset,
    } as ISharedCommonQueries;
  };

  useEffect(() => {
    resetExtension(forAdmin);
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
        label="File"
        options={options}
        onChange={onChange}
      />
    </>
  );
}

const mapStateToProps = (store: StoreState) => {
  return { ...store.filter.extension };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const { resetExtensionsFilterListAction } = filterActions;

  return {
    resetExtension: (forAdmin: boolean = true) =>
      dispatch(resetExtensionsFilterListAction(forAdmin) as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExtensionFilter);
