import React, { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Aos from "aos";
import 'aos/dist/aos.css';
import { useEffect } from "react";
import EnterOTPRegister from "./components/Auth/Sign up/OTP/EnterOTPRegister";
import SignUp from "./components/Auth/Sign up/SignUp";
import SignIn from "./components/Auth/Sign in/SignIn";
import AuthCallback from "./components/Auth/AuthCallback";
import StudentHomePage from "./components/HomePage/Student homepage/StudentHomePage";
import './index.css'
import Main from "./components/Main";
import RequestPasswordReset from "./components/Auth/reset password/RequestPasswordReset";
import ResetPassword from "./components/Auth/reset password/ResetPassword";
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
                        <Route path="/StudentHomepage" element={<StudentHomePage />}/>
                    </Route>
                     <Route path="/signup" element={<SignUp />}/>
                    <Route path="/signin" element={<SignIn />}/>
                    <Route path="/otp-verify" element={<EnterOTPRegister />} />
                    <Route path="auth/callback" element={<AuthCallback />} />
                    <Route path="/forgot-password" element={<RequestPasswordReset />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                </Routes>
            </BrowserRouter>
        </Suspense>
    );
};

export default Layout;
