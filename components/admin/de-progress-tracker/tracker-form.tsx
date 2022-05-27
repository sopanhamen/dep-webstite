import PropertiesTabs from '@components/admin/de-progress-tracker/properties-tabs';
import CustomChart from '@shared/components/charts/custom-chart';
import BaseInput from '@shared/components/form/base-input';
import BaseSelectColor from '@shared/components/form/base-select-color';
import ButtonImport from '@shared/components/form/button-import';
import FormArrayAction from '@shared/components/form/form-array-action';
import Quill from '@shared/components/rich-text-editor';
import UploadImages from '@shared/components/upload-image/upload-images';
import { toTitleCase } from '@shared/custom-function/conversion';
import { EChartDataType, EChartType, ELanguage } from '@shared/enum';
import { MFileImport } from '@shared/models/common.model';
import {
  IChartTrackerBody,
  IFormArrayChartTypesBody,
  ITrackerGetChartDataBody,
} from '@shared/models/de-tracker.model';
import { MImage } from '@shared/models/image-model';
import { FormService } from '@shared/services/form.service';
import React, { memo, useState } from 'react';
import { Control, Controller, useFieldArray } from 'react-hook-form';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { deTrackerActions } from 'store/admin/de-trackers/de-trackers.actions';
import { StoreState } from 'store/root-reducer';

interface ITrackForm {
  control: Control<any, object>;
  errors: any;
  disabled: boolean;
  watch: any;
  setValue: any;

  // redux props
  getTrackersChartsData?: (
    payload: IChartTrackerBody<ITrackerGetChartDataBody>,
  ) => Promise<any>;
  setTrackerImportFiles?: (
    payload: IChartTrackerBody<MFileImport>,
    type?: 'add' | 'remove',
  ) => void;
  exportSample?: (chartType?: EChartType) => Promise<any>;
  setFormArrayChartTypes?: (
    payload: IFormArrayChartTypesBody,
    type?: 'add' | 'remove',
  ) => void;
  removeTrackerChartData?: (index: number) => void;
  formArrayChartTypes?: EChartType[];
  importedFiles?: MFileImport[];
  chartsData?: any[];
}

const enum EFormArrayType {
  DESCRIPTION = 'description',
  CHART = 'chart',
}

function TrackerForm(props: ITrackForm) {
  const {
    getTrackersChartsData,
    setTrackerImportFiles,
    exportSample,
    setFormArrayChartTypes,
    removeTrackerChartData,
    control,
    errors,
    disabled,
    importedFiles,
    chartsData,
    formArrayChartTypes,
    watch,
    setValue,
  } = props;
  const [imageSrc, setImageSrc] = useState('');

  // form
  const descriptionArray = useFieldArray({
    control,
    name: 'descriptions',
  });
  const chartsArray = useFieldArray({
    control,
    name: 'charts',
  });

  //   functions section
  const handleAddFormArray = (type: EFormArrayType) => {
    if (type === EFormArrayType.CHART) {
      chartsArray?.append({});
      setFormArrayChartTypes &&
        setFormArrayChartTypes({
          index: +chartsArray?.fields?.length,
          chartType: EChartType.PIE,
        } as IFormArrayChartTypesBody);
    }
    if (type === EFormArrayType.DESCRIPTION) {
      descriptionArray?.append({
        kh: '',
        eng: '',
      });
    }
  };

  const handleRemoveFormArray = (type: EFormArrayType, index: number) => {
    if (type === EFormArrayType.DESCRIPTION) descriptionArray?.remove(index);
    if (type === EFormArrayType.CHART) {
      chartsArray?.remove(index);
      if (setTrackerImportFiles)
        setTrackerImportFiles(
          {
            body: {},
            index,
          } as IChartTrackerBody<MFileImport>,
          'remove',
        );
      if (setFormArrayChartTypes)
        setFormArrayChartTypes({ chartType: EChartType.BAR, index }, 'remove');
      if (removeTrackerChartData) removeTrackerChartData(index);
    }
  };

  // elements section
  const DescriptionElement = (): JSX.Element => {
    return (
      <div>
        <p className="sub-title">Body Tracker Description</p>
        <div className="border rounded p-3">
          {descriptionArray?.fields?.map((description, index) => {
            return (
              <div
                className="row mb-4 advance-descriptions-container"
                key={description?.id}
              >
                <FormArrayAction
                  variant="remove"
                  onClick={() =>
                    handleRemoveFormArray(EFormArrayType.DESCRIPTION, index)
                  }
                />
                <div className="col-md-6 col-sm-12">
                  <Controller
                    name={`descriptions.${index}.kh`}
                    control={control}
                    defaultValue=""
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }: any) => (
                      <Quill
                        currentValue={value}
                        updatedValue={onChange}
                        language={ELanguage.KHMER}
                        label="Description Kh"
                        helperText={FormService.getErrorMessage(
                          errors?.descriptions?.[index],
                          'kh',
                          'Description Kh',
                        )}
                      />
                    )}
                  />
                </div>

                <div className="col-md-6 col-sm-12">
                  <Controller
                    name={`descriptions.${index}.eng`}
                    control={control}
                    defaultValue=""
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }: any) => (
                      <Quill
                        currentValue={value}
                        updatedValue={onChange}
                        language={ELanguage.ENGLISH}
                        label="Description Eng"
                        helperText={FormService.getErrorMessage(
                          errors?.descriptions?.[index],
                          'eng',
                          'Description Eng',
                        )}
                      />
                    )}
                  />
                </div>
                {descriptionArray?.fields?.length - 1 !== index ? (
                  <div className="divider" />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  //   random color
  const dynamicColors = () => {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  };

  // eslint-disable-next-line react/display-name
  const MemoIframe = memo(
    ({ embeddedExcelLink, embeddedString, index }: any) => (
      <>
        <iframe
          src={`${embeddedExcelLink}${importedFiles?.[index]?.url}${embeddedString}`}
          frameBorder="0"
          style={{ width: '100%', height: '500px' }}
        />
      </>
    ),
  );

  const ChartElement = (): JSX.Element => {
    // link for embedded excel
    const embeddedExcelLink =
      'https://view.officeapps.live.com/op/embed.aspx?src=';
    const embeddedString = '&embedded=true';

    return (
      <div>
        <p className="sub-title">Chart</p>
        <div className="border rounded p-3">
          {chartsArray?.fields?.map((chart, index) => {
            return (
              <div key={chart.id} className="advance-chats-container">
                <FormArrayAction
                  variant="remove"
                  onClick={() =>
                    handleRemoveFormArray(EFormArrayType.CHART, index)
                  }
                />

                {/* file section */}
                <div className="d-flex align-items-center">
                  <ButtonImport
                    id={`import_file_${chart?.id}`}
                    fileData={(file: MFileImport) => {
                      if (file?.url) {
                        if (setTrackerImportFiles)
                          setTrackerImportFiles({
                            body: file,
                            index,
                          } as IChartTrackerBody<MFileImport>);
                      }
                      const payload: ITrackerGetChartDataBody = {
                        name: file?.name,
                        chartType: undefined,
                        dataType: EChartDataType.CHART_JS,
                      };
                      const newPayload: IChartTrackerBody<ITrackerGetChartDataBody> =
                        {
                          index,
                          body: payload,
                        };
                      if (getTrackersChartsData)
                        getTrackersChartsData(newPayload);
                    }}
                    className="me-2"
                  />
                  <button
                    className="admin-btn-cancel"
                    type="button"
                    onClick={() =>
                      exportSample &&
                      exportSample(
                        formArrayChartTypes?.[index] === EChartType.SCATTER
                          ? EChartType.SCATTER
                          : undefined,
                      ).then(async (res) => {
                        //   this download function will replace the global one
                        const byteArray = new Uint8Array(res);

                        const blob = new Blob([byteArray]);
                        const url = window.URL.createObjectURL(blob);

                        const a = document.createElement('a');
                        document.body.appendChild(a);
                        a.setAttribute('style', 'display: none');
                        a.href = url;
                        a.download = `${formArrayChartTypes?.[
                          index
                        ]?.toLowerCase()}-sample.xlsx`;
                        a.click();
                        window.URL.revokeObjectURL(url);
                        a.remove();
                      })
                    }
                  >
                    Export Sample ({toTitleCase(formArrayChartTypes?.[index])})
                  </button>
                </div>

                <div className="row">
                  <div className="col-md-6 p-3" style={{ minHeight: '350px' }}>
                    <p>Chart Title</p>
                    {chartsData?.[index]?.datasets && (
                      <CustomChart
                        chartType={formArrayChartTypes?.[index] as EChartType}
                        currentData={{
                          labels: chartsData?.[index]?.labels,
                          datasets: chartsData?.[index]?.datasets?.map(
                            (item: any) => ({
                              backgroundColor: dynamicColors(),
                              ...item,
                            }),
                          ),
                        }}
                        title="Chart title here"
                        withSlider={false}
                      />
                    )}
                  </div>
                  <div className="col-md-6 p-3">
                    <PropertiesTabs index={index} />
                  </div>
                </div>
                <div className="py-3">
                  <MemoIframe
                    embeddedExcelLink={embeddedExcelLink}
                    embeddedString={embeddedString}
                    index={index}
                  />
                </div>

                {chartsArray?.fields?.length - 1 !== index ? (
                  <div className="divider" />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <UploadImages
            imageData={(image: MImage) => {
              console.log('image: ', image);
              setValue('tagIconId', image?.fileId);
              setImageSrc(image?.url);
            }}
            label="Tags Icon"
            imageSrc={imageSrc}
            imageAlt=""
            className="upload-tags"
          />
        </div>
        <div className="col-md-6 col-sm-12">
          <Controller
            name="metadata.colorCode"
            control={control}
            defaultValue=""
            rules={{
              required: true,
            }}
            render={({ field: { value, onChange } }: any) => (
              <BaseSelectColor
                onChange={onChange}
                value={value}
                helperText={FormService.getErrorMessage(
                  errors,
                  'metadata.colorCode',
                  'Color',
                )}
                disabled={disabled}
              />
            )}
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6 col-sm-12">
          <Controller
            name="trackerTitleKh"
            control={control}
            defaultValue=""
            rules={{
              required: true,
            }}
            render={({ field: { ref, value, onChange } }: any) => (
              <BaseInput
                label="Tracker Title Kh"
                refs={ref}
                value={value}
                onChange={onChange}
                helperText={FormService.getErrorMessage(
                  errors,
                  'trackerTitleKh',
                  'Tracker Title Kh',
                )}
                disabled={disabled}
              />
            )}
          />
        </div>
        <div className="col-md-6 col-sm-12">
          <Controller
            name="trackerTitleEn"
            control={control}
            defaultValue=""
            rules={{
              required: true,
            }}
            render={({ field: { ref, value, onChange } }: any) => (
              <BaseInput
                label="Tracker Title Eng"
                refs={ref}
                value={value}
                onChange={onChange}
                helperText={FormService.getErrorMessage(
                  errors,
                  'trackerTitleEn',
                  'Tracker Title Eng',
                )}
                disabled={disabled}
              />
            )}
          />
        </div>
        <div className="col-md-6 col-sm-12">
          <Controller
            name="trackerDescriptionKh"
            control={control}
            defaultValue=""
            rules={{
              required: true,
            }}
            render={({ field: { ref, value, onChange } }: any) => (
              <BaseInput
                label="Tracker Description Kh"
                refs={ref}
                value={value}
                onChange={onChange}
                helperText={FormService.getErrorMessage(
                  errors,
                  'trackerDescriptionKh',
                  'Tracker Description Kh',
                )}
                disabled={disabled}
              />
            )}
          />
        </div>
        <div className="col-md-6 col-sm-12">
          <Controller
            name="trackerDescriptionEn"
            control={control}
            defaultValue=""
            rules={{
              required: true,
            }}
            render={({ field: { ref, value, onChange } }: any) => (
              <BaseInput
                label="Tracker Description En"
                refs={ref}
                value={value}
                onChange={onChange}
                helperText={FormService.getErrorMessage(
                  errors,
                  'trackerDescriptionEn',
                  'Tracker Description En',
                )}
                disabled={disabled}
              />
            )}
          />
        </div>
      </div>

      {/* add description section */}
      {descriptionArray?.fields?.length ? <DescriptionElement /> : null}
      <div>
        <FormArrayAction
          title="Add Body Tracker Description"
          onClick={() => handleAddFormArray(EFormArrayType.DESCRIPTION)}
          className="my-2"
        />
      </div>

      {/* add chart section */}
      {chartsArray?.fields?.length ? <ChartElement /> : null}
      <div>
        <FormArrayAction
          title="Add Chart"
          onClick={() => handleAddFormArray(EFormArrayType.CHART)}
          className="my-2"
        />
      </div>
    </div>
  );
}

// store section
const mapStateToProps = (store: StoreState) => {
  const { importedFiles, chartsData, formArrayChartTypes } = store?.deTrackers;
  return { importedFiles, chartsData, formArrayChartTypes };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const {
    getTrackersChartsData,
    setTrackerImportFiles,
    exportSample,
    setFormArrayChartTypes,
    removeTrackerChartData,
  } = deTrackerActions;
  return {
    getTrackersChartsData: (
      body: IChartTrackerBody<ITrackerGetChartDataBody>,
    ) => dispatch(getTrackersChartsData(body) as any),
    setTrackerImportFiles: (
      payload: IChartTrackerBody<MFileImport>,
      type?: 'add' | 'remove',
    ) => dispatch(setTrackerImportFiles(payload, type) as any),
    exportSample: (chartType?: EChartType) =>
      dispatch(exportSample(chartType) as any),
    setFormArrayChartTypes: (
      payload: IFormArrayChartTypesBody,
      type?: 'add' | 'remove',
    ) => dispatch(setFormArrayChartTypes(payload, type) as any),
    removeTrackerChartData: (index: number) =>
      dispatch(removeTrackerChartData(index) as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TrackerForm);
