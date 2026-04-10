import { useState, useEffect } from 'react';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays 
} from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, MapPin, Users, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { useCRUD } from '../hooks/useCRUD';
import { firebaseService } from '../services/firebaseService';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { data: events, loading } = useCRUD('events');
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    const unsubscribe = firebaseService.subscribe('clubs', (clubData) => {
      setClubs(clubData);
    });
    return () => unsubscribe();
  }, []);

  const getClubName = (clubId) => {
    const club = clubs.find(c => c.id === clubId);
    return club ? club.name : 'Unknown Club';
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900">{format(currentMonth, 'MMMM yyyy')}</h2>
          <p className="text-sm font-medium text-gray-500 mt-1">Manage your schedule</p>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <button 
            onClick={() => {
              setCurrentMonth(new Date());
              setSelectedDate(new Date());
            }}
            className="px-4 py-2 bg-white border border-gray-200 text-sm font-semibold text-gray-700 rounded-xl hover:bg-gray-50 shadow-sm transition-all"
          >
            Today
          </button>
          <button 
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = "EEE";
    const days = [];
    let startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-semibold text-sm text-gray-400 py-4 uppercase tracking-wider">
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="grid grid-cols-7 border-b border-gray-100 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        
        // Find events for this day
        const dayEvents = events.filter(e => e.date && isSameDay(new Date(e.date), cloneDay));
        const hasEvents = dayEvents.length > 0;
        
        days.push(
          <div
            key={day}
            onClick={() => setSelectedDate(cloneDay)}
            className={`min-h-[100px] border border-transparent p-2 transition-all cursor-pointer relative group flex flex-col items-center
              ${!isSameMonth(day, monthStart) ? "text-gray-300 pointer-events-none bg-gray-50/30" : "text-gray-700 hover:bg-gray-50"}
              ${isSameDay(day, selectedDate) ? "bg-gray-50/80 rounded-2xl border-gray-100 shadow-sm" : ""}
            `}
          >
             <div className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold mt-2
                ${isSameDay(day, selectedDate) ? "bg-[#0b132b] text-white shadow-md" : "group-hover:text-[#0b132b]"}
             `}>
               {formattedDate}
             </div>
             {hasEvents && (
               <div className="flex justify-center mt-2 space-x-1">
                 {dayEvents.slice(0, 3).map((_, idx) => (
                   <div key={idx} className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></div>
                 ))}
               </div>
             )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-px border-b border-gray-100 last:border-b-0" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  const selectedDayEvents = events.filter(e => e.date && isSameDay(new Date(e.date), selectedDate));

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Calendar</h1>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        {/* Calendar Column */}
        <div className="flex-1 bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          {renderHeader()}
          {renderDays()}
          {renderCells()}
        </div>

        {/* Selected Date Events Column */}
        <div className="w-full xl:w-[400px]">
          <div className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 h-full min-h-[600px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {format(selectedDate, 'do MMMM yyyy')}
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-hide">
              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : selectedDayEvents.length > 0 ? (
                selectedDayEvents.map(event => (
                  <div key={event.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    {/* Left Accent Bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0b132b] rounded-l-2xl"></div>
                    
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-gray-900 pr-4 leading-tight">{event.title}</h4>
                      <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-bold rounded-lg border border-gray-200/60 whitespace-nowrap">
                        {getClubName(event.clubId)}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center text-sm text-gray-500 font-medium">
                        <Clock size={16} className="mr-2.5 text-gray-400" />
                        {event.date ? format(new Date(event.date), 'HH:mm') : 'TBD'} - {event.date ? format(new Date(new Date(event.date).getTime() + 2*60*60*1000), 'HH:mm') : 'TBD'}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 font-medium">
                        <MapPin size={16} className="mr-2.5 text-gray-400" />
                        {event.location || 'Campus Main Location'}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 font-medium">
                        <Users size={16} className="mr-2.5 text-gray-400" />
                        {event.participants ? `${event.participants} Participants` : 'Open to all'}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <CalendarIcon size={24} className="text-gray-300" />
                  </div>
                  <p className="font-medium">No events for this date</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
