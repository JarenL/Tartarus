import { combineReducers } from 'redux'
import web3Reducer from './web3Reducer'
import tartarusReducer from './tartarusReducer'
import accountsReducer from './accountsReducer'
import forumReducer from './forumReducer'
import pageReducer from './pageReducer'
import drawerReducer from './drawerReducer'
import commentReducer from './commentReducer'

import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const rootPersistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['forum']
}

const forumPersistConfig = {
  key: 'forum',
  storage: storage,
  whitelist: ['forumSubscriptions']
}

const rootReducer = combineReducers({
  web3: web3Reducer,
  accounts: accountsReducer,
  tartarus: tartarusReducer,
  forum: persistReducer(forumPersistConfig, forumReducer),
  page: pageReducer,
  drawerState: drawerReducer,
  comment: commentReducer
});


export default persistReducer(rootPersistConfig, rootReducer)
