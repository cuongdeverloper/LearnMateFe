import React, { useEffect, useState } from "react";
import axios from "../../Service/AxiosCustomize";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import "../../scss/TutorListPage.scss";

const classSubjectsMap = {
  1: ["Math", "Tiếng Việt"],
  2: ["Toán", "Tiếng Việt", "Tiếng Anh"],
  3: ["Toán", "Tiếng Việt", "Tiếng Anh"],
  4: ["Toán", "Tiếng Việt", "Tiếng Anh", "Khoa học"],
  5: ["Toán", "Tiếng Việt", "Tiếng Anh", "Khoa học", "Lịch Sử"],
  6: ["Toán", "Văn", "Tiếng Anh", "Vật Lý"],
  7: ["Toán", "Văn", "Tiếng Anh", "Vật Lý", "Hóa Học", "Sinh Học"],
  8: ["Toán", "Văn", "Tiếng Anh", "Vật Lý", "Hóa Học", "Sinh Học", "Lịch Sử"],
  9: ["Toán", "Văn", "Tiếng Anh", "Vật Lý", "Hóa Học", "Sinh Học", "Địa Lý"],
  10: ["Math", "Văn", "Tiếng Anh", "Lý", "Hóa", "Sinh", "Tin Học"],
  11: ["Toán", "Văn", "Tiếng Anh", "Lý", "Hóa", "Sinh", "Tin Học"],
  12: ["Toán", "Văn", "Tiếng Anh", "Lý", "Hóa", "Sinh", "Tin Học"],
};

export default function TutorListPage() {
  const [tutors, setTutors] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [filters, setFilters] = useState({
    name: "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
  });

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

  const handleClassSelect = (grade) => {
    // Nếu chọn lại lớp đang chọn => bỏ chọn môn và lớp
    if (selectedClass === grade) {
      setSelectedClass(null);
      setSelectedSubject("");
    } else {
      setSelectedClass(grade);
      setSelectedSubject(""); // reset môn khi đổi lớp
    }
  };

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    // Gọi API lọc ngay khi chọn môn
    fetchTutors({
      ...filters,
      class: selectedClass,
      subject,
    });
  };

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFilterApply = () => {
    fetchTutors({
      ...filters,
      class: selectedClass,
      subject: selectedSubject,
    });
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
        <p className="sub-title">Tìm kiếm gia sư theo lớp học, môn học, giá và đánh giá</p>
      </header>

      <div className="main-layout">
        {/* Sidebar riêng biệt nằm ngoài phần filter */}
        <aside className="sidebar-grade-subject">
          <div className="grade-select">
            <label>Chọn lớp học:</label>
            <div className="grade-options-vertical">
              {[...Array(12)].map((_, i) => (
                <div key={i + 1}>
                  <button
                    className={`grade-btn ${selectedClass === i + 1 ? "selected" : ""}`}
                    onClick={() => handleClassSelect(i + 1)}
                  >
                    Lớp {i + 1}
                  </button>
                  {/* Hiển thị môn ngay dưới lớp đang chọn */}
                  {selectedClass === i + 1 && (
                    <div className="subject-options-vertical">
                      {(classSubjectsMap[i + 1] || []).map((subj, idx) => (
                        <button
                          key={idx}
                          className={`subject-btn ${selectedSubject === subj ? "selected" : ""}`}
                          onClick={() => handleSubjectSelect(subj)}
                        >
                          {subj}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Phần lọc còn lại và danh sách gia sư */}
        <main className="main-content">
          <section className="filter-section">
            <div className="filter-main">
              <div className="filter-row">
                <div className="filter-group">
                  <label>Tên Tutor</label>
                  <input type="text" name="name" value={filters.name} onChange={handleFilterChange} />
                </div>
                <div className="filter-group">
                  <label>Giá tối thiểu</label>
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="filter-group">
                  <label>Giá tối đa</label>
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="filter-group">
                  <label>Đánh giá tối thiểu</label>
                  <input
                    type="number"
                    name="minRating"
                    step="0.1"
                    min="0"
                    max="5"
                    value={filters.minRating}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="filter-group filter-btn-group">
                  <button onClick={handleFilterApply} className="btn btn-primary btn-filter">
                    Lọc Gia Sư
                  </button>
                </div>
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
                        "https://i.pravatar.cc/100?img=" + (Math.floor(Math.random() * 70) + 1)
                      }
                      alt={tutor.name || tutor.fullName}
                    />
                    <div className="tutor-info">
                    <h3>{tutor.user?.username || "Gia sư chưa có tên"}</h3>
                      <div className="rating">
                        <FaStar className="star-icon" />
                        <span>{tutor.rating ? tutor.rating.toFixed(1) : "Chưa có đánh giá"}</span>
                      </div>
                      <p><strong>Email:</strong> {tutor.user?.email || "Chưa cập nhật"}</p>
                      <p><strong>Điện thoại:</strong> {tutor.user?.phoneNumber || "Không rõ"}</p>
                      <p>
                        <strong>Môn dạy:</strong> {tutor.subjects?.join(", ") || "Đang cập nhật"}
                      </p>
                      <p className="tutor-desc">{tutor.description || "Gia sư chuyên nghiệp, tận tâm."}</p>
                      <div className="tutor-price">
                        Giá: {tutor.pricePerHour?.toLocaleString() || "Liên hệ"} VND / giờ
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
