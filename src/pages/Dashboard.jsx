import { useState, useEffect } from 'react';
import { Users, Grid, Calendar, ClipboardList } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import StatCard from '../components/dashboard/StatCard';
import { firebaseService } from '../services/firebaseService';
import { format, parseISO } from 'date-fns';

const Dashboard = () => {
  const [counts, setCounts] = useState({ users: 0, clubs: 0, events: 0, registrations: 0 });
  const [eventsData, setEventsData] = useState([]);
  const [growthData, setGrowthData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubs = [];
    
    // Subscribe to multiple collections for real-time aggregation
    const processCollections = () => {
      let currentUsers = [];
      let currentEvents = [];

      const rebuildGrowthChart = (users) => {
        // Sort ascending for accurate cumulative chart
        const sorted = [...users].sort((a, b) => new Date(a.createdAt?.toDate ? a.createdAt.toDate() : a.createdAt) - new Date(b.createdAt?.toDate ? b.createdAt.toDate() : b.createdAt));
        const monthCounts = {};
        let cumulative = 0;

        sorted.forEach(u => {
          if (u.createdAt) {
            const dateObj = u.createdAt.toDate ? u.createdAt.toDate() : new Date(u.createdAt);
            const month = format(dateObj, 'MMM yyyy');
            monthCounts[month] = (monthCounts[month] || 0) + 1;
          }
        });

        const formatted = Object.entries(monthCounts).map(([name, count]) => {
          cumulative += count;
          return { name, users: cumulative };
        });
        setGrowthData(formatted);
      };

      const rebuildEventsChart = (events) => {
        const monthCounts = {};
        events.forEach(e => {
          let dateStr;
          if (e.date) {
            dateStr = e.date.toDate ? e.date.toDate().toISOString() : new Date(e.date).toISOString();
          } else if (e.createdAt) {
            dateStr = e.createdAt.toDate ? e.createdAt.toDate().toISOString() : new Date(e.createdAt).toISOString();
          } else return;

          try {
            const month = format(parseISO(dateStr), 'MMM yyyy');
            monthCounts[month] = (monthCounts[month] || 0) + 1;
          } catch(err) {}
        });

        const formatted = Object.entries(monthCounts).map(([name, count]) => ({ name, events: count }));
        setEventsData(formatted);
      };

      unsubs.push(firebaseService.subscribe('users', (data) => {
        setCounts(c => ({...c, users: data.length}));
        currentUsers = data;
        rebuildGrowthChart(currentUsers);
        setLoading(false); // First load done
      }));

      unsubs.push(firebaseService.subscribe('clubs', (data) => {
        setCounts(c => ({...c, clubs: data.length}));
      }));

      unsubs.push(firebaseService.subscribe('events', (data) => {
        setCounts(c => ({...c, events: data.length}));
        currentEvents = data;
        rebuildEventsChart(currentEvents);
      }));

      unsubs.push(firebaseService.subscribe('registrations', (data) => {
        setCounts(c => ({...c, registrations: data.length}));
      }));
    };

    processCollections();
    
    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Insights</h1>
        <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 px-4 py-2 rounded-full border border-green-200 shadow-sm">
          <span className="relative flex h-3 w-3 mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          Live Sync Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 mb-8">
        <StatCard title="Total Users" count={counts.users} icon={Users} colorClass="bg-indigo-50 text-indigo-600" />
        <StatCard title="Total Clubs" count={counts.clubs} icon={Grid} colorClass="bg-fuchsia-50 text-fuchsia-600" />
        <StatCard title="Total Events" count={counts.events} icon={Calendar} colorClass="bg-sky-50 text-sky-600" />
        <StatCard title="Registrations" count={counts.registrations} icon={ClipboardList} colorClass="bg-violet-50 text-violet-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8">
        <div className="bg-white p-6 xl:p-8 rounded-[1.25rem] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300">
          <h3 className="text-lg font-bold text-gray-900 mb-8 tracking-tight">Events per Month</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12, fontWeight: 500}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12, fontWeight: 500}} dx={-15} />
                <Tooltip cursor={{fill: '#F9FAFB'}} contentStyle={{borderRadius: '16px', border: '1px solid #F3F4F6', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', fontWeight: 600, padding: '12px 16px'}} />
                <Bar dataKey="events" fill="#6366F1" radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 xl:p-8 rounded-[1.25rem] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300">
          <h3 className="text-lg font-bold text-gray-900 mb-8 tracking-tight">User Growth Trajectory</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12, fontWeight: 500}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12, fontWeight: 500}} dx={-15} />
                <Tooltip contentStyle={{borderRadius: '16px', border: '1px solid #F3F4F6', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', fontWeight: 600, padding: '12px 16px'}} />
                <Line type="monotone" dataKey="users" stroke="#A855F7" strokeWidth={4} dot={{r: 5, strokeWidth: 3, fill: '#fff'}} hoverDot={{r: 8}} activeDot={{r: 8, strokeWidth: 0}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
