import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import loginReducer from "./reducers/loginTracker";
import userDataReducer from "./reducers/userDataTracker";
import tokenReducer from "./reducers/tokenTracker";
import drawerOpenReducer from "./reducers/drawerOpenTracker";
import projectDataReducer from "./reducers/projectDataTracker";

export default function createRootReducer(history) {
  return combineReducers({
    router: connectRouter(history),
    isLogged: loginReducer,
    userData: userDataReducer,
    token: tokenReducer,
    isDrawerOpen: drawerOpenReducer,
    projectData: projectDataReducer,
  });
}
