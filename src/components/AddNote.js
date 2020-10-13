import React, { useRef } from "react";
import Button from "@material-ui/core/Button";
import { db } from "../App";
// import { noteMsg } from '../App';
import loadData from "../App";




function AddNote(todo) {
  function putMsg(id) {
    db.todos.update(id, { note: "fuck" });
    loadData();
  }

  return (
    <div>
      <textarea className="note_area" type="text"></textarea>
      <br />
      <Button variant="outlined" color="primary" onClick={putMsg(todo.id)}>
        Add Note+ {todo.id}
      </Button>
    </div>
  );
}

export default AddNote;
