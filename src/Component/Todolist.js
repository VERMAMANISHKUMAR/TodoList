
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Style.css';

const Todolist = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskValue, setEditTaskValue] = useState('');

  const API_URL = 'https://jsonplaceholder.typicode.com/todos';

  // Fetch todos
  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data.slice(0, 10)); // Limit to first 10 tasks
      setIsLoading(false);
    } catch (error) {
      toast.error('Failed to fetch todos!');
    }
  };

  // Add todo
  const addTodo = async () => {
    if (!inputValue) {
      toast.error('Task cannot be empty!');
      return;
    }

    const newTodo = {
      title: inputValue,
      completed: false,
      userId: 1,
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo),
      });

      const data = await response.json();
      setTasks([data, ...tasks]);
      setInputValue('');
      toast.success('Todo added successfully!');
    } catch (error) {
      toast.error('Failed to add todo!');
    }
  };

  // Update todo
  const updateTodo = async (id) => {
    const updatedTask = tasks.find((task) => task.id === id);
    updatedTask.completed = !updatedTask.completed;

    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });

      setTasks([...tasks]);
      toast.success('Todo updated successfully!');
    } catch (error) {
      toast.error('Failed to update todo!');
    }
  };

  // Edit task
  const editTodo = (id, newTitle) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, title: newTitle } : task
    );
    setTasks(updatedTasks);
    setEditTaskId(null);
    setEditTaskValue('');
    toast.success('Task edited successfully!');
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter((task) => task.id !== id));
      toast.success('Todo deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete todo!');
    }
  };

  // Filtered tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  });

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="todo-container">
      <h1>Todo List</h1>
      <div className="todo-input">
        <input
          type="text"
          placeholder="Add a new task..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={addTodo}>Add Task</button>
      </div>

      <div className="filter-buttons">
        <button onClick={() => setFilter('all')}>All Task</button>
        <button onClick={() => setFilter('completed')}>Completed Task</button>
        <button onClick={() => setFilter('incomplete')}>Incomplete Task</button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul className="todo-list">
          {filteredTasks.map((task) => (
            <li key={task.id} className={task.completed ? 'completed' : ''}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => updateTodo(task.id)}
              />
              {editTaskId === task.id ? (
                <>
                  <input
                    type="text"
                    value={editTaskValue}
                    onChange={(e) => setEditTaskValue(e.target.value)}
                  />
                  <button onClick={() => editTodo(task.id, editTaskValue)}>
                    Update
                  </button>
                  <button onClick={() => setEditTaskId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <span>{task.title}</span>
                  <button onClick={() => {
                    setEditTaskId(task.id);
                    setEditTaskValue(task.title);
                  }}>Edit</button>
                  <button onClick={() => deleteTodo(task.id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      <ToastContainer />
    </div>
  );
};

export default Todolist;
