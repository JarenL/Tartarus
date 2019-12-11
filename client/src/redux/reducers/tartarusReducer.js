import { TARTARUS_ADDRESS } from '../actions/actions';

const initialState = {
  tartarusAddress: '0x4e3d77bd77a7e68c261085dd972f33014b50471d'
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
