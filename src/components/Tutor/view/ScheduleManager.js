import React, { useState, useEffect } from 'react';
import { createSchedule, getTutorSchedule, deleteSchedule } from '../../../Service/ApiService';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './ScheduleManager.scss';

const ScheduleManager = () => {
  const tutorId = useSelector(state => state.user.account.id);
  const [schedules, setSchedules] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', day: '', startTime: '', endTime: '' });

  const loadSchedules = async () => {
    const res = await getTutorSchedule(tutorId);
    setSchedules(res);
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost:6060/api/user/students');
      setStudents(res.data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    }
  };

  const handleSubmit = async () => {
    try {
      await createSchedule(tutorId, form);
      setForm({ studentId: '', day: '', startTime: '', endTime: '' });
      loadSchedules();
    } catch (err) {
      console.error('Error adding schedule:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSchedule(id);
      loadSchedules();
    } catch (err) {
      console.error('Error deleting schedule:', err);
    }
  };

  useEffect(() => {
    loadSchedules();
    fetchStudents();
  }, [tutorId]);

  return (
    <div className="schedule-manager">
      <h3>📅 Quản lý Lịch học</h3>

      <div className="form-row">
        <select
          value={form.studentId}
          onChange={e => setForm({ ...form, studentId: e.target.value })}
        >
          <option value="">Chọn học viên</option>
          {students.map(stu => (
            <option key={stu._id} value={stu._id}>{stu.username} ({stu.email})</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Thứ trong tuần (VD: Monday)"
          value={form.day}
          onChange={e => setForm({ ...form, day: e.target.value })}
        />
        <input
          type="time"
          value={form.startTime}
          onChange={e => setForm({ ...form, startTime: e.target.value })}
        />
        <input
          type="time"
          value={form.endTime}
          onChange={e => setForm({ ...form, endTime: e.target.value })}
        />
        <button onClick={handleSubmit}>➕ Thêm lịch</button>
      </div>

      <ul className="schedule-list">
        {schedules.map(s => (
          <li key={s._id}>
            <div>
              <strong>{s.day}</strong>: {s.startTime} - {s.endTime} với <strong>{s.studentId?.username || s.studentId}</strong>
            </div>
            <button onClick={() => handleDelete(s._id)}>🗑️ Xoá</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScheduleManager;
