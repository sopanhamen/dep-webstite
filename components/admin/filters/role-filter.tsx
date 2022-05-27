import SelectFilter from '@shared/components/filters/select-filter';
import { arrayToPipeString } from '@shared/custom-function/conversion';
import { ISelectFilterOptions, ISharedCommonQueries } from '@shared/interfaces';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { filterActions } from 'store/admin/filter/filter.actions';
import { FilterState } from 'store/admin/filter/filter.reducers';
import { StoreState } from 'store/root-reducer';

interface IFilterRoleProps extends FilterState {
  forAdmin?: boolean;
  multiple?: boolean;
  value?: any;
  onChange?: (data: any) => void;
  resetRoles: (forAdmin: boolean, params: ISharedCommonQueries) => void;
}

function RoleFilter({
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
  resetRoles,
}: IFilterRoleProps) {
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
    resetRoles(forAdmin, getParams());
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
        value={value}
        isClearAll={true}
        isMulti={multiple}
        isLoading={isFetching}
        label="Role"
        options={options}
        onChange={onChange}
      />
    </>
  );
}

const mapStateToProps = (store: StoreState) => {
  return { ...store.filter.role };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const { resetRoleFilterListAction } = filterActions;

  return {
    resetRoles: (forAdmin: boolean = true, params: ISharedCommonQueries) =>
      dispatch(resetRoleFilterListAction(forAdmin, params) as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RoleFilter);
