// client\src\pages\Todo.tsx
import React, { useState } from "react";
import useTasks, { Task } from "../services/useTasks";
import { toast } from "react-toastify";
import Tooltip from "../components/Tooltip";

const suggestedTasks = [
  "Update your resume",
  "Practice common interview questions",
  "Research companies you're applying to",
];

const Todo = () => {
  const { tasks, addTask, toggleTask, deleteTask } = useTasks();
  const [newTask, setNewTask] = useState("");

  const handleAddTask = async () => {
    if (newTask.trim() === "") return;
    await addTask(newTask);
    toast.success("Task added!");
    console.log("Task Added:", newTask);
    setNewTask("");
  };

  const handleAddSuggestedTask = (text: string) => {
    if (tasks.find((t) => t.text === text)) return;
    addTask(text);
    toast.success(`Suggested task added: ${text}`);
    console.log("Suggested Task Added:", text);
  };

  const handleToggleTask = (id: string) => {
    toggleTask(id);
    const updatedTask = tasks.find((task) => task._id === id);
    toast.success(
      updatedTask?.done
        ? `Task marked as incomplete`
        : `Task marked as complete`
    );
    console.log("Toggled Task:", id);
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    toast.error("Task deleted!");
    console.log("Deleted Task:", id);
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-[1100px] mx-auto w-full space-y-8">
        <div className="flex items-center gap-2 mb-6">
            <h2 className="text-3xl font-bold text-indigo-800">
              📝 Full To-Do List
            </h2>
            <Tooltip content="This section helps you manage job-related tasks like updating resumes, preparing for interviews, and more.">
              <span className="w-5 h-5 text-xs bg-indigo-800 text-white rounded-full inline-flex justify-center items-center cursor-default">
                ?
              </span>
            </Tooltip>
          </div>



        <section className="bg-white p-6 rounded-2xl shadow-md space-y-6">
          {/* Add Task */}
          
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              placeholder="Add a new task..."
              className="border px-4 py-2 rounded-lg flex-grow focus:ring-2 ring-indigo-400"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            />
            <button
              onClick={handleAddTask}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Add
            </button>
          </div>
          
          {/* Task List */}
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {tasks.length === 0 ? (
              <p className="text-gray-500 italic">No tasks yet. Add your first task above ⬆️</p>
            ) : (
              <ul className="space-y-3">
                {tasks.map((task: Task) => (
                  <li
                    key={task._id}
                    className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100"
                  >
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => handleToggleTask(task._id)}
                      className="accent-indigo-600 w-5 h-5"
                    />
                    <span
                      className={`flex-grow text-sm ${
                        task.done ? "line-through text-gray-400" : "text-gray-800"
                      } cursor-pointer`}
                      onClick={() => handleToggleTask(task._id)}
                    >
                      {task.text}
                    </span>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Suggested Tasks */}
          <div>
            <h4 className="font-semibold text-indigo-700 mb-3 text-lg">💡 Suggested Tasks:</h4>
            <div className="flex flex-wrap gap-2">
              {suggestedTasks.map((task) => (
                <button
                  key={task}
                  onClick={() => handleAddSuggestedTask(task)}
                  className="px-3 py-1 text-sm rounded-full border border-indigo-300 bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition"
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
