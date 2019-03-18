import { combineReducers } from 'redux';
import web3Reducer from './web3Reducer';
import tartarusReducer from './tartarusReducer';
import accountsReducer from './accountsReducer';
import forumReducer from './forumReducer';
import pageReducer from './pageReducer';
import drawerReducer from './drawerReducer';
import commentReducer from './commentReducer';
import themeReducer from './themeReducer';
import formReducer from './formReducer';

const rootReducer = combineReducers({
  web3: web3Reducer,
  accounts: accountsReducer,
  tartarus: tartarusReducer,
  forum: forumReducer,
  form: formReducer,
  page: pageReducer,
  drawerState: drawerReducer,
  comment: commentReducer,
  theme: themeReducer
});

export default rootReducer;
