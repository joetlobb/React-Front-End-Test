import React, { useState } from "react";

// Define the FormComponent outside of your useForm hook
const FormComponent = ({ setState, state, label }) => (
  <input placeholder="Enter Subtask Name" style={{ width: 400 }}
    name={label} type="text"
    value={state}
    onChange={event => setState(event.target.value)}
  />
);

export default function useForm(defaultState, label) {
  const [state, setState] = useState(defaultState);

  return [
    state,
    <FormComponent state={state} setState={setState} name={label} />,
    setState
  ];
}