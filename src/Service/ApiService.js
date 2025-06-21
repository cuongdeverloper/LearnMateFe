import axios from './AxiosCustomize';

const ApiLogin = (userEmail, userPassword) => {
  return axios.post('/login', { email: userEmail, password: userPassword });
};

const sendOTPApi = async (userId, otp) => {
  try {
    const response = await axios.post('/verify-otp', { userId, OTP: otp });
    return response;
  } catch (error) {
    return { errorCode: 1, message: 'Failed to verify OTP' };
  }
};

const ApiRegister = async (username, email, password, phoneNumber, gender, role, image) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('email', email);
  formData.append('password', password);
  formData.append('phoneNumber', phoneNumber);
  formData.append('gender', gender);
  formData.append('role', role);
  if (image) {
    formData.append('image', image);
  }

  try {
    const response = await axios.post('/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const loginWGoogle = () => {
  return axios.get(`/auth/google/callback`);
};

const fetchPendingBookings = (tutorId) => {
  return axios.get(`/api/tutor/bookings/pending/${tutorId}`);
};

const respondBooking = (bookingId, action, learnerId) => {
  return axios.post(`/api/tutor/bookings/respond`, { bookingId, action, learnerId });
};

const cancelBooking = (bookingId, reason) => {
  return axios.post(`/api/tutor/bookings/cancel`, { bookingId, reason });
};

const getTutorSchedule = (tutorId) => {
  return axios.get(`/api/tutor/schedule/${tutorId}`);
};

const createSchedule = (tutorId, scheduleData) => {
  return axios.post(`/api/tutor/schedule`, { tutorId, ...scheduleData });
};

const updateSchedule = (scheduleId, updatedData) => {
  return axios.put(`/api/tutor/schedule/${scheduleId}`, updatedData);
};

const deleteSchedule = (scheduleId) => {
  return axios.delete(`/api/tutor/schedule/${scheduleId}`);
};

const getTeachingProgress = (studentId) => {
  return axios.get(`/api/tutor/progress/${studentId}`);
};

const updateTeachingProgress = (studentId, progressData) => {
  return axios.post(`/api/tutor/progress`, { studentId, ...progressData });
};

const uploadMaterial = (studentId, file, description) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('description', description);
  formData.append('studentId', studentId);

  return axios.post('/api/tutor/material/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const getMaterialsForStudent = (studentId) => {
  return axios.get(`/api/tutor/material/${studentId}`);
};

export {
  ApiLogin,
  sendOTPApi,
  ApiRegister,
  loginWGoogle,
  fetchPendingBookings,
  respondBooking,
  cancelBooking,
  getTutorSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getTeachingProgress,
  updateTeachingProgress,
  uploadMaterial,
  getMaterialsForStudent
};
