import React, { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import EnterOTPRegister from "./components/Auth/Sign up/OTP/EnterOTPRegister";
import SignUp from "./components/Auth/Sign up/SignUp";
import SignIn from "./components/Auth/Sign in/SignIn";
import AuthCallback from "./components/Auth/AuthCallback";
import StudentHomePage from "./components/HomePage/Student homepage/StudentHomePage";
import "./index.css";
import Main from "./components/Main";
import RequestPasswordReset from "./components/Auth/reset password/RequestPasswordReset";
import ResetPassword from "./components/Auth/reset password/ResetPassword";
import Messenger from "./Message Socket/Page/Messenger";
import PaymentResult from "./components/Booking/paymentResult";
import BookingPage from "./components/Booking/bookingPage";
import TutorListPage from "./components/Booking/tutorPage";
import PaymentPage from "./components/User/PaymentPage";
import BookingSchedule from "./components/Schedule/BookingSchedule";
import BookingHistoryPage from "./components/User/BookingHistory";
import MyCourses from "./components/User/MyCourse";
import SavedTutorsPage from "./components/Booking/SavedTutorPage";
import Header from "./components/Layout/Header/Header";
import Footer from "./components/Layout/Footer/Footer";

const AppLayout = ({ children }) => {
  const location = useLocation();
  const noHeaderFooterRoutes = ["/otp-verify", "/auth/callback"];
  const hideHeaderFooter = noHeaderFooterRoutes.includes(location.pathname);

  return (
    <>
      {!hideHeaderFooter && <Header />}
      {children}
      {!hideHeaderFooter && <Footer />}
    </>
  );
};
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
          </Route>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/otp-verify" element={<EnterOTPRegister />} />
          <Route path="auth/callback" element={<AuthCallback />} />
          <Route path="/forgot-password" element={<RequestPasswordReset />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/messenger" element={<Messenger />} />
          <Route
            path="/tutor"
            element={
              <AppLayout>
                <TutorListPage />
              </AppLayout>
            }
          />
          <Route
            path="/saved-tutors"
            element={
              <AppLayout>
                <SavedTutorsPage />
              </AppLayout>
            }
          />
          <Route
            path="/book/:tutorId"
            element={
              <AppLayout>
                <BookingPage />
              </AppLayout>
            }
          />
          <Route
            path="/payment/result"
            element={
              <AppLayout>
                <PaymentResult />
              </AppLayout>
            }
          />
          <Route
            path="/user/paymentinfo"
            element={
              <AppLayout>
                <PaymentPage />
              </AppLayout>
            }
          />
          <Route
            path="/booking/:bookingId/schedule"
            element={
              <AppLayout>
                <BookingSchedule />
              </AppLayout>
            }
          />
          <Route
            path="/user/bookinghistory"
            element={
              <AppLayout>
                <BookingHistoryPage />
              </AppLayout>
            }
          />
          <Route
            path="/user/my-courses"
            element={
              <AppLayout>
                <MyCourses />
              </AppLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
};

export default Layout;
