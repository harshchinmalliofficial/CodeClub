import { useState } from "react";
import AdminNavbar from "./Admin_components/AdminNavbar.jsx";
import axios from "axios";
import Loading from "../Loading.jsx";
// import Unauthorized from "./unAuthorised.jsx";
import UnAuthorised from "./unAuthorised.jsx"; // Correct

function Admin_home() {
  const baseUrl = import.meta.env.VITE_USER_SERVER_BASE_URL;
  const [question, setQuestion] = useState("");
  const [startTime, setStartTime] = useState("");
  const [qLink, setqLink] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("authToken");
  // console.log(token);

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };

  const handleqLinkChange = (e) => {
    setqLink(e.target.value);
  };

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    axios
      .post(`${baseUrl}/admin/Addqotd`, {
        qName: question,
        qSolutionTime: startTime,
        qLink,
        qSolution: answer,
      })
      .then((response) => {
        console.log(response.data);
        setIsLoading(false);
        // Handle success as needed
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
        setError("Something went wrong");
      });
  };

  if (!token) {
    return (
      <div>
        <UnAuthorised />
      </div>
    );
  }

  return (
    <>
      <AdminNavbar />
      <main className="container">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="welcome">
            <h1 className="title">Upload Questions Here</h1>
            <div className="signup-form">
              <form className="form" onSubmit={handleSubmit}>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Enter question"
                    className="input"
                    value={question}
                    onChange={handleQuestionChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Enter start time"
                    className="input"
                    value={startTime}
                    onChange={handleStartTimeChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Enter question link"
                    className="input"
                    value={qLink}
                    onChange={handleqLinkChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Enter answer"
                    className="input"
                    value={answer}
                    onChange={handleAnswerChange}
                    required
                  />
                </div>
                <button type="submit" className="button">
                  Submit
                </button>
              </form>
              {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default Admin_home;
