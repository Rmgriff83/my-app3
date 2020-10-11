
import React from 'react';



function PriorityField(priRef) {



    return (
        <select name="priority" ref={priRef.current}>
            <option value="ASAP">ASAP</option>
            <option value="Needs to be done">Needs to be done</option>
            <option value="Eh">Eh</option>
            <option value="Take it Easy">Take it Easy</option>
        </select>
    )
}

export default PriorityField;