import React, { useState, useEffect } from 'react';
import Header from './components/header';

// Define Task interface
interface Task {
  id: string;
  text: string;
  completed: boolean;
  category: string;
  dueDate: string | null;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

function ToDoList() {
  // Load tasks from localStorage or use default tasks
  const loadStoredTasks = (): Task[] => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      return JSON.parse(storedTasks);
    }
    return [
      { 
        id: '1', 
        text: "Eat Breakfast", 
        completed: false, 
        category: "personal", 
        dueDate: null, 
        priority: "medium",
        createdAt: new Date()
      },
      { 
        id: '2', 
        text: "Take a Shower", 
        completed: false, 
        category: "personal", 
        dueDate: null, 
        priority: "low",
        createdAt: new Date() 
      },
      { 
        id: '3', 
        text: "Listen to Spotify", 
        completed: false, 
        category: "leisure", 
        dueDate: null, 
        priority: "low",
        createdAt: new Date() 
      },
    ];
  };

  const [tasks, setTasks] = useState<Task[]>(loadStoredTasks);
  const [newTask, setNewTask] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [newTaskCategory, setNewTaskCategory] = useState<string>("personal");
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>("medium");
  const [newTaskDueDate, setNewTaskDueDate] = useState<string>("");
    
    // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  // Handle input changes
  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNewTask(event.target.value);
  }
  
  // Handle search
  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value);
  }
  
  // Handle category selection
  function handleCategoryChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setNewTaskCategory(event.target.value);
  }
  
  // Handle priority selection
  function handlePriorityChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setNewTaskPriority(event.target.value as 'low' | 'medium' | 'high');
  }
  
  // Handle due date selection
  function handleDueDateChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNewTaskDueDate(event.target.value);
  }
  
  // Add new task
  function addTask() {
    if (newTask.trim() !== "") {
      const newTaskObject: Task = {
        id: Date.now().toString(),
        text: newTask,
        completed: false,
        category: newTaskCategory,
        dueDate: newTaskDueDate || null,
        priority: newTaskPriority,
        createdAt: new Date()
      };
      
      setTasks(currentTasks => [...currentTasks, newTaskObject]);
      setNewTask(""); // Clear the input field after adding the task
      setNewTaskDueDate(""); // Reset due date
    }
  }
  
  // Handle task completion toggle
  function toggleTaskCompletion(id: string) {
    setTasks(currentTasks =>
      currentTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }
  
  // Delete task
  function deleteTask(id: string) {
    setTasks(currentTasks => currentTasks.filter(task => task.id !== id));
  }
  
  // Move task up
  function moveTaskUp(index: number) {
    if (index > 0) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index - 1]] = [updatedTasks[index - 1], updatedTasks[index]];
      setTasks(updatedTasks);
    }
  }
  
  // Move task down
  function moveTaskDown(index: number) {
    if (index < tasks.length - 1) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index + 1]] = [updatedTasks[index + 1], updatedTasks[index]];
      setTasks(updatedTasks);
    }
  }
  
  // Filter tasks based on selected filters
  const filteredTasks = tasks
    .filter(task => {
      // Filter by status
      if (filterStatus === "completed") return task.completed;
      if (filterStatus === "active") return !task.completed;
      return true; // "all"
    })
    .filter(task => {
      // Filter by category
      if (filterCategory === "all") return true;
      return task.category === filterCategory;
    })
    .filter(task => {
      // Filter by priority
      if (filterPriority === "all") return true;
      return task.priority === filterPriority;
    })
    .filter(task => {
      // Filter by search term
      if (!searchTerm) return true;
      return task.text.toLowerCase().includes(searchTerm.toLowerCase());
    });
    
  // Helper function to get color based on priority
  const getPriorityColor = (priority: 'low' | 'medium' | 'high'): string => {
    switch(priority) {
      case 'high':
        return 'bg-red-50';
      case 'medium':
        return 'bg-yellow-50';
      case 'low':
        return 'bg-green-50';
      default:
        return 'bg-white';
    }
  };  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-white px-4 py-8">
      <div className='todo-list w-full max-w-3xl'>
        <h1 className='mb-8 text-3xl font-bold text-center'>To Do List</h1>
        <Header />
        
        {/* Task Input Section */}
        <div className="flex flex-col space-y-4 mb-6">
          <div className="flex w-full mb-4">
            <label htmlFor="task-input" className="sr-only">Enter a new task</label>
            <input
              id="task-input"
              type="text"
              placeholder='Enter a new task...'
              value={newTask}
              onChange={handleInputChange}
              className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
            />
            <button
              aria-label="Add new task"
              className='add-button ml-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center font-medium text-lg shadow-md'
              onClick={addTask}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add
            </button>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {/* Category Selection */}
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select 
                id="category-select"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={newTaskCategory}
                onChange={handleCategoryChange}
              >
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="study">Study</option>
                <option value="leisure">Leisure</option>
                <option value="health">Health</option>
              </select>
            </div>
            
            {/* Priority Selection */}
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="priority-select" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select 
                id="priority-select"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={newTaskPriority}
                onChange={handlePriorityChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            {/* Due Date */}
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="due-date" className="block text-sm font-medium text-gray-700 mb-1">Due Date (optional)</label>
              <input 
                id="due-date"
                type="date"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={newTaskDueDate}
                onChange={handleDueDateChange}
              />
            </div>
          </div>
        </div>
        
        {/* Search and Filter */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-1">Search Tasks</label>
              <input
                id="search-input" 
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                id="status-filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                id="category-filter"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="all">All Categories</option>
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="study">Study</option>
                <option value="leisure">Leisure</option>
                <option value="health">Health</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                id="priority-filter"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Task List */}
        <div className="mt-6">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-xl">No tasks found</p>
              <p className="mt-2">Add a new task or change your filters</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {filteredTasks.map((task, index) => (                <li 
                  key={task.id} 
                  className={`flex items-center justify-between p-4 rounded-lg shadow-sm transition-all ${
                    task.completed ? 'bg-gray-100' : getPriorityColor(task.priority)
                  }`}
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="flex flex-col items-center mr-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTaskCompletion(task.id)}
                        className="h-6 w-6 text-blue-600 rounded"
                      />
                      {!task.completed && (
                        <div 
                          className={`w-3 h-3 rounded-full mt-1 ${
                            task.priority === 'high' ? 'bg-red-400' : 
                            task.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                          }`} 
                          title={`${task.priority} priority`}                        ></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : ''} truncate`}>
                        {task.text}
                      </p>
                      <div className="flex flex-wrap items-center mt-1 text-xs text-gray-600 space-x-2">
                        <span className="bg-gray-200 px-2 py-1 rounded-full capitalize">{task.category}</span>
                        {task.dueDate && (
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      aria-label="Move task up"
                      className="p-1.5 text-gray-600 hover:bg-gray-200 rounded-full"
                      onClick={() => moveTaskUp(index)}
                      disabled={index === 0}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    <button
                      aria-label="Move task down"
                      className="p-1.5 text-gray-600 hover:bg-gray-200 rounded-full"
                      onClick={() => moveTaskDown(index)}
                      disabled={index === filteredTasks.length - 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    <button
                      aria-label="Delete task"
                      className="p-1.5 text-red-600 hover:bg-red-100 rounded-full"
                      onClick={() => deleteTask(task.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
            {/* Priority Color Legend */}
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Priority Colors:</h3>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-50 rounded mr-1 border border-gray-200"></div>
                <span className="text-xs text-gray-600">High</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-50 rounded mr-1 border border-gray-200"></div>
                <span className="text-xs text-gray-600">Medium</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-50 rounded mr-1 border border-gray-200"></div>
                <span className="text-xs text-gray-600">Low</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-100 rounded mr-1 border border-gray-200"></div>
                <span className="text-xs text-gray-600">Completed</span>
              </div>
            </div>
          </div>
          
          {/* Task Summary */}
          <div className="mt-4 bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">
              {filteredTasks.filter(t => !t.completed).length} tasks remaining • {filteredTasks.filter(t => t.completed).length} completed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ToDoList;








