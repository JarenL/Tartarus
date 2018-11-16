import { combineReducers } from 'redux'
import web3Reducer from './web3Reducer'
import tartarusReducer from './tartarusReducer'
import accountsReducer from './accountsReducer'
import forumReducer from './forumReducer'

const rootReducer = combineReducers({
    web3: web3Reducer,
    accounts: accountsReducer,
    tartarus: tartarusReducer,
    forum: forumReducer
})

export default rootReducer