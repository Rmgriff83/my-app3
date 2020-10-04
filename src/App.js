import React, { useState, useRef, useEffect } from 'react';
import Dexie from 'dexie';
import './App.css';
import getId from './components/key';




const db = new Dexie('todos');
db.version(1).stores({
  todos: 'id,title,date,finished,priority,trashed'
});

function App() {

  const [todos, setTodos] = useState([]);
  //const [finished, isFinished] = useState(false);
  const myInput = useRef(null);
  const priRef = useRef(null);


  function loadData() {
    db.todos.toCollection().sortBy('date').then(storedTodos => {
      setTodos(storedTodos);
    });
  }

  useEffect(() => {
    loadData();
  }, []);

  async function putItemIntoDatabase() {
    const id = getId(20);
    await db.todos.put({
      id: id,
      title: myInput.current.value,
      date: Date.now(),
      finished: false,
      priority: priRef.current.value,
      trashed: false
    });

    loadData();

    myInput.current.value = "";
    priRef.current.value = "";
  }

  function doneYet(id) {

    db.todos.update(id, { finished: true });
    loadData();

  };

  function hideIt(element) {

    element.style.display = 'none';

  }

  function trashIt(id) {

    db.todos.update(id, { trashed: true });
    loadData();
  }

  return (
    <div className="App">

      <label>priority:  </label>
      <select name="priority" ref={priRef}>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <input type="text" ref={myInput} placeholder="enter Todo"></input><button onClick={(putItemIntoDatabase)}>add Todo</button> <br />

      {todos.map(todo => <p className="todoList" id={todo.id}>

        <button onClick={() => {

          let thisTodo = document.getElementById(todo.id);
          thisTodo.style.textDecoration = 'line-through';

          doneYet(todo.id)

        }}>&#9989;</button>
        <button onClick={() => {

          let thisTodoElement = document.getElementById(todo.id);
          { hideIt(thisTodoElement) }
          { trashIt(todo.id) }

        }}>delete</button>

        {todo.title}<br />
        {todo.priority}

      </p>)}

    </div>
  );
}

export default App;
