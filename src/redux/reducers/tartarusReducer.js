import { TARTARUS_ADDRESS } from '../actions/actions';

const initialState = {
  tartarusAddress: '0xa7a894918cdb06ecb64b6becd79011601eeedc7c'
};

const tartarusReducer = (state = initialState, action) => {
  switch (action.type) {
    case TARTARUS_ADDRESS:
      return Object.assign({}, state, {
        tartarusAddress: action.payload
      });
    default:
      return state;
  }
};

export default tartarusReducer;
