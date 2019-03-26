import { combineReducers } from 'redux';
import web3Reducer from './web3Reducer';
import tartarusReducer from './tartarusReducer';
import userReducer from './userReducer';
import themeReducer from './themeReducer';
import formReducer from './formReducer';

const rootReducer = combineReducers({
  web3: web3Reducer,
  user: userReducer,
  tartarus: tartarusReducer,
  form: formReducer,
  theme: themeReducer
});

export default rootReducer;
