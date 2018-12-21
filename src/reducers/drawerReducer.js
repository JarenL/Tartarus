import {
    DRAWER_STATE
} from '../actions/actions';

const initialState = {
    drawerState: false
}

const draweReducer = (state = initialState, action) => {
    switch (action.type) {
        case DRAWER_STATE:
            if (state.drawerState) {
                return {
                    ...state,
                    drawerState: false
                };
            } else {
                return {
                    ...state,
                    drawerState: true
                };
            }
        default:
            return state
    }
}

export default draweReducer;