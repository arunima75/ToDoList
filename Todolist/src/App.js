import React, { useState, useEffect } from 'react';
import './App.css';

function App() {

  // State to store the list of todos
  const [toDos, setToDos] = useState(() => {
    // Check if todos exist in the local storage if yes then parse them 
    const storedTodos = localStorage.getItem('todos');
    return storedTodos ? JSON.parse(storedTodos) : [];
  });

  // State to store the value of a new todo
  const [toDo, setToDo] = useState('');

  //State to store the value of completed todo
  const [completedTodos, setCompletedTodos] = useState(() => {
    // Check if completedTodos exist in local storage, if yes then parse them
    const storedCompletedTodos = localStorage.getItem('completedTodos');
    return storedCompletedTodos ? JSON.parse(storedCompletedTodos) : [];
  });

  //const [showCompleted, setShowCompleted] = useState(false);


  //State to keep track of the current page for pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the indexes of the todos for the current page
  const todosPerPage = 5;
  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;

  // Get the todos to display on the current page
  const currentTodos = toDos.slice(indexOfFirstTodo, indexOfLastTodo);

  // Calculate the total number of pages for pagination
  const totalPages = Math.ceil(toDos.length / todosPerPage);

  // This useEffect save todos to local storage whenever the 'toDos' state changes
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(toDos));
  }, [toDos]);

  // This useEffect saves completedTodos to local storage whenever the 'completedTodos' state changes
  useEffect(() => {
    localStorage.setItem('completedTodos', JSON.stringify(completedTodos));
  }, [completedTodos]);

  // Handles Previous button click
  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  // Hnadles next Button click
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // Handles adding new Todo to the list
  const handleAddTodo = () => {
    if (toDo.trim() !== '') {
      const newTodo = { id: Date.now(), title: toDo };
      setToDos((prevTodos) => [...prevTodos, newTodo]);
      setToDo('');
    }
  };

  // Handles removing todo from the list by passing its id
  const handleRemoveTodo = (id) => {
    setToDos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const handleCompleteTodo = (id) => {
    // Find the todo by id in the toDos list
    const todoToComplete = toDos.find((todo) => todo.id === id);

    if (todoToComplete) {
      // Remove the todo from the toDos list
      setToDos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));

      // Add the completed todo to the completedTodos list with a timestamp
      const completedTodoWithTimestamp = {
        ...todoToComplete,
        completedAt: new Date().toLocaleString(),
      };

      // Add the completed todo to the completedTodos list
      setCompletedTodos((prevCompletedTodos) => [
        ...prevCompletedTodos,
        completedTodoWithTimestamp,
      ]);
    }
  }
  // const handleCompletedTodoDisplay = () => {
  //   setShowCompleted((prevShowCompleted) => !prevShowCompleted);
  // }

  const handleRemoveCompleted = (id) => {
    setCompletedTodos((prevCompletedTodos) =>
      prevCompletedTodos.filter((completedTodo) => completedTodo.id !== id)
    );
  };

  const handleMouseEnter = (completedTodo, event) => {
    const tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    tooltip.className="tooltip";
    tooltip.textContent = `Completed on: ${completedTodo.completedAt}`;
    event.currentTarget.appendChild(tooltip);
  };

  const handleMouseLeave = (event) => {
    const tooltip = event.currentTarget.querySelector(".tooltip");
    if (tooltip) {
      event.currentTarget.removeChild(tooltip);
    }
  };


  return (
    <div className="container">
      <header id="headerStyle">
        <h1>To Do List</h1>
      </header>
      <div className="input-container">
        <input
          type="text"
          name="title"
          placeholder="Add a Todo..."
          style={{ padding: '5px' }}
          value={toDo}
          onChange={(e) => setToDo(e.target.value)}
          className="input-field"
        />
        <button className="btn" onClick={handleAddTodo}>
          Add
        </button>
        {/* <button className="btn" style={{ marginLeft: "2px" }} onClick={handleCompletedTodoDisplay}>
          {showCompleted ? 'Show Active' : ' Show Completed'}
        </button> */}
      </div>
      <div style={{ display: 'flex' }}>
        {currentTodos.length > 0 && (
          <div style={{ flex: 1 }}>
            <h2 className='header'>Active Todos</h2>
            <ul className="todo-list">
              {currentTodos.map((obj) => (
                <li
                  key={obj.id}
                  className="tododisplay"
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  {obj.title}
                  <button className="removeButton" onClick={() => handleRemoveTodo(obj.id)}>
                    <span className="hyphen">x</span>
                  </button>
                  <button className="completeButton" onClick={() => handleCompleteTodo(obj.id)}>
                    <span className="complete">✔</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {completedTodos.length > 0 && (
          <div style={{ flex: 1 }}>
            <h2 className='header'>Completed Todos</h2>
            <ul className="todo-list">
              {completedTodos.map((completedTodo) => (
                <li
                  key={completedTodo.id}
                  className="tododisplay"
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                  onMouseEnter={(e) => handleMouseEnter(completedTodo, e)}
                  onMouseLeave={handleMouseLeave}
                >
                  {completedTodo.title}
                  <button
                    className="removeButton"
                    onClick={() => handleRemoveCompleted(completedTodo.id)}
                  >
                    <span className="hyphen">x</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* {toDos.length === 0  && <p className="no-todos">No todos available</p>} */}
      <div className="pagination">
        {currentPage !== 1 && (
          <button className="previousButton" onClick={handlePreviousPage}>
            Previous
          </button>
        )}
        {currentPage !== totalPages && toDos.length > 0 && (
          <button className="nextButton" onClick={handleNextPage}>
            Next
          </button>
        )}
      </div>
    </div>
  );

}
export default App;