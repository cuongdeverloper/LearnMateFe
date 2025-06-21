import React, { useEffect } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import './HomePage.scss';

const TutorHomePage = () => {
  useEffect(() => {
    document.title = "LearnMate - Gia sư trực tuyến chuyên nghiệp";
  }, []);

  return (
    <div className="tutor-homepage">
      <header className="tutor-header">
        <Container fluid className="d-flex justify-content-between align-items-center py-3 px-4">
          <h3 className="logo mb-0">LearnMate</h3>
          <div className="d-flex align-items-center gap-3">
            <Button variant="outline-primary" onClick={() => window.location.href='/TutorDashboard'}>
              📘 Tutor Dashboard
            </Button>
            <div className="dropdown">
              <Button variant="outline-secondary" className="dropdown-toggle" data-bs-toggle="dropdown">
                👤 Tài khoản
              </Button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><a className="dropdown-item" href="#">Thông tin cá nhân</a></li>
                <li><a className="dropdown-item" href="#">Đổi mật khẩu</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="/signin">Đăng xuất</a></li>
              </ul>
            </div>
          </div>
        </Container>
      </header>
      {/* Hero Section */}
      <section className="hero">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1>Đội ngũ gia sư tại <span>LearnMate</span></h1>
              <p>Giỏi chuyên môn - Giàu kinh nghiệm - Phương pháp dễ hiểu</p>
              <Button variant="success">Đăng ký học thử</Button>
            </Col>
            <Col md={6}>
              <img src="/teachers-banner.png" alt="Teachers" className="img-fluid" />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Subject Filter */}
      <section className="subject-filter">
        <Container>
          <Form.Select>
            <option>Chọn bộ môn</option>
            <option>Toán</option>
            <option>Văn</option>
            <option>Tiếng Anh</option>
          </Form.Select>
        </Container>
      </section>

      {/* Featured Tutors */}
      <section className="featured-tutors">
        <Container>
          <h2>Gia sư nổi bật</h2>
          <Row>
            {[1, 2, 3, 4].map(i => (
              <Col md={3} key={i} className="tutor-card">
                <div className="avatar-placeholder"></div>
                <h5>Gia sư {i}</h5>
                <p>Chuyên môn: Toán - THPT</p>
                <Button size="sm">Xem chi tiết</Button>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="tutor-footer">
        <Container>
          <Row>
            <Col md={4}>
              <h5>Về LearnMate</h5>
              <ul>
                <li>Giới thiệu</li>
                <li>Liên hệ</li>
                <li>Tuyển dụng</li>
              </ul>
            </Col>
            <Col md={4}>
              <h5>Chính sách</h5>
              <ul>
                <li>Bảo mật</li>
                <li>Điều khoản</li>
                <li>FAQ</li>
              </ul>
            </Col>
            <Col md={4}>
              <h5>Liên hệ</h5>
              <p>📞 028 7300 3033</p>
              <p>✉️ learnwithus@learnmate.vn</p>
            </Col>
          </Row>
          <p className="text-center copyright">© 2025 LearnMate. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
};

export default TutorHomePage;
