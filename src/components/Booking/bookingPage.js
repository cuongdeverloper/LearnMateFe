import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createBooking } from '../../Service/ApiService';
import axios from '../../Service/AxiosCustomize';
import '../../scss/BookingPage.scss';

export default function BookingPage() {
  const { tutorId } = useParams();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const res = await axios.get(`/tutors/${tutorId}`);
        setTutor(res.tutor);
      } catch (err) {
        setMessage('Không thể tải thông tin gia sư');
      }
    };

    fetchTutor();
  }, [tutorId]);

  const handleBooking = async () => {
    const confirmBooking = window.confirm(
      `Xác nhận đặt lịch với gia sư ${tutor?.name || tutor?.fullName} với giá ${tutor.pricePerHour?.toLocaleString()} VND?`
    );
    if (!confirmBooking) return;

    setLoading(true);
    try {
      const payload = { tutorId, amount: tutor.pricePerHour };
      const res = await createBooking(payload);

      if (res?.data?.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      } else {
        setMessage('Đã xảy ra lỗi khi tạo thanh toán');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Đặt lịch thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-container">
      <div className="booking-card">
        <h2>Xác nhận đặt lịch học</h2>
        {message && <p className="custom-alert">{message}</p>}

        {tutor ? (
          <div className="tutor-confirm">
            <img
              src={
                tutor.avatar || `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 70) + 1}`
              }
              alt="avatar"
              className="avatar"
            />
            <div className="tutor-details">
              <h3>{tutor.name || tutor.fullName}</h3>
              <p><strong>Môn:</strong> {tutor.subject || 'Không rõ'}</p>
              <p><strong>Giá:</strong> {tutor.pricePerHour?.toLocaleString()} VND / giờ</p>
              <p><strong>Mô tả:</strong> {tutor.description || 'Không có mô tả'}</p>
            </div>
          </div>
        ) : (
          <p>Đang tải thông tin gia sư...</p>
        )}

        <div className="form-group">
          <label>Số tiền thanh toán (VND)</label>
          <input
            type="number"
            value={tutor?.pricePerHour || ''}
            disabled
          />
        </div>

        <button
          onClick={handleBooking}
          disabled={loading || !tutor}
          className="btn-booking"
        >
          {loading ? 'Đang xử lý...' : 'Thanh toán & Đặt lịch'}
        </button>
      </div>
    </div>
  );
}
