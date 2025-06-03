import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createBooking } from '../../Service/ApiService';
import axios from '../../Service/AxiosCustomize';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../scss/BookingPage.scss';

export default function BookingPage() {
  const { tutorId } = useParams();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [numberOfSessions, setNumberOfSessions] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const res = await axios.get(`/tutors/${tutorId}`);
        if (res?.tutor) {
          setTutor(res.tutor);
        } else {
          toast.error('Không thể tải thông tin gia sư');
        }
      } catch (err) {
        toast.error('Lỗi khi tải thông tin gia sư');
      }
    };
    fetchTutor();
  }, [tutorId]);

  const handleBooking = async () => {
    if (!numberOfSessions || numberOfSessions <= 0) {
      toast.warn('Vui lòng nhập số buổi học hợp lệ');
      return;
    }
  
    setLoading(true);
    try {
      const totalAmount = tutor.pricePerHour * numberOfSessions;
  
      // Step 1: Tạo booking
      const res = await axios.post(`/bookings/${tutorId}`, {
        amount: totalAmount,
        numberOfSessions,
      });
  
      const bookingId = res.bookingId;
      if (!bookingId) throw new Error('Không thể tạo booking');
  
      // Step 2: Gọi tới VNPay để lấy payment URL
      const paymentRes = await axios.post('/payment/create-vnpay', {
        bookingId,
        amount: totalAmount,
      });
  
      const paymentUrl = paymentRes.paymentUrl;
      if (paymentUrl) {
        toast.success('Đang chuyển hướng đến thanh toán...');
        setTimeout(() => {
          window.location.href = paymentUrl;
        }, 1000);
      } else {
        toast.error('Không lấy được URL thanh toán');
      }
    } catch (err) {
      console.error('Lỗi đặt lịch:', err);
      if (err.response) {
        console.error('Response data:', err.response.data);
      }
      toast.error(err.response?.data?.message || err.message || 'Đặt lịch thất bại');
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
    }
  };
  
  // Khi bấm nút "Thanh toán & Đặt lịch", hiện modal
  const handleShowConfirm = () => {
    if (!numberOfSessions || numberOfSessions <= 0) {
      toast.warn('Vui lòng nhập số buổi học hợp lệ');
      return;
    }
    setShowConfirmModal(true);
  };

  const renderTutorInfo = () => {
    const user = tutor?.user;
    return (
      <div className="tutor-confirm">
        <img
          src={
            user?.image ||
            `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 70) + 1}`
          }
          alt="avatar"
          className="avatar"
        />
        <div className="tutor-details">
          <h3>{user?.username || 'Không rõ tên'}</h3>
          <p><strong>Email:</strong> {user?.email || 'Không rõ'}</p>
          <p><strong>SĐT:</strong> {user?.phoneNumber || 'Không rõ'}</p>
          <p><strong>Giới tính:</strong> {user?.gender || 'Không rõ'}</p>
          <p><strong>Môn:</strong> {tutor.subject || 'Không rõ'}</p>
          <p><strong>Giá:</strong> {tutor.pricePerHour?.toLocaleString()} VND / giờ</p>
          <p><strong>Mô tả:</strong> {tutor.description || 'Không có mô tả'}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="booking-wrapper">
      {/* Left Panel: Đánh giá */}
      <div className="side-panel left-panel">
        <h3>Đánh giá</h3>
        <ul>
          <li><strong>⭐⭐⭐⭐⭐ (4.9)</strong> - 25 lượt đánh giá</li>
          <li>“Rất nhiệt tình, con tôi tiến bộ nhanh”</li>
          <li>“Giải thích dễ hiểu, đúng giờ”</li>
          <li>“Phương pháp dạy dễ hiểu và sinh động”</li>
        </ul>
      </div>

      {/* Center: Thông tin gia sư + đặt lịch */}
      <div className="booking-container">
        <div className="booking-card">
          <h2>Xác nhận đặt lịch học</h2>

          {tutor ? renderTutorInfo() : <p>Đang tải thông tin gia sư...</p>}

          <div className="form-group">
            <label>Số buổi học</label>
            <input
              type="number"
              min={1}
              value={numberOfSessions}
              onChange={(e) => setNumberOfSessions(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>Tổng số tiền thanh toán (VND)</label>
            <input
              type="text"
              value={(tutor?.pricePerHour * numberOfSessions)?.toLocaleString() || ''}
              disabled
            />
          </div>

          <button
            onClick={handleShowConfirm}
            disabled={loading || !tutor}
            className="btn-booking"
          >
            {loading ? 'Đang xử lý...' : 'Thanh toán & Đặt lịch'}
          </button>
        </div>
      </div>

      {/* Right Panel: Cam kết */}
      <div className="side-panel right-panel">
        <h3>Cam kết từ gia sư</h3>
        <ul>
          <li>✅ Dạy đúng giờ, đủ buổi</li>
          <li>✅ Soạn bài kỹ lưỡng</li>
          <li>✅ Hỗ trợ học sinh ngoài giờ</li>
          <li>✅ Đảm bảo tiến bộ sau 1 tháng</li>
        </ul>
      </div>

      {/* Modal Xác nhận */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Xác nhận đặt lịch</h3>
            <p>Bạn có chắc muốn đặt {numberOfSessions} buổi học với tổng số tiền {(tutor?.pricePerHour * numberOfSessions).toLocaleString()} VND?</p>
            <div className="modal-actions">
              <button
                className="btn btn-confirm"
                onClick={handleBooking}
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
              <button
                className="btn btn-cancel"
                onClick={() => setShowConfirmModal(false)}
                disabled={loading}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
