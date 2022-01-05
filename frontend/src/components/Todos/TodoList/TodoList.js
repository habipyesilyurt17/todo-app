import Todo from "./Todo/Todo";
import "./TodoList.css";

const TodoList = (props) => {
  const todos = props.todos.map((todo) => {
    return <Todo key={todo._id} todoId={todo._id} todo={todo.todo} completed={todo.completed} onUpdate={props.updateTodo} onDelete={props.deleteTodo} onCompleted={props.completedTodo}  />;
  });
  return (
      todos.length > 0 ? <ul className="todo__list">{todos}</ul> : <p className="todo__list-desc">You don't have a todo yet..</p>
  ) 
};

export default TodoList;