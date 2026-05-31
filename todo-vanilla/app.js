// Todo 데이터는 배열로 관리하고 localStorage에 저장하여 새로고침 후에도 유지합니다.
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

// 사용자에게 안내할 메시지를 한 곳에서 관리합니다.
function showMessage(messageText) {
  message.textContent = messageText;
}

// Todo 배열을 JSON 문자열로 변환하여 localStorage에 저장합니다.
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  console.log(`saveTodos() : ${STORAGE_KEY} ${JSON.stringify(todos)}`);
}

// localStorage에 저장된 Todo를 불러오며, 저장값이 없으면 빈 배열을 사용합니다.
function loadTodos() {
  const savedTodos = localStorage.getItem(STORAGE_KEY);
  console.log(`loadTodos(): ${savedTodos}`);

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
  console.log("todos:", todos);
}

// Date 객체를 로컬 시간 기준 YYYY-MM-DD 문자열로 변환합니다.
function getDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// 오늘 날짜를 YYYY-MM-DD 문자열로 반환합니다.
function getTodayString() {
  return getDateString(new Date());
}

// 화면에 표시할 수 있도록 선택 날짜를 읽기 쉬운 형식으로 변환합니다.
function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(date);
}

// 선택 날짜를 원하는 일수만큼 이동하고 목록을 다시 그립니다.
function changeDate(dayOffset) {
  const changedDate = new Date(`${selectedDate}T00:00:00`);
  changedDate.setDate(changedDate.getDate() + dayOffset);
  selectedDate = getDateString(changedDate);
  renderTodos();
}

// 현재 선택된 날짜와 필터에 해당하는 Todo만 반환합니다.
function getFilteredTodos() {
  const selectedDateTodos = todos.filter((todo) => todo.date === selectedDate);

  if (currentFilter === "active") {
    return selectedDateTodos.filter((todo) => !todo.completed);
    // 이때 todo가 completed라는 요소를 가지고 있음을 미리 알고 있어야 한다.
    // vscode로 todo객체에 커서를 가져다 대면 any라고 뜬다.
    // 이는 코드를 읽기에 다소 불편한 것 같다.
  }

  if (currentFilter === "completed") {
    return selectedDateTodos.filter((todo) => todo.completed);
  }

  return selectedDateTodos;
}

// 선택된 필터 버튼에만 active 스타일을 적용합니다.
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

// Todo 배열의 현재 상태를 기준으로 목록 화면을 다시 그립니다.
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

// 반복되는 Todo 동작 버튼 생성을 담당합니다.
function createActionButton(buttonText, className, clickHandler) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `action-button ${className}`;
  button.textContent = buttonText;
  button.addEventListener("click", clickHandler);

  return button;
}

// 입력값을 확인한 뒤 새로운 Todo를 배열에 추가합니다.
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

// 선택한 Todo의 완료 여부를 반대로 변경합니다.
function toggleTodo(todoId) {
  const targetTodo = todos.find((todo) => todo.id === todoId);

  if (!targetTodo) {
    return;
  }

  targetTodo.completed = !targetTodo.completed;
  saveTodos();
  renderTodos();
}

// prompt에 기존 내용을 보여주고, 입력받은 값으로 Todo를 수정합니다.
function updateTodo(todoId) {
  const targetTodo = todos.find((todo) => todo.id === todoId);

  if (!targetTodo) {
    return;
  }

  const updatedTodoText = window.prompt(
    "수정할 내용을 입력해 주세요.",
    targetTodo.text,
  );

  // 사용자가 취소를 누른 경우 기존 내용을 유지합니다.
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

// 선택한 Todo의 위치를 찾아 배열에서 제거합니다.
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

// 저장된 Todo를 복원한 뒤 초기 화면을 렌더링합니다.
loadTodos();
renderTodos();
