import { useState, useEffect } from 'react';
import DataTable from '../components/common/DataTable';
import { useCRUD } from '../hooks/useCRUD';
import { firebaseService } from '../services/firebaseService';
import { format } from 'date-fns';

const Registrations = () => {
  const { data, loading, handleDelete } = useCRUD('registrations');
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const unsubUsers = firebaseService.subscribe('users', setUsers);
    const unsubEvents = firebaseService.subscribe('events', setEvents);

    return () => {
      unsubUsers();
      unsubEvents();
    };
  }, []);

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const getEventTitle = (eventId) => {
    const event = events.find(e => e.id === eventId);
    return event ? event.title : 'Unknown Event';
  };

  const columns = [
    { header: 'Participant', render: (row) => <span className="font-bold text-gray-900">{getUserName(row.userId)}</span> },
    { header: 'Event', render: (row) => <span className="text-indigo-600 font-bold">{getEventTitle(row.eventId)}</span> },
    { header: 'Registration Date', render: (row) => {
        if (!row.createdAt) return 'N/A';
        try {
          const date = row.createdAt.toDate ? row.createdAt.toDate() : new Date(row.createdAt);
          return <span className="text-gray-500 font-medium">{format(date, 'MMM dd, yyyy HH:mm')}</span>;
        } catch(e) {
          return 'Invalid Date';
        }
    }}
  ];

  const confirmDelete = (id) => {
    handleDelete(id, "Registration");
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Event Registries</h1>
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

export default Registrations;
