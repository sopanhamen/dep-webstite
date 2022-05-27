import React, { useEffect, useState } from 'react';
import { ICommonElementProps } from '@shared/interfaces';
import clsx from 'clsx';
import useTranslation from 'next-translate/useTranslation';

interface IClientPillarTabs extends ICommonElementProps {
  selectedPillars?: string | string[];
  onChange?: (selectedPillars: string[]) => void;
}

export default function ClientPillarTabs({
  className,
  style,
  selectedPillars = [],
  onChange,
}: IClientPillarTabs): JSX.Element {
  const { t } = useTranslation();
  const totalPillars = 3;
  const [pillars, setPillars] = useState([
    {
      label: 'common:filter.all',
      value: [],
      active: false,
    },
    {
      label: 'common:filter.digital_government',
      value: ['DIGITAL-GOVERNMENT'],
      active: false,
    },
    {
      label: 'common:filter.digital_citizen',
      value: ['DIGITAL-CITIZEN'],
      active: false,
    },
    {
      label: 'common:filter.digital_business',
      value: ['DIGITAL-BUSINESS'],
      active: false,
    },
  ]);

  const click = (pillars: string[] = []) => {
    onChange && onChange(pillars);
  };

  /*==========  Set true to equivalent pillar or to All if nothing is selected ==========*/
  useEffect(() => {
    const arr = pillars?.map((p, index) => {
      if (
        index === 0 &&
        ((selectedPillars?.length > 1 &&
          selectedPillars?.length === totalPillars) ||
          !selectedPillars)
      )
        return { ...p, active: true };
      else if (JSON.stringify(selectedPillars) === JSON.stringify(p?.value))
        return { ...p, active: true };
      else return { ...p, active: false };
    });
    setPillars(arr);
  }, [selectedPillars]);

  return (
    <>
      {selectedPillars?.length > 1 &&
      selectedPillars?.length !== totalPillars ? (
        ''
      ) : (
        <section
          className={clsx('client-pillars-tab', className)}
          style={style}
        >
          <div className="container center flex-wrap">
            {pillars?.map((p, i) => (
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
      )}
      <div className="mb-4 border-bottom" />
    </>
  );
}
