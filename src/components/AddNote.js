import React, { useRef } from 'react';
import Button from '@material-ui/core/Button';
import { db } from '../App';
import loadData from '../App';



function putMsg(id, noteMsg) {


    db.todos.update(id, { note: noteMsg });
    loadData();




}



function AddNote(todo) {

    const noteMsg = useRef(null);

    return (
        <div>

            <textarea ref={noteMsg.current} className="note_area" type="text"></textarea><br />
            <Button variant="outlined" color="primary" onClick={putMsg(todo.id, noteMsg)}>
                Add Note+ {todo.id}

            </Button>

        </div>
    )
};

export default AddNote;