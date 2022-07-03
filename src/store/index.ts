import { applyMiddleware, createStore, compose, combineReducers } from "redux";
import thunk from "redux-thunk";
import authModule from "../pages/Login/store/reducer";
import wineModule from "../pages/Wine/store/reducer";
import wineryModule from "../pages/Winery/store/reducer";
import postModule from "../pages/UserFeed/store/reducer";

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  authModule,
  wineModule,
  wineryModule,
  postModule,
});

export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

// @ts-ignore
window.myStore = store;
