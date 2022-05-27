import React, { useEffect, useState } from 'react';
import { ICommonElementProps, IMetadata } from '@shared/interfaces';
import clsx from 'clsx';
import useTranslation from 'next-translate/useTranslation';
import SelectFilter from '@shared/components/filters/select-filter';
import { ISelectFilterOptions, ISharedCommonQueries } from '@shared/interfaces';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { filterActions } from 'store/admin/filter/filter.actions';
import { FilterState } from 'store/admin/filter/filter.reducers';
import { StoreState } from 'store/root-reducer';
import { getLocale } from '@shared/custom-function/common';
import { IType } from '@shared/interfaces/resource-hub';
import { locales } from 'moment';
import { MLocaleParent } from '@shared/models/common.model';

interface IClientFileTypeTabs extends ICommonElementProps {
  forAdmin?: boolean;
  selectedFileType?: string | string[];
  data?: any;
  metadata?: IMetadata;
  onChange?: (selectedFileType: string[]) => void;
}

function ClientFileTypeTabs({
  forAdmin = false,
  className,
  style,
  data,
  metadata,
  selectedFileType = [],
  onChange,
}: IClientFileTypeTabs): JSX.Element {
  const { t } = useTranslation();
  const totalPillars = metadata?.total;

  const [isfileType, setFileTypes] = useState<ISelectFilterOptions[]>([]);

  const [isAll, setAll] = useState(true);

  useEffect(() => {
    const list = data?.map((d: IType) => {
      return {
        label: d.name,
        locale: d.locale,
        value: [d.code],
        active: false,
      };
    });
    setFileTypes(list) as any;
  }, [data, setFileTypes]);

  const click = (isfileType: string[] = []) => {
    if (isfileType?.length >= 1) setAll(false);
    else setAll(true);

    onChange && onChange(isfileType);
  };

  /*==========  Set true to equivalent pillar or to All if nothing is selected ==========*/
  useEffect(() => {
    const arr = isfileType?.map((p, index) => {
      if (
        index === 0 &&
        ((selectedFileType?.length > 1 &&
          selectedFileType?.length === totalPillars) ||
          !selectedFileType)
      )
        return { ...p, active: true };
      else if (JSON.stringify(selectedFileType) === JSON.stringify(p?.value))
        return { ...p, active: true };
      else return { ...p, active: false };
    });
    setFileTypes(arr);
  }, [selectedFileType]);

  return (
    <>
      {selectedFileType?.length > 1 &&
      selectedFileType?.length !== totalPillars ? (
        ''
      ) : (
        <section
          className={clsx('client-pillars-tab', className)}
          style={style}
        >
          <div className="container center flex-wrap">
            <div
              key={`pillar-tab-0`}
              className={clsx('tab ', isAll ? 'active' : '')}
              onClick={() => click()}
            >
              {t('common:filter.all')}
            </div>

            {isfileType?.map((p, i) => (
              <div
                key={`pillar-tab-${i + 1}`}
                className={clsx('tab', p?.active ? 'active' : '')}
                onClick={() => click(p?.value)}
              >
                {getLocale(p?.locale?.en?.name, p?.locale?.km?.name)}
              </div>
            ))}
          </div>
        </section>
      )}
      <div className="mb-4 border-bottom" />
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

export default connect(mapStateToProps, mapDispatchToProps)(ClientFileTypeTabs);
