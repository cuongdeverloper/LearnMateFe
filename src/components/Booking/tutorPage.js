import React, { useEffect, useState } from "react";
import axios from "../../Service/AxiosCustomize";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import "../../scss/TutorListPage.scss";

export default function TutorListPage() {
  const [tutors, setTutors] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
    subject: "",
  });
  const subjectOptions = [
    "Toán",
    "Vật Lý",
    "Hóa Học",
    "Tiếng Anh",
    "Lập Trình",
    "Văn",
    "Sinh Học",
    "Địa Lý",
    "Lịch Sử",
    "Tin Học",
  ];
  const navigate = useNavigate();

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async (filterParams = {}) => {
    try {
      const res = await axios.get("/tutors", { params: filterParams });
      setTutors(res.tutors || []);
    } catch (error) {
      alert("Lấy danh sách tutor thất bại");
      console.error(error);
    }
  };
  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFilterApply = () => {
    fetchTutors(filters);
  };

  return (
    <div className="page-container">
      <nav className="navbar">
        <div className="navbar-logo" onClick={() => navigate("/")}>
          TutorBooking
        </div>
        <div className="navbar-menu">
          <button onClick={() => navigate("/login")} className="btn btn-outline">
            Đăng nhập
          </button>
          <button onClick={() => navigate("/register")} className="btn btn-primary">
            Đăng ký
          </button>
        </div>
      </nav>

      <header className="page-header">
        <h1>Chọn Gia Sư Phù Hợp</h1>
        <p className="sub-title">Tìm kiếm gia sư theo tên, môn học, giá và đánh giá</p>
      </header>

      <section className="filter-section">
        <div className="filter-row">
          <div className="filter-group">
            <label>Tên Tutor</label>
            <input
              type="text"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              placeholder="Nhập tên tutor"
            />
          </div>
          <div className="filter-group">
            <label>Giá tối thiểu (VND)</label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="100000"
            />
          </div>
          <div className="filter-group">
            <label>Giá tối đa (VND)</label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="500000"
            />
          </div>
          <div className="filter-group">
            <label>Đánh giá tối thiểu</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              name="minRating"
              value={filters.minRating}
              onChange={handleFilterChange}
              placeholder="4.0"
            />
          </div>
          <div className="filter-group">
            <label>Môn học</label>
            <select
              name="subject"
              value={filters.subject}
              onChange={handleFilterChange}
            >
              <option value="">Tất cả</option>
              {subjectOptions.map((subj, idx) => (
                <option key={idx} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group filter-btn-group">
            <button onClick={handleFilterApply} className="btn btn-primary btn-filter">
              Lọc Gia Sư
            </button>
          </div>
        </div>
      </section>

      <section className="tutor-list-section">
        {tutors.length === 0 ? (
          <p className="no-result">Không tìm thấy gia sư phù hợp.</p>
        ) : (
          <div className="tutor-list">
            {tutors.map((tutor) => (
              <div
                key={tutor._id}
                className="tutor-card"
                onClick={() => navigate(`/book/${tutor._id}`)}
              >
                <img
                  className="tutor-avatar"
                  src={
                    tutor.avatar ||
                    "https://i.pravatar.cc/100?img=" +
                      (Math.floor(Math.random() * 70) + 1)
                  }
                  alt={tutor.name || "Tutor Avatar"}
                />
                <div className="tutor-info">
                  <h3>{tutor.name || tutor.fullName}</h3>
                  <div className="rating">
                    <FaStar className="star-icon" />
                    <span>{tutor.rating ? tutor.rating.toFixed(1) : "Chưa có"}</span>
                  </div>
                  <p className="tutor-desc">
                    {tutor.description || "Gia sư chuyên nghiệp, tận tâm."}
                  </p>
                  <div className="tutor-price">
                    Giá: {tutor.pricePerHour?.toLocaleString()} VND / giờ
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}