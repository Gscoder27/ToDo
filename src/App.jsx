// App.jsx
import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { TbEdit } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";

export default function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState(() => {
    try {
      const raw = localStorage.getItem("todos");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Failed to parse todos from localStorage:", e);
      return [];
    }
  });
  const [inputRows, setInputRows] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [showFinished, setShowFinished] = useState(false); // default unchecked
  const textareaRef = useRef(null);

  // persist whenever todos changes
  useEffect(() => {
    try {
      localStorage.setItem("todos", JSON.stringify(todos));
    } catch (e) {
      console.error("Failed to write todos to localStorage:", e);
    }
  }, [todos]);

  // focus textarea when entering edit mode
  useEffect(() => {
    if (editingId && textareaRef.current) {
      textareaRef.current.focus();
      // place caret at end
      const val = textareaRef.current.value;
      textareaRef.current.setSelectionRange(val.length, val.length);
    }
  }, [editingId]);

  const handleSave = () => {
    const trimmed = todo.trim();
    if (!trimmed) return;

    if (editingId) {
      setTodos((prev) =>
        prev.map((t) => (t.id === editingId ? { ...t, todo: trimmed } : t))
      );
      setEditingId(null);
    } else {
      setTodos((prev) => [
        ...prev,
        { id: uuidv4(), todo: trimmed, isCompleted: false },
      ]);
    }

    setTodo("");
    setInputRows(1);
  };

  const handleEdit = (id) => {
    const item = todos.find((t) => t.id === id);
    if (!item) return;
    setEditingId(id);
    setTodo(item.todo);
    const lines = item.todo ? item.todo.split("\n").length : 1;
    setInputRows(Math.min(Math.max(lines, 1), 10));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTodo("");
    setInputRows(1);
  };

  const handleDelete = (id) => {
    if (!id) return;
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this To-Do?"
    );
    if (confirmDelete) {
      setTodos((prev) => prev.filter((item) => item.id !== id));
      if (editingId === id) handleCancelEdit();
    }
  };

  const toggleItemCompleted = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      setInputRows((r) => Math.min(r + 1, 10));
    }
  };

  const visibleTodos = showFinished ? todos : todos.filter((t) => !t.isCompleted);

  return (
    <>
      <Navbar />
      <div className="container mx-auto w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 p-5 my-5 rounded-xl shadow-lg bg-cyan-600 text-white min-h-screen">
        <div className="addTodo my-5">
          <h2 className="text-lg font-bold text-gray-900"> Add a Task</h2>

          <div className="flex flex-col sm:flex-row items-stretch gap-2 w-full">
            <textarea
              ref={textareaRef}
              onChange={handleChange}
              value={todo}
              rows={inputRows}
              onKeyDown={handleKeyDown}
              className="bg-cyan-100 text-gray-900 flex-1 min-w-0 p-2 rounded-xl shadow-lg resize-y overflow-auto"
              placeholder="Type your task. Use Shift+Enter to expand."
              style={{ minWidth: "120px", maxWidth: "100%" }}
            />

            <div className="flex flex-col sm:flex-row gap-2 sm:items-start w-full sm:w-auto">
              <button
                onClick={handleSave}
                className="bg-blue-800 text-white font-semibold p-2 rounded-md hover:bg-purple-700 transition"
                style={{ minWidth: "64px", width: "100%" }}
              >
                {editingId ? "Update" : "Save"}
              </button>

              {editingId && (
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-300 text-gray-900 font-semibold p-2 rounded-md hover:bg-gray-400 transition"
                  style={{ width: "100%" }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900">Your To-Do's :- </h2>

          <label className="inline-flex items-center gap-2 my-3 text-gray-900">
            <input
              className="w-4 h-4"
              type="checkbox"
              checked={showFinished}
              onChange={(e) => setShowFinished(e.target.checked)}
            />
            <span className="text-sm">Show Finished To-Do's</span>
          </label>
          <hr className="border-t border-gray-300 my-3 " />
          <div className="todos">
            {visibleTodos.length === 0 && (
              <p className="text-gray-900 text-center font-semibold m-5 mt-8">
                No To-Do's Added Yet
              </p>
            )}

            {visibleTodos.map((item) => (
              <div
                key={item.id}
                className="mx-auto w-full max-w-full p-3 my-2 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-amber-100 rounded-md gap-3"
                style={{ wordBreak: "break-word" }}
              >
                <div className="flex items-start w-full sm:w-auto gap-3">
                  <input
                    onChange={() => toggleItemCompleted(item.id)}
                    type="checkbox"
                    checked={!!item.isCompleted}
                    name={item.id}
                    className="mt-1 w-4 h-4 flex-shrink-0"
                  />
                  <div
                    className={
                      (item.isCompleted ? "line-through " : "") +
                      "flex-1 text-gray-900 break-words whitespace-pre-line min-w-0"
                    }
                    style={{ wordBreak: "break-word" }}
                  >
                    {item.todo}
                  </div>
                </div>

                <div className="actions flex-shrink-0 flex gap-2 ml-auto sm:ml-0">
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="bg-blue-800 text-white p-2 rounded-md flex items-center gap-2 hover:bg-purple-700 transition"
                    aria-label="Edit task"
                  >
                    <TbEdit />
                    <span className="hidden sm:inline">Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-800 p-2 rounded-md text-white hover:bg-red-700 transition"
                    aria-label="Delete task"
                  >
                    <MdDeleteOutline />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
