import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import companyReducer from '../features/company/companySlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    company: companyReducer,
  },
});
