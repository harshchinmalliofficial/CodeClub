import { Link } from "react-router-dom";
import "./AdminComponentsStyles/nav.css";
import { useState, useEffect } from "react";

function AdminNavbar() {
  // const token = localStorage.getItem("authToken");
  // console.log("the token", token);
  const [isLoggedin, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <header className="nav-container">
      <Link className="nav-logo" to="/admin/home">
        <span className="nav-logo-text " style={{ fontFamily: "Tahoma" }}>
          CodeClub
        </span>
      </Link>
      <nav className="nav-links">
        {isLoggedin ? (
          <>
            <Link className="nav-link" to="/admin/home">
              <span className="nav-link-text" style={{ fontFamily: "inter" }}>
                Home
              </span>
            </Link>
            <Link className="nav-link" to="/admin/uploadTest">
              <span className="nav-link-text" style={{ fontFamily: "inter" }}>
                UploadTest
              </span>
            </Link>

            <Link className="nav-link" to="/admin/qna">
              <span className="nav-link-text" style={{ fontFamily: "inter" }}>
                Teachers AI
              </span>
            </Link>

            <Link className="nav-link" to="/admin/events">
              <span className="nav-link-text" style={{ fontFamily: "inter" }}>
                Events
              </span>
            </Link>

            <Link
              className="nav-link"
              to="/admin/login"
              onClick={() => {
                localStorage.removeItem("authToken");
              }}
            >
              <span className="nav-link-text" style={{ fontFamily: "inter" }}>
                Logout
              </span>
            </Link>
          </>
        ) : (
          <>
            <Link className="nav-link" to="/admin/login">
              <span className="nav-link-text" style={{ fontFamily: "inter" }}>
                login
              </span>
            </Link>

            <Link className="nav-link" to="/admin/signup">
              <span className="nav-link-text" style={{ fontFamily: "inter" }}>
                Signup
              </span>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default AdminNavbar;
