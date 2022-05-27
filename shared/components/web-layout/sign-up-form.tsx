/* eslint-disable react-hooks/rules-of-hooks */
import BaseInput from '@shared/components/form/base-input';
import BaseSelect from '@shared/components/form/base-select-creatable';
import BaseTextArea from '@shared/components/form/base-textarea';
import {
  getLanguage,
  isValidPhoneNumber,
} from '@shared/custom-function/common';
import { EClassification } from '@shared/enum/classification.enum';
import { ISelectOption } from '@shared/models/common.model';
import {
  IClassification,
  IOrganization,
} from '@shared/models/organization.model';
import { FormService } from '@shared/services/form.service';
import useTranslation from 'next-translate/useTranslation';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { connect } from 'react-redux';
import * as Redux from 'redux';
import AuthAction from 'store/auth/auth.action';
import { AuthState } from 'store/auth/auth.reducer';
import { StoreState } from 'store/root-reducer';
import BasePhoneInput from '../form/base-phone-input';

interface IBaseForm {
  fullName?: string;
  email?: string;
  organizationName?: string;
  purpose?: string;
}

export interface ISignUpBody extends IBaseForm {
  phone?: string;
  organizationId?: string;
  organizationCode?: string;
  organization?: {
    name?: string;
    type?: string;
    pillar?: string;
    sectors?: string[];
    sectorNames?: string[];
    phone?: string;
    email?: string;
    website?: string;
    description?: string;
  };
}

interface ISignUpForm extends IBaseForm {
  phoneNumber?: string;
  organizationType?: string;
  pillar?: string;
  sector?: string[];
  link?: string;
}

interface ISignUpProps extends AuthState {
  getAuthorization: () => Promise<void>;
  getPublicToken: () => Promise<void>;
  onSignUp: (body: ISignUpBody) => Promise<void>;
  getOrganizationNames: () => void;
  getOrganizationTypes: () => void;
  getPillars: () => void;
  getSectors: () => void;
  onSubmitSuccess: () => void;
}

const SignUpForm = (props: ISignUpProps) => {
  const {
    organizationNames,
    OrganizationTypes,
    pillars,
    sectors,
    getAuthorization,
    getOrganizationNames,
    getOrganizationTypes,
    getPillars,
    getPublicToken,
    getSectors,
    onSignUp,
    onSubmitSuccess,
  } = props;

  const defaultValues: ISignUpForm = {
    fullName: '',
    email: '',
    phoneNumber: '',
    organizationName: '',
    organizationType: '',
    pillar: '',
    sector: [],
    link: '',
    purpose: '',
  };

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    getValues,
    watch,
    formState: { errors },
  } = useForm({ defaultValues });

  const [disabled, setDisabled] = useState(false);
  const [purposeValue, setPurposeValue] = useState(0);
  const [dialCode, setDialCode] = useState(0);
  let { t } = useTranslation();

  useEffect(() => {
    getOrganizationNames();
    getOrganizationTypes();
    getPillars();
    getSectors();
  }, []);

  const onChangeSelect = (evt: any, type: string) => {
    switch (type) {
      case 'ORG_NAME':
        setValue('organizationType', '');
        setValue('pillar', '');
        setValue('sector', []);
        setValue('link', '');

        const data: any = organizationNames?.find(
          (item: IOrganization) => item?.id === evt,
        );

        if (data) {
          const newSector = data?.sectors?.map((item: IClassification) => {
            return item?.code;
          });
          setDisabled(true);
          setValue('organizationType', data?.type?.code);
          setValue('pillar', data?.pillar?.code || '');
          setValue('sector', newSector || '');
          setValue('link', data?.website || '');
        } else {
          setDisabled(false);
        }
        break;
      default:
        break;
    }
  };

  const handleOnChange = (value: any, data: any) => {
    setDialCode(data.dialCode.length);
  };

  const onSubmit = (formData: ISignUpForm) => {
    let body: ISignUpBody;
    const newOrg: any = getValues('organizationName');
    const newOrgType: any = getValues('organizationType');
    let newSectors: string[] = [];
    let existSectors: string[] = [];
    getValues('sector')?.length
      ? getValues('sector')?.forEach((item: ISelectOption | any) => {
          if (item.__isNew__) {
            newSectors.push(item?.value);
          } else {
            existSectors.push(item);
          }
        })
      : '';

    if (newOrg?.__isNew__) {
      body = {
        fullName: formData?.fullName,
        email: formData?.email,
        phone: `+${formData?.phoneNumber}`,
        organization: {
          name: newOrg?.value,
          type: newOrgType?.__isNew__
            ? newOrgType.value
            : formData?.organizationType,
          pillar: formData?.pillar,
          // exist sector
          sectors: existSectors,
          // creatable sector
          sectorNames: newSectors,
          website: formData?.link,
        },
        purpose: formData?.purpose,
      };
    } else {
      body = {
        fullName: formData?.fullName,
        email: formData?.email,
        phone: `+${formData?.phoneNumber}`,
        organizationId: formData?.organizationName,
        purpose: formData?.purpose,
      };
    }

    onSignUp(body).then((res) => {
      reset(defaultValues);
      setDisabled(true);
      onSubmitSuccess();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
      <Container>
        <Row>
          <Col xs={12}>
            <Controller
              name="fullName"
              control={control}
              defaultValue=""
              rules={{
                required: true,
              }}
              render={({ field: { ref, value, onChange, ...field } }: any) => (
                <BaseInput
                  {...field}
                  label={t(`common:sign_up.full_name`)}
                  className="mb-3"
                  refs={ref}
                  value={value}
                  onChange={onChange}
                  isRequired={true}
                  error={errors?.fullName && true}
                  helperText={FormService.getErrorMessage(
                    errors,
                    'fullName',
                    'Full Name',
                  )}
                />
              )}
            />
          </Col>
          <Col xs={12}>
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
              render={({ field: { ref, value, onChange, ...field } }: any) => (
                <BaseInput
                  label={t(`common:sign_up.email`)}
                  className="mb-3"
                  refs={ref}
                  value={value}
                  onChange={onChange}
                  isRequired={true}
                  error={errors?.email && true}
                  helperText={FormService.getErrorMessage(
                    errors,
                    'email',
                    'Email',
                    'Email is invalid',
                  )}
                />
              )}
            />
          </Col>
          <Col xs={12}>
            <Controller
              name="phoneNumber"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 8 + dialCode,
                maxLength: 9 + dialCode,
                validate: (value) => isValidPhoneNumber(value),
              }}
              render={({ field: { ref, value, onChange, ...field } }: any) => (
                <div className="mb-3">
                  <>
                    <BasePhoneInput
                      isRequired={true}
                      refs={ref}
                      containerClass="mb-2"
                      country={'kh'}
                      value={value}
                      onChange={(evt: any, country: any) => {
                        onChange(evt);
                        handleOnChange(evt, country);
                      }}
                      specialLabel={t(`common:sign_up.phone_number`)}
                      error={errors?.phoneNumber && true}
                      countryCodeEditable={false}
                      helperText={FormService.getErrorMessage(
                        errors,
                        'phoneNumber',
                        'Phone Number',
                        errors?.phoneNumber?.type === 'minLength'
                          ? 'Phone Number should contain 8 numbers'
                          : errors?.phoneNumber?.type === 'validate'
                          ? 'Phone Number should not start with zero'
                          : errors?.phoneNumber?.type === 'maxLength'
                          ? 'Phone Number should with maximum length of 9'
                          : '',
                      )}
                    />
                  </>
                </div>
              )}
            />
          </Col>
          <Col xs={12}>
            <Controller
              name="organizationName"
              control={control}
              defaultValue=""
              rules={{
                required: true,
              }}
              render={({ field: { ref, value, onChange, ...field } }: any) => (
                <BaseSelect
                  {...field}
                  label={t(`common:sign_up.organization_name`)}
                  refs={ref}
                  value={value}
                  onChange={(evt: any) => {
                    onChange(evt);
                    onChangeSelect(evt, 'ORG_NAME');
                  }}
                  options={organizationNames}
                  className="mb-3"
                  isRequired={true}
                  error={errors?.organizationName && true}
                  isCreatable
                  helperText={FormService.getErrorMessage(
                    errors,
                    'organizationName',
                    'Organization Name',
                  )}
                />
              )}
            />
          </Col>
          <Col xs={12}>
            <Controller
              name="organizationType"
              control={control}
              defaultValue=""
              rules={{
                required: false,
              }}
              render={({ field: { ref, value, onChange, ...field } }: any) => (
                <BaseSelect
                  {...field}
                  label={t(`common:sign_up.organization_type`)}
                  refs={ref}
                  value={value}
                  onChange={onChange}
                  options={OrganizationTypes}
                  className="mb-3"
                  error={errors?.organizationType && true}
                  disabled={disabled}
                  isCreatable
                  helperText={FormService.getErrorMessage(
                    errors,
                    'organizationType',
                    'Organization Type',
                  )}
                />
              )}
            />
          </Col>
          <Col xs={12}>
            <Controller
              name="pillar"
              control={control}
              defaultValue=""
              rules={{
                required: false,
              }}
              render={({ field: { ref, value, onChange, ...field } }: any) => (
                <BaseSelect
                  {...field}
                  label={t(`common:sign_up.pillar`)}
                  refs={ref}
                  value={value}
                  onChange={onChange}
                  options={pillars}
                  className="mb-3"
                  error={errors?.pillar && true}
                  disabled={disabled}
                  helperText={FormService.getErrorMessage(
                    errors,
                    'pillar',
                    'Pillar',
                  )}
                />
              )}
            />
          </Col>
          <Col xs={12}>
            <Controller
              name="sector"
              control={control}
              defaultValue={[]}
              rules={{
                required: false,
              }}
              render={({ field: { ref, value, onChange, ...field } }: any) => (
                <BaseSelect
                  {...field}
                  label={t(`common:sign_up.sector`)}
                  refs={ref}
                  value={value}
                  onChange={onChange}
                  options={sectors}
                  className="mb-3"
                  error={errors?.sector && true}
                  disabled={disabled}
                  isMulti={true}
                  isCreatable
                  helperText={FormService.getErrorMessage(
                    errors,
                    'sector',
                    'Sector',
                  )}
                />
              )}
            />
          </Col>
          <Col xs={12}>
            <Controller
              name="link"
              control={control}
              defaultValue=""
              rules={{
                required: false,
                pattern: {
                  value:
                    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
                  message: 'Link is invalid',
                },
              }}
              render={({ field: { ref, value, onChange, ...field } }: any) => (
                <BaseInput
                  {...field}
                  label={t(`common:sign_up.link_to_website`)}
                  className="mb-3"
                  refs={ref}
                  value={value}
                  onChange={onChange}
                  error={errors?.link && true}
                  disabled={disabled}
                  helperText={FormService.getErrorMessage(
                    errors,
                    'link',
                    'Link to Website',
                  )}
                />
              )}
            />
          </Col>
          <Col xs={12}>
            <Controller
              name="purpose"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                maxLength: 200,
              }}
              render={({ field: { ref, value, onChange, ...field } }: any) => (
                <BaseTextArea
                  {...field}
                  label={t(`common:sign_up.purpose`)}
                  className="mb-3"
                  refs={ref}
                  value={value}
                  onChange={(evt: any) => {
                    onChange(evt);
                    setPurposeValue(evt?.target.value?.length);
                  }}
                  isRequired={true}
                  error={errors?.purpose && true}
                  helperText={FormService.getErrorMessage(
                    errors,
                    'purpose',
                    'Purpose',
                    'Purpose should contain 200 characters',
                  )}
                />
              )}
            />
            <p className="label-hint">
              {t(`common:sign_up.characters_left`)}{' '}
              <span>{200 - purposeValue > 0 ? 200 - purposeValue : 0}</span>
            </p>
          </Col>
          <Col xs={12}>
            <Button type="submit" className="base-btn w-100 mt-3">
              Submit Application
            </Button>
          </Col>
        </Row>
      </Container>
    </form>
  );
};

const mapStateToProps = (store: StoreState) => {
  const { organizationNames, OrganizationTypes, pillars, sectors } = store.auth;

  return {
    organizationNames,
    OrganizationTypes,
    pillars,
    sectors,
  };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch) => {
  const {
    getAuthorization,
    getOrganizationNames,
    getPublicToken,
    getClassifications,
    onSignUp,
  } = AuthAction;

  return {
    getAuthorization: () => dispatch(getAuthorization() as any),
    getPublicToken: () => dispatch(getPublicToken() as any),
    getOrganizationNames: () => dispatch(getOrganizationNames() as any),
    getOrganizationTypes: () =>
      dispatch(getClassifications(EClassification.ORGANIZATION) as any),
    getPillars: () =>
      dispatch(getClassifications(EClassification.PILLAR) as any),
    getSectors: () =>
      dispatch(getClassifications(EClassification.SECTOR) as any),
    onSignUp: (body: ISignUpBody) => dispatch(onSignUp(body) as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpForm);
