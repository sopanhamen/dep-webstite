import CompanyBackgroundDetail from '@components/admin/about-us/company-background/company-background-detail';
import { MCompanyBackground } from '@shared/models/about-us/company-background';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import CompanyBackgroundActions from 'store/admin/about-us/company-background/company-background.actions';
import { StoreState } from 'store/root-reducer';

interface ICompanyBackgroundProps {
  getCompanyBackgrounds: () => void;
  companyBackground: MCompanyBackground[];
  isLoading: boolean;
}

function CompanyBackground(props: ICompanyBackgroundProps) {
  const { getCompanyBackgrounds, companyBackground, isLoading } = props;

  useEffect(() => {
    getCompanyBackgrounds();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <CompanyBackgroundDetail />
    </>
  );
}

const mapStateToProps = (state: StoreState) => {
  return { ...state?.aboutUs?.companyBackground };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const { getCompanyBackgrounds } = CompanyBackgroundActions;

  return {
    getCompanyBackgrounds: () => dispatch(getCompanyBackgrounds() as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyBackground);
