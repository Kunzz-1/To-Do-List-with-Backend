const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

async function loadTasks() {
  try {
    const res = await fetch("/api/tasks");
    if (!res.ok) throw new Error("Failed to fetch tasks");
    const tasks = await res.json();
    taskList.innerHTML = "";
    tasks.forEach((task) => {
      const li = document.createElement("li");
      const span = document.createElement("span");
      span.textContent = task.text;
      if (task.done) span.classList.add("done");

      const buttonsDiv = document.createElement("div");

      const toggleBtn = document.createElement("button");
      toggleBtn.textContent = task.done ? "Undo" : "Done";
      toggleBtn.onclick = () => toggleTask(task.id, !task.done);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.onclick = () => deleteTask(task.id);

      buttonsDiv.appendChild(toggleBtn);
      buttonsDiv.appendChild(deleteBtn);

      li.appendChild(span);
      li.appendChild(buttonsDiv);
      taskList.appendChild(li);
    });
  } catch (err) {
    taskList.innerHTML = "<li>Error loading tasks</li>";
    console.error(err);
  }
}

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;
  try {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error("Failed to add task");
    taskInput.value = "";
    loadTasks();
  } catch (err) {
    alert("Error adding task");
    console.error(err);
  }
});

async function toggleTask(id, done) {
  try {
    const res = await fetch("/api/tasks/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done }),
    });
    if (!res.ok) throw new Error("Failed to update task");
    loadTasks();
  } catch (err) {
    alert("Error updating task");
    console.error(err);
  }
}

async function deleteTask(id) {
  try {
    const res = await fetch("/api/tasks/" + id, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete task");
    loadTasks();
  } catch (err) {
    alert("Error deleting task");
    console.error(err);
  }
}

loadTasks();
