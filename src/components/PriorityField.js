import React from "react";

function PriorityField(priRef) {
  return (
    <select name="priority" ref={priRef.current}>
      <option value="ASAP">ASAP</option>
      <option value="Needs to be done">Urgent</option>
      <option value="Eh">Not Important</option>
      <option value="Take it Easy">Eventually</option>
    </select>
  );
}

export default PriorityField;
