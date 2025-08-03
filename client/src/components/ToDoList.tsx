//client\src\components\ToDoList.tsx
import React, { useState, useEffect } from "react";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const ToDoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("tasks");
    if (stored) setTasks(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    const text = taskInput.trim();
    if (!text) return;
    setTasks([...tasks, { id: Date.now(), text, completed: false }]);
    setTaskInput("");
  };

  const toggleComplete = (id: number) => {
    setTasks(tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white p-4 sm:p-6 rounded-xl shadow-md">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-indigo-600">To‑Do List</h2>

      {/* Input + Add button */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4 w-full">
        <input
          type="text"
          placeholder="Add new task"
          value={taskInput}
          onChange={e => setTaskInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addTask()}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={addTask}
          className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Add
        </button>
      </div>

      {/* Task list */}
      <ul className="space-y-2">
        {tasks.length === 0 && (
          <li className="text-gray-500 italic">No tasks yet. Add one above!</li>
        )}
        {tasks.map(t => (
          <li
            key={t.id}
            className="flex justify-between items-left bg-indigo-50 p-3 rounded-md"
          >
            <div className="flex items-left gap-2 w-full overflow-hidden">
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => toggleComplete(t.id)}
                className="form-checkbox text-indigo-600 flex-shrink-0"
              />
              <span className={`truncate ${t.completed ? "line-through text-gray-400" : "text-gray-800"}`}>
                {t.text}
              </span>
            </div>
            <button
              onClick={() => deleteTask(t.id)}
              className="ml-4 text-red-500 hover:text-red-700 font-semibold text-sm flex-shrink-0"
              aria-label="Delete task"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDoList;
