import React, { useState, useRef, useEffect } from 'react';
import Dexie from 'dexie';
import './App.css';

function getId(len) {

  const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
  let val = "";
  for (let i = 0; i < len; ++i) {
    val += chars[Math.floor(Math.random() * chars.length)]
  };
  return val;
};

const db = new Dexie('todos');
db.version(1).stores({
  todos: 'id,title,date,finished'
});

function App() {

  const [todos, setTodos] = useState([]);
  const myInput = useRef(null);


  function loadData() {
    db.todos.toCollection().sortBy('date').then(storedTodos => {//i dont understand this function
      setTodos(storedTodos);
    });
  }

  useEffect(() => {
    loadData();
  }, []);//whats with the array?

  async function putItemIntoDatabase() {
    const id = getId(20);
    await db.todos.put({
      id: id,
      title: myInput.current.value,
      date: Date.now(),
      finished: false
    });

    loadData();

    myInput.current.value = "";
  }

  function doneYet(id) {

    db.todos.update(id, { finished: true, title: 'hello world' });
    loadData();
  };


  return (
    <div className="App">
      <button onClick={(putItemIntoDatabase)}>click</button>
      <br />
      <input type="text" ref={myInput}></input>
      {todos.map(todo => <p>{todo.title} <br />

        {todo.date}
        <button onClick={() => doneYet(todo.id)}>Done Yet?</button>
      </p>)}


    </div>
  );
}

export default App;
