import AdminPagination from '@components/admin/table/admin-pagination';
import AppTable from '@components/admin/table/app-table';
import AdminListCard from '@shared/components/cards/admin-list-card';
import MoreDropDown from '@shared/components/drop-down-button';
import AdminSearch from '@shared/components/filters/admin-search';
import BaseTextArea from '@shared/components/form/base-textarea';
import ModificationModal from '@shared/components/modals/modification-modal';
import AdminTableImg from '@shared/components/table/admin-table-img';
import { userVerificationHeader } from '@shared/constant';
import { activePage, removeFalseyObject } from '@shared/custom-function/common';
import { ELanguage, EStatus, ETextColor } from '@shared/enum';
import {
  IAction,
  IAdminPaginationData,
  ICommonQueries,
  IMessagePayload,
  IToggle,
} from '@shared/interfaces';
import { UserVerification } from '@shared/models/user-management/user-verification.modal';
import { FormService } from '@shared/services/form.service';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Controller, useForm, UseFormHandleSubmit } from 'react-hook-form';
import { connect } from 'react-redux';
import * as Redux from 'redux';
import { UserVerificationActions } from 'store/admin/user-management/user-verification/user-verification.actions';
import { UserVerificationState } from 'store/admin/user-management/user-verification/user-verification.reducers';
import { StoreState } from 'store/root-reducer';

interface IUserPermissions extends UserVerificationState {
  getUserVerification: (payload: ICommonQueries) => Promise<void>;
  toggle: (id: string, payload: IToggle) => void;
  onSubmitNote: (
    id: string,
    payload: IToggle,
    param: IMessagePayload,
  ) => Promise<void>;
}

interface IMessage {
  onSubmit: (formData: IMessagePayload) => void;
  handleSubmit: UseFormHandleSubmit<IMessagePayload>;
}

const defaultValues: IMessagePayload = {
  note: '',
};

function UserVerificationLists({
  isRequesting,
  metadata,
  userVerifications,
  getUserVerification,
  onSubmitNote,
  toggle,
}: IUserPermissions): JSX.Element {
  const [search, setSearch] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isId, setId] = useState('');
  let { t } = useTranslation();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ defaultValues });

  useEffect(() => {
    const payload: ICommonQueries = {
      limit: metadata.limit,
      offset: metadata.offset,
      search,
      status: EStatus.PENDING,
    };

    getUserVerification(payload);
  }, [search, submitting]); // eslint-disable-line react-hooks/exhaustive-deps

  const pagination = (e: IAdminPaginationData) => {
    const payload: ICommonQueries = {
      limit: e.limit,
      offset: e.limit * (e.activePage - 1),
      search,
      status: EStatus.PENDING,
    };

    getUserVerification(removeFalseyObject(payload));
  };

  const moreOptionToDisplay = (stat: string): IAction[] => {
    let value: IAction[] = [];
    if (stat === EStatus.PENDING) {
      value = [
        {
          name: 'approve',
          color: ETextColor.BLUE,
        },
        {
          name: 'reject',
          color: ETextColor.RED,
        },
      ];
    }

    return value;
  };

  const onSubmit = (formData: IMessagePayload) => {
    setSubmitting(true);
    const payload = { status: EStatus.REJECT };
    const body = {
      note: formData.note,
    };
    onSubmitNote(isId, payload, body).then((res) => {
      setShowMessageModal(false);
    });
  };

  return (
    <AdminListCard>
      <AdminListCard.Header>
        <div className="d-flex justify-content-between">
          <AdminSearch
            className="ctrl-mr ctrl-mb width-300"
            text={search}
            onChangeText={(d) => {
              setSearch(d.text);
            }}
          />
        </div>
      </AdminListCard.Header>
      <AdminListCard.Body>
        <AppTable
          headers={userVerificationHeader}
          loading={isRequesting}
          total={metadata.total}
        >
          {userVerifications?.map((list: UserVerification, index: number) => (
            <tr key={index}>
              <td>{list.fullName}</td>
              <td>{list.email}</td>
              <td>{list.phoneNumber}</td>
              <td>{list.userRole}</td>
              <td>{list.projectOwner}</td>
              <td>
                <AdminTableImg src={list?.organizationIcon} alt="icon" />
              </td>
              <td>{list.organizationName}</td>
              <td>{list.organizationType}</td>
              <td>{list.organizationPillar}</td>
              <td>
                {list.organizationSector?.map((sector: any, i: number) => (
                  <p key={i}>{sector.name}</p>
                ))}
              </td>
              <td>{list.website}</td>
              <td>{list.description}</td>
              <td className="text-capitalize">{list.status.toLowerCase()}</td>
              <td className="text-capitalize">
                <MoreDropDown
                  actions={moreOptionToDisplay(list?.status)}
                  selectedActions={(status: string) => {
                    if (status === 'reject') {
                      setShowMessageModal(true);
                      setId(list?.id);
                    } else {
                      const payload = { status: EStatus.APPROVE };
                      toggle(list?.id, payload);
                    }
                  }}
                />
              </td>
            </tr>
          ))}
        </AppTable>
      </AdminListCard.Body>
      <AdminListCard.Footer>
        <AdminPagination
          activePage={activePage(metadata)}
          limit={metadata?.limit}
          totalItem={metadata?.total}
          onChange={pagination}
        />
      </AdminListCard.Footer>
      <ModificationModal
        title="Note"
        isShow={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        size="lg"
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="note"
            control={control}
            defaultValue=""
            rules={{
              required: true,
              maxLength: 200,
            }}
            render={({ field: { ref, value, onChange, ...field } }: any) => (
              <BaseTextArea
                {...field}
                label="Note"
                placeholder="Have any Comment, text here."
                className="mb-3"
                refs={ref}
                value={value}
                onChange={onChange}
                error={errors?.note}
                helperText={FormService.getErrorMessage(
                  errors,
                  'note',
                  'note',
                  'note should contain 200 characters',
                )}
              />
            )}
          />
          <Button type="submit" className={`base-btn w-100 bg-blue `}>
            {t('common:buttons.submit')}
          </Button>
        </Form>
      </ModificationModal>
    </AdminListCard>
  );
}

const mapStateToProps = (store: StoreState) => {
  return { ...store.userManagement.userVerification };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch) => {
  const { getUserVerification, toggleStatusAction, onSubmitNote } =
    UserVerificationActions;

  return {
    getUserVerification: (payload: ICommonQueries) =>
      dispatch(getUserVerification(payload, ELanguage.ENGLISH) as any),

    toggle: (id: string, payload: IToggle) =>
      dispatch(toggleStatusAction(id, payload) as any),
    onSubmitNote: (id: string, payload: IToggle, param: IMessagePayload) =>
      dispatch(onSubmitNote(id, payload, param) as any),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserVerificationLists);
