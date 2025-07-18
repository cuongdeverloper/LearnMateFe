import React, { useState, useEffect } from 'react';
import { fetchStudentsApi, updateTeachingProgress } from '../../../Service/ApiService';
import './ProgressTracker.scss';

const ProgressTracker = () => {
  const [form, setForm] = useState({ learnerId: '', subject: '', content: '', week: '' });
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetchStudentsApi();
        setStudents(res);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    };
    fetchStudents();
  }, []);

  const handleSubmit = async () => {
    try {
      await updateTeachingProgress(form.learnerId, form);
      alert("Đã lưu tiến độ học tập");
      setForm({ learnerId: '', subject: '', content: '', week: '' });
    } catch (err) {
      console.error('Lỗi khi lưu tiến độ:', err);
    }
  };

  return (
    <div className="progress-tracker">
      <h3>📘 Theo dõi Tiến độ học tập</h3>
      <div className="form-grid">
        <label>
          Học viên
          <select
            value={form.learnerId}
            onChange={e => setForm({ ...form, learnerId: e.target.value })}
          >
            <option value="">Chọn học viên</option>
            {students.map(stu => (
              <option key={stu._id} value={stu._id}>
                {stu.username} ({stu.email})
              </option>
            ))}
          </select>
        </label>
        <label>
          Môn học
          <input
            placeholder="Môn học"
            value={form.subject}
            onChange={e => setForm({ ...form, subject: e.target.value })}
          />
        </label>
        <label>
          Tuần học
          <input
            placeholder="Tuần học"
            value={form.week}
            onChange={e => setForm({ ...form, week: e.target.value })}
          />
        </label>
        <label>
          Nội dung học trong tuần
          <textarea
            placeholder="Nội dung học trong tuần"
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
          />
        </label>
        <button onClick={handleSubmit}>✅ Lưu tiến độ</button>
      </div>
    </div>
  );
};

export default ProgressTracker;