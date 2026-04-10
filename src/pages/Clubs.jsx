import { useState } from 'react';
import DataTable from '../components/common/DataTable';
import { useCRUD } from '../hooks/useCRUD';
import { firebaseService } from '../services/firebaseService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Check, X, Search } from 'lucide-react';

const Clubs = () => {
  const { data, loading } = useCRUD('clubs');
  const [filter, setFilter] = useState('All');

  const filteredData = data.filter(club => {
    const status = club.status || 'pending';
    if (filter === 'All') return true;
    return status.toLowerCase() === filter.toLowerCase();
  });

  const handleStatusChange = async (id, newStatus) => {
    try {
      await firebaseService.update('clubs', id, { status: newStatus });
      toast.success(`Club marked as ${newStatus}`);
    } catch (err) {
      toast.error('Failed to change status: ' + err.message);
    }
  };

  const StatusBadge = ({ status = 'pending' }) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">Approved</span>;
      case 'rejected':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-rose-100 text-rose-700">Rejected</span>;
      default:
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-700">Pending</span>;
    }
  };

  const columns = [
    { header: 'Club Name', render: (row) => <span className="font-bold text-gray-900">{row.name}</span> },
    { header: 'Description', render: (row) => <span className="text-gray-500 font-normal">{row.description}</span> },
    { header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { header: 'Created', render: (row) => {
        if (!row.createdAt) return 'N/A';
        try {
          const date = row.createdAt.toDate ? row.createdAt.toDate() : new Date(row.createdAt);
          return <span className="text-gray-500 font-normal">{format(date, 'MMM dd, yyyy')}</span>;
        } catch(e) {
          return 'Invalid Date';
        }
    }}
  ];

  const ActionButtons = (row) => (
    <div className="flex justify-end space-x-2">
      <button
        onClick={() => handleStatusChange(row.id, 'approved')}
        disabled={row.status === 'approved'}
        className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-all ${row.status === 'approved' ? 'opacity-0 invisible' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold text-xs'}`}
      >
        <Check size={14} /> <span>Approve</span>
      </button>
      <button
        onClick={() => handleStatusChange(row.id, 'rejected')}
        disabled={row.status === 'rejected'}
        className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-all ${row.status === 'rejected' ? 'hide invisible opacity-0' : 'bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-xs'}`}
      >
        <X size={14} /> <span>Reject</span>
      </button>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Club Management</h1>
        
        {/* SaaS style segmented control Tabs */}
        <div className="inline-flex p-1.5 bg-gray-100/80 backdrop-blur rounded-2xl">
          {['All', 'Pending', 'Approved', 'Rejected'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                filter === tab
                  ? 'bg-white text-indigo-700 shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={filteredData} customActions={ActionButtons} />
      )}
    </div>
  );
};

export default Clubs;
