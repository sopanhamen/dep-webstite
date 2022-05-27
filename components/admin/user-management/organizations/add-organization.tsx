import ModificationModal from '@shared/components/modals/modification-modal';
import { MSelectOption } from '@shared/models/common.model';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { StoreState } from 'store/root-reducer';
import * as Redux from 'redux';
import classificationActions from 'store/admin/classification/classification.action';
import { EClassification } from '@shared/enum/classification.enum';
import { EStatus } from '@shared/enum';
import { useForm } from 'react-hook-form';
import OrganizationForm from '@components/admin/user-management/organizations/organization-form';
import { APIServices } from '@shared/services/api.service';
import { organizationActions } from 'store/admin/user-management/organization/organization.actions';
import { Organization } from '@shared/models/user-management/organization.model';
import { selectCreatableToStringArray } from '@shared/custom-function/conversion';
import * as _ from 'lodash';

// ============ static data ==============
const defaultValues: Organization = {
  name: '',
  type: '',
  pillar: '',
  sectors: [],
  status: '',
  website: '',
  description: '',
};
// ========== end static data ============

interface IAddOrganization {
  isShow: boolean;
  onClose: () => void;

  // redux props
  createOrganization?: (payload: Organization) => Promise<void>;
  getSectors?: () => void;
  getOrganizationTypes?: () => void;
  getPillars?: () => void;
  sectors?: MSelectOption[];
  organizationTypes?: MSelectOption[];
  pillars?: MSelectOption[];
}

const AddOrganization = (props: IAddOrganization) => {
  const {
    createOrganization,
    getOrganizationTypes,
    getPillars,
    getSectors,
    onClose,
    isShow,
    organizationTypes,
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

  const [submitting, setSubmitting] = useState(false);

  // hooks section
  useEffect(() => {
    if (!isShow) return;
    if (getOrganizationTypes && !organizationTypes?.length)
      getOrganizationTypes();
    if (getSectors && !sectors?.length) getSectors();
    if (getPillars && !pillars?.length) getPillars();
    return () => {
      APIServices.axiosCancelToken();
    };
  }, [isShow]);

  // functions section
  const handleCloseModal = () => {
    if (submitting) return;
    onClose();
  };

  const onSubmit = (formData: Organization) => {
    setSubmitting(true);
    const payload = {
      ...formData,
      sectors: selectCreatableToStringArray(formData?.sectors),
      type: _.isObject(formData.type) ? formData.type['value'] : formData.type,
    };

    if (createOrganization)
      createOrganization(payload)
        .then(() => {
          reset(defaultValues);
          setSubmitting(false);
          onClose();
        })
        .catch(() => {
          setSubmitting(false);
        });
  };

  return (
    <ModificationModal
      title="Add Organization"
      isShow={isShow}
      onClose={handleCloseModal}
      size="lg"
    >
      <ModificationModal.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          <OrganizationForm
            control={control}
            errors={errors}
            imageSrc={watch('imageUrl')}
            imageAlt={watch('name')}
            setValue={setValue}
          />
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
};

// store section
const mapStateToProps = (store: StoreState) => {
  return { ...store?.classification };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch) => {
  const { createOrganization } = organizationActions;
  const { getClassifications } = classificationActions;

  return {
    createOrganization: (payload: Organization) =>
      dispatch(createOrganization(payload) as any),

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

export default connect(mapStateToProps, mapDispatchToProps)(AddOrganization);
