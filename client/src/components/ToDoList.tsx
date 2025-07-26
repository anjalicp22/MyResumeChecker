// import React, { useState, useEffect } from "react";

// interface Task {
//   id: number;
//   text: string;
//   completed: boolean;
// }

// const ToDoList: React.FC = () => {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [taskInput, setTaskInput] = useState("");

//   // Load tasks from localStorage (or replace with API fetch)
//   useEffect(() => {
//     const storedTasks = localStorage.getItem("tasks");
//     if (storedTasks) {
//       setTasks(JSON.parse(storedTasks));
//     }
//   }, []);

//   // Save tasks to localStorage whenever tasks change (replace with API save)
//   useEffect(() => {
//     localStorage.setItem("tasks", JSON.stringify(tasks));
//   }, [tasks]);

//   const addTask = () => {
//     if (taskInput.trim() === "") return;
//     const newTask: Task = {
//       id: Date.now(),
//       text: taskInput.trim(),
//       completed: false,
//     };
//     setTasks([...tasks, newTask]);
//     setTaskInput("");
//   };

//   const toggleComplete = (id: number) => {
//     setTasks(tasks.map(task =>
//       task.id === id ? { ...task, completed: !task.completed } : task
//     ));
//   };

//   const deleteTask = (id: number) => {
//     setTasks(tasks.filter(task => task.id !== id));
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       addTask();
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
//       <h2 className="text-xl font-semibold mb-4 text-indigo-600">To-Do List</h2>

//       <div className="flex mb-4">
//         <input
//           type="text"
//           placeholder="Add new task"
//           value={taskInput}
//           onChange={(e) => setTaskInput(e.target.value)}
//           onKeyDown={handleKeyDown}
//           className="flex-grow border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         />
//         <button
//           onClick={addTask}
//           className="bg-indigo-600 text-white px-4 py-2 rounded-r hover:bg-indigo-700"
//         >
//           Add
//         </button>
//       </div>

//       <ul>
//         {tasks.length === 0 && (
//           <li className="text-gray-500">No tasks yet. Add one above!</li>
//         )}
//         {tasks.map(({ id, text, completed }) => (
//           <li
//             key={id}
//             className="flex items-center justify-between mb-2"
//           >
//             <label className="flex items-center space-x-2 cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={completed}
//                 onChange={() => toggleComplete(id)}
//                 className="form-checkbox text-indigo-600"
//               />
//               <span className={completed ? "line-through text-gray-400" : ""}>
//                 {text}
//               </span>
//             </label>
//             <button
//               onClick={() => deleteTask(id)}
//               className="text-red-500 hover:text-red-700 font-bold"
//               aria-label={`Delete task ${text}`}
//             >
//               &times;
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ToDoList;