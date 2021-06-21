import { createStore, combineReducers, compose } from "redux";
import { TodolistActionsType, todolistsReducer } from "./todolists-reducer";
import { TaskActionsType, tasksReducer } from "./tasks-reducer";

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer,
});

export type AppStateType = ReturnType<typeof rootReducer>;
export type AppActionsType = TodolistActionsType & TaskActionsType;

export const store = createStore(rootReducer, composeEnhancers());
