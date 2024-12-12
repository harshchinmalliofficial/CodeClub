import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/login.css";
import Navbar from "../components/Navbar";
import axios from "axios";
import Loading from "../Loading.jsx";
import { AuthContext } from "../AuthContext.jsx";

function Login() {
  const { storeToken } = useContext(AuthContext);
  const baseUrl = import.meta.env.VITE_USER_SERVER_BASE_URL;
  const Navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Password visibility state

  function handleclick(e) {
    e.preventDefault();
    setIsLoading(true);

    axios
      .post(`${baseUrl}/login`, {
        email,
        password,
      })
      .then(async (response) => {
        const token = await response.data.data.token;
        console.log(token);
        storeToken(token);
        setIsLoading(false);
        Navigate("/");
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
        setMessage("Something went wrong");
      });
  }

  // Function to toggle password visibility
  function togglePasswordVisibility() {
    setIsPasswordVisible((prevState) => !prevState);
  }

  return (
    <>
      <Navbar />
      <main className="login">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="welcome">
            <h1 className="title">
              Login Into <span style={{ color: "brown" }}>CodeClub</span>
            </h1>
            <p className="description">
              Submit your code and earn points to redeem swag items
            </p>
            <div className="signup-form">
              <form className="form">
                <div className="input-group">
                  <input
                    id="email"
                    placeholder="Kle Tech Email ID"
                    type="email"
                    className="input"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <input
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    className="input"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password-button"
                    onClick={togglePasswordVisibility}
                  >
                    {isPasswordVisible ? "Hide" : "Show"}
                  </button>
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
          </div>
        )}
      </main>
    </>
  );
}

export default Login;
