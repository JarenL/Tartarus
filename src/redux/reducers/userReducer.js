import {
  UPDATE_USER_SUBSCRIPTIONS,
  UPDATE_USER_SAVED,
  INITIALIZE_USER_SETTINGS,
  UPDATE_USER_WATCHED,
  UPDATE_USER_NOTIFIED,
  UPDATE_USER_PERMISSIONS,
  USER_LOGIN,
  USER_LOGOUT,
  UPDATE_USER_NOTIFICATIONS
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
  userPermissions: {
    admin: [false, false, false, false, false, false, false, 0, 0],
    moderator: [false, false, false, false, false, false, 0, 0]
  }
};

const accountsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'web3/CHANGE_ACCOUNT':
      return {
        ...state,
        username: action.payload.username,
        userSettings: {
          ...state.userSettings,
          [action.payload.username]: {
            ...state.userSettings[action.payload.username]
          }
        },
        userPermissions: {
          ...state.userPermissions,
          admin: [false, false, false, false, false, false, false, 0, 0],
          moderator: [false, false, false, false, false, false, 0, 0]
        }
      };
    case 'web3/LOGOUT':
      return {
        ...state,
        username: null,
        userPermissions: {
          admin: [false, false, false, false, false, false, false, 0, 0],
          moderator: [false, false, false, false, false, false, 0, 0]
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
              watched: {
                posts: [],
                comments: [],
                users: []
              },
              lastNotified: Date.now(),
              notifications: []
            }
          }
        };
      } else {
        return {
          ...state,
          username: action.payload.username
        };
      }
    case USER_LOGOUT:
      return {
        ...state,
        username: null,
        userPermissions: {
          admin: [false, false, false, false, false, false, false, 0, 0],
          moderator: [false, false, false, false, false, false, 0, 0]
        }
      };

    case UPDATE_USER_PERMISSIONS:
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
    case UPDATE_USER_WATCHED:
      return {
        ...state,
        userSettings: {
          ...state.userSettings,
          [action.payload.username]: {
            ...state.userSettings[action.payload.username],
            watched: action.payload.watched
          }
        }
      };
    case UPDATE_USER_NOTIFIED:
      return {
        ...state,
        userSettings: {
          ...state.userSettings,
          [action.payload.username]: {
            ...state.userSettings[action.payload.username]
          }
        }
      };
    case UPDATE_USER_NOTIFICATIONS:
      console.log(action);
      return {
        ...state,
        userSettings: {
          ...state.userSettings,
          [action.payload.username]: {
            ...state.userSettings[action.payload.username],
            notifications: action.payload.notifications,
            lastNotified: Date.now()
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
