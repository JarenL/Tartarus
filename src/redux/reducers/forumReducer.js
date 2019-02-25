import {
	CURRENT_FORUM,
	CURRENT_FORUM_ADDRESS,
	CURRENT_POST_ADDRESS,
	UPDATE_FORUM,
	UPDATE_FORUM_SUBSCRIPTIONS,
	CURRENT_COMMENT_ADDRESS
} from '../actions/actions';

import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const forumPersistConfig = {
  key: 'forum',
  storage: storage,
  whitelist: ['forumSubscriptions']
}

const initialState = {
	currentForum: "Frontpage",
	currentForumAddress: null,
	currentPostAddress: null,
	currentCommentAddress: null,
	forumSubscriptions: []
}

const forumReducer = (state = initialState, action) => {
	switch (action.type) {
		case CURRENT_FORUM:
			return {
				...state,
				currentForum: action.payload
			};
		case CURRENT_FORUM_ADDRESS:
			return {
				...state,
				currentForumAddress: action.payload
			};
		case CURRENT_POST_ADDRESS:
			return {
				...state,
				currentPostAddress: action.payload
			};
		case CURRENT_COMMENT_ADDRESS:
			return {
				...state,
				currentCommentAddress: action.payload
			};
		case UPDATE_FORUM:
			return {
				...state,
				currentForum: action.payload.name,
				currentForumAddress: action.payload.address
			};
			case UPDATE_FORUM_SUBSCRIPTIONS:
			return {
				...state,
				forumSubscriptions: action.payload
			};
		default:
			return state
	}
}

export default persistReducer(forumPersistConfig, forumReducer)
