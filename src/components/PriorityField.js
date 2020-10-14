import React from "react";

function PriorityField(priRef) {
  return (
    <select name="priority" ref={priRef.current}>
      <option value="one">ASAP</option>
      <option value="two">Urgent</option>
      <option value="notImportant">Not Important</option>
      <option value="eventually">Eventually</option>
    </select>
  );
}

export default PriorityField;
