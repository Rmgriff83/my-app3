import React from 'react';

function RevealField() {

    return (<div id="reveal_field" onClick={function () {

        let form = document.getElementById('form_container');
        form.classList.toggle('hide_form');

    }}></div>
    )

};

export default RevealField;