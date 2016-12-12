import React from "react";
import { render } from "react-dom";
import Editor from "./components/editor.jsx";
import { state } from "./state/state"

render(
    <Editor state={state} />,
    document.getElementById('app')
); 