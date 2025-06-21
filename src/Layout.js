import React, { Suspense, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Aos from "aos";
import 'aos/dist/aos.css';

// Auth
import EnterOTPRegister from "./components/Auth/Sign up/OTP/EnterOTPRegister";
import SignUp from "./components/Auth/Sign up/SignUp";
import SignIn from "./components/Auth/Sign in/SignIn";
import AuthCallback from "./components/Auth/AuthCallback";

// Pages
import StudentHomePage from "./components/HomePage/Student homepage/StudentHomePage";
import TutorHomePage from "./components/HomePage/Tutor homepage/TutorHomePage";

// Dashboards
import TutorDashboard from "./components/Tutor/TutorDashboard";
import Main from "./components/Main";

import './index.css';

const Layout = () => {
  useEffect(() => {
    Aos.init({ duration: 1000 }); 
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />}>
            <Route path="/StudentHomepage" element={<StudentHomePage />} />
            <Route path="/TutorHomepage" element={<TutorHomePage />} />
          </Route>
            <Route path="/TutorDashboard" element={<TutorDashboard />} />

          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/otp-verify" element={<EnterOTPRegister />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
};

export default Layout;
