import BaseInput from '@shared/components/form/base-input';
import BasePhoneInput from '@shared/components/form/base-phone-input';
import BaseSelect from '@shared/components/form/base-select-creatable';
import { isValidPhoneNumber } from '@shared/custom-function/common';
import { MRole, MSelectOption } from '@shared/models/common.model';
import { Organization } from '@shared/models/user-management/organization.model';
import { IUserPayload } from '@shared/models/users.model';
import { FormService } from '@shared/services/form.service';
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import { connect } from 'react-redux';
import { StoreState } from 'store/root-reducer';

interface IUserForm {
  userFormActions: (type: string, value: boolean | string) => void;
  watch: UseFormWatch<IUserPayload>;
  control: Control<IUserPayload, object>;
  errors: any;
  disabled?: boolean;
  disabledOrganizationField?: boolean;
  isCreatable?: boolean;

  // redux props
  rolesOpts?: MRole[];
  organizations?: Organization[];
  projects?: MSelectOption[];
}

const UserForm = (props: IUserForm) => {
  const {
    userFormActions,
    watch,
    control,
    errors,
    rolesOpts,
    organizations,
    projects,
    disabled = false,
    disabledOrganizationField = false,
    isCreatable = true,
  } = props;
  const [dialCode, setDialCode] = useState(0);
  const watchRole = watch('role');

  //  functions section
  const handleOnChange = (value: any, data: any) => {
    setDialCode(data.dialCode.length);
  };

  const onOrganizationChange = (evt: any) => {
    userFormActions('organizationChanged', evt);
  };

  return (
    <div className="row">
      <div className="col-md-6 col-sm-12">
        <Controller
          name="fullName"
          control={control}
          defaultValue=""
          rules={{
            required: true,
          }}
          render={({ field: { ref, value, onChange } }: any) => (
            <BaseInput
              label="Full Name"
              refs={ref}
              value={value}
              onChange={onChange}
              helperText={FormService.getErrorMessage(
                errors,
                'fullName',
                'Full Name',
              )}
              disabled={disabled}
            />
          )}
        />
      </div>
      <div className="col-md-6 col-sm-12">
        <Controller
          name="email"
          control={control}
          defaultValue=""
          rules={{
            required: true,
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Email is invalid.',
            },
          }}
          render={({ field: { ref, value, onChange } }: any) => (
            <BaseInput
              label="Email"
              className="mb-3"
              refs={ref}
              value={value}
              onChange={onChange}
              error={errors?.email && true}
              helperText={FormService.getErrorMessage(
                errors,
                'email',
                'Email',
                'Email is invalid',
              )}
              disabled={disabled}
            />
          )}
        />
      </div>
      <div className="col-md-6 col-sm-12">
        <Controller
          name="phone"
          control={control}
          defaultValue=""
          rules={{
            required: true,
            minLength: 8 + dialCode,
            maxLength: 9 + dialCode,
            validate: (value) => isValidPhoneNumber(value),
          }}
          render={({ field: { value, onChange } }: any) => (
            <div className="mb-3">
              <BasePhoneInput
                containerClass="mb-2"
                country={'kh'}
                value={value}
                onChange={(evt: any, country: any) => {
                  onChange(evt);
                  handleOnChange(evt, country);
                }}
                specialLabel="Phone"
                error={errors?.phone && true}
                countryCodeEditable={false}
                disabled={disabled}
                helperText={FormService.getErrorMessage(
                  errors,
                  'phone',
                  'Phone',
                  errors?.phone?.type === 'minLength'
                    ? 'Phone Number should contain 8 numbers'
                    : errors?.phone?.type === 'validate'
                    ? 'Phone Number should not start with zero'
                    : errors?.phone?.type === 'maxLength'
                    ? 'Phone Number should with maximum length of 9'
                    : '',
                )}
              />
            </div>
          )}
        />
      </div>
      <div className="col-md-6 col-sm-12">
        <Controller
          name="role"
          control={control}
          defaultValue=""
          rules={{
            required: true,
          }}
          render={({ field: { ref, value, onChange } }: any) => (
            <BaseSelect
              value={value}
              onChange={onChange}
              options={rolesOpts}
              label="User Role"
              refs={ref}
              helperText={FormService.getErrorMessage(
                errors,
                'role',
                'User Role',
              )}
              disabled={disabled}
            />
          )}
        />
      </div>
      {watchRole === 'PROJECT-OWNER' ? (
        <div className="col-md-6 col-sm-12">
          <Controller
            name="projectIds"
            control={control}
            defaultValue={['']}
            rules={{
              required: true,
            }}
            render={({ field: { ref, value, onChange } }: any) => (
              <BaseSelect
                value={value}
                onChange={onChange}
                options={projects}
                label="Project Owner"
                refs={ref}
                helperText={FormService.getErrorMessage(
                  errors,
                  'projectIds',
                  'Project Owner',
                )}
                isMulti
                disabled={disabled}
              />
            )}
          />
        </div>
      ) : null}
      <div className="col-md-6 col-sm-12">
        <Controller
          name="organizationId"
          control={control}
          defaultValue=""
          rules={{
            required: true,
          }}
          render={({ field: { ref, value, onChange } }: any) => (
            <BaseSelect
              value={value}
              onChange={(evt: any) => {
                onChange(evt);
                onOrganizationChange(evt);
              }}
              options={organizations}
              label="Organization"
              refs={ref}
              helperText={FormService.getErrorMessage(
                errors,
                'organizationId',
                'Organization',
              )}
              isCreatable={isCreatable}
              disabled={disabled || disabledOrganizationField}
            />
          )}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (store: StoreState) => {
  return { ...store?.userManagement?.user };
};

export default connect(mapStateToProps, null)(UserForm);
