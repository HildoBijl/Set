import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

import * as reducers from './reducers/index.js'

const rootReducer = combineReducers(reducers)
const store = createStore(
	rootReducer, 
	composeWithDevTools(applyMiddleware(thunk))
)

export default store

