import { configureStore } from '@reduxjs/toolkit';
import companyReducer from '../features/company/companySlice';

export const store = configureStore({
  reducer: {
    company: companyReducer,
  },
});
