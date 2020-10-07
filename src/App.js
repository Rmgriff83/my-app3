import React, { useState, useRef, useEffect } from 'react';
import Dexie from 'dexie';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './App.css';
import getId from './components/key';

const db = new Dexie('todos');
db.version(1).stores({
  todos: 'id,title,date,finished,priority,trashed,dueDate'
});

function App() {

  const [todos, setTodos] = useState([]);
  //const [finished, isFinished] = useState(false);
  const myInput = useRef(null);
  const priRef = useRef(null);
  const [startDate, setStartDate] = useState(new Date());


  function loadData() {
    db.todos.toCollection().sortBy('date').then(storedTodos => {
      setTodos(storedTodos);

    });
  }

  // function deleteFinished() {

  //   db.todos.filter(function (todo) {
  //     if (todo.finished === true) {
  //       console.log(todo.title);
  //     };
  //   });
  // }


  useEffect(() => {
    loadData();
    if (db.todos.sortBy === true) {
      console.log('hllo');
    }

  }, []);

  // function checkIfFinished(id) {
  //   if (id.finished === true) {
  //     let thisTodo = document.getElementById(id);
  //     thisTodo.style.textDecoration = 'line-through';
  //   }
  // }

  // checkIfFinished(db.todos.id);


  async function putItemIntoDatabase() {
    const id = getId(20);
    await db.todos.put({
      id: id,
      title: myInput.current.value,
      date: Date.now(),
      finished: false,
      priority: priRef.current.value,
      trashed: false,
      dueDate: startDate
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

  function handleChange(date) {
    setStartDate(date);
  }


  return (
    <div className="App">

      <label>priority:  </label>
      <select name="priority" ref={priRef}>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

      <DatePicker selected={startDate} onChange={handleChange} />

      <input type="text" ref={myInput} placeholder="enter Todo"></input><button onClick={(putItemIntoDatabase)}>add Todo</button> <br />

      {todos.map(todo => <p key={todo.id} className="todoList" id={todo.id}>



        <button onClick={() => {

          let thisTodo = document.getElementById(todo.id);
          thisTodo.classList.add('finished');

          doneYet(todo.id)

        }}>&#9989;</button>
        <button onClick={() => {

          let thisTodoElement = document.getElementById(todo.id);
          { hideIt(thisTodoElement) }
          { trashIt(todo.id) }

        }}>delete</button>

        {todo.title}<br />
        {todo.priority}<br />
        {todo.dueDate.toLocaleString()}

      </p>)}

    </div>
  );
}

export default App;
