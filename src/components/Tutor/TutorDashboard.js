import React, { useState } from 'react';
import TutorBookingList from './view/TutorBookingList';
import ScheduleManager from './view/ScheduleManager';
import ProgressTracker from './view/ProgressTracker';
import MaterialUploader from './view/MaterialUploader';
import './TutorDashboard.scss';

const TutorDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');

  const renderTab = () => {
    switch (activeTab) {
      case 'bookings': return <TutorBookingList />;
      case 'schedule': return <ScheduleManager />;
      case 'progress': return <ProgressTracker />;
      case 'materials': return <MaterialUploader />;
      default: return <TutorBookingList />;
    }
  };

  return (
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
        {renderTab()}
      </main>
    </div>
  );
};

export default TutorDashboard;