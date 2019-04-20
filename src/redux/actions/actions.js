/*
 * action types
 */

export const WEB3_INITIALIZED = 'WEB3_INITIALIZED';
export const TARTARUS_ADDRESS = 'TARTARUS_ADDRESS';
export const UPDATE_FORUM_SUBSCRIPTIONS = 'UPDATE_FORUM_SUBSCRIPTIONS';
export const UPDATE_USER_SUBSCRIPTIONS = 'UPDATE_USER_SUBSCRIPTIONS';
export const UPDATE_USER_SAVED = 'UPDATE_USER_SAVED';
export const INITIALIZE_USER_SETTINGS = 'INITIALIZE_USER_SETTINGS';
export const TOGGLE_DARK_THEME = 'TOGGLE_DARK_THEME';
export const USER_LOGOUT = 'USER_LOGOUT';
export const USER_LOGIN = 'USER_LOGIN';

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
