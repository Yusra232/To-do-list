import './App.css';
import { useState } from 'react';
import { PlusCircle } from 'lucide-react';// 圖示，要先安裝 npm install lucide-react

const App = () => {
 // 🧠 狀態區塊
  const [newTask, setNewTask] = useState(''); // 輸入框文字
  const [tasks, setTasks] = useState([]); // 任務清單
  const [editingId, setEditingId] = useState(null); // 編輯中任務的 id
  const [editingText, setEditingText] = useState(''); // 編輯文字內容
  const [searchTerm, setSearchTerm] = useState(''); // 搜尋文字
  const [filter, setFilter] = useState('all'); // 任務分類: 'all', 'active', 'completed'

   // ✨ 新增任務
  const handleAddTask = () => {
    if (!newTask.trim()) return;
    const newItem = {
      id: Date.now(),
      text: newTask,
      completed: false,
    };
    setTasks([...tasks, newItem]);
    setNewTask('');
  };

  // 🗑 刪除任務
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditingText('');
    }
  };

   // ✅ 切換完成狀態
  const handleToggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // 編輯
  const handleEditTask = (task) => {
    setEditingId(task.id);
    setEditingText(task.text);
  };

  const handleSaveEdit = (id) => {
    if (!editingText.trim()) return;
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, text: editingText } : task
      )
    );
    setEditingId(null);
    setEditingText('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  // 🔍 根據搜尋文字過濾
  const filteredTasks = tasks.filter((task) =>
    task.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🗂 根據分類過濾
  const displayedTasks = filteredTasks.filter((task) => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
  });

  // 🟢 待處理任務數量
  const activeCount = tasks.filter((task) => !task.completed).length;

   // 🎨 UI
  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 p-8 font-sans h-screen w-screen">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">To do list</h1>

      {/* 頂部區塊：新增任務 + 下拉 */}
      <div className="flex flex-col w-full max-w-md space-y-4">
        {/* 第一列：新增任務 + 按鈕 + 下拉選單 */}
        <div className="flex w-full justify-between items-center space-x-4">
          {/* 左側：新增任務 + 按鈕 */}
          <div className="flex flex-1 items-center space-x-2">
            <input
              type="text"
              placeholder="請輸入新任務..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              className="flex-1 h-10 rounded-xl border border-gray-300 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 hover:shadow-md"
            />
            <button
              onClick={handleAddTask}
              className="h-10 flex items-center gap-2 px-5 bg-blue-500 text-gray-700 rounded-xl shadow-md hover:bg-blue-600 hover:shadow-lg whitespace-nowrap"
            >
              <PlusCircle className="size-4" />
              新增
            </button>
          </div>

          {/* 右側：下拉選單 */}
          <div className="w-36">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="h-10 w-full rounded-xl border border-gray-300 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 hover:shadow-md"
            >
              <option value="all">全部</option>
              <option value="active">待處理 ({activeCount})</option>
              <option value="completed">已完成</option>
            </select>
          </div>
        </div>

        {/* 第二列：搜尋框 */}
        <input
          type="text"
          placeholder="搜尋任務..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-10 rounded-xl border border-gray-300 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 hover:shadow-md"
        />
      </div>

      {/* 任務清單 */}
      <ul className="w-full max-w-md space-y-3 mt-4">
        {displayedTasks.map((task) => (
          <li
            key={task.id}
            className={`flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-sm transition hover:shadow-md ${
              task.completed && editingId !== task.id
                ? 'opacity-70 line-through text-gray-500'
                : ''
            }`}
          >
            {editingId === task.id ? (
              <div className="flex flex-1 items-center space-x-2">
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="flex-1 rounded border border-gray-300 py-1 px-2 outline-none transition focus:ring-2 focus:ring-blue-100"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit(task.id);
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                />
                <button
                  onClick={() => handleSaveEdit(task.id)}
                  className="text-green-500 hover:text-green-700 transition"
                >
                  💾
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  ✕
                </button>
              </div>
            ) : (
              <>
                <span
                  className="cursor-pointer flex-1"
                  onClick={() => handleToggleComplete(task.id)}
                >
                  {task.text}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditTask(task)}
                    className="text-blue-500 hover:text-blue-700 transition"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    ✕
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
        {displayedTasks.length === 0 && (
          <p className="text-gray-400 text-center">目前沒有任務</p>
        )}
      </ul>
    </div>
  );
};

export default App;
