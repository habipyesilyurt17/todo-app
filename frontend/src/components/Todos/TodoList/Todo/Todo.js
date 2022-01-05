import { AiOutlineEdit, AiOutlineDelete, AiOutlineCheck } from "react-icons/ai";
import "./Todo.css";

const Todo = (props) => {
  return (
    <li className="todos__list-item" key={props.todoId}>
      <div className={props.completed ? "completed" : ""}>{props.todo}</div>
      <div className="action-icons">
        <button onClick={() => props.onUpdate(props.todoId)}>
          <AiOutlineEdit title="Edit" style={{ color: "blue" }} />
        </button>
        <button onClick={() => props.onDelete(props.todoId)}>
          <AiOutlineDelete title="Delete" style={{ color: "red" }} />
        </button>
        <button onClick={() => props.onCompleted(props.todoId)}>
          <AiOutlineCheck title={props.completed ? "Uncompleted" : "Completed"} style={{ color: "green" }} />
        </button>
      </div>
    </li>
  );
};

export default Todo;
