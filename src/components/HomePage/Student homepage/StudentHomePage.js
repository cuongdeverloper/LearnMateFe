import React from "react";
import "./StudentHomePage.scss";
import LangLogin from "../LangLogin/LangLogin";
import { useNavigate } from "react-router-dom";
import { doLogout } from "../../../redux/action/userAction";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie'
import { useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
const StudentHomePage = () => {
  useEffect(() => {
  AOS.init({
    duration: 1000, 
  });
}, []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logout = async () => {
    await dispatch(doLogout());
  }
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  const user = useSelector(state => state.user);
  const role = useSelector((state) => state.user.account.role);

  const isTokenExpired = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp < currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  };
  const decodeTokenData = async () => {
    try {
      const token = Cookies.get('accessToken');

      if (!token || isTokenExpired(token)) {
        dispatch(doLogout());
        navigate('/signin')
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      dispatch(doLogout());
    }
  };
  useEffect(() => {
    document.title = "LearnMate";
  }, [isAuthenticated]);

  useEffect(() => {
    decodeTokenData();
  }, [dispatch])

  useEffect(() => {
    if (!isAuthenticated) {
      logout();
    }
  }, [isAuthenticated, dispatch]);

  return (
    <div className="home-container">
      {/* HEADER */}
      <header className="header">
        <div className="logo">LearnMate</div>
        <nav className="nav">
          <a href="/tutor">Tìm gia sư</a>
          <a href="/tutor-application">Trở thành gia sư</a>
          {role === "tutor" && <a to="/TutorDashboard">BookingManagement</a>}
          {role === "admin" && <a to="/admin/dashboard">Admin</a>}
        </nav>
        <div className="right-section">
          <LangLogin />
          <div className="profile-dropdown">
            <img
              src={user?.account?.image || "https://i.pravatar.cc/40"}
              alt="avatar"
              className="avatar"
              onClick={() =>
                document
                  .querySelector(".dropdown-menu")
                  ?.classList.toggle("show")
              }
            />
            <div className="dropdown-menu">
              <button onClick={() => navigate('/profile')}>Trang cá nhân</button>
              <button onClick={() => navigate('/user/paymentinfo')}>Thanh toán</button>
              <button onClick={() => navigate('/user/bookinghistory')}>Lịch sử đặt lịch</button>
              <button onClick={() => navigate('/user/my-courses')}>Khóa học của tôi</button>

            </div>
          </div>
        </div>
      </header>


      {/* HERO */}
      <section className="hero" data-aos="fade-up">
        <div className="hero-left">
          <strong><h1 style={{ color: "#121117" }}>Học nhanh hơn với gia sư giỏi nhất dành cho bạn.</h1></strong>
          <button className="btn-primary" onClick={() => navigate('/tutor')}>Bắt đầu ngay →</button>
        </div>
        <div className="hero-right">
          <div className="stacked-images">
            <img
              src="https://res.cloudinary.com/djeilqn5r/image/upload/v1748488439/SDN392/img-1748488435399-aesthetic-outdoor-3840x2160-12537.jpg.jpg"
              alt="Gia sư"
              className="main-img"
            />
            <img
              src="https://res.cloudinary.com/djeilqn5r/image/upload/v1748488439/SDN392/img-1748488435399-aesthetic-outdoor-3840x2160-12537.jpg.jpg"
              alt="stacked"
              className="shadow-img shadow-1"
            />
            <img
              src="https://res.cloudinary.com/djeilqn5r/image/upload/v1748488439/SDN392/img-1748488435399-aesthetic-outdoor-3840x2160-12537.jpg.jpg"
              alt="stacked"
              className="shadow-img shadow-2"
            />
          </div>
        </div>

      </section>

      {/* THỐNG KÊ */}
      <section className="stats" data-aos="fade-up">
        <div className="stat-item"><strong>100.000+</strong><br />Gia sư kinh nghiệm</div>
        <div className="stat-item"><strong>300.000+</strong><br />Đánh giá 5 sao</div>
        <div className="stat-item"><strong>120+</strong><br />Môn học giảng dạy</div>
        <div className="stat-item"><strong>180+</strong><br />Quốc tịch gia sư</div>
        <div className="stat-item"><strong>4.8 ★</strong><br />Trên App Store</div>
      </section>
      <section className="how-it-works" data-aos="fade-up">
        <h2>How it works:</h2>
        <div className="steps">
          <div className="step">
            <div className="step-header">
              <span className="step-number">1</span>
              <h3>Find your tutor.</h3>
            </div>
            <p>We’ll connect you with a tutor who will motivate, challenge, and inspire you.</p>
            <div className="step-img">
              <img src="https://res.cloudinary.com/djeilqn5r/image/upload/v1752488056/mother-giving-advice-son-flat-design-style_207579-1140_ujexkh.avif" alt="Find your tutor" />
            </div>
          </div>
          <div className="step">
            <div className="step-header">
              <span className="step-number">2</span>
              <h3>Start learning.</h3>
            </div>
            <p>Your tutor will guide the way through your first lesson and help you plan your next steps.</p>
            <div className="step-img">
              <img src="https://res.cloudinary.com/djeilqn5r/image/upload/v1752488027/Video-Call-1024x768-1_qkogsr.jpg" alt="Start learning" />
            </div>
          </div>
          <div className="step">
            <div className="step-header">
              <span className="step-number">3</span>
              <h3>Speak. Read. Write. Repeat.</h3>
            </div>
            <p>Choose how many lessons you want to take each week and get ready to reach your goals!</p>
            <div className="step-img">
              <img src="https://res.cloudinary.com/djeilqn5r/image/upload/v1752488060/learning-unicef_peroiz.jpg" alt="Repeat learning" />
            </div>
          </div>
        </div>
      </section>

      {/* TRỞ THÀNH GIA SƯ */}
      <div className="div-become-tutor" data-aos="fade-up">
        <section className="become-tutor">
          <div className="become-left">
            <img src="https://res.cloudinary.com/djeilqn5r/image/upload/v1752487669/Tutorat-a-Winnipeg-Tuteurs-a-Winnipeg-SOSprof-Tutoring-in-Winnipeg-Tutors-in-Winnipeg-SOSteacher-1024x932_w7wgdr.jpg" alt="Trở thành gia sư" />
          </div>
          <div className="become-right">
            <h2>Trở thành gia sư</h2>
            <p>Kiếm tiền bằng cách chia sẻ kiến thức chuyên môn với học viên. Đăng ký ngay để bắt đầu dạy học trực tuyến cùng FindTutor.</p>
            <ul>
              <li>🌟 Tìm học viên mới</li>
              <li>🚀 Phát triển sự nghiệp</li>
              <li>💸 Nhận thanh toán an toàn</li>
            </ul>
            <button className="btn-primary">Trở thành gia sư →</button>
            <a href="#">Tìm hiểu cách hoạt động</a>
          </div>
        </section>
      </div>
      <footer className="site-footer" data-aos="fade-up">
        <div className="footer-content">
          <div className="footer-logo">
            <h3>LearnMate</h3>
            <p>Kết nối học viên với gia sư hàng đầu trên toàn thế giới.</p>
          </div>

          <div className="footer-links">
            <h4>Về chúng tôi</h4>
            <ul>
              <li><a href="#">Giới thiệu</a></li>
              <li><a href="#">Cơ hội nghề nghiệp</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Hỗ trợ</h4>
            <ul>
              <li><a href="#">Trung tâm trợ giúp</a></li>
              <li><a href="#">Liên hệ</a></li>
              <li><a href="#">Câu hỏi thường gặp</a></li>
            </ul>
          </div>

          <div className="footer-social">
            <h4>Kết nối</h4>
            <div className="social-icons">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-youtube"></i></a>
            </div>

            <div className="app-links">
              <a href="https://play.google.com" target="_blank" rel="noreferrer">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" />
              </a>
              <a href="https://www.apple.com/app-store/" target="_blank" rel="noreferrer">
                <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 LearnMate. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
export default StudentHomePage