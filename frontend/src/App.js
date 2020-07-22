import React, { useState, useEffect } from "react";
import Todo from "./components/Todo";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import { nanoid } from "nanoid";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import axios from "axios";

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    refreshList();
  });

  const refreshList = () => {
    axios
      .get("http://localhost:8000/api/todos/")
      .then((res) => setTasks(res.data))
      .catch((err) => console.log(err));
  };

  function addTask(name) {
    const newTask = { id: "todo-" + nanoid(), name: name, completed: false };
    // setNewTask(newTask);
    axios
      .post("http://localhost:8000/api/todos/", newTask)
      .then((res) => refreshList());
  }

  function toggleTaskCompleted(id) {
    const updatedTask = tasks.find((task) => id === task.id);
    updatedTask.completed = !updatedTask.completed;

    console.log(updatedTask);

    axios
      .put(`http://localhost:8000/api/todos/${id}/`, updatedTask)
      .then((res) => refreshList());
  }

  function deleteTask(id) {
    axios
      .delete(`http://localhost:8000/api/todos/${id}`)
      .then((res) => refreshList());
  }

  function editTask(id, newName) {
    const taskToEdit = tasks.find((task) => id === task.id);

    taskToEdit.name = newName;

    axios
      .put(`http://localhost:8000/api/todos/${id}/`, taskToEdit)
      .then((res) => refreshList());
  }

  const moveTask = (dragIndex, hoverIndex) => {
    //get the dragged element
    const draggedTask = tasks[dragIndex];

    setTasks(
      update(tasks, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, draggedTask],
        ],
      })
    );
  };

  const taskList = tasks
    .filter(FILTER_MAP[filter])
    .map((task, index) => (
      <Todo
        id={task.id}
        name={task.name}
        completed={task.completed}
        key={task.id}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
        index={index}
        moveTask={moveTask}
      />
    ));

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));
  const taskNoun = tasks.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${taskNoun} remaining`;

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception"> {filterList}</div>

      <h2 id="list-heading">{headingText}</h2>
      <ul
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        <DndProvider backend={HTML5Backend}>{taskList}</DndProvider>
      </ul>
    </div>
  );
}
export default App;
