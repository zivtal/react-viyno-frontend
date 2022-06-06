import { applyMiddleware, createStore, compose, combineReducers } from "redux";
import thunk from "redux-thunk";
import authModule from "../pages/Login/store/reducer";
// @ts-ignore
import wineModule from "../pages/Wine/store/reducer"; // TODO: Convert to typescript
// @ts-ignore
import wineryModule from "../pages/Winery/store/reducer"; // TODO: Convert to typescript
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
