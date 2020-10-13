import React from "react";

function RevealField() {
  return (
    <div
      id="reveal_field"
      onClick={function () {
        let form = document.getElementById("form_container");
        let revealF = document.getElementById("reveal_field");
        form.classList.toggle("hide_form");
        revealF.classList.toggle("popIn");
      }}
    ></div>
  );
}

export default RevealField;
