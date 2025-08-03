// client/src/pages/Todo.tsx
import React, { useState } from "react";
import useTasks, { Task } from "../services/useTasks";
import { toast } from "react-toastify";
import Tooltip from "../components/Tooltip";

const suggestedTasks = [
  "Update your resume",
  "Practice common interview questions",
  "Research companies you're applying to",
];

const Todo: React.FC = () => {
  const { tasks, addTask, toggleTask, deleteTask } = useTasks();
  const [newTask, setNewTask] = useState("");

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    await addTask(newTask.trim());
    toast.success("Task added!");
    setNewTask("");
  };

  const handleAddSuggested = (text: string) => {
    if (!tasks.some(t => t.text === text)) {
      addTask(text);
      toast.success(`Suggested task added: ${text}`);
    }
  };

  const handleToggle = (t: Task) => {
    toggleTask(t._id);
    toast.info(t.done ? "Task marked incomplete" : "Task marked complete");
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
    toast.error("Task deleted!");
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-3xl lg:max-w-5xl mx-auto w-full space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <h2 className="text-3xl font-bold text-indigo-800">📝 Full To‑Do List</h2>
          <Tooltip content="Manage tasks for your job hunt: resume updates, interview prep, and more">
            <span className="w-6 h-6 bg-indigo-800 text-white rounded-full inline-flex items-center justify-center text-xs cursor-default">?</span>
          </Tooltip>
        </div>

        <section className="bg-white p-4 sm:p-6 rounded-2xl shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              placeholder="Add a new task..."
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 ring-indigo-400"
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAddTask()}
            />
            <button
              onClick={handleAddTask}
              className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Add
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {tasks.length === 0 ? (
              <p className="text-gray-500 italic">No tasks yet. Add your first task above ⬆️</p>
            ) : (
              <ul className="space-y-3">
                {tasks.map((t: Task) => (
                  <li
                    key={t._id}
                    className="flex items-center justify-between bg-indigo-50 p-3 rounded-lg border border-indigo-100"
                  >
                    <div className="flex items-center gap-3 flex-grow min-w-0">
                      <input
                        type="checkbox"
                        checked={t.done}
                        onChange={() => handleToggle(t)}
                        className="accent-indigo-600 w-5 h-5 flex-shrink-0"
                      />
                      <span
                        className={`text-sm truncate ${t.done ? "line-through text-gray-400" : "text-gray-800"}`}
                        onClick={() => handleToggle(t)}
                      >
                        {t.text}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="text-red-600 hover:underline text-sm flex-shrink-0"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h4 className="text-lg font-semibold text-indigo-700 mb-3">💡 Suggested Tasks:</h4>
            <div className="flex flex-wrap justify-start gap-2">
              {suggestedTasks.map(task => (
                <button
                  key={task}
                  onClick={() => handleAddSuggested(task)}
                  className="px-4 py-2 text-sm rounded-full border border-indigo-300 bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition whitespace-normal text-left"
                >
                  ➕ {task}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Todo;
