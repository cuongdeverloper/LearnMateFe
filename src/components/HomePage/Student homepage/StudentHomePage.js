import React, { useEffect, useRef } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { doLogout } from "../../../redux/action/userAction";
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie'

const StudentHomePage = () => {
  const subjects = ["Toán", "Lý", "Hóa", "Tiếng Anh"];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { postId } = useParams();   const socket = useRef();
  const handleClose = () => {
    navigate("/"); 
  };
  const logout = async () => {
    await dispatch(doLogout());
  }
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  const user = useSelector(state => state.user);
//   useEffect(() => {
//     socket.current = io("ws://localhost:7373");
//     socket.current.on("getMessage", (data) => {
//       setArrivalMessage({
//         sender: data.senderId,
//         text: data.text,
//         createdAt: Date.now(),
//       });
//     });
//   }, []);
// console.log(socket)
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
    <div style={{ fontFamily: "sans-serif", color: "#1f2937", backgroundColor: "white" }}>
      {/* Hero Section */}
      <section style={{ backgroundColor: "#eff6ff", padding: "3rem 1.5rem", textAlign: "center" }}>
        <Container>
          <h1 style={{ fontSize: "1.875rem", fontWeight: "700", marginBottom: "1rem" }}>
            Tìm gia sư phù hợp nhất với bạn chỉ trong vài phút
          </h1>
          <Row className="justify-content-center g-3 mt-3">
            <Col xs="auto">
              <Form.Select aria-label="Chọn môn học" style={{ minWidth: "150px" }}>
                <option>Chọn môn học</option>
                <option>Toán</option>
                <option>Lý</option>
                <option>Hóa</option>
              </Form.Select>
            </Col>
            <Col xs="auto">
              <Form.Select aria-label="Online/Offline" style={{ minWidth: "150px" }}>
                <option>Online/Offline</option>
                <option>Online</option>
                <option>Offline</option>
              </Form.Select>
            </Col>
            <Col xs="auto">
              <Form.Select aria-label="Chọn khu vực" style={{ minWidth: "150px" }}>
                <option>Chọn khu vực</option>
              </Form.Select>
            </Col>
            <Col xs="auto">
              <Button variant="primary" style={{ padding: "0.75rem 1.5rem" }}>
                Tìm ngay
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Danh mục nổi bật */}
      <section style={{ padding: "2.5rem 1.5rem" }}>
        <Container>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1.5rem" }}>
            Danh mục nổi bật
          </h2>
          <Row xs={2} md={4} className="g-3">
            {subjects.map((subject) => (
              <Col key={subject}>
                <div
                  style={{
                    padding: "1.25rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.375rem",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
                >
                  <p style={{ fontSize: "1.125rem", fontWeight: "500", marginBottom: "0.5rem" }}>
                    {subject}
                  </p>
                  <Button variant="link" style={{ color: "#3b82f6" }}>
                    Xem gia sư
                  </Button>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Gợi ý gia sư */}
      <section style={{ backgroundColor: "#f9fafb", padding: "2.5rem 1.5rem" }}>
        <Container>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1.5rem" }}>
            Gia sư phù hợp với bạn
          </h2>
          <Row xs={1} md={4} className="g-4">
            {[...Array(4)].map((_, idx) => (
              <Col key={idx}>
                <div
                  style={{
                    border: "1px solid #d1d5db",
                    borderRadius: "0.375rem",
                    padding: "1rem",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    transition: "box-shadow 0.3s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 10px 15px rgba(0,0,0,0.2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)")}
                >
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      backgroundColor: "#d1d5db",
                      borderRadius: "50%",
                      marginBottom: "0.75rem",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  ></div>
                  <h3 style={{ fontWeight: "500", textAlign: "center" }}>Gia sư {idx + 1}</h3>
                  <p style={{ fontSize: "0.875rem", color: "#4b5563", textAlign: "center", margin: "0.25rem 0" }}>
                    Toán • THPT
                  </p>
                  <p style={{ fontSize: "0.875rem", marginTop: "0.25rem", textAlign: "center" }}>
                    Giá: {(30000 + idx * 5000).toLocaleString("vi-VN")}đ/giờ
                  </p>
                  <div style={{ textAlign: "center", marginTop: "1rem" }}>
                    <Button variant="primary" size="sm">
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Lợi ích */}
      <section style={{ padding: "2.5rem 1.5rem" }}>
        <Container>
          <Row xs={2} md={4} className="text-center g-4">
            <Col>
              <p style={{ color: "#2563eb", fontSize: "2rem" }}>🎓</p>
              <p>Học thử miễn phí 1 buổi</p>
            </Col>
            <Col>
              <p style={{ color: "#2563eb", fontSize: "2rem" }}>✅</p>
              <p>Gia sư được xác minh</p>
            </Col>
            <Col>
              <p style={{ color: "#2563eb", fontSize: "2rem" }}>🗓️</p>
              <p>Lịch học linh hoạt</p>
            </Col>
            <Col>
              <p style={{ color: "#2563eb", fontSize: "2rem" }}>📞</p>
              <p>Hỗ trợ 24/7</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: "#2563eb", color: "white", padding: "2rem 1.5rem", textAlign: "center" }}>
        <Container>
          <p>Tải ứng dụng của chúng tôi</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1rem" }}>
            <img src="/appstore.png" alt="App Store" style={{ height: "40px" }} />
            <img src="/playstore.png" alt="Google Play" style={{ height: "40px" }} />
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default StudentHomePage;
