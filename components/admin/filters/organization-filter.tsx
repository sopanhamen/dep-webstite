import SelectFilter from '@shared/components/filters/select-filter';
import { arrayToPipeString } from '@shared/custom-function/conversion';
import { ISelectFilterOptions, ISharedCommonQueries } from '@shared/interfaces';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { filterActions } from 'store/admin/filter/filter.actions';
import { FilterState } from 'store/admin/filter/filter.reducers';
import { StoreState } from 'store/root-reducer';

interface IFilterOrganizationProps extends FilterState {
  forAdmin?: boolean;
  multiple?: boolean;
  value?: any;
  label?: string;
  onChange?: (data: any) => void;
  resetOrganizations: (forAdmin: boolean, params: ISharedCommonQueries) => void;
}

function OrganizationFilter({
  forAdmin = true,
  multiple = true,
  value,
  label = 'Project Owner',
  onChange,
  limit = 0,
  offset = 0,
  search = '',
  statuses = ['ACTIVE'],
  data,
  isFetching,
  resetOrganizations,
}: IFilterOrganizationProps) {
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
    !data?.length && resetOrganizations(forAdmin, getParams());
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
        label={label}
        options={options}
        onChange={onChange}
      />
    </>
  );
}

const mapStateToProps = (store: StoreState) => {
  return { ...store.filter.organization };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const { resetOrganizationFilterListAction } = filterActions;

  return {
    resetOrganizations: (
      forAdmin: boolean = true,
      params: ISharedCommonQueries,
    ) => dispatch(resetOrganizationFilterListAction(forAdmin, params) as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationFilter);
