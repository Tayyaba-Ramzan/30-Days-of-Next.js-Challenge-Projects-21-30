"use client";

import { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash, Edit, Plus } from "lucide-react";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export default function ProTodoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editedTaskText, setEditedTaskText] = useState<string>("");
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  useEffect(() => {
    setIsMounted(true);
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks) as Task[]);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, isMounted]);

  const addTask = (): void => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask("");
    }
  };

  const toggleTaskCompletion = (id: number): void => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const startEditingTask = (id: number, text: string): void => {
    setEditingTaskId(id);
    setEditedTaskText(text);
  };

  const updateTask = (): void => {
    if (editedTaskText.trim() !== "") {
      setTasks(tasks.map(task => task.id === editingTaskId ? { ...task, text: editedTaskText } : task));
      setEditingTaskId(null);
      setEditedTaskText("");
    }
  };

  const deleteTask = (id: number): void => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => 
    filter === 'all' ? true : filter === 'completed' ? task.completed : !task.completed
  );

  if (!isMounted) return null;

  return (
    <div 
    className="flex items-center justify-center min-h-screen p-4"
            style={{
               backgroundImage: 'url("img.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
    >
      <div className="w-full max-w-md bg-transparent dark:bg-gray-800 shadow-lg rounded-lg p-6 border border-none 	
">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 italic text-center underline">Todo List</h1>
        <div className="flex items-center mb-4">
          <Input
            type="text"
            placeholder="Add a new task"
            value={newTask}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTask(e.target.value)}
            className="flex-1 mr-2 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          />
          <Button onClick={addTask} className="bg-yellow-300 hover:bg-yellow-400 text-black font-medium py-2 px-4 rounded-md flex items-center">
            <Plus className="w-5 h-5 mr-1" /> Add
          </Button>
        </div>
        <div className="flex justify-between mb-4">
          <Button onClick={() => setFilter('all')} className="text-sm px-2 py-1 rounded-md bg-yellow-300 hover:bg-yellow-400 text-black">All</Button>
          <Button onClick={() => setFilter('completed')} className="text-sm px-2 py-1 rounded-md bg-yellow-300 hover:bg-yellow-400 text-black">Completed</Button>
          <Button onClick={() => setFilter('pending')} className="text-sm px-2 py-1 rounded-md bg-yellow-300 hover:bg-yellow-400 text-black">Pending</Button>
        </div>
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between bg-yellow-100 hover:bg-yellow-200 text-black rounded-md px-4 py-2">
              <div className="flex items-center">
                <Checkbox checked={task.completed} className="mr-2" onCheckedChange={() => toggleTaskCompletion(task.id)} />
                {editingTaskId === task.id ? (
                  <Input
                    type="text"
                    value={editedTaskText}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEditedTaskText(e.target.value)}
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && updateTask()}
                    className="flex-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                  />
                ) : (
                  <span className={`flex-1 text-gray-800 dark:text-gray-200 ${task.completed ? "line-through text-gray-500 dark:text-gray-400" : ""}`}>{task.text}</span>
                )}
              </div>
              <div className="flex items-center">
                {editingTaskId === task.id ? (
                  <Button onClick={updateTask} className="bg-yellow-300 hover:bg-yellow-400 text-black font-medium py-1 px-2 rounded-md mr-2">Save</Button>
                ) : (
                  <Button onClick={() => startEditingTask(task.id, task.text)} className="bg-yellow-300 hover:bg-yellow-400 text-black font-medium py-1 px-2 rounded-md mr-2">
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
                <Button onClick={() => deleteTask(task.id)} className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-2 rounded-md">
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
