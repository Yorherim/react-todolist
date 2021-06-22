import {
    addTodolistAC,
    removeTodolistAC,
    setTodolistsAC,
} from "./todolists-reducer";
import {
    tasksAPI,
    TaskStatuses,
    TaskType,
    UpdateTaskModelType,
} from "../api/todolists-api";
import { ThunkType } from "./store";

export type TaskActionsType =
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof changeCheckTaskStatusAC>
    | ReturnType<typeof changeTaskTitleAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof setTodolistsAC>
    | ReturnType<typeof setTasksAC>;

export type TaskStateType = {
    [key: string]: Array<TaskType>;
};

const initialState: TaskStateType = {};

export const tasksReducer = (
    state: TaskStateType = initialState,
    action: TaskActionsType
): TaskStateType => {
    switch (action.type) {
        case "ADD-TASK":
            return {
                ...state,
                [action.task.todoListId]: [
                    action.task,
                    ...state[action.task.todoListId],
                ],
            };
        case "REMOVE-TASK":
            return {
                ...state,
                [action.todolistId]: [
                    ...state[action.todolistId].filter(
                        (t) => t.id !== action.taskId
                    ),
                ],
            };
        case "CHANGE-CHECK-TASK-STATUS":
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map((task) => {
                    return task.id === action.taskId
                        ? {
                              ...task,
                              status:
                                  task.status === TaskStatuses.New
                                      ? TaskStatuses.Completed
                                      : TaskStatuses.New,
                          }
                        : task;
                }),
            };
        case "CHANGE-TASK-TITLE":
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map((task) => {
                    return task.id === action.taskId
                        ? { ...task, title: action.newTitle }
                        : task;
                }),
            };
        case "ADD-TODOLIST": {
            const newState = { ...state };
            newState[action.id] = [];
            return newState;
        }
        case "REMOVE-TODOLIST": {
            const newState = { ...state };
            delete newState[action.id];
            return newState;
        }
        case "SET-TODOLISTS":
            const newState = { ...state };
            action.todolists.forEach((tl) => {
                newState[tl.id] = [];
            });
            return newState;
        case "SET-TASKS":
            return {
                ...state,
                [action.todolistId]: action.tasks,
            };
        default:
            return state;
    }
};

// action creators
export const addTaskAC = (task: TaskType) => ({
    type: "ADD-TASK" as const,
    task,
});
export const removeTaskAC = (taskId: string, todolistId: string) => ({
    type: "REMOVE-TASK" as const,
    taskId,
    todolistId,
});
export const changeCheckTaskStatusAC = (
    taskId: string,
    todolistId: string
) => ({
    type: "CHANGE-CHECK-TASK-STATUS" as const,
    taskId,
    todolistId,
});
export const changeTaskTitleAC = (
    taskId: string,
    todolistId: string,
    newTitle: string
) => ({
    type: "CHANGE-TASK-TITLE" as const,
    taskId,
    todolistId,
    newTitle,
});
export const setTasksAC = (tasks: TaskType[], todolistId: string) => ({
    type: "SET-TASKS" as const,
    tasks,
    todolistId,
});

// thunk creators
export const fetchTasksTC =
    (todolistId: string): ThunkType =>
    async (dispatch) => {
        try {
            const { items } = await tasksAPI.getTasks(todolistId);
            dispatch(setTasksAC(items, todolistId));
        } catch (err) {
            throw new Error(err);
        }
    };
export const deleteTaskTC =
    (todolistId: string, taskId: string): ThunkType =>
    async (dispatch) => {
        try {
            await tasksAPI.deleteTask(todolistId, taskId);
            dispatch(removeTaskAC(taskId, todolistId));
        } catch (err) {
            throw new Error(err);
        }
    };
export const addTaskTC =
    (todolistId: string, title: string): ThunkType =>
    async (dispatch) => {
        try {
            const {
                data: { item },
            } = await tasksAPI.createTask(todolistId, title);
            dispatch(addTaskAC(item));
        } catch (err) {
            throw new Error(err);
        }
    };
export const updateTaskTC =
    (
        todolistId: string,
        taskId: string,
        model: UpdateTaskModelType
    ): ThunkType =>
    async (dispatch) => {
        try {
            // await tasksAPI.updateTask(todolistId, taskId, model);
            // dispatch(changeTaskTitleAC(taskId, todolistId, model.title));
            // dispatch(changeCheckTaskStatusAC(taskId, todolistId));
            console.log("update task");
        } catch (err) {
            throw new Error(err);
        }
    };
