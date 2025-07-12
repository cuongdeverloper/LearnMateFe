import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaShoppingBag, FaComments, FaChalkboardTeacher } from "react-icons/fa";
import axios from "../../../Service/AxiosCustomize";
import "./Header.scss";

const Header = () => {
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.user.account.access_token);
  const role = useSelector((state) => state.user.account.role);
  const [showDropdown, setShowDropdown] = useState(false);
  const [savedTutorIds, setSavedTutorIds] = useState([]);
  const dropdownRef = useRef(null);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/profile', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUser(res);
      } catch (err) {
        console.error("Lỗi lấy profile:", err);
      }
    };
    if (accessToken) fetchProfile();
  }, [accessToken]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="custom-header">
      <div className="header-inner">
        <Link to="/StudentHomepage" className="logo-text">
          <FaChalkboardTeacher className="logo-icon" />
          LearnMate
        </Link>

        <nav className="nav-links">
          <Link to="/tutor">Tìm gia sư</Link>
          <Link to="/community">Cộng đồng</Link>
          {accessToken && <Link to="/chat"><FaComments style={{ marginRight: 5 }} /> Chat</Link>}
          {accessToken && <Link to="/user/my-courses">Khóa học</Link>}
          {accessToken && <Link to="/user/bookinghistory">Lịch sử</Link>}
          {role === "admin" && <Link to="/admin">Admin</Link>}
        </nav>

        <div className="header-right">
          {accessToken ? (
            <>
              <div className="cart-icon" onClick={() => navigate("/saved-tutors")}>
                <FaShoppingBag />
                {savedTutorIds.length > 0 && (
                  <span className="cart-badge">{savedTutorIds.length}</span>
                )}
              </div>
              <div className="avatar-group" ref={dropdownRef}>
                {user && (
                  <>
                    <img
                      src={user.image || "https://i.pravatar.cc/150?img=32"}
                      alt="avatar"
                      className="avatar-img"
                      onClick={() => setShowDropdown(!showDropdown)}
                    />
                    <span className="username-text">{user.username}</span>
                  </>
                )}
                {showDropdown && (
                  <ul className="dropdown-menu">
                    <li onClick={() => { setShowDropdown(false); navigate("/user/paymentinfo"); }}>
                      Thanh toán
                    </li>
                    <li onClick={() => { setShowDropdown(false); navigate("/user/bookinghistory"); }}>
                      Lịch sử đặt lịch
                    </li>
                    <li onClick={() => { setShowDropdown(false); navigate("/user/my-courses"); }}>
                      Khóa học của tôi
                    </li>
                    <li onClick={() => { setShowDropdown(false); navigate("/signin"); }}>
                      Đăng xuất
                    </li>
                  </ul>
                )}
              </div>
            </>
          ) : (
            <div className="auth-btns">
              <button className="btn-outline" onClick={() => navigate("/signin")}>Đăng nhập</button>
              <button className="btn-filled" onClick={() => navigate("/signup")}>Đăng ký</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
