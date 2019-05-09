import {
  UPDATE_USER_SUBSCRIPTIONS,
  UPDATE_USER_SAVED,
  INITIALIZE_USER_SETTINGS,
  UPDATE_USER_PERMISSIONS,
  USER_LOGIN,
  USER_LOGOUT
} from '../actions/actions';

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const userPersistConfig = {
  key: 'accounts',
  storage: storage,
  whitelist: ['userSettings', 'username', 'userPermissions']
};

const initialState = {
  username: null,
  userSettings: [],
  userPermissions: []
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
        username: action.payload.username,
        userSettings: {
          ...state.userSettings,
          [action.payload.username]: {
            ...state.userSettings[action.payload.username],
            lastVisited: Date.now()
          }
        }
      };
    case 'web3/LOGOUT':
      return {
        ...state,
        username: action.payload.username,
        userSettings: {
          ...state.userSettings,
          [action.payload.username]: {
            ...state.userSettings[action.payload.username],
            lastVisited: Date.now()
          }
        }
      };
    case USER_LOGIN:
      if (state.userSettings[action.payload.username] === undefined) {
        return {
          ...state,
          username: action.payload.username,
          userSettings: {
            ...state.userSettings,
            [action.payload.username]: {
              subscriptions: [],
              saved: {
                posts: [],
                comments: []
              },
              lastVisited: Date.now()
            }
          }
        };
      } else {
        return {
          ...state,
          username: action.payload.username,
          userSettings: {
            ...state.userSettings,
            [action.payload.username]: {
              ...state.userSettings[action.payload.username],
              lastVisited: Date.now()
            }
          }
        };
      }
    case USER_LOGOUT:
      return {
        ...state,
        username: null,
        userPermissions: []
      };

    case UPDATE_USER_PERMISSIONS:
      console.log(action.payload);
      return {
        ...state,
        userPermissions: {
          ...state.userPermissions,
          [action.payload.type]: action.payload.permissions
        }
      };

    case UPDATE_USER_SUBSCRIPTIONS:
      return {
        ...state,
        userSettings: {
          ...state.userSettings,
          [action.payload.username]: {
            ...state.userSettings[action.payload.username],
            subscriptions: action.payload.subscriptions
          }
        }
      };
    case UPDATE_USER_SAVED:
      return {
        ...state,
        userSettings: {
          ...state.userSettings,
          [action.payload.username]: {
            ...state.userSettings[action.payload.username],
            saved: action.payload.saved
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
