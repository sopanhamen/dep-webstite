import storage from 'redux-persist/lib/storage';
// defaults to localStorage for web

// redux persist config
export const persistConfig = {
  key: 'root',
  storage,
  // put the state u want it to persisted
  // 'admin'
  whitelist: ['auth'],
};
