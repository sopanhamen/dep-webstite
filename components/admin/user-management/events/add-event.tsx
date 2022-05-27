import ModificationModal from '@shared/components/modals/modification-modal';
import { IDefaultForm } from '@shared/interfaces';
import { MLocaleParent } from '@shared/models/common.model';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import * as Redux from 'redux';
import eventActions from 'store/admin/user-management/events/event.actions';
import EventForm from './event-form';

interface IAddEventProps {
  isShow: boolean;
  onClose: () => void;
  createEvent: (body: IEventBody) => Promise<void>;
}

export interface IEventForm extends Partial<IDefaultForm> {
  imageId?: string;
  imageUrl?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  locationLink?: string;
  meetingLink?: string;
}

export interface IEventBody extends IEventForm {
  title?: string;
  description?: string;
  address?: string;
  locale?: MLocaleParent;
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

function AddEvent(props: IAddEventProps) {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({ defaultValues });

  const { isShow, onClose, createEvent } = props;

  useEffect(() => {
    reset();
  }, [onClose]);

  const handleCloseModal = () => {
    onClose();
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

    createEvent(body).then(() => {
      onClose();
      reset();
    });
  };

  return (
    <ModificationModal
      title="Add Event"
      isShow={isShow}
      onClose={handleCloseModal}
      size="lg"
    >
      <ModificationModal.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          <EventForm
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />
        </form>
      </ModificationModal.Body>
      <ModificationModal.Footer>
        <button
          className="admin-btn-add bth-submit mt-2"
          type="submit"
          onClick={() => handleSubmit(onSubmit)()}
        >
          Add
        </button>
      </ModificationModal.Footer>
    </ModificationModal>
  );
}

const mapDispatchToProps = (dispatch: Redux.Dispatch) => {
  const { createEvent } = eventActions;

  return {
    createEvent: (body: IEventBody) => dispatch(createEvent(body) as any),
  };
};

export default connect(null, mapDispatchToProps)(AddEvent);
