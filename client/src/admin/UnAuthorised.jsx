import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();
  //   const token = localStorage.getItem("authToken");

  useEffect(() => {
    const isAuthenticated = false; // Replace this with your actual authentication logic

    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Unauthorized Access</h1>
        <p className="text-lg text-gray-700">
          You are not authorized to view this page.
        </p>
        <p className="text-lg text-gray-700">
          Redirecting to the login page...
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
