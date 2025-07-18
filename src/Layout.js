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
import BookingHistoryPage from "./components/User/BookingHistory";
import MyCourses from "./components/User/MyCourse";
import SavedTutorsPage from "./components/Booking/SavedTutorPage";
import Header from "./components/Layout/Header/Header";
import Footer from "./components/Layout/Footer/Footer";
import TutorDashboard from "./components/Tutor/TutorDashboard";
import Dashboard from "./Admin/Dashboard";
import TutorApplications from "./Admin/TutorApplications";
import TutorManagement from "./Admin/TutorManagement";
import ProtectedRoute from "./ProtectRoutes";
import Unauthorized from "./Unauthorized";
import NotFound from "./NotFound";
import VerifyAccount from "./components/Auth/VerifyAccount";
import Profile from "./components/Profile/Profile";
import ReviewCoursePage from "./components/Review/ReviewCoursePage";
import BookingSchedule from "./components/Booking/Schedule/BookingSchedule";
import TutorApplicationForm from './components/Profile/TutorApplicationForm';


const AppLayout = ({ children }) => {
  const location = useLocation();
  const noHeaderFooterRoutes = ["/otp-verify", "/auth/callback"];
  const hideHeaderFooter = noHeaderFooterRoutes.includes(location.pathname);
  useEffect(() => {

  }, [])
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
            <Route path="/" element={<StudentHomePage />} />
          </Route>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/otp-verify" element={<EnterOTPRegister />} />
          <Route path="auth/callback" element={<AuthCallback />} />
          <Route path="/forgot-password" element={<RequestPasswordReset />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/messenger" element={<Messenger />} />
<Route path="/messenger/:conversationId" element={<Messenger />} />
          <Route path="/TutorDashboard" element={
            <ProtectedRoute allowedRoles={['tutor']}>
              <TutorDashboard />
            </ProtectedRoute>
          } />
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
            path="/booking/:bookingId/schedule"
            element={
              <AppLayout>
                <BookingSchedule />
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

          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin/tutors" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <TutorManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/applications" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <TutorApplications />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tutor-application" element={<TutorApplicationForm />} />
          <Route
            path="/review/:bookingId"
            element={
              <AppLayout>
                <ReviewCoursePage />
              </AppLayout>
            }
          />
          <Route path="/verify-account" element={<VerifyAccount />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
};

export default Layout;
