import React, { useState, useRef, useEffect } from 'react';
import Dexie from 'dexie';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Button from '@material-ui/core/Button';
import './App.css';
import getId from './components/key';
import { Container } from '@material-ui/core';


//create a db!
const db = new Dexie('todos');
db.version(1).stores({
  todos: 'id,title,date,finished,priority,trashed,dueDate'
});

//main App function
function App() {

  const [todos, setTodos] = useState([]);
  const [tick, setTick] = useState(0);
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



  //side effect of app running that loads data again
  useEffect(() => {
    loadData();

    setInterval(() => {
      setTick(tick => tick + 1)
    }, 1000)



  }, []);




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


  //changes todo trashed property if clicked then loads data into db
  function trashIt(id, isTrashed) {

    db.todos.update(id, { trashed: !isTrashed });

    setLastItem(id)

    //check if title changed

    loadData();
  }




  //sets picked start date for date property
  function handleChange(date) {
    setStartDate(date);
  }


  function undoTrashed(id) {

    db.todos.update(lastItem, { trashed: false });
    loadData();
    setLastItem(null);
  };

  function timeToDueDate(dueDate) {

    let timeNow = new Date();

    let timeLeft = Math.floor((dueDate.getTime() - timeNow.getTime()) / 1000);

    // taken from https://stackoverflow.com/questions/8211744/convert-time-interval-given-in-seconds-into-more-human-readable-form
    //secondsInAYear = 31536000; secondsInADay = 86400; secondsInAnHour = 3600; secondsInAMinute = 60;



    var numhours = Math.floor(((timeLeft)) / 3600);
    var numminutes = Math.floor((((timeLeft)) % 3600) / 60);
    var numseconds = (((timeLeft) % 86400) % 3600) % 60;
    return numhours + " hours " + numminutes + " minutes " + numseconds + " seconds";

  }



  return (
    <Container id="main" className="App">



      <Container id="undo_box"></Container>

      <Container id="form_container">

        <label>priority:  </label>
        <select name="priority" ref={priRef}>
          <option value="ASAP">ASAP</option>
          <option value="Needs to be done">Needs to be done</option>
          <option value="Eh">Eh</option>
          <option value="Take it Easy">Take it Easy</option>
        </select>

        <DatePicker selected={startDate} onChange={handleChange} />

        <input type="text" ref={myInput} placeholder="enter Todo"></input><Button color="primary" variant="outlined" onClick={(putItemIntoDatabase)}>add To List</Button> <br />
      </Container>

      <div id="reveal_field" onClick={function () {

        let form = document.getElementById('form_container');
        form.classList.toggle('hide_form');

      }}></div><br />
      <h1>To Do:</h1>
      {lastItem && (
        <Button onClick={undoTrashed}>undo</Button>
      )}

      {todos.map(todo => (


        <div id={getId(20)}>
          {todo.trashed ? null : (

            <Container key={todo.id} className={["todoList", todo.finished ? 'finished' : null].join(" ")} id={todo.id}>

              <Button variant="contained" color="primary" onClick={() => {

                doneYet(todo.id, todo.finished);

              }}><span>&#9989;</span></Button>

              <Button variant="contained" color="primary" onClick={() => {

                trashIt(todo.id, todo.trashed)

              }}>delete</Button>

              <p contentEditable="true" suppressContentEditableWarning="true"><span id={todo.id + 1}>{todo.title}</span></p><br />
              {todo.priority}<br />

              <p>Due In:</p>
              {(timeToDueDate(todo.dueDate))}<br />


            </Container>)}
        </div>))}

      <p style={{ display: "none" }}>{tick}</p>
    </Container>
  );
}

export default App;
