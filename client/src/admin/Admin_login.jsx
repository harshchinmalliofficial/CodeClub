import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../pages/styles/signup.css";
import axios from "axios";
import AdminNavbar from "./Admin_components/AdminNavbar";

function Admin_login() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setMessage] = useState("");

  function handleclick(e) {
    e.preventDefault();

    if (!username || !password) {
      setMessage("Please Enter All The Fields");
    } else {
      axios
        .post(`http://localhost:9090/admin/signup`, {
          username,
          password,
        })
        .then((response) => {
          // console.log(response.data.data.token);
          localStorage.setItem("authToken", response.data.data.token);
          navigate("/admin/home");
        })
        .catch((error) => {
          console.error("Error:", error);
          setMessage("Something went wrong");
        });
    }
  }

  return (
    <>
      <AdminNavbar />
      <main className="signup container">
        <div className="welcome">
          <h1 className="title">
            Login Into <span style={{ color: "brown" }}>CodeClub</span>
          </h1>
          <p className="description">
            Submit your code and earn points to redeem swag items
          </p>
        </div>
        <div className="signup-form">
          <form className="form">
            <div className="input-group">
              <input
                id="Username"
                placeholder="Kle Tech Username ID"
                type="Username"
                className="input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <input
                id="password"
                type="password"
                className="input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="button" onClick={handleclick}>
              Login
            </button>
          </form>
          <div className="login-link">
            <span className="text">Do not have an account? </span>
            <Link to="/signup" className="link">
              Signup
            </Link>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </main>
    </>
  );
}

export default Admin_login;
