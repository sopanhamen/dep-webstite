import {
  IEventBody,
  IEventForm,
} from '@components/admin/user-management/events/add-event';
import EventForm from '@components/admin/user-management/events/event-form';
import AdminListCard from '@shared/components/cards/admin-list-card';
import CmsPageTitle from '@shared/components/cards/cms-page-title';
import { APIServices } from '@shared/services/api.service';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import * as Redux from 'redux';
import eventActions from 'store/admin/user-management/events/event.actions';
import { StoreState } from 'store/root-reducer';

interface IEventDetailProp {
  getEvent: (id: string) => void;
  updateEvent: (id: string, body: IEventBody) => Promise<void>;
  event: IEventBody;
}

const defaultValues: IEventForm = {
  imageId: '',
  imageUrl: '',
  titleEn: '',
  titleKh: '',
  descriptionEn: '',
  descriptionKh: '',
  startDate: '',
  endDate: '',
  locationLink: '',
  meetingLink: '',
};

const EventDetail = (props: IEventDetailProp) => {
  const { getEvent, updateEvent, event } = props;

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({ defaultValues });

  const ac = new AbortController();
  const router = useRouter();
  const id = router?.query?.id as string;

  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (id) getEvent(id);
    return () => {
      APIServices.axiosCancelToken();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const detail = {
      imageId: event?.imageId || '',
      imageUrl: event?.imageUrl || '',
      titleEn: event?.locale?.en?.title || '',
      titleKh: event?.locale?.km?.title || '',
      descriptionEn: event?.locale?.en?.description || '',
      descriptionKh: event?.locale?.km?.description || '',
      startDate: event.startDate ? new Date(event.startDate) : '',
      endDate: event.endDate ? new Date(event.endDate) : '',
      locationLink: event?.locationLink || '',
      meetingLink: event?.meetingLink || '',
    };
    reset(detail);
    return () => {
      ac.abort();
    };
  }, [event]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleButtonChange = () => {
    if (!isEdit) return setIsEdit(true);
    handleSubmit(onSubmit)();
  };

  const onSubmit = (formData: IEventForm) => {
    const body = {
      title: formData?.titleEn,
      description: formData?.descriptionEn,
      imageId: formData?.imageId,
      startDate: formData.startDate && moment(formData.startDate).toISOString(),
      endDate: formData.endDate && moment(formData.endDate).toISOString(),
      locationLink: formData?.locationLink,
      meetingLink: formData?.meetingLink,
      locale: {
        en: {
          title: formData?.titleEn,
          description: formData?.descriptionEn,
        },
        km: {
          title: formData?.titleKh,
          description: formData?.descriptionKh,
        },
      },
    } as IEventBody;

    updateEvent(id, body).then(() => {
      setIsEdit(!isEdit);
      getEvent(id);
    });
  };

  const onCancel = () => {
    setIsEdit(!isEdit);
    getEvent(id);
  };

  return (
    <>
      <AdminListCard>
        <AdminListCard.Header className="d-flex flex-wrap align-items-center justify-content-between">
          <CmsPageTitle title="Event Detail" hasBackIcon />
          <div className="d-flex flex-wrap align-items-center">
            {isEdit && (
              <button className="admin-btn-cancel ctrl-mr" onClick={onCancel}>
                Cancel
              </button>
            )}
            <button className="admin-btn-add" onClick={handleButtonChange}>
              {isEdit ? 'Save' : 'Edit'}
            </button>
          </div>
        </AdminListCard.Header>
        <hr className="break-line ctrl-mt" />
        <AdminListCard.Body xScrollable={false} className="pt-3">
          <form>
            <EventForm
              control={control}
              errors={errors}
              watch={watch}
              setValue={setValue}
              reset={reset}
              disabled={!isEdit}
            />
          </form>
        </AdminListCard.Body>
      </AdminListCard>
    </>
  );
};

const mapStateToProps = (store: StoreState) => {
  const { eventDetail } = store?.userManagement?.event;

  return {
    event: eventDetail,
  };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch) => {
  const { getEventDetail, updateEvent } = eventActions;

  return {
    getEvent: (id: string) => dispatch(getEventDetail(id) as any),
    updateEvent: (id: string, body: IEventBody) =>
      dispatch(updateEvent(id, body) as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventDetail);
