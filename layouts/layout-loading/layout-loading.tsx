import AuthLoading from '@shared/components/loadings/auth-loading';
import { connect } from 'react-redux';
import { StoreState } from 'store/root-reducer';

interface ILoading {
  isLoading?: boolean;
}

function LayoutLoading({ isLoading }: ILoading) {
  return <>{isLoading && <AuthLoading />}</>;
}

const mapStateToProps = (state: StoreState) => {
  const { isLoading } = state?.auth;
  return {
    isLoading,
  };
};

export default connect(mapStateToProps, null)(LayoutLoading);
