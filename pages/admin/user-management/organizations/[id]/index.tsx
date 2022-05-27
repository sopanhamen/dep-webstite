import OrganizationForm from '@components/admin/user-management/organizations/organization-form';
import AdminListCard from '@shared/components/cards/admin-list-card';
import CmsPageTitle from '@shared/components/cards/cms-page-title';
import { EStatus } from '@shared/enum';
import { EClassification } from '@shared/enum/classification.enum';
import { IUpdate, MSelectOption } from '@shared/models/common.model';
import { Organization } from '@shared/models/user-management/organization.model';
import { APIServices } from '@shared/services/api.service';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import classificationActions from 'store/admin/classification/classification.action';
import { organizationActions } from 'store/admin/user-management/organization/organization.actions';
import { StoreState } from 'store/root-reducer';

// ==================== static data =================
const defaultValues: Organization = {
  name: '',
  type: '',
  pillar: '',
  sectors: [''],
  status: '',
  website: '',
  description: '',
  imageId: '',
  imageUrl: '',
};
// ================== end static data ===============

interface IOrganizationDetail {
  // redux props
  updateOrganization: (payload: IUpdate<Organization>) => Promise<void>;
  getOrganization: (id: string) => Promise<void>;
  getSectors: () => void;
  getOrganizationTypes: () => void;
  getPillars: () => void;
  organization: Organization | null;
  sectors: MSelectOption[];
  organizationTypes: MSelectOption[];
  pillars: MSelectOption[];
}

const OrganizationDetail = (props: IOrganizationDetail) => {
  const {
    getOrganization,
    updateOrganization,
    getSectors,
    getPillars,
    getOrganizationTypes,
    organizationTypes,
    organization,
    sectors,
    pillars,
  } = props;
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

  // hooks section
  useEffect(() => {
    getOrganization(id).then(() => {
      getOrganizationTypes();
      getSectors();
      getPillars();
    });

    return () => {
      APIServices.axiosCancelToken();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!organization) return;
    reset(organization);
    return () => {
      ac.abort();
    };
  }, [organization]); // eslint-disable-line react-hooks/exhaustive-deps

  // functions section
  const handleButtonChange = () => {
    if (!isEdit) return setIsEdit(true);
    handleSubmit(onSubmit)();
  };

  const onSubmit = (body: Organization) => {
    const payload = {
      id,
      body,
    };

    setIsEdit(false);
    updateOrganization(payload)
      .then(() => {
        setIsEdit(false);
      })
      .catch(() => {
        setIsEdit(true);
      });
  };

  const handleCancel = () => {
    setIsEdit(!isEdit);
    if (!organization) return;
    reset(organization);
  };

  return (
    <AdminListCard>
      <AdminListCard.Header className="d-flex flex-wrap align-items-center justify-content-between">
        <CmsPageTitle title="Organzation Detail" hasBackIcon />
        <div className="d-flex flex-wrap align-items-center">
          {isEdit && (
            <button className="admin-btn-cancel ctrl-mr" onClick={handleCancel}>
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
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <label className="my-3 custom-label">Organization Section</label>
              <OrganizationForm
                control={control}
                errors={errors}
                imageSrc={watch('imageUrl')}
                imageAlt={watch('name')}
                setValue={setValue}
                disabled={!isEdit}
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
    organizations: organizationsTypes,
  } = store?.classification;

  return {
    ...store?.userManagement?.organization,
    sectors,
    pillars,
    organizationsTypes,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const { getClassifications } = classificationActions;
  const { getOrganization, updateOrganization } = organizationActions;

  return {
    getOrganization: (id: string) => dispatch(getOrganization(id) as any),
    updateOrganization: (updateOrganizationPayload: IUpdate<Organization>) =>
      dispatch(updateOrganization(updateOrganizationPayload) as any),

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

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationDetail);
