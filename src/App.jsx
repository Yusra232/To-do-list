import './App.css';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react'; // 圖示，要先安裝 npm install lucide-react

const App = () => {
  // 🧠 狀態區塊
  const [newTask, setNewTask] = useState(''); // 輸入框文字
  const [tasks, setTasks] = useState([]); // 任務清單（每個任務是物件）
  const [editingId, setEditingId] = useState(null); // 編輯中任務的 id
  const [editingText, setEditingText] = useState(''); // 編輯文字內容
  const [searchTerm, setSearchTerm] = useState(''); // 🔍 新增搜尋關鍵字 state

  // ✨ 新增任務
  const handleAddTask = () => {
    if (!newTask.trim()) return; // 防止空白輸入
    const newItem = {
      id: Date.now(), // 用時間戳當唯一 ID
      text: newTask,
      completed: false, // 初始為未完成
    };
    setTasks([...tasks, newItem]); // 加入清單
    setNewTask(''); // 清空輸入框
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
  // 開始編輯
  const handleEditTask = (task) => {
    setEditingId(task.id);
    setEditingText(task.text);
  };

  // 儲存編輯
  const handleSaveEdit = (id) => {
    if (!editingText.trim()) return; // 空白不存
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, text: editingText } : task
      )
    );
    setEditingId(null);
    setEditingText('');
  };

  // 取消編輯
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  // 🔍 根據搜尋文字過濾任務
  const filteredTasks = tasks.filter((task) =>
    task.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🎨 UI
  return (
    <div className='flex min-h-screen flex-col items-center bg-gray-50 p-8 font-sans h-screen w-screen'>
      {/* 標題 */}
      <h1 className='mb-6 text-3xl font-bold text-gray-800'>To do list</h1>

      {/* 輸入框 + 按鈕 */}
      <div className='flex w-full max-w-md items-center space-x-2 mb-6'>
        {/* 輸入框 */}
        <input
          type='text'
          placeholder='請輸入新任務...'
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTask()} // 按 Enter 也能送出
          className='flex-1 rounded-xl border border-gray-300 bg-white py-2 px-4 text-gray-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
        />

        {/* 新增按鈕 */}
        <button
          onClick={handleAddTask}
          className='flex items-center gap-1 rounded-xl bg-blue-500 px-4 py-2 text-gray-700 shadow-md transition hover:bg-blue-600'
        >
          <PlusCircle className='size-4' />
          新增
        </button>
      </div>

      {/* 🔍 搜尋框 */}
      <input
        type='text'
        placeholder='搜尋任務...'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className='border rounded px-2 py-1 mb-4 w-full max-w-md'
      />

      {/* 任務清單 */}
      <ul className='w-full max-w-md space-y-3'>
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className={`flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-sm ${
              task.completed && editingId !== task.id
                ? 'opacity-70 line-through text-gray-500'
                : ''
            }`}
          >
            {editingId === task.id ? (
              // 編輯模式
              <div className='flex flex-1 items-center space-x-2'>
                <input
                  type='text'
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className='flex-1 rounded border border-gray-300 py-1 px-2 outline-none'
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit(task.id);
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                />
                <button
                  onClick={() => handleSaveEdit(task.id)}
                  className='text-green-500 hover:text-green-700'
                >
                  💾
                </button>
                <button
                  onClick={handleCancelEdit}
                  className='text-gray-500 hover:text-gray-700'
                >
                  ✕
                </button>
              </div>
            ) : (
              // 非編輯模式
              <>
                <span
                  className='cursor-pointer flex-1'
                  onClick={() => handleToggleComplete(task.id)}
                >
                  {task.text}
                </span>
                <div className='flex space-x-2'>
                  <button
                    onClick={() => handleEditTask(task)}
                    className='text-blue-500 hover:text-blue-700'
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className='text-red-500 hover:text-red-700'
                  >
                    ✕
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
        {tasks.length === 0 && (
          <p className='text-gray-400 text-center'>目前沒有任務</p>
        )}
      </ul>
    </div>
  );
};

export default App;
