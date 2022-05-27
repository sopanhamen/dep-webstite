import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './root-reducer';
import { persistConfig } from './store.persist.config';
import { persistReducer } from 'redux-persist';
import persistStore from 'redux-persist/lib/persistStore';

const persistedReducer = persistReducer(persistConfig, rootReducer);
// eslint-disable-next-line import/no-anonymous-default-export
const state =
  typeof window === undefined
    ? createStore(
        rootReducer,
        composeWithDevTools(applyMiddleware(thunkMiddleware)),
      )
    : createStore(
        persistedReducer,
        composeWithDevTools(applyMiddleware(thunkMiddleware)),
      );

const store = {
  persistor: persistStore(state),
  state,
};

export default store;
