import { combineReducers } from 'redux'
import web3Reducer from './web3Reducer'
import tartarusReducer from './tartarusReducer'
import accountsReducer from './accountsReducer'
import forumReducer from './forumReducer'
import pageReducer from './pageReducer'
import drawerReducer from './drawerReducer'



const rootReducer = combineReducers({
    web3: web3Reducer,
    accounts: accountsReducer,
    tartarus: tartarusReducer,
    forum: forumReducer,
    page: pageReducer,
    drawerState: drawerReducer
});

export default rootReducer