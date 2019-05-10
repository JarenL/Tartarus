import { TARTARUS_ADDRESS } from '../actions/actions';

const initialState = {
  tartarusAddress: '0x575a5e398917865921e30a07daaa5374ea27a6c5'
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
