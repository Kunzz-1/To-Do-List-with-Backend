const express = require("express");
const fs = require("fs").promises; // use promise-based fs
const path = require("path");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "tasks.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Helper: load tasks
async function loadTasks() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    // If file doesn't exist, create one
    if (err.code === "ENOENT") {
      await saveTasks([]);
      return [];
    }
    throw err;
  }
}

// Helper: save tasks
async function saveTasks(tasks) {
  await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2));
}

// Routes
app.get("/api/tasks", async (req, res) => {
  const tasks = await loadTasks();
  res.json(tasks);
});

app.post("/api/tasks", async (req, res) => {
  const tasks = await loadTasks();
  const newTask = { id: Date.now(), text: req.body.text, done: false };
  tasks.push(newTask);
  await saveTasks(tasks);
  res.status(201).json(newTask);
});

app.put("/api/tasks/:id", async (req, res) => {
  const tasks = await loadTasks();
  const task = tasks.find((t) => t.id == req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found" });
  task.done = req.body.done;
  await saveTasks(tasks);
  res.json(task);
});

app.delete("/api/tasks/:id", async (req, res) => {
  let tasks = await loadTasks();
  tasks = tasks.filter((t) => t.id != req.params.id);
  await saveTasks(tasks);
  res.json({ success: true });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
