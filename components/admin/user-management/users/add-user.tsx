import OrganizationForm from '@components/admin/user-management/organizations/organization-form';
import UserForm from '@components/admin/user-management/users/user-form';
import ModificationModal from '@shared/components/modals/modification-modal';
import { EStatus } from '@shared/enum';
import { EClassification } from '@shared/enum/classification.enum';
import { MSelectOption } from '@shared/models/common.model';
import { Organization } from '@shared/models/user-management/organization.model';
import { IUserPayload } from '@shared/models/users.model';
import { APIServices } from '@shared/services/api.service';
import { AxiosError, AxiosResponse } from 'axios';
import * as _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import * as Redux from 'redux';
import classificationActions from 'store/admin/classification/classification.action';
import { userActions } from 'store/admin/user-management/user/user.actions';
import { StoreState } from 'store/root-reducer';

// ============ static data ==============
const initialOrganization: Organization = {
  name: '',
  type: '',
  pillar: '',
  sectors: [''],
  status: '',
  website: '',
  description: '',
};
const defaultValues: IUserPayload = {
  fullName: '',
  email: '',
  phone: '',
  role: '',
  organizationId: '',
  projectIds: [''],
  organization: initialOrganization,
};
// ========== end static data ============

interface IAddUser {
  isShow: boolean;
  onClose: () => void;

  // redux
  getOrganizations: () => void;
  getProjects: () => void;
  getRoles: () => void;
  getSectors: () => void;
  getOrganizationTypes: () => void;
  getPillars: () => void;
  createUser?: (payload: IUserPayload) => Promise<AxiosResponse | AxiosError>;
  organizations?: Organization[];
  projects?: MSelectOption[];
  roles?: MSelectOption[];
  sectors?: MSelectOption[];
  organizationTypes?: MSelectOption[];
  pillars?: MSelectOption[];
}

function AddUser(props: IAddUser) {
  const {
    getOrganizations,
    getProjects,
    getRoles,
    getOrganizationTypes,
    getPillars,
    getSectors,
    createUser,
    onClose,
    isShow,
    organizations,
    projects,
    roles,
    pillars,
    sectors,
    organizationTypes,
  } = props;

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({ defaultValues });

  const [submitting, setSubmitting] = useState(false);
  const [showOrganizationForm, setShowOrganizationForm] = useState(false);

  // hooks section
  useEffect(() => {
    if (!isShow) return;

    // user select options
    if (getOrganizationTypes && !organizationTypes?.length)
      getOrganizationTypes();
    if (getSectors && !sectors?.length) getSectors();
    if (getPillars && !pillars?.length) getPillars();

    // organization select options
    if (getOrganizations && !organizations?.length) getOrganizations();
    if (getProjects && !projects?.length) getProjects();
    if (getRoles && !roles?.length) getRoles();
    return () => {
      APIServices.axiosCancelToken();
    };
  }, [isShow]);

  //  functions section
  const onSubmit = (formData: IUserPayload) => {
    const model = {
      fullName: null,
      email: null,
      role: null,
      phone: null,
      projectIds: null,
    };
    const modelWithoutOrganization = {
      ...model,
      organizationId: null,
    };
    const modelWithOrganization = {
      ...model,
      organization: null,
    };
    setSubmitting(true);

    const payload = _.pick(
      formData,
      _.keys(
        formData?.organizationId?.__isNew__
          ? modelWithOrganization
          : modelWithoutOrganization,
      ),
    ) as IUserPayload;

    payload.phone = `+${payload.phone}`;

    if (createUser)
      createUser(payload)
        .then(() => {
          reset(defaultValues);
          setSubmitting(false);
          onClose();
        })
        .catch(() => {
          setSubmitting(false);
        });
  };

  const handleCloseModal = () => {
    if (submitting) return;
    onClose();
  };

  const handleUserFormActions = (type: string, option: any) => {
    if (type !== 'organizationChanged') return;
    setShowOrganizationForm(!!option?.__isNew__);
    if (!!option?.__isNew__) {
      setValue('organization.name', option?.value?.toString(), {
        shouldValidate: true,
      });
    } else {
      setValue('organization', initialOrganization, {
        shouldValidate: true,
      });
    }
  };

  return (
    <ModificationModal
      title="Add User"
      isShow={isShow}
      onClose={handleCloseModal}
      size="lg"
    >
      <ModificationModal.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          <UserForm
            control={control}
            errors={errors}
            watch={watch}
            userFormActions={handleUserFormActions}
          />
          {showOrganizationForm ? (
            <>
              <label className="my-3 custom-label">Organization Section</label>
              <OrganizationForm
                control={control}
                errors={errors}
                imageSrc={watch('organization.imageUrl')}
                imageAlt={watch('organization.name')}
                from="user"
                setValue={setValue}
              />
            </>
          ) : null}
        </form>
      </ModificationModal.Body>
      <ModificationModal.Footer>
        <button
          className="admin-btn-add bth-submit"
          type="submit"
          disabled={submitting}
          onClick={() => handleSubmit(onSubmit)()}
        >
          Add
        </button>
      </ModificationModal.Footer>
    </ModificationModal>
  );
}

// store section
const mapStateToProps = (store: StoreState) => {
  const {
    sectors,
    pillars,
    organizations: organizationsType,
  } = store?.classification;
  return {
    ...store?.userManagement?.user,
    sectors,
    pillars,
    organizationsType,
  };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch) => {
  const { createUser, getOrganizations, getProjects, getRoles } = userActions;
  const { getClassifications } = classificationActions;

  return {
    createUser: (payload: IUserPayload) => dispatch(createUser(payload) as any),

    // for user form select options
    getOrganizations: () => dispatch(getOrganizations() as any),
    getProjects: () => dispatch(getProjects() as any),
    getRoles: () => dispatch(getRoles() as any),

    // for organization select options
    getSectors: () =>
      dispatch(
        getClassifications(EClassification.SECTOR, {
          status: EStatus.ACTIVE,
          limit: 0,
        }) as any,
      ),
    getPillars: () =>
      dispatch(
        getClassifications(EClassification.PILLAR, {
          status: EStatus.ACTIVE,
          limit: 0,
        }) as any,
      ),
    getOrganizationTypes: () =>
      dispatch(
        getClassifications(EClassification.ORGANIZATION, {
          status: EStatus.ACTIVE,
          limit: 0,
        }) as any,
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddUser);
