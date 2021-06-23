import { todolistsAPI, TodolistType } from "../api/todolists-api";
import { ThunkType } from "./store";
import { fetchTasksTC } from "./tasks-reducer";

export type TodolistActionsType =
    | ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof setTodolistsAC>;

export type FilterValuesType = "all" | "active" | "completed";

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType;
};

const initialState: Array<TodolistDomainType> = [];

export const todolistsReducer = (
    state: Array<TodolistDomainType> = initialState,
    action: TodolistActionsType
): TodolistDomainType[] => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return state.filter((tl) => tl.id !== action.id);
        case "ADD-TODOLIST":
            return [{ ...action.todolist, filter: "all" }, ...state];
        case "CHANGE-TODOLIST-TITLE": {
            const todolist = state.find((t) => t.id === action.id);
            if (todolist) todolist.title = action.title;
            return [...state];
        }
        case "CHANGE-TODOLIST-FILTER": {
            const todolist = state.find((t) => t.id === action.id);
            if (todolist) todolist.filter = action.filter;
            return [...state];
        }
        case "SET-TODOLISTS":
            return action.todolists.map((tl) => ({
                ...tl,
                filter: "all",
            }));
        default:
            return state;
    }
};

// action creators
export const removeTodolistAC = (todolistId: string) => ({
    type: "REMOVE-TODOLIST" as const,
    id: todolistId,
});
export const addTodolistAC = (todolist: TodolistType) => ({
    type: "ADD-TODOLIST" as const,
    todolist,
});
export const changeTodolistTitleAC = (
    todolistId: string,
    newTodolistTitle: string
) => ({
    type: "CHANGE-TODOLIST-TITLE" as const,
    id: todolistId,
    title: newTodolistTitle,
});
export const changeTodolistFilterAC = (
    todolistId: string,
    newFilter: FilterValuesType
) => ({
    type: "CHANGE-TODOLIST-FILTER" as const,
    id: todolistId,
    filter: newFilter,
});
export const setTodolistsAC = (todolists: TodolistType[]) => ({
    type: "SET-TODOLISTS" as const,
    todolists,
});

// thunk creators
export const fetchTodolistsTC = (): ThunkType => async (dispatch) => {
    try {
        const todolists = await todolistsAPI.getTodolists();
        todolists.forEach((tl) => {
            dispatch(fetchTasksTC(tl.id));
        });
        dispatch(setTodolistsAC(todolists));
    } catch (err) {
        throw new Error(err);
    }
};
export const deleteTodolistTC =
    (todolistId: string): ThunkType =>
    async (dispatch) => {
        try {
            await todolistsAPI.deleteTodolist(todolistId);
            dispatch(removeTodolistAC(todolistId));
        } catch (err) {
            throw new Error(err);
        }
    };
export const createTodolistTC =
    (title: string): ThunkType =>
    async (dispatch) => {
        try {
            const {
                data: { item },
            } = await todolistsAPI.createTodolist(title);
            dispatch(addTodolistAC(item));
        } catch (err) {
            throw new Error(err);
        }
    };
export const changeTodolistTitleTC =
    (todolistId: string, newTodolistTitle: string): ThunkType =>
    async (dispatch) => {
        try {
            await todolistsAPI.updateTodolist(todolistId, newTodolistTitle);
            dispatch(changeTodolistTitleAC(todolistId, newTodolistTitle));
        } catch (err) {
            throw new Error(err);
        }
    };
