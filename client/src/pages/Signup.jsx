import { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./styles/signup.css";
import Loading from "../Loading.jsx";
import { AuthContext } from "../AuthContext.jsx";

function Signup() {
  const navigate = useNavigate();
  const { storeToken } = useContext(AuthContext);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [cfId, setCfId] = useState("");
  const [error, setError] = useState("");
  const [validId, setValidId] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://codeforces.com/api/user.info?handles=${cfId}&checkHistoricHandles=false`
      );
      const handle = response.data.result[0].handle;
      if (cfId === handle) {
        setError("ID matched");
        setValidId(true);
      }
    } catch (error) {
      setError("Invalid Codeforces ID");
      setValidId(false);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setCfId(e.target.value);
  };

  const handleclick = (e) => {
    e.preventDefault();

    if (!email || !password || !firstname || !lastname) {
      setError("Please enter all fields");
    } else if (!/^01fe\d{2}[a-zA-Z]{2,5}\d{3}@kletech\.ac\.in$/.test(email)) {
      setError("Enter a valid email");
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(
        password
      )
    ) {
      setError("Enter a valid password");
    } else {
      if (validId) {
        setIsLoading(true);
        axios
          .post("http://localhost:9090/signup", {
            Firstname: firstname,
            Lastname: lastname,
            email: email,
            password,
            CfId: cfId,
          })
          .then((res) => {
            console.log(res.data.data.token);
            storeToken(res.data.data.token);
            navigate("/");
          })
          .catch(() => {
            setError("Something went wrong! Please try later");
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="signup">
        <div className="welcome">
          <h1 className="title">
            Signup to
            <span style={{ color: "brown", fontFamily: "Arial" }}>
              CodeClub
            </span>
          </h1>
          <p className="description">
            Submit your code and earn points to redeem swag items
          </p>
        </div>
        <div className="signup-form">
          <form className="form">
            <div className="input-group">
              <input
                id="first-name"
                placeholder="First Name"
                type="text"
                className="input"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />
              <input
                id="last-name"
                placeholder="Last Name"
                type="text"
                className="input"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                id="email"
                placeholder="Email"
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                id="CfId"
                placeholder="CodeForces id"
                type="text"
                className="input"
                value={cfId}
                onChange={(e) => handleInputChange(e)}
                onBlur={fetchData}
                required
              />

              {isLoading && <Loading />}
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
              Sign Up
            </button>
          </form>
          <div className="login-link">
            <span className="text">Already have an account? </span>
            <Link to="/login" className="link">
              Login
            </Link>
          </div>
          {error && (
            <p
              style={
                error === "ID matched" ? { color: "green" } : { color: "red" }
              }
            >
              {error}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default Signup;
