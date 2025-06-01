import axios from './AxiosCustomize';

export const createBooking = (payload) => {
  return axios.post('/bookings', payload);
};

export const getTutors = (params) => {
  return axios.get('/tutors', { params });
};