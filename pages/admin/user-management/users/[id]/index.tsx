import OrganizationForm from '@components/admin/user-management/organizations/organization-form';
import UserForm from '@components/admin/user-management/users/user-form';
import AdminListCard from '@shared/components/cards/admin-list-card';
import { permissionChecker } from '@shared/custom-function/common';
import { EStatus } from '@shared/enum';
import { EClassification } from '@shared/enum/classification.enum';
import { IUpdate } from '@shared/models/common.model';
import { Organization } from '@shared/models/user-management/organization.model';
import { IUserPayload, MUserDetail } from '@shared/models/users.model';
import { APIServices } from '@shared/services/api.service';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import * as Redux from 'redux';
import classificationActions from 'store/admin/classification/classification.action';
import { userActions } from 'store/admin/user-management/user/user.actions';
import { StoreState } from 'store/root-reducer';
import CmsPageTitle from '@shared/components/cards/cms-page-title';

// ============ static data ==============
const defaultValues: IUserPayload = {
  fullName: '',
  email: '',
  phone: 'kh',
  role: '',
  organizationId: '',
  projectIds: [''],
  organization: {
    name: '',
    type: '',
    pillar: '',
    sectors: [''],
    status: '',
    website: '',
    description: '',
    imageId: '',
    imageUrl: '',
  },
};
// ========== end static data ============

interface IUserDetail {
  // redux props
  getUser: (id: string) => Promise<void>;
  updateUser: (updateUserPayload: IUpdate<IUserPayload>) => Promise<void>;
  getOrganizations: () => void;
  getProjects: () => void;
  getRoles: () => void;
  getSectors: () => void;
  getOrganizationTypes: () => void;
  getPillars: () => void;
  user: MUserDetail;
  organizations: Organization[];
}

const UserDetail = (props: IUserDetail) => {
  const {
    getUser,
    getOrganizationTypes,
    getOrganizations,
    getPillars,
    getProjects,
    getSectors,
    getRoles,
    updateUser,
    user,
    organizations,
  } = props;
  const ac = new AbortController();
  const router = useRouter();
  const id = router?.query?.id as string;

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({ defaultValues });

  const [isEdit, setIsEdit] = useState(false);

  // hooks section
  useEffect(() => {
    if (!id) return;
    getUser(id).then(() => {
      // user select options
      if (getOrganizationTypes) getOrganizationTypes();
      if (getSectors) getSectors();
      if (getPillars) getPillars();

      // organization select options
      if (getOrganizations) getOrganizations();
      if (getProjects) getProjects();
      if (getRoles) getRoles();
    });

    return () => {
      APIServices.axiosCancelToken();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!user) return;
    reset(user);
    return () => {
      ac.abort();
    };
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // function section
  const handleUserFormActions = (type: string, value: any) => {
    if (type !== 'organizationChanged') return;
    const organization = organizations?.find((org) => org?.id === value);
    if (organization)
      setValue('organization', organization, { shouldValidate: true });
  };

  const onSubmit = (body: IUserPayload) => {
    delete body?.organization;
    const payload = {
      id,
      body,
    };
    setIsEdit(false);
    updateUser(payload)
      .then(() => {
        setIsEdit(false);
      })
      .catch(() => {
        setIsEdit(true);
      });
  };

  const handleButtonChange = () => {
    if (!isEdit) return setIsEdit(true);
    handleSubmit(onSubmit)();
  };

  const handleCancel = () => {
    setIsEdit(!isEdit);
    if (!user) return;
    reset(user);
  };

  return (
    <AdminListCard>
      <AdminListCard.Header className="d-flex flex-wrap align-items-center justify-content-between">
        <CmsPageTitle title="User Detail" hasBackIcon />
        <div className="d-flex flex-wrap align-items-center">
          {isEdit && (
            <button className="admin-btn-cancel ctrl-mr" onClick={handleCancel}>
              Cancel
            </button>
          )}
          {permissionChecker('WEB-USER-UPDATE') && (
            <button className="admin-btn-add" onClick={handleButtonChange}>
              {isEdit ? 'Save' : 'Edit'}
            </button>
          )}
        </div>
      </AdminListCard.Header>
      <hr className="break-line ctrl-mt" />
      <AdminListCard.Body xScrollable={false} className="pt-3">
        <form>
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <UserForm
                control={control}
                errors={errors}
                watch={watch}
                userFormActions={handleUserFormActions}
                disabled={!isEdit}
                isCreatable={false}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <label className="my-3 custom-label">Organization Section</label>
              <OrganizationForm
                control={control}
                errors={errors}
                imageSrc={watch('organization.imageUrl')}
                imageAlt={watch('organization.name')}
                from="user"
                setValue={setValue}
                disabled
              />
            </div>
          </div>
        </form>
      </AdminListCard.Body>
    </AdminListCard>
  );
};

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
  const { getRoles, getOrganizations, getProjects, getUser, updateUser } =
    userActions;
  const { getClassifications } = classificationActions;

  return {
    getUser: (userId: string) => dispatch(getUser(userId) as any),
    updateUser: (updateUserPayload: IUpdate<IUserPayload>) =>
      dispatch(updateUser(updateUserPayload) as any),

    // for user select options
    getRoles: () => dispatch(getRoles() as any),
    getOrganizations: () => dispatch(getOrganizations() as any),
    getProjects: () => dispatch(getProjects() as any),

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

export default connect(mapStateToProps, mapDispatchToProps)(UserDetail);
