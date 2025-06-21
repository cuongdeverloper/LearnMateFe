import { FETCH_SCHEDULE, ADD_SCHEDULE, DELETE_SCHEDULE, UPDATE_SCHEDULE } from '../action/scheduleAction';

const initialState = {
  scheduleList: [],
};

const scheduleReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SCHEDULE:
      return { ...state, scheduleList: action.payload };
    case ADD_SCHEDULE:
      return { ...state, scheduleList: [...state.scheduleList, action.payload] };
    case DELETE_SCHEDULE:
      return { ...state, scheduleList: state.scheduleList.filter(item => item._id !== action.payload) };
    case UPDATE_SCHEDULE:
      return {
        ...state,
        scheduleList: state.scheduleList.map(item =>
          item._id === action.payload._id ? action.payload : item
        ),
      };
    default:
      return state;
  }
};

export default scheduleReducer;
