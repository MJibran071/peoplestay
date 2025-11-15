import React, { useState } from 'react';
import { Calendar, CheckSquare, Clock, User } from 'lucide-react';
import { mockTasks } from '../constants';
import type { Task } from '../types';

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [filter, setFilter] = useState<'All' | 'To Do' | 'In Progress' | 'Done'>('All');

  const filteredTasks = tasks.filter(task => filter === 'All' || task.status === filter);

  const getStatusInfo = (status: Task['status']) => {
    switch (status) {
      case 'To Do':
        return { color: 'bg-yellow-100 text-yellow-700', icon: Clock, borderColor: 'border-yellow-400' };
      case 'In Progress':
        return { color: 'bg-blue-100 text-blue-700', icon: Clock, borderColor: 'border-blue-400' };
      case 'Done':
        return { color: 'bg-green-100 text-green-700', icon: CheckSquare, borderColor: 'border-green-500' };
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Property Tasks</h1>
        <p className="text-slate-500 mt-1">Manage cleaning, maintenance, and other operational tasks.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2 className="text-xl font-bold text-slate-800">Task List</h2>
            <div className="flex space-x-1 bg-zinc-100 p-1 rounded-lg">
                {(['All', 'To Do', 'In Progress', 'Done'] as const).map(f => (
                    <button 
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${filter === f ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-600 hover:bg-zinc-200/60'}`}
                    >
                        {f}
                    </button>
                ))}
            </div>
        </div>

        <div className="space-y-4">
          {filteredTasks.map((task) => {
            const statusInfo = getStatusInfo(task.status);
            return (
              <div key={task.id} className={`p-5 bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300 border-l-4 ${statusInfo.borderColor}`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                        <h3 className="font-bold text-slate-800 text-lg">{task.title}</h3>
                        <p className="text-sm text-slate-500 mt-1">{task.property}</p>
                    </div>
                    <div className="flex items-center text-sm text-slate-500 gap-4 sm:gap-6 flex-wrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color} order-first sm:order-none`}>{task.status}</span>
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1.5 text-slate-400" />
                            <span className="font-medium">Due:</span>&nbsp;{task.dueDate}
                        </div>
                        <div className="flex items-center">
                            <img
                                src={`https://i.pravatar.cc/150?u=${task.assignee.replace(/\s/g, '')}`}
                                alt={task.assignee}
                                className="w-6 h-6 rounded-full mr-2 border"
                            />
                           <span className="font-medium">{task.assignee}</span>
                        </div>
                    </div>
                </div>
              </div>
            );
          })}
           {filteredTasks.length === 0 && (
            <div className="text-center py-10">
                <p className="text-slate-500">No tasks found for this filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;