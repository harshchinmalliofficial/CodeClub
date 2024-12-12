import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import "./styles/nav.css";
import { AuthContext } from "../AuthContext.jsx";
import axios from "axios";

function Navbar() {
  const baseUrl = import.meta.env.VITE_USER_SERVER_BASE_URL;
  const { clearToken } = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUserdetails] = useState("");
  const token = localStorage.getItem("authToken");

  const name = user.CfId;
  useEffect(() => {
    if (token) {
      axios
        .get(`${baseUrl}/auth`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          setIsLoggedIn(true);
          setUserdetails(response.data.user);
          // console.log(user);
        });
    } else {
      console.log("l");
    }
  }, [token, baseUrl]);
  return (
    <header className="nav-container">
      <Link className="nav-logo" to="#">
        <span className="nav-logo-text " style={{ fontFamily: "Tahoma" }}>
          CodeClub
        </span>
      </Link>
      <nav className="nav-links">
        {isLoggedIn ? (
          <Link className="nav-link" to="/">
            <span className="nav-link-text" style={{ fontFamily: "inter" }}>
              Home
            </span>
          </Link>
        ) : (
          <Link className="nav-link" to="/login">
            <span className="nav-link-text" style={{ fontFamily: "inter" }}>
              Home
            </span>
          </Link>
        )}
        <Link className="nav-link" to="/redeem">
          <span className="nav-link-text">Redeem</span>
        </Link>
        {!isLoggedIn ? (
          <Link className="nav-link" to="/profile">
            <span className="nav-link-text">Profile</span>
          </Link>
        ) : (
          <>
            <Link className="nav-link" to="/profile">
              <span className="nav-link-text">{name}</span>
            </Link>
            <Link className="nav-link" to="/tests">
              <span className="nav-link-text">Tests</span>
            </Link>
            <Link to="/login" className="nav-link" onClick={clearToken}>
              <span className="nav-link-text">Logout</span>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
