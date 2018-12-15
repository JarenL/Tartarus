import {
    DRAWER_STATE
} from '../actions/actions';

const initialState = {
    drawerState: true
}

const draweReducer = (state = initialState, action) => {
    switch (action.type) {
        case DRAWER_STATE:
            if (state.drawerState) {
                return {
                    ...state,
                    currentForum: false
                };
            } else {
                return {
                    ...state,
                    currentForum: true
                };
            }
        default:
            return state
    }
}

export default draweReducer;