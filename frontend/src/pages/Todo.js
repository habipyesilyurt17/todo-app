import { useRef, useState, useContext, useEffect } from "react";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import Spinner from "../components/Spinner/Spinner";
import TodoList from "../components/Todos/TodoList/TodoList";
import AuthContext from "../context/auth-context";
import { toast } from "react-toastify";
import axios from "axios";

import "./Todo.css";

const TodoPage = () => {
  let storageToken = localStorage.getItem("token");
  var isActive = true;

  const [message, setMessage] = useState({
    type: "",
    desc: "",
  });

  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState({});
  const [todoInput, setTodoInput] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const authContext = useContext(AuthContext);
  const todoInputRef = useRef(null);

  const startCreateEventHandler = () => {
    setCreating(true);
  };

  const modalCancelHandler = () => {
    setCreating(false);
    setUpdating(false);
  };

  const modalConfirmHandler = () => {
    setCreating(false);
    setIsLoading(true);
    const todo = todoInputRef.current.value;
    if (todo.trim().length === 0) {
      return;
    }
    const requestBody = {
      todo,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + authContext.token,
    };
    axios
      .post("http://localhost:8000/todo/createTodo", requestBody, {
        headers: headers,
      })
      .then((response) => {
        const updatedTodos = [...todos];
        const newTodo = {
          _id: response.data._id,
          todo: response.data.todo,
          creator: {
            _id: response.data.creator,
          },
          completed: response.data.completed,
        };
        updatedTodos.push(newTodo);
        setTodos(updatedTodos);
        const newMessage = {
          ...message,
          ...{ type: "success", desc: response.data.message },
        };
        setMessage(newMessage);
        setIsLoading(false);
      })
      .catch((err) => {
        const newMessage = {
          ...message,
          ...{ type: "error", desc: err.response.data.message },
        };
        setMessage(newMessage);
        setIsLoading(false);
      });
  };

  const fetchTodos = () => {
    setIsLoading(true);
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + authContext.token,
    };
    axios
      .get("http://localhost:8000/todo/getAllTodos", {
        headers: headers,
      })
      .then((response) => {
        setTodos(response.data.todos);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        if (isActive) {
          setIsLoading(false);
        }
      });
  };

  useEffect(() => {
    fetchTodos();
    return () => {
      isActive = false;
    };
  }, []);

  const updateTodo = (todoId) => {
    const selectTodo = todos.find((todo) => todo._id === todoId);
    setUpdating(true);
    setTodo(selectTodo);
    setTodoInput(selectTodo.todo);
  };

  const modalUpdateHandler = () => {
    setUpdating(false);
    setIsLoading(true);
    const newTodo = { ...todo, ...{ todo: todoInput } };
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + authContext.token,
    };
    axios
      .patch(`http://localhost:8000/todo/${newTodo._id}`, newTodo, {
        headers: headers,
      })
      .then((response) => {
        fetchTodos();
        const newMessage = {
          ...message,
          ...{ type: "success", desc: response.data.message },
        };
        setMessage(newMessage);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        const newMessage = {
          ...message,
          ...{ type: "error", desc: err.response.data.message },
        };
        setMessage(newMessage);
      });
  };

  const handleChangeTodo = (e) => {
    setTodoInput(e.target.value);
  };

  const deleteTodo = (todoId) => {
    setIsLoading(true);
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + authContext.token,
    };
    axios
      .delete(`http://localhost:8000/todo/${todoId}`, {
        headers: headers,
      })
      .then((response) => {
        setTodos(todos.filter((todo) => todo._id !== todoId));
        setIsLoading(false);
        const newMessage = {
          ...message,
          ...{ type: "warning", desc: response.data.message },
        };
        setMessage(newMessage);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        const newMessage = {
          ...message,
          ...{ type: "error", desc: err.response.data.message },
        };
        setMessage(newMessage);
      });
  };

  const completedTodo = (todoId) => {
    setIsLoading(true);
    const filteredTodo = todos.filter((todo) => todo._id === todoId);
    const updatedTodo = {
      ...filteredTodo[0],
      completed: !filteredTodo[0].completed,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + authContext.token,
    };
    axios
      .patch(`http://localhost:8000/todo/${todoId}`, updatedTodo, {
        headers: headers,
      })
      .then((response) => {
        fetchTodos();
        const newMessage = {
          ...message,
          ...{ type: "success", desc: response.data.message },
        };
        setMessage(newMessage);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        const newMessage = {
          ...message,
          ...{ type: "error", desc: err.response.data.message },
        };
        setMessage(newMessage);
      });
  };

  const toastMessage = () => {
    toast(message.desc, {
      type: message.type,
      position: toast.POSITION.TOP_CENTER,
    });
    setMessage({ type: "", desc: "" });
  };

  return (
    <>
      {message.desc !== "" && toastMessage()}
      {(creating || updating) && <Backdrop />}
      {creating && (
        <Modal
          title="Add Todo"
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={modalConfirmHandler}
          confirmText="Confirm"
        >
          <form>
            <div className="form-control">
              <label htmlFor="todo">Todo</label>
              <input type="text" id="todo" ref={todoInputRef}></input>
            </div>
          </form>
        </Modal>
      )}

      {updating && (
        <Modal
          title="Update Todo"
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={modalUpdateHandler}
          confirmText="Update"
        >
          <form>
            <div className="form-control">
              <label htmlFor="todo">Todo</label>
              <input
                type="text"
                id="todo"
                value={todoInput}
                onChange={(e) => handleChangeTodo(e)}
              ></input>
            </div>
          </form>
        </Modal>
      )}

      {storageToken && (
        <div className="todos-control">
          <p>Todo Lists</p>
          <button className="default-btn" onClick={startCreateEventHandler}>
            Create Todo
          </button>
        </div>
      )}
      {isLoading ? (
        <Spinner />
      ) : (
        <TodoList
          todos={todos}
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
          completedTodo={completedTodo}
        />
      )}
    </>
  );
};

export default TodoPage;
