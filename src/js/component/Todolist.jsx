import React, { useEffect, useState } from "react";

export const Todolist = () => {
  const host = 'https://playground.4geeks.com/todo';
  const user = "martinmartos"
  const [task, setTask] = useState("");
  const [list, setList] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const getTodo = async () => {
    // Función para obtener las tareas desde el servidor
    const url = `${host}/users/${user}`;
    const response = await fetch(url);
    console.log(response)
    if (!response.ok) {
      console.error("Error al obtener las tareas:", response.status, response.statusText);
      return;
    }
    const data = await response.json();
    setList(data.todos || []);
  };

  const addTask = async (event) => {
    // Función para agregar una tarea (POST)
    event.preventDefault();
    if (task.trim() === "") return;
    const newTask = { label: task, done: false };
    const url = `${host}/todos/${user}`;
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask)
    };

    const response = await fetch(url, options);
    if (!response.ok) {
      console.error("Error actualizando las tareas:", response.status, response.statusText);
      return
    }
    const data = await response.json();
    console.log("Tareas actualizadas:", data);
    setTask("");
    getTodo();
  };

  const handleEdit = (task) => {
    // Preparar tarea para edición
    setEditTask(task);
    setEditMode(true);
    setTask(task.label);
  };

  const updateTask = async (event) => {
    // Función para actualizar la lista  (PUT)
    event.preventDefault();
    const dataToSend = {
      label: task,
      is_done: isDone
    }
    const url = `${host}/todos/${editTask.id}`;
    const options = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend)
    };
    const response = await fetch(url, options);
    if (!response.ok) {
      console.error("Error", response.status, response.statusText);
      return
    }
    //const data = await response.json();
    setEditMode(false);
    setTask("");
    setEditTask({});
    getTodo()
  };

  const deleteTask = async (item) => {
    // Función para eliminar una tarea específica (DELETE)
    console.log(item)
    const url = `${host}/todos/${item.id}`
    const options = {
      method: "DELETE"
    }
    const response = await fetch(url, options)
    if (!response.ok) {
      console.log(error)
      return
    }
    getTodo()
    // Primero hacer el fetch con el método DELETE
    // Al finalizar ejecutó el get para traer todas las tareas
  };


  useEffect(() => {
    // Cargar las tareas
    getTodo();
  }, []);

  
  
  return (
    <div className="container">
      <h1 className="text-center m-2">Lista de tareas</h1>
      <div className="mb-3">
        <form onSubmit={editMode ? updateTask : addTask}>
          <input
            className="form-control"
            placeholder="¿Tareas por hacer?"
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)} // Actualizar el estado de la tarea
          />
          {editMode ?
           <div>
             <input 
             id="isDone"
             type="checkbox"
             checked={isDone}
             onChange={(e) => setIsDone(e.target.checked)}
             />
            <label htmlFor="isDone">Completed</label>
           </div>
          : ""}
          <button type="submit" className="btn btn-primary mt-2">
             {editMode ? "Actualizar tarea" : "Añadir tarea"}
          </button>
        </form>
      </div>
      <div className="list">
        <ul className="list-group">
          {list.map((item) => (
            <li key={item.id} className="list-group-item d-flex justify-content-between hidden-icon">
              {item.label}: {item.is_done ? "Terminado" : "Pendiente"}
              <div>
              <span onClick={() => handleEdit(item)}>
                <i className="fas fa-pencil-alt text-dark"></i>
              </span>
              <span onClick={() => deleteTask(item)}>
                <i className="far fa-trash-alt text-danger ms-2"></i>
              </span>

              </div>
            </li>
          ))}
          <span className="list-group-item bg-light text-end fw-lighter">
            {list.length === 0 ? "Sin tareas. ¿Quieres añadir?" : `${list.length} tareas`}
          </span>
        </ul>
        <button type="button" className="btn btn-success m-2" onClick={getTodo}>
          Recargar tareas
        </button>
      </div>
    </div>
  );
};