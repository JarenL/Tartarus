import { TARTARUS_ADDRESS } from '../actions/actions';

const initialState = {
  tartarusAddress: '0x62442ae7fd7ac91662494d70fa1618079b5096c0'
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
