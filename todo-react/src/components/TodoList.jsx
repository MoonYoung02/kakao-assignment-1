import TodoItem from './TodoItem.jsx'

function TodoList({ todos, onDeleteTodo, onToggleTodo, onUpdateTodo }) {
  if (todos.length === 0) {
    return (
      <p className="empty-state">
        선택한 조건에 맞는 할 일이 없습니다.
        <br />
        새로운 할 일을 추가해 보세요.
      </p>
    )
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          onToggleTodo={onToggleTodo}
          onUpdateTodo={onUpdateTodo}
        />
      ))}
    </ul>
  )
}

export default TodoList
