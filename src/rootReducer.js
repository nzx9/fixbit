import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import loginReducer from "./reducers/loginTracker";
import userDataReducer from "./reducers/userDataTracker";

export default function createRootReducer(history) {
  return combineReducers({
    router: connectRouter(history),
    isLogged: loginReducer,
    userData: userDataReducer,
  });
}
