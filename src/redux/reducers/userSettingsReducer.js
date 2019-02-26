import {
	UPDATE_USER_SUBSCRIPTIONS,
	INITIALIZE_USER_SETTINGS
} from '../actions/actions.js';

const initialState = {
	subscriptions: [],
	test1: [],
	test2: []
}

const userSettingsReducer = (state = initialState, action) => {
	switch (action.type) {
		case INITIALIZE_USER_SETTINGS:
			console.log(action)
			return {
				state,			
			};
		case UPDATE_USER_SUBSCRIPTIONS:
			console.log(action)
				return {
					...state,
					subscriptions: action.payload.subscriptions
				};
			default:
				return state
	}
}

export default userSettingsReducer