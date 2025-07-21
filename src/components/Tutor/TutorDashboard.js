import React, { useState } from 'react';
import TutorBookingList from './view/TutorBookingList';
import ScheduleManager from './view/ScheduleManager';
import ProgressTracker from './view/ProgressTracker';
import MaterialUploader from './view/MaterialUploader';
import './TutorDashboard.scss';
import BookingSchedule from '../Booking/Schedule/BookingSchedule';
import Header from '../Layout/Header/Header';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { doLogout } from '../../redux/action/userAction';

const TutorDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
   const user = useSelector(state => state.user.account); 
  const handleLogin = () => {
    navigate("/");
  };

  const handleLogout = () => {
    dispatch(doLogout());
    navigate("/");
  };
  const renderTab = () => {
    switch (activeTab) {
      case 'bookings': return <TutorBookingList />;
      case 'schedule': return <BookingSchedule />;
      case 'progress': return <ProgressTracker />;
      case 'materials': return <MaterialUploader />;
      default: return <TutorBookingList />;
    }
  };

  return (
    <>
      
      <div className="dashboard-layout">
        <aside className="sidebar">
          <h2>📘 Tutor Panel</h2>
          <ul className="nav-links">
            <li className={activeTab === 'bookings' ? 'active' : ''} onClick={() => setActiveTab('bookings')}>
              📅 Booking Management
            </li>
            <li className={activeTab === 'schedule' ? 'active' : ''} onClick={() => setActiveTab('schedule')}>
              ⏰ Schedule Manager
            </li>
            <li className={activeTab === 'progress' ? 'active' : ''} onClick={() => setActiveTab('progress')}>
              📈 Progress Tracker
            </li>
            <li className={activeTab === 'materials' ? 'active' : ''} onClick={() => setActiveTab('materials')}>
              📁 Material Uploader
            </li>
          </ul>
        </aside>
        <main className="dashboard-content">
          {!isAuthenticated ? (
        <button className="login-btn" onClick={handleLogin}>
          Đăng nhập
        </button>
      ) : (
        <div className="user-info">
          <span style={{ marginRight: '12px' }}>{user?.username || "Tài khoản"}</span>
          <button className="btn btn-secondary" onClick={()=> navigate('/messenger')}>
            Chat
          </button>
          <button className="login-btn logout-btn" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      )}
          {renderTab()}
        </main>
      </div>
    </>

  );
};

export default TutorDashboard;