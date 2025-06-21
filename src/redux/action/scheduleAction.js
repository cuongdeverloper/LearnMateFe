export const FETCH_SCHEDULE = 'FETCH_SCHEDULE';
export const ADD_SCHEDULE = 'ADD_SCHEDULE';
export const DELETE_SCHEDULE = 'DELETE_SCHEDULE';
export const UPDATE_SCHEDULE = 'UPDATE_SCHEDULE';

export const setSchedule = (data) => ({
  type: FETCH_SCHEDULE,
  payload: data
});

export const addSchedule = (schedule) => ({
  type: ADD_SCHEDULE,
  payload: schedule
});

export const deleteSchedule = (id) => ({
  type: DELETE_SCHEDULE,
  payload: id
});

export const updateSchedule = (schedule) => ({
  type: UPDATE_SCHEDULE,
  payload: schedule
});
