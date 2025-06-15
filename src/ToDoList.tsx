import React, { useState } from 'react';
import Header from './components/header';
function ToDoList() {

   const [tasks, setTask] = useState<string[]>(["Eat Breakfast", "Take a Shower", "Listen to Spotify"]);
    const [newtask, setNewTask] = useState<string>("");
    
    
    function handleinputChange(event:React.ChangeEvent<HTMLInputElement>) {
        setNewTask(event.target.value);
    }
    
    function addTask() {

        if(newtask.trim() !== "") {
             setTask(t =>[...tasks, newtask]);
        setNewTask(""); // Clear the input field after adding the task
        }
       
    }

function deleteTask(index:number) {
      const updatedTasks = tasks.filter((element, i) => i !== index);  
        setTask(updatedTasks);
    }       

    function moveTaskUp(index:number) {

        if(index > 0){
                const updatedTasks = [...tasks];
                [updatedTasks[index], updatedTasks[index - 1]] =  [updatedTasks[index - 1], updatedTasks[index]];
                setTask(updatedTasks);
            }
    }   

    function moveTaskDown(index:number) {
            
         if(index < tasks.length - 1) {
                const updatedTasks = [...tasks];
                [updatedTasks[index], updatedTasks[index + 1]] =  [updatedTasks[index + 1], updatedTasks[index]];
                setTask(updatedTasks);
            }
    }  

     return (
      <div className="flex flex-col items-center justify-start min-h-screen bg-white">
         <div className='todo-list w-full max-w-md'>
        
            <h1 className='mb-10 text-2xl font-bold text-center'>To Do List</h1>
            <Header />
            <div className="flex w-full mb-4">
               <input
                  type="text"
                  placeholder='Enter a new task....'
                  value={newtask}
                  onChange={handleinputChange}
                  className="flex-1 border rounded-2xl px-2 py-1"
               />
               <button
                  className='add-button ml-4 px-4 py-1 bg-blue-500 text-white rounded'
                  onClick={addTask}>
                  Add
               </button>
            </div>
            <ol className='mt-4 list-decimal pl-5'>
  {tasks.map((task: string, index: number) =>
    <li key={index} className=" items-center justify-between mb-2 text-xl flex bg-gray-100 p-2 rounded">
      <span className="text flex-1 font-bold text-gray-800">{task}</span>
      <button className='delete-button ml-2 px-1 py-0.5 bg-red-500 text-white rounded hover:bg-blue-300 '
      onClick={() => deleteTask(index)}>
        delete
      </button>

      <button className='Up-button ml-2 px-1 py-2 bg-cyan-500 text-white rounded text-xs hover:bg-blue-300'
      onClick={() => moveTaskUp(index)}>
        ☝️
      </button>


      <button className='Up-button ml-2 px-1 py-2 bg-cyan-500 text-white rounded text-xs hover:bg-blue-300'
      onClick={() => moveTaskDown(index)}>
        👇
      </button>
    </li>
  )}
</ol>
         </div>
      </div>
   );
}
export default ToDoList;








