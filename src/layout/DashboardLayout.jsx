import Sidebar from "../shared/Sidebar";
import Header from "../shared/Header";
import { Outlet } from "react-router-dom";
import Breadcrumbs from "../shared/Breadcrumbs";

function DashboardLayout() {
  return (
    <>
      <div className="d-flex" id="wrapper">
        <Sidebar />
        <div id="page-content-wrapper">
          <Header />
          <div className="container-fluid mb-3">
            <Breadcrumbs />
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardLayout;
