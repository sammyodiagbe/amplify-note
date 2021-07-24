import React, { useState } from "react";
import { createTodo } from "./graphql/mutations";
import { API, graphqlOperation } from "aws-amplify";

const CreateTodo = () => {
  const [todo_name, setTodoName] = useState("");
  const [todo_description, setTodoDescription] = useState("");

  const createNewTodo = async (e) => {
    e.preventDefault();
    try {
      const structure = { name: todo_name, description: todo_description };
      const todo = await API.graphql(
        graphqlOperation(createTodo, { input: structure })
      );
      setTodoDescription("");
      setTodoName("");
    } catch (err) {
      console.log("something broke, ", err);
    }
  };

  return (
    <div className="create-todo">
      <h1>Create a todo</h1>
      <form onSubmit={createNewTodo}>
        <input
          type="text"
          placeholder="Todo name"
          value={todo_name}
          onChange={(e) => setTodoName(e.target.value)}
        />
        <br />
        <textarea
          placeholder="Description"
          value={todo_description}
          onChange={(e) => setTodoDescription(e.target.value)}
        ></textarea>
        <br />
        <br />
        <button>Create todo</button>
      </form>
    </div>
  );
};

export default CreateTodo;
