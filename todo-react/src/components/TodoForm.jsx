import { useRef, useState } from 'react'

function TodoForm({ message, onAddTodo }) {
  const [todoText, setTodoText] = useState('')
  const inputRef = useRef(null)

  const handleSubmit = (event) => {
    event.preventDefault()

    const isAdded = onAddTodo(todoText)

    if (isAdded) {
      setTodoText('')
    }

    inputRef.current?.focus()
  }

  return (
    <section className="todo-form-section" aria-label="할 일 추가">
      <form className="todo-form" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="todo-input">
          새로운 할 일
        </label>
        <input
          id="todo-input"
          ref={inputRef}
          className="todo-input"
          type="text"
          placeholder="새로운 할 일을 입력하세요"
          autoComplete="off"
          value={todoText}
          onChange={(event) => setTodoText(event.target.value)}
        />
        <button className="add-button" type="submit">
          추가
        </button>
      </form>
      <p className="message" role="alert" aria-live="polite">
        {message}
      </p>
    </section>
  )
}

export default TodoForm
