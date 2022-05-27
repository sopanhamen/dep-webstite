import React, { useEffect, useState } from 'react';
import { ICommonElementProps } from '@shared/interfaces';
import clsx from 'clsx';
import useTranslation from 'next-translate/useTranslation';

interface IAdminTabs extends ICommonElementProps {
  selectedTabs?: string | string[];
  onChange?: (selectedTabs: string[]) => void;
}

export default function AdminTabs({
  className,
  style,
  selectedTabs = [],
  onChange,
}: IAdminTabs): JSX.Element {
  const { t } = useTranslation();
  const totalTabs = 3;
  const [tabs, setTabs] = useState([
    {
      label: 'Ganeral',
      value: [],
      active: false,
    },
    {
      label: 'Tracker',
      value: ['Tracker'],
      active: false,
    },
  ]);

  const click = (tabs: string[] = []) => {
    onChange && onChange(tabs);
  };

  /*==========  Set true to equivalent pillar or to All if nothing is selected ==========*/
  useEffect(() => {
    const arr = tabs?.map((p, index) => {
      if (
        index === 0 &&
        ((selectedTabs?.length > 1 && selectedTabs?.length === totalTabs) ||
          !selectedTabs)
      )
        return { ...p, active: true };
      else if (JSON.stringify(selectedTabs) === JSON.stringify(p?.value))
        return { ...p, active: true };
      else return { ...p, active: false };
    });
    setTabs(arr);
  }, [selectedTabs]);

  return (
    <>
      <section
        className={clsx('section-admin-tabs client-pillars-tab', className)}
        style={style}
      >
        <div className="d-flex justify-content-start align-item-center flex-wrap">
          {tabs?.map((p, i) => (
            <div
              key={`pillar-tab-${i}`}
              className={clsx('tab', p?.active ? 'active' : '')}
              onClick={() => click(p?.value)}
            >
              {t(p?.label)}
            </div>
          ))}
        </div>
      </section>
      <div className="mb-4 border-bottom borderColor" />
    </>
  );
}
