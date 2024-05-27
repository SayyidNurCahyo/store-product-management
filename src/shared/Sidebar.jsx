import { IconLogin, IconLogout, IconRegistered } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Sidebar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    Swal.fire({
      title: "Do you want to log out?",
      showCancelButton: true,
      confirmButtonText: "Log Out",
      confirmButtonColor: "red",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate("/");
      }
    });
  };

  return (
    <>
      <div className="border-end bg-dark" id="sidebar-wrapper">
        <div className="p-0 d-flex justify-content-center sidebar-heading bg-dark">
          <img
            src="/src/assets/logo.png"
            style={{ height: 180, margin: 15, marginTop: 40 }}
            alt="Eazy Camp Logo"
          />
        </div>
        <div className="list-group list-group-flush p-3">
          <Link
            to="/login"
            className="text-decoration-none d-flex align-items-center cursor-pointer border-0 list-group-item list-group-item-action list-group-item-dark p-3 mb-2 rounded-4"
          >
            <IconLogin style={{ marginRight: 10 }} />
            <span>Login</span>
          </Link>
          <Link
            to="/register"
            className="text-decoration-none d-flex align-items-center cursor-pointer border-0 list-group-item list-group-item-action list-group-item-dark p-3 mb-2 rounded-4"
          >
            <IconRegistered style={{ marginRight: 10 }} />
            <span>Register</span>
          </Link>
          <a
            onClick={handleLogout}
            className="text-decoration-none d-flex align-items-center cursor-pointer border-0 list-group-item list-group-item-action list-group-item-dark p-3 mb-2 rounded-4"
          >
            <IconLogout style={{ marginRight: 10 }} />
            Log Out
          </a>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
