import React from "react";

function PriorityField(priRef) {
  return (
    <select name="priority" ref={priRef.current}>
      <option value="ASAP">ASAP</option>
      <option value="Urgent">Urgent</option>
      <option value="Not Important">Not Important</option>
      <option value="Eventually">Eventually</option>
    </select>
  );
}

export default PriorityField;
