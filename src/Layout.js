import React, { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import Test from "./components/Test";
import EnterOTPRegister from "./components/Auth/Sign up/OTP/EnterOTPRegister";
import SignUp from "./components/Auth/Sign up/SignUp";
import SignIn from "./components/Auth/Sign in/SignIn";
import AuthCallback from "./components/Auth/AuthCallback";

import PaymentResult from "./components/Booking/paymentResult";
import BookingPage from "./components/Booking/bookingPage";
import TutorListPage from "./components/Booking/tutorPage";
import PaymentPage from "./components/User/PaymentPage";

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
          <Route path="/" element={<Test />}></Route>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/otp-verify" element={<EnterOTPRegister />} />
          <Route path="auth/callback" element={<AuthCallback />} />

          <Route path="/" element={<Test />}></Route>
          <Route path="/tutor" element={<TutorListPage />} />
          <Route path="/book/:tutorId" element={<BookingPage />} />
          <Route path="/payment/result" element={<PaymentResult />} />
          <Route path="/user/paymentinfo" element={<PaymentPage />} />
          {/* <Route path="/payment/:bookingId" element={<PaymentResult />} /> */}
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
};

export default Layout;
