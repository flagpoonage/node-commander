import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import MainReducer from './reducers/main';

const AppStore = createStore(
  MainReducer,
  {
    initializing: false,
    package: null
  },
  applyMiddleware(thunk)
);

export default AppStore;
