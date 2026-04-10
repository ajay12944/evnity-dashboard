import { useState, useEffect } from 'react';
import DataTable from '../components/common/DataTable';
import { useCRUD } from '../hooks/useCRUD';
import { firebaseService } from '../services/firebaseService';
import { format } from 'date-fns';

const Events = () => {
  const { data, loading, handleDelete } = useCRUD('events');
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

  const columns = [
    { header: 'Event Title', render: (row) => <span className="font-bold text-gray-900">{row.title}</span> },
    { header: 'Date & Time', render: (row) => {
        if (!row.date) return <span className="text-gray-400">TBD</span>;
        try {
          return <span className="text-gray-600 font-medium">{format(new Date(row.date), 'MMM dd, yyyy • HH:mm')}</span>;
        } catch(e) {
          return <span className="text-gray-500">{row.date}</span>;
        }
    }},
    { header: 'Organizing Club', render: (row) => (
      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-50 text-xs font-bold text-gray-600 border border-gray-200/60">
        {getClubName(row.clubId)}
      </span>
    )}
  ];

  const confirmDelete = (id) => {
    handleDelete(id, "Event");
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Event Masterlist</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={data} onDelete={confirmDelete} />
      )}
    </div>
  );
};

export default Events;
