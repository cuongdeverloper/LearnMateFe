import React, { useState } from 'react';
import { updateTeachingProgress } from '../../../Service/ApiService';
import './ProgressTracker.scss';

const ProgressTracker = () => {
  const [form, setForm] = useState({ studentId: '', subject: '', content: '', week: '' });

  const handleSubmit = async () => {
    try {
      await updateTeachingProgress(form.studentId, form);
      alert("Đã lưu tiến độ học tập");
      setForm({ studentId: '', subject: '', content: '', week: '' });
    } catch (err) {
      console.error('Lỗi khi lưu tiến độ:', err);
    }
  };

  return (
    <div className="progress-tracker">
      <h3>📘 Theo dõi Tiến độ học tập</h3>
      <div className="form-grid">
        <input
          placeholder="Mã học viên"
          value={form.studentId}
          onChange={e => setForm({ ...form, studentId: e.target.value })}
        />
        <input
          placeholder="Môn học"
          value={form.subject}
          onChange={e => setForm({ ...form, subject: e.target.value })}
        />
        <input
          placeholder="Tuần học"
          value={form.week}
          onChange={e => setForm({ ...form, week: e.target.value })}
        />
        <textarea
          placeholder="Nội dung học trong tuần"
          value={form.content}
          onChange={e => setForm({ ...form, content: e.target.value })}
        />
        <button onClick={handleSubmit}>✅ Lưu tiến độ</button>
      </div>
    </div>
  );
};

export default ProgressTracker;