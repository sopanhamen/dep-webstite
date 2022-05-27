import TrackerForm from '@components/admin/de-progress-tracker/tracker-form';
import ModificationModal from '@shared/components/modals/modification-modal';
import { EChartType } from '@shared/enum';
import { MFileImport } from '@shared/models/common.model';
import React from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { StoreState } from 'store/root-reducer';

interface ITrackerPayload {
  trackerTitleKh: string;
  trackerTitleEn: string;
  trackerDescriptionKh: string;
  trackerDescriptionEn: string;
  tagIconId: string;
  descriptions: [
    {
      kh: string;
      eng: string;
    },
  ];
  charts: [
    {
      chartType: EChartType;
    },
  ];
  metadata: {
    colorCode: string;
  };
}

const defaultValues: ITrackerPayload = {
  trackerTitleKh: '',
  trackerTitleEn: '',
  trackerDescriptionKh: '',
  trackerDescriptionEn: '',
  tagIconId: '',
  descriptions: [
    {
      kh: '',
      eng: '',
    },
  ],
  charts: [
    {
      chartType: EChartType.PIE,
    },
  ],
  metadata: {
    colorCode: '',
  },
};

interface IAddTracker {
  isShow: boolean;
  onClose: () => void;

  // redux props
  formArrayChartTypes?: EChartType[];
  importedFiles?: MFileImport[];
  chartsData?: any[];
}

function AddTracker(props: IAddTracker) {
  const { isShow, onClose, formArrayChartTypes, importedFiles, chartsData } =
    props;
  const {
    control,
    formState,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    register,
  } = useForm({ defaultValues });

  const onSubmit = (formData: ITrackerPayload) => {
    console.log('formData: ', formData);
    console.log('formArrayChartTypes: ', formArrayChartTypes);
    console.log('importedFiles: ', importedFiles);
    console.log('chartsData: ', chartsData);
  };

  return (
    <ModificationModal
      isShow={isShow}
      onClose={onClose}
      title="Add Tracker"
      className="modal-add-tracker"
    >
      <div>
        <hr />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModificationModal.Body>
            <TrackerForm
              control={control}
              errors={errors}
              disabled={false}
              watch={watch}
              setValue={setValue}
            />
          </ModificationModal.Body>
          <ModificationModal.Footer>
            <button className="admin-btn-add bth-submit" type="submit">
              Add
            </button>
          </ModificationModal.Footer>
        </form>
      </div>
    </ModificationModal>
  );
}

// store section
const mapStateToProps = (store: StoreState) => {
  const { importedFiles, chartsData, formArrayChartTypes } = store?.deTrackers;
  return { importedFiles, chartsData, formArrayChartTypes };
};

export default connect(mapStateToProps, null)(AddTracker);
