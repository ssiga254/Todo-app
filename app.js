let currentFilter = "all";
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const input = document.getElementById("taskInput");
const btn = document.getElementById("addBtn");
const list = document.getElementById("taskList");

btn.addEventListener("click", addTask);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

function addTask() {
  const taskText = input.value.trim();
  if (taskText === "") return;

  tasks.push({
    text: taskText,
    completed: false
  });

  saveTasks();
  input.value = "";

  renderTasks();

  // 💥 Bounce effect on container
  const app = document.querySelector(".app");
  app.classList.add("bounce");

  setTimeout(() => {
    app.classList.remove("bounce");
  }, 300);
}

 function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
function updateTaskCount() {
  const pending = tasks.filter(task => !task.completed).length;

  document.getElementById("taskCount").innerText =
    `${pending} task${pending !== 1 ? "s" : ""} left`;
}
function renderTasks() {
  list.innerHTML = "";

    tasks.forEach((task, index) => {
  if (
    currentFilter === "completed" && !task.completed ||
    currentFilter === "pending" && task.completed
  ) return;

  const li = document.createElement("li");


    if (task.completed) {
      li.classList.add("completed");
    }

    li.innerHTML = `
      <span class="task-text">${task.text}</span>
      <div>
         <button class="edit" data-index="${index}">✏️</button>
        <button class="complete" data-index="${index}">✔️</button>
        <button class="delete" data-index="${index}">❌</button>
      </div>
    `;

    list.appendChild(li);
  });
  updateTaskCount();
  toggleClearButton();
}
   function saveEdit(input, index) {
  const newText = input.value.trim();

  if (newText !== "") {
    tasks[index].text = newText;
  }

  saveTasks();
  renderTasks();
}
list.addEventListener("click", (e) => {
  const button = e.target.closest("button");
  if (!button) return;

  const index = button.dataset.index;

 if (button.classList.contains("delete")) {
  const li = button.closest("li");

  li.classList.add("fade-out");

  setTimeout(() => {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }, 400);
}

  if (button.classList.contains("complete")) {
    tasks[index].completed = !tasks[index].completed;
    
  button.classList.add("check-animate");

  setTimeout(() => {
    button.classList.remove("check-animate");
  }, 300);
    celebrate();
    saveTasks();
    renderTasks();
  }

  if (button.classList.contains("edit")) {
    const li = button.closest("li");
    const span = li.querySelector(".task-text");

    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = span.innerText;

    li.replaceChild(editInput, span);
    editInput.focus();

    editInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        saveEdit(editInput, index);
      }
    });

    editInput.addEventListener("blur", () => {
      saveEdit(editInput, index);
    });
  }
});

  

const filterButtons = document.querySelectorAll(".filters button");

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
     filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    renderTasks();
  });
});
renderTasks();
const clearBtn = document.getElementById("clearCompleted");

clearBtn.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed);

  saveTasks();
  renderTasks();
});
function toggleClearButton() {
  const hasCompleted = tasks.some(task => task.completed);
  clearBtn.style.display = hasCompleted ? "block" : "none";
}
function celebrate() {
  const app = document.querySelector(".app");
  app.style.boxShadow = "0 0 25px rgba(0,255,0,0.6)";

  setTimeout(() => {
    app.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2)";
  }, 400);
}