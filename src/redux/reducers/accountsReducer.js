import {
  CURRENT_USER_ADDRESS,
  CURRENT_OWNER_ADDRESS,
  UPDATE_USER_SUBSCRIPTIONS,
  INITIALIZE_USER_SETTINGS
} from '../actions/actions';

import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import userSettingsReducer from './userSettingsReducer';

const userPersistConfig = {
  key: 'accounts',
  storage: storage,
  whitelist: ['userSettings']
}

const initialState = {
  currentOwnerAddress: "0",
  currentUserAddress: "0",
  userSettings: []
}

const accountsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'web3/RECEIVE_ACCOUNT':
      return {
        ...state,
        currentOwnerAddress: action.address
      };

    case 'web3/CHANGE_ACCOUNT':
      return {
        ...state,
        currentOwnerAddress: action.address
      };
    case 'web3/LOGOUT':
      return {
        ...state,
        currentOwnerAddress: null
      }
    case CURRENT_OWNER_ADDRESS:
      return {
        ...state,
        currentOwnerAddress: action.payload
      };
    case CURRENT_USER_ADDRESS:
      return {
        ...state,
        currentUserAddress: action.payload
      };
    case INITIALIZE_USER_SETTINGS:
      console.log(action)
      return {
        ...state,
        userSettings : {
          ...state.userSettings,
          [action.payload] : {
            subscriptions: [],
            test1: [],
            test2: []
          }
        }
      };
    case UPDATE_USER_SUBSCRIPTIONS:
      console.log(action)
      let user = action.payload.user
      return {
        ...state,
        userSettings: {
          ...state.userSettings,
          [action.payload.user]: {
            ...state.userSettings[user],
            subscriptions: action.payload.subscriptions 
          }
        }
      };
    default:
      return state
  }
}

export default persistReducer(userPersistConfig, accountsReducer)
