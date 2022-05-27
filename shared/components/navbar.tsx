import { IUser } from '@shared/models/auth.model';
import Image from 'next/image';
import Router from 'next/router';
import { useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as Redux from 'redux';
import AuthAction from 'store/auth/auth.action';
import { StoreState } from 'store/root-reducer';

interface INavbar extends Partial<StoreState> {
  logout: () => void;
  handleClickMenu: () => void;
  user?: IUser;
}

function Navbar(props: INavbar) {
  const { logout, user, handleClickMenu } = props;

  const handleLogout = () => {
    logout();
    Router.push('/login');
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-navbar-top border-bottom">
        <div className="container-fluid">
          <div
            className="d-block d-md-none cursor-pointer border rounded-3 px-2 py-1"
            onClick={handleClickMenu}
          >
            <svg
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
              fill="#fff"
              fillRule="evenodd"
              clipRule="evenodd"
            >
              <path
                d="M24 18v1h-24v-1h24zm0-6v1h-24v-1h24zm0-6v1h-24v-1h24z"
                fill="#1040e2"
              />
              <path d="M24 19h-24v-1h24v1zm0-6h-24v-1h24v1zm0-6h-24v-1h24v1z" />
            </svg>
          </div>
          <div className="ms-auto">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                <div className="d-flex align-items-center">
                  <Image
                    className="rounded-circle"
                    src={'/assets/admin/icon/profile-empty.jpg'}
                    alt="profile photo"
                    width={25}
                    height={25}
                  />
                  <p className="mx-2 mb-0 d-inline fw-normal fontSize12">
                    {user?.profile?.fullName}
                  </p>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                <Dropdown.Item onClick={() => handleLogout()}>
                  Log out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </nav>
    </div>
  );
}

const mapStateToProps = (state: StoreState) => {
  const { user } = state?.auth;

  return {
    user,
  };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch) => {
  const { logout } = AuthAction;

  return {
    logout: () => dispatch(logout() as any),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
