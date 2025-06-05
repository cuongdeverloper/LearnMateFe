import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../Service/AxiosCustomize';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../scss/BookingPage.scss';
import { useSelector } from "react-redux";

export default function BookingPage() {
  const { tutorId } = useParams();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [numberOfSessions, setNumberOfSessions] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [balance, setBalance] = useState(null);
  const userId = useSelector((state) => state.user.account.id);
  const token = useSelector((state) => state.user.account.access_token);
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

    const fetchBalance = async () => {
      try {
        const infoRes = await fetch(`http://localhost:6060/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!infoRes.ok) throw new Error("Lấy thông tin người dùng thất bại");
        const infoData = await infoRes.json();
        if (infoData.user.balance !== undefined) {
          setBalance(infoData.user.balance);
        }
      } catch (err) {
        toast.error('Không thể lấy thông tin số dư');
      }
    };
    fetchTutor();
    fetchBalance();
  }, [tutorId]);

  const handleBooking = async () => {
    if (!numberOfSessions || numberOfSessions <= 0) {
      toast.warn('Vui lòng nhập số buổi học hợp lệ');
      return;
    }

    setLoading(true);
    try {
      const totalAmount = tutor.pricePerHour * numberOfSessions;

      if (balance < totalAmount) {
        toast.error('Số dư không đủ để thanh toán');
        setLoading(false);
        return;
      }

      const res = await axios.post(
        `/bookings/${tutorId}`,
        {
          amount: totalAmount,
          numberOfSessions,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.success) {
        toast.success('Đặt lịch thành công và đã trừ tiền từ số dư!');
        setBalance(prev => prev - totalAmount);
      } else {
        toast.error(res.message || 'Đặt lịch thất bại');
      }
    } catch (err) {
      console.error('Lỗi đặt lịch:', err);
      toast.error(err.response?.data?.message || err.message || 'Đặt lịch thất bại');
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
      setShowConfirmModal(false);
    }
  };

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

          <div className="form-group">
            <label>Số dư tài khoản</label>
            <input
              type="text"
              value={balance?.toLocaleString() + ' VND' || '...'}
              disabled
            />
          </div>

          <button
            onClick={handleShowConfirm}
            disabled={loading || !tutor}
            className="btn-booking"
          >
            {loading ? 'Đang xử lý...' : 'Trừ tiền & Đặt lịch'}
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
