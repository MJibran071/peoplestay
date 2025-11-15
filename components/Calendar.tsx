import React, { useState, useMemo } from 'react';
// FIX: Import Calendar icon with an alias to avoid naming conflict with the component.
import { ChevronLeft, ChevronRight, BedDouble, ListChecks, X, Calendar as CalendarIcon } from 'lucide-react';
import { mockBookings, mockTasks } from '../constants';
import type { Booking, Task } from '../types';

type CalendarEvent = 
  | { type: 'booking'; data: Booking }
  | { type: 'task'; data: Task };

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const daysInMonth = useMemo(() => {
    const days = [];
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    for (let i = 0; i < 42; i++) {
      days.push(new Date(startDate));
      startDate.setDate(startDate.getDate() + 1);
    }
    return days;
  }, [firstDayOfMonth]);
  
  const eventsByDate = useMemo(() => {
    const events: { [key: string]: CalendarEvent[] } = {};
    
    mockBookings.forEach(booking => {
      let currentDate = new Date(booking.checkIn);
      const endDate = new Date(booking.checkOut);
      while(currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        if(!events[dateStr]) events[dateStr] = [];
        events[dateStr].push({ type: 'booking', data: booking });
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    mockTasks.forEach(task => {
        const dateStr = new Date(task.dueDate).toISOString().split('T')[0];
        if(!events[dateStr]) events[dateStr] = [];
        events[dateStr].push({ type: 'task', data: task });
    });

    return events;
  }, []);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };
  
  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
  };

  const getBookingStatusColor = (status: Booking['status']) => {
    switch(status) {
        case 'Confirmed': return 'bg-green-500';
        case 'Pending': return 'bg-yellow-500';
        case 'Cancelled': return 'bg-red-500';
    }
  }

  const selectedDayEvents = selectedDate ? eventsByDate[selectedDate.toISOString().split('T')[0]] || [] : [];

  return (
    <div className="flex h-[calc(100vh-10rem)] bg-white rounded-2xl shadow-md overflow-hidden">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
                <button onClick={handleToday} className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Today</button>
                <button onClick={handlePrevMonth} className="p-2 text-slate-500 rounded-full hover:bg-slate-100"><ChevronLeft className="w-5 h-5" /></button>
                <button onClick={handleNextMonth} className="p-2 text-slate-500 rounded-full hover:bg-slate-100"><ChevronRight className="w-5 h-5" /></button>
            </div>
            <h2 className="text-xl font-bold text-slate-800">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
        </div>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 flex-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-sm text-slate-500 py-3 border-b border-r border-slate-200">{day}</div>
          ))}
          {daysInMonth.map((day, index) => {
            const dateStr = day.toISOString().split('T')[0];
            const dayEvents = eventsByDate[dateStr] || [];
            const isToday = new Date().toISOString().split('T')[0] === dateStr;
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isSelected = selectedDate && selectedDate.toISOString().split('T')[0] === dateStr;

            return (
              <div 
                key={index} 
                className={`border-b border-r border-slate-200 p-2 flex flex-col cursor-pointer transition-colors relative ${isCurrentMonth ? 'hover:bg-sky-50' : 'bg-zinc-50 hover:bg-zinc-100'} ${isSelected ? 'bg-sky-100 ring-2 ring-sky-500 z-10' : ''}`}
                onClick={() => handleDayClick(day)}
              >
                <span className={`self-end font-semibold text-sm w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-sky-500 text-white' : ''} ${!isCurrentMonth ? 'text-slate-400' : 'text-slate-700'}`}>{day.getDate()}</span>
                <div className="mt-1 space-y-1 overflow-hidden flex-1">
                    {dayEvents.slice(0, 3).map((event, i) => (
                        <div key={i} className={`h-1.5 w-full rounded-full ${event.type === 'booking' ? getBookingStatusColor(event.data.status) : 'bg-blue-500'}`}></div>
                    ))}
                    {dayEvents.length > 3 && <p className="text-xs text-slate-500 text-center">+ {dayEvents.length - 3} more</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Side Panel */}
      <div className={`w-96 border-l border-slate-200 flex-col transition-all duration-300 ease-in-out bg-slate-50 ${selectedDate ? 'flex' : 'hidden'}`}>
        {selectedDate && (
          <>
            <div className="p-4 border-b border-slate-200 flex justify-between items-center flex-shrink-0">
                <div>
                    <h3 className="font-bold text-slate-800">{selectedDate.toLocaleString('default', { weekday: 'long' })}</h3>
                    <p className="text-sm text-slate-500">{selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <button onClick={() => setSelectedDate(null)} className="p-2 text-slate-500 rounded-full hover:bg-slate-200"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedDayEvents.length > 0 ? (
                    selectedDayEvents.map((event, i) => (
                        <div key={i} className="p-3 bg-white rounded-lg shadow-sm border-l-4" style={{borderColor: event.type === 'booking' ? {Confirmed: '#22c55e', Pending: '#f59e0b', Cancelled: '#ef4444'}[event.data.status] : '#3b82f6'}}>
                           <div className="flex items-center text-sm font-semibold mb-1">
                                {event.type === 'booking' ? <BedDouble className="w-4 h-4 mr-2" /> : <ListChecks className="w-4 h-4 mr-2" />}
                                {event.type === 'booking' ? `Booking: ${event.data.guestName}` : `Task: ${event.data.title}`}
                           </div>
                           <p className="text-sm text-slate-600 ml-6">{event.type === 'booking' ? `${event.data.property}` : `${event.data.assignee}`}</p>
                           {event.type === 'booking' && <p className="text-xs text-slate-500 ml-6 mt-1">{`Status: ${event.data.status}`}</p>}
                        </div>
                    ))
                ) : (
                    <div className="text-center text-sm text-slate-500 pt-10 h-full flex flex-col items-center justify-center">
                        {/* FIX: Use the aliased CalendarIcon component instead of recursively calling the Calendar component. */}
                        <CalendarIcon className="w-10 h-10 text-slate-400 mb-2"/>
                        <p className="font-semibold">No events scheduled</p>
                        <p>This day is clear.</p>
                    </div>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Calendar;