import protectedRoute from '@components/auth/protected-route';
import Navbar from '@shared/components/navbar';
import Sidebar from '@shared/components/sidebar';
import React, { useState } from 'react';

interface IAdminLayout {
  children: React.ReactNode;
}

function AdminLayout({ children }: IAdminLayout): JSX.Element {
  const [menuShow, setMenuShow] = useState(false);
  const handleClickMenu = () => setMenuShow(!menuShow);
  const handleCloseMenu = () => setMenuShow(false);

  return (
    <div className="d-flex">
      <Sidebar isShow={menuShow} closeSelf={handleCloseMenu} />
      <div id="page-content-wrapper">
        <Navbar handleClickMenu={handleClickMenu} />
        <div className="container-fluid pt-2 admin-min-height">{children}</div>
      </div>
    </div>
  );
}

export default protectedRoute(AdminLayout);
