import BaseImage from '@shared/components/images/base-image';
import { ICON_URL } from '@shared/constant';
import { EChartDataType, EChartType } from '@shared/enum';
import { MFileImport } from '@shared/models/common.model';
import {
  IChartMenuItem,
  IChartTrackerBody,
  IFormArrayChartTypesBody,
  ITrackerGetChartDataBody,
} from '@shared/models/de-tracker.model';
import clsx from 'clsx';
import React, { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { deTrackerActions } from 'store/admin/de-trackers/de-trackers.actions';
import { StoreState } from 'store/root-reducer';

const chartTypes: IChartMenuItem[] = [
  { title: 'Pie', src: ICON_URL.PIE_CHART, type: EChartType.PIE },
  {
    title: 'Doughnut',
    src: ICON_URL.DOUGHNUT_CHART,
    type: EChartType.DOUGHNUT,
  },
  { title: 'Line', src: ICON_URL.LINE_CHART, type: EChartType.LINE },
  { title: 'Bar', src: ICON_URL.BAR_CHART, type: EChartType.BAR },
  { title: 'Scatter', src: ICON_URL.SCATTER_CHART, type: EChartType.SCATTER },
];

interface IPropertiesTabs {
  index: number;

  // redux props
  setFormArrayChartTypes?: (
    payload: IFormArrayChartTypesBody,
    type?: 'add' | 'remove',
  ) => void;
  getTrackersChartsData?: (
    payload: IChartTrackerBody<ITrackerGetChartDataBody>,
  ) => void;
  importedFiles?: MFileImport[];
  formArrayChartTypes?: EChartType[];
}

function PropertiesTabs({
  index,

  // redux props
  getTrackersChartsData,
  importedFiles,
  setFormArrayChartTypes,
  formArrayChartTypes,
}: IPropertiesTabs) {
  const [key, setKey] = useState('chartTypes');

  const handleChartTypeChanged = (chart: IChartMenuItem) => {
    let payload: ITrackerGetChartDataBody = {
      name: importedFiles?.[index]?.name || '',
      chartType: EChartType.SCATTER,
      dataType: EChartDataType.CHART_JS,
    };
    if (chart.type === EChartType.SCATTER) {
      payload.chartType = EChartType.SCATTER;
    } else {
      payload.chartType = undefined;
    }

    setFormArrayChartTypes &&
      setFormArrayChartTypes({
        index,
        chartType: chart?.type,
      } as IFormArrayChartTypesBody);
    if (
      formArrayChartTypes?.[index] === EChartType.SCATTER ||
      chart.type === EChartType.SCATTER
    ) {
      const newPayload: IChartTrackerBody<ITrackerGetChartDataBody> = {
        index,
        body: payload,
      };
      if (importedFiles?.[index]?.name) {
        getTrackersChartsData && getTrackersChartsData(newPayload);
      }
    }
  };

  const ChartTypes = (): JSX.Element => {
    return (
      <div className="chart-types-container">
        {chartTypes?.map((chart) => (
          <div
            className={clsx(
              'chart-action',
              formArrayChartTypes?.[index] === chart?.type && 'chart-active',
            )}
            key={chart.src}
            onClick={() => handleChartTypeChanged(chart)}
          >
            <BaseImage src={chart.src} width={40} height={40} />
            <div className="action-name">{chart.title}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="properties-tab-container p-3">
      <Tabs
        defaultActiveKey="profile"
        id="uncontrolled-tab-example"
        className="mb-3 properties-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k as string)}
      >
        <Tab
          eventKey="chartTypes"
          title="Chart Types"
          className="properties-tab-content"
        >
          <ChartTypes />
        </Tab>
        <Tab
          eventKey="refined"
          title="Refined"
          className="properties-tab-content"
        >
          <h1>Refined</h1>
        </Tab>
        <Tab
          eventKey="annotate"
          title="Annotate"
          className="properties-tab-content"
        >
          <h1>Annotate</h1>
        </Tab>
      </Tabs>
    </div>
  );
}

// store section
const mapStateToProps = (store: StoreState) => {
  const { formArrayChartTypes, importedFiles } = store?.deTrackers;
  return { formArrayChartTypes, importedFiles };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const { getTrackersChartsData, setFormArrayChartTypes } = deTrackerActions;
  return {
    setFormArrayChartTypes: (
      payload: IFormArrayChartTypesBody,
      type: 'add' | 'remove' = 'add',
    ) => dispatch(setFormArrayChartTypes(payload, type) as any),
    getTrackersChartsData: (
      body: IChartTrackerBody<ITrackerGetChartDataBody>,
    ) => dispatch(getTrackersChartsData(body) as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PropertiesTabs);
