import React, { useEffect, useState } from 'react';
import { fetchPendingBookings, respondBooking, cancelBooking } from '../../../Service/ApiService';
import { useSelector } from 'react-redux';
import './TutorBookingList.scss';

const TutorBookingList = () => {
  const [bookings, setBookings] = useState([]);
  const tutorId = useSelector(state => state.user.account.id);

  const loadBookings = async () => {
    const res = await fetchPendingBookings(tutorId);
    setBookings(res);
  };

  const handleResponse = async (id, action, learnerId) => {
    await respondBooking(id, action, learnerId);
    loadBookings();
  };

  const handleCancel = async (id) => {
    const reason = prompt("Lý do hủy buổi học:");
    if (reason) await cancelBooking(id, reason);
    loadBookings();
  };

  useEffect(() => { loadBookings(); }, [tutorId]);

  return (
    <div className="booking-list">
      <h3>📋 Danh sách Booking chờ duyệt</h3>
      <table className="booking-table">
        <thead>
          <tr>
            <th>Học viên</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b._id}>
              <td>{b.learnerId?.username || b.studentId}</td>
              <td><span className={`status ${b.status}`}>{b.status}</span></td>
              <td>
                <button className="btn-accept" onClick={() => handleResponse(b._id, 'approve', b.studentId)}>✔️ Duyệt</button>
                <button className="btn-reject" onClick={() => handleResponse(b._id, 'cancelled', b.studentId)}>❌ Từ chối</button>
                {/* <button className="btn-cancel" onClick={() => handleCancel(b._id)}>🛑 Hủy</button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TutorBookingList;
