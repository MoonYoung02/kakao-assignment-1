import { useState } from 'react'

function TodoItem({ todo, onDeleteTodo, onToggleTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)

  const handleEditSubmit = (event) => {
    event.preventDefault()

    const isUpdated = onUpdateTodo(todo.id, editText)

    if (isUpdated) {
      setIsEditing(false)
    }
  }

  const cancelEdit = () => {
    setEditText(todo.text)
    setIsEditing(false)
  }

  return (
    <li className={`todo-item${todo.completed ? ' completed' : ''}`}>
      {isEditing ? (
        <form className="edit-form" onSubmit={handleEditSubmit}>
          <label className="sr-only" htmlFor={`edit-todo-${todo.id}`}>
            할 일 수정
          </label>
          <input
            id={`edit-todo-${todo.id}`}
            className="edit-input"
            type="text"
            value={editText}
            onChange={(event) => setEditText(event.target.value)}
            autoFocus
          />
          <div className="todo-actions">
            <button className="action-button edit-button" type="submit">
              저장
            </button>
            <button
              className="action-button cancel-button"
              type="button"
              onClick={cancelEdit}
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <>
          <span className="todo-text">{todo.text}</span>
          <div className="todo-actions">
            <button
              className="action-button complete-button"
              type="button"
              onClick={() => onToggleTodo(todo.id)}
            >
              {todo.completed ? '완료 취소' : '완료'}
            </button>
            <button
              className="action-button edit-button"
              type="button"
              onClick={() => setIsEditing(true)}
            >
              수정
            </button>
            <button
              className="action-button delete-button"
              type="button"
              onClick={() => onDeleteTodo(todo.id)}
            >
              삭제
            </button>
          </div>
        </>
      )}
    </li>
  )
}

export default TodoItem
