import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Admin_home from "../admin/Admin_home";
import Admin_login from "../admin/Admin_login";
import ProfilePage from "../Profile.jsx";
import Admin_signup from "../admin/Admin_signup.jsx";
import Redeem from "../pages/Redeem.jsx";
import Tests from "../pages/Tests.jsx";
import Qna from "../admin/Qna.jsx";
import UploadTest from "../admin/UploadTest.jsx";
// import Calendar from "@/admin/Events";
import MyCalendar from "@/admin/Events";
// import { Upload } from "lucide-react";

function Routess() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/home" element={<Admin_home />} />
        <Route path="/admin/login" element={<Admin_login />} />
        <Route path="/admin/signup" element={<Admin_signup />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/redeem" element={<Redeem />} />
        <Route path="/tests" element={<Tests />} />
        <Route path="/admin/qna" element={<Qna />} />
        <Route path="/admin/uploadTest" element={<UploadTest />} />
        <Route path="/admin/events" element={<MyCalendar />} />
      </Routes>
    </>
  );
}

export default Routess;
