import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import loginReducer from "./reducers/loginTracker";
import userDataReducer from "./reducers/userDataTracker";
import tokenReducer from "./reducers/tokenTracker";
import dataChangeReducer from "./reducers/dataChangeTracker";
import projectDataReducer from "./reducers/projectDataTracker";

export default function createRootReducer(history) {
  return combineReducers({
    router: connectRouter(history),
    isLogged: loginReducer,
    userData: userDataReducer,
    token: tokenReducer,
    isDataChanged: dataChangeReducer,
    projectData: projectDataReducer,
  });
}
