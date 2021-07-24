import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { listTodos } from "./graphql/queries";
import { deleteTodo } from "./graphql/mutations";

const GetTodos = () => {
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const { data } = await API.graphql(graphqlOperation(listTodos));
      setTodos(data.listTodos.items);
    } catch (err) {
      console.log("something went wrong ", err);
    }
  };

  const deleteThisTodo = async (todoId) => {
    console.log(todoId);
    try {
      const deletetodo = await API.graphql(
        graphqlOperation(deleteTodo, { input: { id: todoId } })
      );
      const newTodos = todos.filter((todo) => todo.id !== todoId);
      setTodos(newTodos);
      console.log("done deleting, ");
    } catch (err) {
      console.log("something went wrong ", err);
    }
  };

  const renderTodos = todos.map((todo) => {
    return (
      <div className="" key={todo.id}>
        <p>{todo.name}</p>
        <p>{todo.description}</p>
        <button
          style={{
            padding: "1em",
            color: "#fff",
            background: "#f6334f",
            border: "none",
          }}
          onClick={() => {
            deleteThisTodo(todo.id);
          }}
        >
          Delete todo
        </button>
      </div>
    );
  });

  return (
    <div>
      <h1>Your todos</h1>
      {renderTodos}
    </div>
  );
};

export default GetTodos;
