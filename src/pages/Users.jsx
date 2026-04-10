import DataTable from '../components/common/DataTable';
import { useCRUD } from '../hooks/useCRUD';
import { format } from 'date-fns';

const Users = () => {
  const { data, loading } = useCRUD('users');

  const columns = [
    { header: 'Name', render: (row) => <span className="font-bold text-gray-900">{row.name}</span> },
    { header: 'Email', render: (row) => <span className="text-gray-500 font-medium">{row.email}</span> },
    { header: 'Role', render: (row) => (
      <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full 
        ${row.role === 'Admin' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200/50' : 'bg-emerald-100 text-emerald-700 border border-emerald-200/50'}`}>
        {row.role}
      </span>
    )},
    { header: 'Joined', render: (row) => {
        if (!row.createdAt) return 'N/A';
        try {
          const date = row.createdAt.toDate ? row.createdAt.toDate() : new Date(row.createdAt);
          return <span className="text-gray-500 font-medium">{format(date, 'MMM dd, yyyy')}</span>;
        } catch(e) {
          return 'Invalid Date';
        }
    }}
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">User Directory</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={data} />
      )}
    </div>
  );
};

export default Users;
