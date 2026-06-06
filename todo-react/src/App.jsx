import { useEffect, useMemo, useState } from 'react'
import DateNavigation from './components/DateNavigation.jsx'
import TodoFilter from './components/TodoFilter.jsx'
import TodoForm from './components/TodoForm.jsx'
import TodoList from './components/TodoList.jsx'
import { getTodayString } from './utils/date.js'
import './App.css'

const STORAGE_KEY = 'todo-react-todos'

function loadSavedTodos() {
  const savedTodos = localStorage.getItem(STORAGE_KEY)

  if (!savedTodos) {
    return []
  }

  try {
    const parsedTodos = JSON.parse(savedTodos)
    return Array.isArray(parsedTodos) ? parsedTodos : []
  } catch {
    return []
  }
}

function createTodo(text, date) {
  return {
    id: crypto.randomUUID(),
    text,
    completed: false,
    date,
    createdAt: Date.now(),
  }
}

function App() {
  const [todos, setTodos] = useState(loadSavedTodos)
  const [filter, setFilter] = useState('all')
  const [selectedDate, setSelectedDate] = useState(getTodayString)
  const [message, setMessage] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const selectedDateTodos = useMemo(
    () => todos.filter((todo) => todo.date === selectedDate),
    [todos, selectedDate],
  )

  const visibleTodos = useMemo(() => {
    if (filter === 'active') {
      return selectedDateTodos.filter((todo) => !todo.completed)
    }

    if (filter === 'completed') {
      return selectedDateTodos.filter((todo) => todo.completed)
    }

    return selectedDateTodos
  }, [filter, selectedDateTodos])

  const addTodo = (todoText) => {
    const trimmedTodoText = todoText.trim()

    if (!trimmedTodoText) {
      setMessage('할 일을 입력해 주세요.')
      return false
    }

    setTodos((currentTodos) => [
      ...currentTodos,
      createTodo(trimmedTodoText, selectedDate),
    ])
    setMessage('할 일이 추가되었습니다.')
    return true
  }

  const toggleTodo = (todoId) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
    setMessage('')
  }

  const updateTodo = (todoId, nextText) => {
    const trimmedTodoText = nextText.trim()

    if (!trimmedTodoText) {
      setMessage('수정할 내용은 비워둘 수 없습니다.')
      return false
    }

    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === todoId ? { ...todo, text: trimmedTodoText } : todo,
      ),
    )
    setMessage('할 일이 수정되었습니다.')
    return true
  }

  const deleteTodo = (todoId) => {
    setTodos((currentTodos) =>
      currentTodos.filter((todo) => todo.id !== todoId),
    )
    setMessage('할 일이 삭제되었습니다.')
  }

  return (
    <main className="todo-app">
      <header className="app-header">
        <p className="eyebrow">PRODUCTIVITY</p>
        <h1>Todo List</h1>
        <p className="app-description">
          날짜별로 할 일을 정리하고 진행 상태를 관리해 보세요.
        </p>
      </header>

      <DateNavigation
        selectedDate={selectedDate}
        onChangeDate={setSelectedDate}
      />

      <TodoForm message={message} onAddTodo={addTodo} />

      <section className="todo-list-section" aria-label="할 일 목록">
        <div className="list-header">
          <h2>할 일</h2>
          <span className="todo-count">{selectedDateTodos.length}개</span>
        </div>

        <TodoFilter currentFilter={filter} onChangeFilter={setFilter} />

        <TodoList
          todos={visibleTodos}
          onDeleteTodo={deleteTodo}
          onToggleTodo={toggleTodo}
          onUpdateTodo={updateTodo}
        />
      </section>
    </main>
  )
}

export default App
