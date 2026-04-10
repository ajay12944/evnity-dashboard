const StatCard = ({ title, count, icon: Icon, colorClass }) => {
  return (
    <div className="relative overflow-hidden bg-white p-6 sm:p-7 rounded-[1.25rem] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_8px_24px_rgba(99,102,241,0.08)] hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-center h-full">
      {/* Decorative Blur Blob */}
      <div className={`absolute -right-6 -top-6 w-24 h-24 ${colorClass.split(' ')[0]} opacity-20 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none`}></div>
      
      <div className="flex items-center justify-between z-10 relative gap-4">
        <div className="flex flex-col flex-1 min-w-0">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 break-words whitespace-normal">{title}</p>
          <h3 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight group-hover:text-indigo-600 transition-colors duration-300 break-words whitespace-normal">
            {count}
          </h3>
        </div>
        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center ${colorClass} group-hover:scale-110 transition-transform duration-300 shadow-sm shrink-0`}>
          <Icon className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
