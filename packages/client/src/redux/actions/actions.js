/*
 * action types
 */

export const WEB3_INITIALIZED = 'WEB3_INITIALIZED';
export const TARTARUS_ADDRESS = 'TARTARUS_ADDRESS';
export const UPDATE_FORUM_SUBSCRIPTIONS = 'UPDATE_FORUM_SUBSCRIPTIONS';
export const UPDATE_USER_SUBSCRIPTIONS = 'UPDATE_USER_SUBSCRIPTIONS';
export const UPDATE_USER_SAVED = 'UPDATE_USER_SAVED';
export const UPDATE_USER_WATCHED = 'UPDATE_USER_WATCHED';
export const UPDATE_USER_NOTIFIED = 'UPDATE_USER_NOTIFIED';
export const UPDATE_USER_NOTIFICATIONS = 'UPDATE_USER_NOTIFICATIONS';
export const UPDATE_USER_PERMISSIONS = 'UPDATE_USER_PERMISSIOSN';
export const UPDATE_USER_LAST_VISITED = 'UPDATE_USER_LAST_VISITED';
export const INITIALIZE_USER_SETTINGS = 'INITIALIZE_USER_SETTINGS';
export const TOGGLE_DARK_THEME = 'TOGGLE_DARK_THEME';
export const USER_LOGOUT = 'USER_LOGOUT';
export const USER_LOGIN = 'USER_LOGIN';
export const DRAWER_STATE = 'DRAWER_STATE';

/*
 * action creators
 */

export function toggleDarkTheme() {
  return {
    type: TOGGLE_DARK_THEME
  };
}

export function initializeWeb3(web3) {
  return {
    type: WEB3_INITIALIZED,
    payload: web3
  };
}

export function userLogin(user) {
  return {
    type: USER_LOGIN,
    payload: user
  };
}

export function userLogout() {
  return {
    type: USER_LOGOUT
  };
}

export function setTartarusAddress(tartarusAddress) {
  return {
    type: TARTARUS_ADDRESS,
    payload: tartarusAddress
  };
}

export function initializeUserSettings(userAddress) {
  return {
    type: INITIALIZE_USER_SETTINGS,
    payload: userAddress
  };
}

export function updateUserSubscriptions(userSubscriptions) {
  return {
    type: UPDATE_USER_SUBSCRIPTIONS,
    payload: userSubscriptions
  };
}

export function updateUserSaved(userSaved) {
  return {
    type: UPDATE_USER_SAVED,
    payload: userSaved
  };
}

export function updateUserWatched(userWatched) {
  return {
    type: UPDATE_USER_WATCHED,
    payload: userWatched
  };
}

export function updateUserNotified() {
  return {
    type: UPDATE_USER_NOTIFIED
  };
}

export function updateUserNotifications(userNotifications) {
  return {
    type: UPDATE_USER_NOTIFICATIONS,
    payload: userNotifications
  };
}

export function updateUserPermissions(userPermissions) {
  return {
    type: UPDATE_USER_PERMISSIONS,
    payload: userPermissions
  };
}

export function updateUserLastVisited() {
  return {
    type: UPDATE_USER_LAST_VISITED,
  };
}

export function setDrawerState() {
  return {
    type: DRAWER_STATE
  };
}
