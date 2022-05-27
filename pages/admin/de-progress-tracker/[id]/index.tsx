import AddTracker from '@components/admin/de-progress-tracker/add-tracker';
import { defaultPillarsFormValues } from '@components/admin/de-progress-tracker/ganeral-form';
import GaneralList from '@components/admin/de-progress-tracker/ganeral-list';
import TrackerList from '@components/admin/de-progress-tracker/tracker-list';
import { defaultNewsFormValues } from '@components/admin/news/news-form';
import AdminListCard from '@shared/components/cards/admin-list-card';
import CmsPageTitle from '@shared/components/cards/cms-page-title';
import AppLoading from '@shared/components/loadings/app-loading';
import { deTrackerGaneralHeaders, deTrackerHeaders } from '@shared/constant';
import { ITableHeader, IToggle } from '@shared/interfaces';
import { IPillarAPIBody, MPillarForm } from '@shared/models/de-tracker.model';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { deTrackerActions } from 'store/admin/de-trackers/de-trackers.actions';
import { DETrackerState } from 'store/admin/de-trackers/de-trackers.reducers';
import { StoreState } from 'store/root-reducer';

export interface IDETrackerProps extends DETrackerState {
  getPillarsDetail: (id: string) => void;
  updatePillar: (id: string, body: IPillarAPIBody) => Promise<void>;
}

function DETrackerList({
  getPillarsDetail,
  isFetching,
  pillarsDetail,
  updatePillar,
}: IDETrackerProps) {
  const router = useRouter();
  const [isShowAddTracker, setIsShowAddTracker] = useState(false);
  const id = router?.query?.id as string;
  const [editable, setEditable] = useState(false);
  const [key, setKey] = useState('ganeral');

  const cancelEdit = () => {
    setEditable(false);
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: defaultNewsFormValues });

  const refreshPage = () => {
    setEditable(false);
    if (!id) return;
    getPillarsDetail(id);
  };

  const submit = (formData: MPillarForm) => {
    if (!formData) return;
    const body: IPillarAPIBody = {
      description: formData?.descriptionEn,
      locale: {
        en: {
          description: formData?.descriptionEn,
        },
        km: {
          description: formData?.descriptionKh,
        },
      },
    };

    updatePillar(pillarsDetail?.id + '', body).then((r) => {
      refreshPage();
    });
  };

  useEffect(() => {
    refreshPage();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!pillarsDetail) return;
    const pillar = new MPillarForm(pillarsDetail);
    reset(pillar);
  }, [pillarsDetail]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      {/* add tracker */}
      <AddTracker
        isShow={isShowAddTracker}
        onClose={() => setIsShowAddTracker(false)}
      />

      <AdminListCard>
        <AdminListCard.Header>
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <CmsPageTitle title={pillarsDetail?.name} hasBackIcon={false} />
            {key === 'ganeral' ? (
              <>
                {editable ? (
                  <div>
                    <button
                      className="admin-btn-cancel ctrl-mr"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                    <button
                      className="admin-btn-save"
                      onClick={handleSubmit(submit)}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    className="admin-btn-edit"
                    onClick={() => setEditable(!editable)}
                    disabled={!id || isFetching}
                  >
                    Edit
                  </button>
                )}
              </>
            ) : (
              <button
                className="admin-btn-add"
                onClick={() => setIsShowAddTracker(true)}
              >
                Add Tracker
              </button>
            )}
          </div>

          <div className="border-bottom my-2"></div>
        </AdminListCard.Header>

        {/*========== Card Body (Unscrollable) ==========*/}
        <AdminListCard.Body xScrollable={false} yScrollable={false}>
          <Tabs
            activeKey={key}
            onSelect={(k) => setKey(k as string)}
            transition={true}
            id="noanim-tab-example"
            className="mb-3 section-admin-tabs client-pillars-tab borderColor"
          >
            <Tab eventKey="ganeral" title="General">
              <GaneralList
                control={control}
                errors={errors}
                editable={editable}
              />
            </Tab>
            <Tab eventKey="tracker" title="Tracker">
              <TrackerList pCode={pillarsDetail?.code} />
            </Tab>
          </Tabs>
        </AdminListCard.Body>
      </AdminListCard>
    </div>
  );
}

const mapStateToProps = (store: StoreState) => {
  return { ...store.deTrackers };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const { getPillarsListIdAction, updatePillars } = deTrackerActions;

  return {
    getPillarsDetail: (id: string) =>
      dispatch(getPillarsListIdAction(id) as any),
    updatePillar: (id: string, body: IPillarAPIBody) =>
      dispatch(updatePillars(id, body) as any),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(DETrackerList);
