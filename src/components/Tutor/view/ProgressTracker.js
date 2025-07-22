import React, { useState, useEffect } from 'react';
import { getTeachingProgress, updateTeachingProgress, getBookingsByTutorId } from '../../../Service/ApiService';
import { useSelector } from 'react-redux';
import './ProgressTracker.scss';

const ProgressTracker = () => {
  const tutorId = useSelector(state => state.user.account.id);
  const [form, setForm] = useState({ learnerId: '', subject: '', content: '', week: '' });
  const [students, setStudents] = useState([]);
  const [selectedStudentProgress, setSelectedStudentProgress] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudentsFromBookings = async () => {
      try {
        if (!tutorId) return;
        
        const res = await getBookingsByTutorId(tutorId);
        if (res && res.bookings) {
          // Lấy danh sách học viên unique từ bookings đã approve
          const uniqueStudents = res.bookings
            .filter(booking => booking.status === 'approve' && booking.learnerId)
            .reduce((acc, booking) => {
              const student = booking.learnerId;
              if (!acc.find(s => s._id === student._id)) {
                acc.push(student);
              }
              return acc;
            }, []);
          
          setStudents(uniqueStudents);
        }
      } catch (err) {
        console.error("Failed to fetch students from bookings:", err);
      }
    };
    
    fetchStudentsFromBookings();
  }, [tutorId]);

  const handleStudentSelect = async (studentId) => {
    if (!studentId) {
      setSelectedStudentProgress([]);
      setForm({ ...form, learnerId: '' });
      return;
    }

    setLoading(true);
    try {
      const response = await getTeachingProgress(studentId);
      setSelectedStudentProgress(response || []);
      setForm({ ...form, learnerId: studentId });
    } catch (err) {
      console.error('Error fetching student progress:', err);
      setSelectedStudentProgress([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await updateTeachingProgress(form.learnerId, form);
      alert("Đã lưu tiến độ học tập");
      setForm({ learnerId: form.learnerId, subject: '', content: '', week: '' });
      setIsFormVisible(false);
      // Refresh progress after adding new one
      await handleStudentSelect(form.learnerId);
    } catch (err) {
      console.error('Lỗi khi lưu tiến độ:', err);
      alert('Có lỗi xảy ra khi lưu tiến độ');
    }
  };

  const selectedStudent = students.find(s => s._id === form.learnerId);

  return (
    <div className="progress-tracker">
      <h3>📘 Theo dõi Tiến độ học tập</h3>
      
      <div className="student-selector">
        <label>
          Chọn học viên đã booking
          <select
            value={form.learnerId}
            onChange={e => handleStudentSelect(e.target.value)}
          >
            <option value="">-- Chọn học viên --</option>
            {students.map(student => (
              <option key={student._id} value={student._id}>
                {student.username} ({student.email})
              </option>
            ))}
          </select>
        </label>
      </div>

      {form.learnerId && (
        <div className="student-progress-section">
          <div className="student-info">
            <h4>📋 Tiến độ học tập của {selectedStudent?.username}</h4>
            <button 
              className="add-progress-btn"
              onClick={() => setIsFormVisible(!isFormVisible)}
            >
              {isFormVisible ? '❌ Hủy' : '➕ Thêm tiến độ mới'}
            </button>
          </div>

          {loading ? (
            <div className="loading">Đang tải tiến độ học tập...</div>
          ) : (
            <div className="progress-display">
              {selectedStudentProgress.length > 0 ? (
                <div className="progress-list">
                  <h5>📈 Lịch sử tiến độ:</h5>
                  {selectedStudentProgress
                    .sort((a, b) => b.week - a.week)
                    .map((progress, index) => (
                    <div key={progress._id || index} className="progress-item">
                      <div className="progress-header">
                        <span className="week-badge">Tuần {progress.week}</span>
                        <span className="subject-badge">{progress.subject}</span>
                        <span className="date-info">
                          {new Date(progress.createdAt || progress.updatedAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <div className="progress-content">
                        {progress.content}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-progress">
                  <p>📝 Chưa có tiến độ học tập nào được ghi nhận cho học viên này.</p>
                  <p>Hãy thêm tiến độ đầu tiên!</p>
                </div>
              )}
            </div>
          )}

          {isFormVisible && (
            <div className="add-progress-form">
              <h5>➕ Thêm tiến độ mới</h5>
              <div className="form-grid">
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
                    type="number"
                    placeholder="Tuần học"
                    value={form.week}
                    onChange={e => setForm({ ...form, week: e.target.value })}
                  />
                </label>
                <label>
                  Nội dung học trong tuần
                  <textarea
                    placeholder="Mô tả chi tiết nội dung đã học trong tuần này..."
                    value={form.content}
                    onChange={e => setForm({ ...form, content: e.target.value })}
                    rows="4"
                  />
                </label>
                <button 
                  onClick={handleSubmit}
                  disabled={!form.subject || !form.content || !form.week}
                  className="submit-btn"
                >
                  ✅ Lưu tiến độ
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;