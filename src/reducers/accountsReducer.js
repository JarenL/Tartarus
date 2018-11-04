import {
  CURRENT_OWNER_ADDRESS,
  CURRENT_USER_ADDRESS
} from '../actions/actions';

const initialState = {
  currentOwnerAddress: "0",
  currentUserAddress: "0"
}

const accountsReducer = (state = initialState, action) => {
  switch (action.type) {
    case CURRENT_OWNER_ADDRESS:
      return Object.assign({}, state, {
        currentOwnerAddress: action.payload
      })
    case CURRENT_USER_ADDRESS:
      return Object.assign({}, state, {
        currentUserAddress: action.payload
      })
    default:
      return state
  }
}

export default accountsReducer