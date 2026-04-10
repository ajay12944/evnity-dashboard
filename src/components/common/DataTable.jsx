const DataTable = ({ columns, data, onEdit, onDelete, customActions }) => {
  const hasActions = onEdit || onDelete || customActions;

  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100/80">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50/50">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100"
              >
                {col.header}
              </th>
            ))}
            {hasActions && (
              <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-50/50">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (hasActions ? 1 : 0)} className="px-6 py-16 text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                    <span className="text-gray-400 text-2xl font-light">∅</span>
                  </div>
                  <p className="text-gray-500 font-medium">No records found</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id} className="hover:bg-indigo-50/30 transition-colors group">
                {columns.map((col, index) => (
                  <td key={index} className="px-6 py-5 whitespace-nowrap text-sm text-gray-700 font-medium tracking-tight">
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
                {hasActions && (
                  <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                    <div className="flex justify-end space-x-2 items-center">
                      {customActions ? customActions(row) : null}
                      {/* Original buttons kept intact if used */}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="px-3 py-1.5 flex items-center text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row.id)}
                          className="px-3 py-1.5 flex items-center text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
