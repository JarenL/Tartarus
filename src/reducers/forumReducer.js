import {
	CURRENT_FORUM,
	CURRENT_FORUM_ADDRESS
} from '../actions/actions';

const initialState = {
	currentForum: "Frontpage",
	currentForumAddress: null
}

const forumReducer = (state = initialState, action) => {
	switch (action.type) {
		case CURRENT_FORUM:
			return Object.assign({}, state, {
				currentForum: action.payload
			})
		case CURRENT_FORUM_ADDRESS:
			return Object.assign({}, state, {
				currentForumAddress: action.payload
			})
		default:
			return state
	}
}

export default forumReducer