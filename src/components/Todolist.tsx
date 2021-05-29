import React, { MouseEvent, useCallback } from "react";

import { Button, Checkbox, IconButton } from "@material-ui/core";
import { Delete } from "@material-ui/icons";

import { TaskType, FilterValuesType } from "../App";
import AddItemForm from "./AddItemForm";
import EditableSpan from "./EditableSpan";
import Task from "./Task";

type PropsType = {
    todolistId: string;
    title: string;
    tasks: Array<TaskType>;
    changeTodoListFilter: (filterValue: FilterValuesType, id: string) => void;
    removeTask: (id: string, todolistId: string) => void;
    addTask: (title: string, todolistId: string) => void;
    changeCheckStatus: (taskId: string, todolistId: string) => void;
    todoListFilter: FilterValuesType;
    removeTodolist: (todolistId: string) => void;
    changeTaskTitle: (
        taskId: string,
        todolistId: string,
        newValue: string
    ) => void;
    changeStateTitleTodolist: (newTitle: string, todolistId: string) => void;
};

const Todolist = React.memo(function ({
    todolistId,
    title,
    tasks,
    changeTodoListFilter,
    removeTask,
    addTask,
    changeCheckStatus,
    todoListFilter,
    removeTodolist,
    changeTaskTitle,
    changeStateTitleTodolist,
}: PropsType) {
    console.log("Todolist is called");
    const filterTodoList = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => {
            switch (e.currentTarget.childNodes[0].textContent) {
                case "Active":
                    return changeTodoListFilter("active", todolistId);
                case "Completed":
                    return changeTodoListFilter("completed", todolistId);
                default:
                    return changeTodoListFilter("all", todolistId);
            }
        },
        [changeTodoListFilter, todolistId]
    );

    const deleteTodolist = () => removeTodolist(todolistId);

    const addItem = useCallback(
        (title: string) => {
            addTask(title, todolistId);
        },
        [addTask, todolistId]
    );

    const changeTodolistTitle = useCallback(
        (newTitle: string) => {
            changeStateTitleTodolist(newTitle, todolistId);
        },
        [changeStateTitleTodolist, todolistId]
    );

    if (todoListFilter === "active") {
        tasks = tasks.filter((t) => !t.isDone);
    }
    if (todoListFilter === "completed") {
        tasks = tasks.filter((t) => t.isDone);
    }

    return (
        <div>
            <h3>
                <EditableSpan
                    title={title}
                    onChangeTitle={changeTodolistTitle}
                />{" "}
                <IconButton aria-label="delete" onClick={deleteTodolist}>
                    <Delete />
                </IconButton>
            </h3>
            <AddItemForm addItem={addItem} />

            <ul className={"todolists_tasks"}>
                {tasks.map((task) => {
                    return (
                        <Task
                            key={task.id}
                            changeCheckStatus={changeCheckStatus}
                            removeTask={removeTask}
                            changeTaskTitle={changeTaskTitle}
                            task={task}
                            todolistId={todolistId}
                        />
                    );
                })}
            </ul>

            <div>
                <Button
                    variant={todoListFilter === "all" ? "contained" : "text"}
                    onClick={filterTodoList}
                >
                    All
                </Button>
                <Button
                    color={"primary"}
                    variant={todoListFilter === "active" ? "contained" : "text"}
                    onClick={filterTodoList}
                >
                    Active
                </Button>
                <Button
                    color={"secondary"}
                    variant={
                        todoListFilter === "completed" ? "contained" : "text"
                    }
                    onClick={filterTodoList}
                >
                    Completed
                </Button>
            </div>
        </div>
    );
});

export default Todolist;