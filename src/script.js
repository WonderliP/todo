import autosize from "autosize";

const form = document.querySelector(".form-row");
const inputEnter = document.querySelector(".js-input");
const todosContainer = document.querySelector(".todos");

const todos = getLocalStorage();
if (todos)
  todos.forEach(todo => {
    const todoEl = document.createElement("li");
    todoEl.classList.add("item-todo");
    todo.completed ? todoEl.classList.add("checked") : "";
    todoEl.innerHTML = `
      <textarea class="item-todo__textarea" disabled rows="1" spellcheck="false"  >${todo.text
        .trim()
        .replace(/\n/g, "")}</textarea> 
      <div class="item-todo__buttons">
        <button class="item-todo__button button-edit"><i class="fa-solid fa-pen"></i></button> 
        <button class="item-todo__button button-ready hidden"><i class="fa-solid fa-check"></i></button>
        <button class="item-todo__button button-delete"><i class="fa-solid fa-xmark"></i></button>
      </div>
    `;

    addTodoToContainer(todoEl);

    autosizeTextarea(todoEl);
  });

form.addEventListener("submit", e => {
  e.preventDefault();

  const todo = document.createElement("li");
  todo.classList.add("item-todo");
  todo.innerHTML = `
    <textarea class="item-todo__textarea" disabled rows="1" spellcheck="false" >${inputEnter.value
      .trim()
      .replace(/\n/g, "")}</textarea> 
    <div class="item-todo__buttons">
      <button class="item-todo__button button-edit"><i class="fa-solid fa-pen"></i></button>
      <button class="item-todo__button button-ready hidden"><i class="fa-solid fa-check"></i></button>
      <button class="item-todo__button button-delete"><i class="fa-solid fa-xmark"></i></button>
    </div>
    `;

  addTodoToContainer(todo);

  autosizeTextarea(todo);

  inputEnter.value = "";

  setLocalStorage();
});

todosContainer.addEventListener("click", e => {
  const targetEl = e.target;
  const currentTodo = targetEl.closest(".item-todo");
  const textarea = autosize(currentTodo.querySelector(".item-todo__textarea"));
  const btnEdit = currentTodo.querySelector(".button-edit");
  const btnReady = currentTodo.querySelector(".button-ready");

  if (
    targetEl.classList.contains("item-todo") ||
    (targetEl === textarea && textarea.disabled)
  ) {
    currentTodo.classList.toggle("checked");
    btnEdit.classList.remove("hidden");
    btnReady.classList.add("hidden");
  }

  if (targetEl.classList.contains("fa-xmark")) {
    currentTodo.remove();
  }

  if (targetEl.classList.contains("fa-pen")) {
    if (currentTodo.classList.contains("checked")) return;

    btnEdit.classList.add("hidden");
    btnReady.classList.remove("hidden");

    textarea.disabled = false;
    textarea.focus();
    textarea.selectionStart = textarea.value.length;

    btnReady.addEventListener("click", () => {
      textarea.disabled = true;

      btnEdit.classList.remove("hidden");
      btnReady.classList.add("hidden");
    });
  }

  setLocalStorage();
});

function setLocalStorage() {
  const allTodos = [...document.querySelectorAll(".item-todo")];

  const tasks = allTodos.map(todo => {
    const textarea = todo.querySelector(".item-todo__textarea");

    return {
      text: textarea.value,
      completed: todo.classList.contains("checked"),
    };
  });

  localStorage.setItem("todos", JSON.stringify(tasks));
}

function getLocalStorage() {
  return JSON.parse(localStorage.getItem("todos"));
}

function addTodoToContainer(todo) {
  todosContainer.appendChild(todo);
}

function autosizeTextarea(todo) {
  const textarea = todo.querySelector(".item-todo__textarea");
  autosize(textarea);
}
