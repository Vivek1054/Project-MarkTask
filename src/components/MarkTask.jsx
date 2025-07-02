import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function MarkTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [remind, setRemind] = useState(true);
  const [todos, setTodos] = useState([]);
  const [deletedTasks, setDeletedTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showDoneTask, setShowDoneTask] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  // Load on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('todos'));
    const history = JSON.parse(localStorage.getItem('deleted'));
    const done = JSON.parse(localStorage.getItem('completed'));
    if (saved) setTodos(saved);
    if (history) setDeletedTasks(history);
    if (done) setCompletedTasks(done);
  }, []);

  // Save changes
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('deleted', JSON.stringify(deletedTasks));
    localStorage.setItem('completed', JSON.stringify(completedTasks));
  }, [todos, deletedTasks, completedTasks]);

  // Theme
  useEffect(() => {
    const root = document.documentElement;
    darkMode ? root.classList.add('dark') : root.classList.remove('dark');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const addTask = () => {
    if (!title.trim()) return;
    const createdAt = new Date().toLocaleString();

    const newTask = {
      id: Date.now(),
      title,
      description,
      duration: duration ? parseInt(duration) : null,
      remind,
      completed: false,
      createdAt,
    };

    setTodos([...todos, newTask]);

    if (remind && duration) {
      setTimeout(() => {
        alert(`⏰ Reminder: Time's up for "${title}" task!`);
      }, parseInt(duration) * 60000);
    }

    setTitle('');
    setDescription('');
    setDuration('');
    setRemind(true);
  };

  const toggleComplete = (index) => {
    const updated = [...todos];
    const task = updated[index];
    task.completed = !task.completed;

    if (task.completed) {
      task.completedAt = new Date().toLocaleString();
      setCompletedTasks([...completedTasks, task]);
      alert(`✅ Task "${task.title}" marked as completed!`);
    } else {
      setCompletedTasks(completedTasks.filter((t) => t.id !== task.id));
    }

    setTodos(updated);
  };

  const deleteTask = (index) => {
    const deletedAt = new Date().toLocaleString();
    const deletedTask = { ...todos[index], deletedAt };
    setDeletedTasks([...deletedTasks, deletedTask]);
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 transition-colors duration-500">
      <div className="w-full max-w-xl bg-white dark:bg-gray-900 dark:text-white p-6 rounded-2xl shadow-2xl">

        {/* Header */}
        <div className="flex gap-2 justify-between">
          <h1 className="text-2xl font-bold animate-pulse font-fancy">📝 Smart To-Do List</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-sm px-3 py-1 border rounded-full transform hover:bg-indigo-500 hover:text-white hover:scale-110 active:scale-90"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-4 mt-4">
          <div className="flex gap-2 p-5 flex-wrap">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-sm px-3 mr-5 py-1 border rounded-full hover:bg-purple-500 hover:text-white transform hover:scale-110 active:scale-90"
            >
              {showHistory ? 'Hide Deleted' : 'View Deleted'}
            </button>
            <button
              onClick={() => setShowDoneTask(!showDoneTask)}
              className="text-sm px-3 py-1 border rounded-full hover:bg-green-500 hover:text-white transform hover:scale-110 active:scale-90"
            >
              {showDoneTask ? 'Hide Completed' : 'View Completed'}
            </button>
          </div>
        </div>

        {/* Add Task */}
        <motion.div className="grid gap-2 mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          <motion.input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className="px-4 py-2 rounded-xl border dark:bg-gray-800 dark:border-gray-700 focus:outline-none"
            whileFocus={{ scale: 1.05 }}
          />
          <motion.textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task description"
            className="px-4 py-2 rounded-xl border dark:bg-gray-800 dark:border-gray-700 focus:outline-none"
            rows="2"
            whileFocus={{ scale: 1.05 }}
          />
          <motion.div className="flex gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Time (minutes)"
              className="flex-1 px-4 py-2 rounded-xl border dark:bg-gray-800 dark:border-gray-700 focus:outline-none"
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={remind}
                onChange={() => setRemind(!remind)}
              />
              Reminder
            </label>
          </motion.div>
          <motion.button
            onClick={addTask}
            className="bg-sky-600 transform hover:bg-indigo-700 text-white px-4 py-2 rounded-xl m-5"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Task
          </motion.button>
        </motion.div>

        {/* Active Tasks */}
        <h2 className="text-lg font-semibold mb-2">Active Tasks</h2>
        <ul className="space-y-2">
          <AnimatePresence>
            {todos.map((task, index) => (
              <motion.li
                key={task.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl shadow flex justify-between items-center"
              >
                <div>
                  <div className="font-semibold">{task.title}</div>
                  <div className="text-sm italic">{task.description}</div>
                  <div className="text-xs text-gray-500">🕒 {task.createdAt}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleComplete(index)} className="text-green-600 text-xs">✅</button>
                  <button onClick={() => deleteTask(index)} className="text-red-600 text-xs">🗑️</button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {/* Completed Tasks */}
        {showDoneTask && (
          <>
            <h2 className="text-lg font-semibold mt-6">✅ Completed Tasks</h2>
            <ul className="space-y-2">
              {completedTasks.map((task) => (
                <li key={task.id} className="bg-green-100 dark:bg-green-700 p-4 rounded-xl shadow">
                  <div className="font-semibold">{task.title}</div>
                  <div className="text-sm italic">{task.description}</div>
                  <div className="text-xs text-gray-500">✅ {task.completedAt}</div>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Deleted Tasks */}
        {showHistory && (
          <>
            <h2 className="text-lg font-semibold mt-6">🗑️ Deleted Tasks</h2>
            <ul className="space-y-2">
              {deletedTasks.map((task) => (
                <li key={task.id} className="bg-red-100 dark:bg-red-700 p-4 rounded-xl shadow">
                  <div className="font-semibold">{task.title}</div>
                  <div className="text-sm italic">{task.description}</div>
                  <div className="text-xs text-gray-500">🗑️ {task.deletedAt}</div>
                </li>
              ))}
            </ul>
          </>
        )}

      </div>
    </div>
  );
}

export default MarkTask;
