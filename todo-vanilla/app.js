const STORAGE_KEY = "todo-vanilla-todos";
let todos = [];
let currentFilter = "all";
let selectedDate = getTodayString();

const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const todoCount = document.querySelector("#todo-count");
const emptyState = document.querySelector("#empty-state");
const message = document.querySelector("#message");
const filterButtons = document.querySelectorAll(".filter-button");
const selectedDateText = document.querySelector("#selected-date");
const previousDateButton = document.querySelector("#previous-date-button");
const nextDateButton = document.querySelector("#next-date-button");

function showMessage(messageText) {
  message.textContent = messageText;
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function loadTodos() {
  const savedTodos = localStorage.getItem(STORAGE_KEY);

  if (!savedTodos) {
    todos = [];
    return;
  }

  try {
    const parsedTodos = JSON.parse(savedTodos);
    todos = Array.isArray(parsedTodos) ? parsedTodos : [];
  } catch {
    todos = [];
  }
}

function getDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getTodayString() {
  return getDateString(new Date());
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(date);
}

function changeDate(dayOffset) {
  const changedDate = new Date(`${selectedDate}T00:00:00`);
  changedDate.setDate(changedDate.getDate() + dayOffset);
  selectedDate = getDateString(changedDate);
  renderTodos();
}

function getFilteredTodos() {
  const selectedDateTodos = todos.filter((todo) => todo.date === selectedDate);

  if (currentFilter === "active") {
    return selectedDateTodos.filter((todo) => !todo.completed);
  }

  if (currentFilter === "completed") {
    return selectedDateTodos.filter((todo) => todo.completed);
  }

  return selectedDateTodos;
}

function updateActiveFilterButton() {
  filterButtons.forEach((filterButton) => {
    const isSelectedFilter = filterButton.dataset.filter === currentFilter;
    filterButton.classList.toggle("active", isSelectedFilter);
  });
}

function createTodo(todoText, date) {
  return {
    id: Date.now(),
    text: todoText,
    completed: false,
    date,
  };
}

function renderTodos() {
  todoList.innerHTML = "";
  const filteredTodos = getFilteredTodos();
  const selectedDateTodoCount = todos.filter(
    (todo) => todo.date === selectedDate,
  ).length;

  filteredTodos.forEach((todo) => {
    const todoItem = document.createElement("li");
    todoItem.className = `todo-item${todo.completed ? " completed" : ""}`;

    const todoText = document.createElement("span");
    todoText.className = "todo-text";
    todoText.textContent = todo.text;

    const todoActions = document.createElement("div");
    todoActions.className = "todo-actions";

    const completeButton = createActionButton(
      todo.completed ? "완료 취소" : "완료",
      "complete-button",
      () => toggleTodo(todo.id),
    );
    const editButton = createActionButton("수정", "edit-button", () =>
      updateTodo(todo.id),
    );
    const deleteButton = createActionButton("삭제", "delete-button", () =>
      deleteTodo(todo.id),
    );

    todoActions.append(completeButton, editButton, deleteButton);
    todoItem.append(todoText, todoActions);
    todoList.append(todoItem);
  });

  selectedDateText.textContent = formatDate(selectedDate);
  todoCount.textContent = `${selectedDateTodoCount}개`;
  emptyState.classList.toggle("hidden", filteredTodos.length > 0);
  updateActiveFilterButton();
}

function createActionButton(buttonText, className, clickHandler) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `action-button ${className}`;
  button.textContent = buttonText;
  button.addEventListener("click", clickHandler);

  return button;
}

function addTodo(todoText) {
  const trimmedTodoText = todoText.trim();

  if (!trimmedTodoText) {
    showMessage("할 일을 입력해 주세요.");
    todoInput.focus();
    return;
  }

  todos.push(createTodo(todoText, selectedDate));

  saveTodos();
  todoInput.value = "";
  showMessage("");
  renderTodos();
  todoInput.focus();
}

function toggleTodo(todoId) {
  const targetTodo = todos.find((todo) => todo.id === todoId);

  if (!targetTodo) {
    return;
  }

  targetTodo.completed = !targetTodo.completed;
  saveTodos();
  renderTodos();
}

function updateTodo(todoId) {
  const targetTodo = todos.find((todo) => todo.id === todoId);

  if (!targetTodo) {
    return;
  }

  const updatedTodoText = window.prompt(
    "수정할 내용을 입력해 주세요.",
    targetTodo.text,
  );

  if (updatedTodoText === null) {
    return;
  }

  const trimmedTodoText = updatedTodoText.trim();

  if (!trimmedTodoText) {
    showMessage("수정할 내용은 비워둘 수 없습니다.");
    return;
  }

  targetTodo.text = trimmedTodoText;
  saveTodos();
  showMessage("");
  renderTodos();
}

function deleteTodo(todoId) {
  const targetTodoIndex = todos.findIndex((todo) => todo.id === todoId);

  if (targetTodoIndex === -1) {
    return;
  }

  todos.splice(targetTodoIndex, 1);
  saveTodos();
  showMessage("");
  renderTodos();
}

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addTodo(todoInput.value);
});

filterButtons.forEach((filterButton) => {
  filterButton.addEventListener("click", () => {
    currentFilter = filterButton.dataset.filter;
    renderTodos();
  });
});

previousDateButton.addEventListener("click", () => {
  changeDate(-1);
});

nextDateButton.addEventListener("click", () => {
  changeDate(1);
});

loadTodos();
renderTodos();
