import {
  CURRENT_USER_ADDRESS,
  CURRENT_OWNER_ADDRESS
} from '../actions/actions';

const initialState = {
  currentOwnerAddress: "0",
  currentUserAddress: "0"
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
    default:
      return state
  }
}

export default accountsReducer