import {
  UPDATE_USER_SUBSCRIPTIONS,
  INITIALIZE_USER_SETTINGS,
  USER_LOGIN,
  USER_LOGOUT
} from '../actions/actions';

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const userPersistConfig = {
  key: 'accounts',
  storage: storage,
  whitelist: ['userSettings', 'username']
};

const initialState = {
  username: null,
  userSettings: []
};

const accountsReducer = (state = initialState, action) => {
  switch (action.type) {
    // case 'web3/RECEIVE_ACCOUNT':
    //   return {
    //     ...state,
    //     currentOwnerAddress: action.address
    //   };

    case 'web3/CHANGE_ACCOUNT':
      return {
        ...state,
        username: null
      };
    case 'web3/LOGOUT':
      return {
        ...state,
        username: null
      };
    case USER_LOGIN:
      if (state.userSettings[state.username] === undefined) {
        let currentTime = Date.now();
        return {
          ...state,
          username: action.payload.username,
          userSettings: {
            ...state.userSettings,
            [action.payload.username]: {
              subscriptions: [],
              test1: [],
              test2: [],
              saved: [],
              lastVisited: currentTime
            }
          }
        };
      } else {
        let currentTime = Date.now();
        return {
          ...state,
          username: action.payload.username,
          userSettings: {
            ...state.userSettings,
            [action.payload.username]: {
              ...state.userSettings,
              lastVisited: currentTime
            }
          }
        };
      }
    case USER_LOGOUT:
      return {
        ...state,
        username: null
      };

    case UPDATE_USER_SUBSCRIPTIONS:
      return {
        ...state,
        userSettings: {
          ...state.userSettings,
          [action.payload.username]: {
            ...state.userSettings,
            subscriptions: action.payload.subscriptions
          }
        }
      };
    default:
      return {
        ...state
      };
  }
};

export default persistReducer(userPersistConfig, accountsReducer);
