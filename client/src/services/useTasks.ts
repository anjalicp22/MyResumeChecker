import { useState, useEffect } from "react";

export interface Task {
  _id: string;
  text: string;
  done: boolean;
}

const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setTasks([]); // no tasks if no token
      return;
    }
    (async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    })();
  }, [token]);

  const addTask = async (text: string) => {
    if (!text.trim() || !token) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: text.trim() }),
      });
      if (!res.ok) throw new Error("Add task failed");
      const createdTask = await res.json();
      setTasks((prev) => [...prev, createdTask]);
    } catch (err) {
      console.error("Add task failed:", err);
    }
  };

  const toggleTask = async (id: string) => {
    if (!token) return;
    const task = tasks.find((t) => t._id === id);
    if (!task) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks/${id}`, {
        method: "PUT", // <-- changed from PATCH to PUT
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ done: !task.done }),
      });
      if (!res.ok) throw new Error("Toggle task failed");
      const updatedTask = await res.json();
      setTasks((prev) => prev.map((t) => (t._id === id ? updatedTask : t)));
    } catch (err) {
      console.error("Toggle task failed:", err);
    }
  };


  const deleteTask = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete task failed");
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Delete task failed:", err);
    }
  };

  return { tasks, addTask, toggleTask, deleteTask };
};

export default useTasks;
