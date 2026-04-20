import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, differenceInDays } from 'date-fns';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X, Trash2, Edit2 } from 'lucide-react';

export default function ContentCalendar() {
  const { pipeline, calendarActivities, addCalendarActivity, updateCalendarActivity, deleteCalendarActivity } = useContent();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Modal State
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  
  // Form State
  const [actTitle, setActTitle] = useState('');
  const [actType, setActType] = useState('Event');

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const openDateModal = (day) => {
      setSelectedDate(day);
      setEditingActivity(null);
      setActTitle('');
      setActType('Event');
      setIsModalOpen(true);
  };

  const openEditModal = (e, act) => {
      e.stopPropagation();
      setSelectedDate(new Date(act.dueDate));
      setEditingActivity(act);
      setActTitle(act.title);
      setActType(act.type || 'Event');
      setIsModalOpen(true);
  };

  const saveActivity = async (e) => {
      e.preventDefault();
      if (!actTitle.trim()) return;

      if (editingActivity) {
          await updateCalendarActivity(editingActivity.id, {
              title: actTitle,
              type: actType,
              dueDate: selectedDate.toISOString()
          });
      } else {
          await addCalendarActivity({
              title: actTitle,
              type: actType,
              dueDate: selectedDate.toISOString()
          });
      }
      setIsModalOpen(false);
  };

  const handleDeleteActivity = async (e) => {
      e.preventDefault();
      if (editingActivity) {
          await deleteCalendarActivity(editingActivity.id);
          setIsModalOpen(false);
      }
  };

  const getActivityColor = (dueDate) => {
      const diff = differenceInDays(new Date(dueDate), new Date());
      // Render colors dynamically based on deadline
      if (diff < 0) return 'bg-muted/50 text-muted-foreground border-border'; 
      if (diff <= 2) return 'bg-red-100 text-red-600 border-red-200'; // Very near
      if (diff <= 7) return 'bg-amber-100 text-amber-600 border-amber-200'; // Within week
      return 'bg-blue-50 text-blue-500 border-blue-100'; // Fine
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative z-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Calendar</h1>
          <p className="text-muted-foreground">Click any day to add an activity or deadline.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={prevMonth} className="h-10 w-10 bg-card shadow-sm border-primary/20">
            <ChevronLeft size={18} className="text-primary" />
          </Button>
          <span className="text-lg font-semibold w-40 text-center flex items-center justify-center gap-2 text-foreground">
            <CalendarIcon size={18} className="text-primary" />
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <Button variant="outline" size="icon" onClick={nextMonth} className="h-10 w-10 bg-card shadow-sm border-primary/20">
            <ChevronRight size={18} className="text-primary" />
          </Button>
        </div>
      </div>

      <div className="border border-border/60 rounded-xl overflow-hidden bg-card/80 backdrop-blur-sm shadow-xl shadow-primary/5">
        <div className="grid grid-cols-7 border-b border-border/60 bg-muted/20">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="py-3 text-center text-sm font-semibold text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day, idx) => {
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());
            
            const pipelineItems = pipeline.filter(i => i.dueDate && isSameDay(new Date(i.dueDate), day));
            const dayActivities = calendarActivities.filter(a => a.dueDate && isSameDay(new Date(a.dueDate), day));

            return (
              <div 
                key={day.toString()} 
                onClick={() => openDateModal(day)}
                className={`min-h-[120px] p-2 border-b border-r border-border/60 transition-colors hover:bg-primary/5 cursor-pointer
                  ${!isCurrentMonth ? 'bg-muted/10 opacity-50' : ''}
                  ${idx % 7 === 6 ? 'border-r-0' : ''}
                `}
              >
                <div className={`text-right text-sm mb-1 ${isToday ? 'w-full inline-flex justify-end' : ''}`}>
                    {isToday ? (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shadow-md shadow-primary/30">
                            {format(day, 'd')}
                        </span>
                    ) : (
                        <span className="font-medium text-foreground/80">{format(day, 'd')}</span>
                    )}
                </div>
                
                <div className="flex flex-col gap-1 mt-2">
                    {/* Render Pipeline Items (Static in Calendar, managed in Pipeline) */}
                    {pipelineItems.map(item => (
                        <div key={item.id} className="truncate rounded px-1.5 py-1 text-[10px] font-semibold bg-primary/20 text-primary-foreground border border-primary/30" title="Production Board Item">
                            🚧 {item.title}
                        </div>
                    ))}
                    
                    {/* Render Manual Activities */}
                    {dayActivities.map(act => (
                        <div 
                          key={act.id} 
                          onClick={(e) => openEditModal(e, act)}
                          className={`truncate rounded px-1.5 py-1 text-[10px] font-semibold border transition-all hover:brightness-95 flex items-center justify-between group ${getActivityColor(act.dueDate)}`}
                        >
                            <span>{act.title}</span>
                            <Edit2 size={10} className="opacity-0 group-hover:opacity-100" />
                        </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal for Adding/Editing Activity */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
              <Card className="w-full max-w-md shadow-2xl border-primary/20 animate-in zoom-in-95 duration-200">
                  <form onSubmit={saveActivity}>
                      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                          <CardTitle className="text-xl">
                              {editingActivity ? 'Edit Activity' : 'Add Activity'}
                          </CardTitle>
                          <button type="button" onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                              <X size={20} />
                          </button>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-4">
                          <div className="text-sm font-medium text-primary">
                              Date: {selectedDate && format(selectedDate, 'EEEE, MMMM do, yyyy')}
                          </div>
                          <div className="space-y-2">
                              <label className="text-sm font-medium">Activity Name</label>
                              <Input 
                                autoFocus
                                required
                                value={actTitle} 
                                onChange={e => setActTitle(e.target.value)} 
                                placeholder="e.g., Team Sync, Shoot B-Roll..." 
                              />
                          </div>
                          <div className="flex items-center justify-between pt-4 gap-2">
                              {editingActivity && (
                                <Button type="button" variant="destructive" onClick={handleDeleteActivity} className="flex gap-2">
                                    <Trash2 size={16} /> Delete
                                </Button>
                              )}
                              <Button type="submit" className="ml-auto bg-primary text-primary-foreground shadow-md shadow-primary/20">
                                  {editingActivity ? 'Save Changes' : 'Create Activity'}
                              </Button>
                          </div>
                      </CardContent>
                  </form>
              </Card>
          </div>
      )}

    </div>
  );
}
