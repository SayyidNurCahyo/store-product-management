import { IconMenu2 } from "@tabler/icons-react";
import { useState } from "react";
import { useEffect } from "react";

function Header() {
  const toggleSidebar = (event) => {
    event.preventDefault();
    document.body.classList.toggle("sb-sidenav-toggled");
    localStorage.setItem(
      "sb|sidebar-toggle",
      document.body.classList.contains("sb-sidenav-toggled")
    );
  };
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    const checkToken = async () => {
      if (!localStorage.getItem("user")) {
        setIsLogin(false);
      } else {
        setIsLogin(true);
      }
    };
    checkToken();
  }, [localStorage.getItem("user")]);
  return (
    <>
      <nav className="bg-dark navbar navbar-expand-lg navbar-light border-bottom">
        <div className="container-fluid">
          <button
            onClick={toggleSidebar}
            className="btn btn-primary text-white"
            id="sidebarToggle"
          >
            <IconMenu2 />
          </button>
          <div>
            <span>
              {isLogin && JSON.parse(localStorage.getItem("user")).email}
            </span>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;
