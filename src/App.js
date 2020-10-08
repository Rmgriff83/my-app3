import React, { useState, useRef, useEffect } from 'react';
import Dexie from 'dexie';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './App.css';
import getId from './components/key';

//create a db!
const db = new Dexie('todos');
db.version(1).stores({
  todos: 'id,title,date,finished,priority,trashed,dueDate'
});

//main App function
function App() {

  const [todos, setTodos] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  //const [finished, isFinished] = useState(false);
  const [lastItem, setLastItem] = useState(null);
  const myInput = useRef(null);
  const priRef = useRef(null);
  const [startDate, setStartDate] = useState(new Date());

  //loads data into table
  function loadData() {
    db.todos.toCollection().sortBy('date').then(storedTodos => {
      setTodos(storedTodos);

    });
  }

  //tried to update title if changed by user(after being defined)
  // useEffect(() => {

  //   db.todos.each((todo) => {

  //     let newTitle = document.getElementById(todo.id + 1).textContent;

  //     if (todo.id !== newTitle) {
  //       db.todos.update(todo.id, { title: newTitle });
  //       loadData();
  //     }



  //   })
  // }, []);



  //how do i make a conditional based on an object property?

  // function deleteFinished() {

  //   db.todos.filter(function (todo) {
  //     if (todo.finished === true) {
  //       console.log(todo.title);
  //     };
  //   });
  // }


  //side effect of app running that loads data again
  useEffect(() => {
    loadData();



  }, []);

  //another try at the conditional issue
  // function checkIfFinished(id) {
  //   if (id.finished === true) {
  //     let thisTodo = document.getElementById(id);
  //     thisTodo.style.textDecoration = 'line-through';
  //   }
  // }

  // checkIfFinished(db.todos.id);


  //puts individual items into table
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

    //make sure the new data is in
    loadData();

    //resets field values
    myInput.current.value = "";
    priRef.current.value = "";
    const formContainer = document.getElementById('form_container');
    formContainer.classList.toggle('hide_form');
  }

  //updates todo finished property if clicked then loads data into db
  function doneYet(id, isDone) {

    db.todos.update(id, { finished: !isDone });
    loadData();

  };

  //hides todo ELEMENT if clicked
  // function hideIt(element) {

  //   element.style.display = 'none';

  // }
  //changes todo trashed property if clicked then loads data into db
  function trashIt(id, isTrashed) {

    db.todos.update(id, { trashed: !isTrashed });

    setLastItem(id)

    //check if title changed

    loadData();
  }


  // function deleteIt(id) {

  //   db.todos.delete(id);
  //   loadData();
  // }

  //sets picked start date for date property
  function handleChange(date) {
    setStartDate(date);
  }

  db.todos.each((todo) => {

    if (todo.finished === true) {

      //why isn't this staying after page refresh??
      //its seeing the right ones, but won't let me define css? also its printing every state change 2x?
      console.log(todo.title);
    };
  });

  function undoFinished(id, i) {
    //i isn't adding 1 each click?
    if (i % 2 === 0) {
      console.log(i);
      // db.todos.update(id, { finished: true });
      // loadData();
    }
  };

  function undoTrashed(id) {

    db.todos.update(lastItem, { trashed: false });
    loadData();
    setLastItem(null);
  };

  function timeToDueDate(dueDate) {

    let timeNow = new Date();

    let timeLeft = Math.floor((dueDate.getTime() - timeNow.getTime()) / 1000 / 60);
    // let counter = setInterval(() => {
    //   console.log(timeLeft)
    // }, 1000);

    //this broke my page
    // setInterval(() => {
    //   setTimeLeft(timeLeft);
    // }, 1000);
    return timeLeft
    // console.log(counter);  needs to be a stateful variable


  }

  return (
    <div id="main" className="App">



      <div id="undo_box"></div>

      <div id="form_container">

        <label>priority:  </label>
        <select name="priority" ref={priRef}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <DatePicker selected={startDate} onChange={handleChange} />

        <input type="text" ref={myInput} placeholder="enter Todo"></input><button onClick={(putItemIntoDatabase)}>add To List</button> <br />
      </div>

      <div id="reveal_field" onClick={function () {

        let form = document.getElementById('form_container');
        form.classList.toggle('hide_form');

      }}></div><br />
      <h1>To Do:</h1>
      {lastItem && (
        <button onClick={undoTrashed}>undo</button>
      )}

      {todos.map(todo => (


        <div id={getId(20)}>
          {todo.trashed ? null : (


            <div key={todo.id} className={["todoList", todo.finished ? 'finished' : null].join(" ")} id={todo.id}>

              <button onClick={() => {

                doneYet(todo.id, todo.finished);

              }}><span>&#9989;</span></button>

              <button onClick={() => {

                trashIt(todo.id, todo.trashed)

              }}>delete</button>

              <p contentEditable="true" suppressContentEditableWarning="true"><span id={todo.id + 1}>{todo.title}</span></p><br />
              {todo.priority}<br />
              {/* {todo.dueDate.toLocaleString()}<br /> */}<br />
        time left:{(timeToDueDate(todo.dueDate))}<br />
              {todo.dueDate.toLocaleString()}

            </div>)}
        </div>))}


    </div>
  );
}

export default App;
