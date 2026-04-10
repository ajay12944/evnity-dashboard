import { useState, useEffect } from 'react';
import { firebaseService } from '../services/firebaseService';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Megaphone, Send, AtSign, Eye, AlertCircle } from 'lucide-react';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('Students');

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firebaseService.subscribe(`announcements/${activeTab}/items`, (data) => {
      setAnnouncements(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [activeTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) return;

    try {
      setIsSubmitting(true);
      await firebaseService.create(`announcements/${activeTab}/items`, { ...formData, audience: activeTab });
      toast.success('Announcement broadcasted successfully!');
      setFormData({ title: '', message: '' });
    } catch (err) {
      console.error("Firestore Error creating announcement:", err);
      toast.error('Failed to send announcement: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
      
      {/* Compose Section */}
      <div className="xl:col-span-1 sticky top-8 z-10">
        <div className="bg-white rounded-[1.25rem] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 p-8">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100/50 shadow-inner">
              <Megaphone size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">New Broadcast</h2>
              <p className="text-xs font-medium text-gray-400 mt-0.5">Push updates to all portals</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Subject Line</label>
              <input
                type="text"
                name="title"
                required
                placeholder="Important update..."
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all font-medium text-gray-700 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Message Body</label>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="What do you want to tell everyone?"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all resize-none font-medium text-gray-700 placeholder-gray-400"
              />
            </div>
            {/* Visual tags for UI polish */}
            <div className="flex space-x-3 pb-2">
               <div className="flex-1 px-3 py-2 bg-gray-50 rounded-lg flex items-center justify-between hover:bg-gray-100 transition-colors">
                  <span className="text-xs font-semibold text-gray-500 flex items-center"><AtSign size={14} className="mr-1.5"/> Target</span>
                  <span className="text-xs font-bold text-indigo-700 text-right px-2 py-1 rounded-md bg-indigo-50/80 leading-none min-w-[70px] text-center">
                    {activeTab}
                  </span>
               </div>
               <div className="flex-1 px-3 py-2 bg-gray-50 rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors">
                  <span className="text-xs font-semibold text-gray-500 flex items-center"><AlertCircle size={14} className="mr-1.5"/> Priority</span>
                  <span className="text-xs font-bold text-gray-900">Standard</span>
               </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-[0_4px_12px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_16px_rgba(99,102,241,0.4)] hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isSubmitting ? 'Broadcasting...' : (
                <>
                  <Send size={18} strokeWidth={2.5} className="mr-2" />
                  Broadcast Live
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Feed Section */}
      <div className="xl:col-span-2 min-h-[calc(100vh-10rem)]">
        <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center mb-8 gap-4">
          
          <div className="inline-flex p-1.5 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-gray-100 rounded-2xl">
            {['Students', 'Clubs', 'Central'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-xl font-bold text-xs transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
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
        ) : (() => {
          if (announcements.length === 0) {
            return (
              <div className="bg-white rounded-[1.25rem] border border-gray-100 p-16 text-center shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Megaphone size={32} strokeWidth={2} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 tracking-tight mb-2">No active broadcasts</h3>
                <p className="text-sm font-medium text-gray-500">Formulate a message on the left to push it to the feed.</p>
              </div>
            );
          }
          
          return (
            <div className="space-y-5">
              {announcements.map((ann) => (
                <div key={ann.id} className="relative bg-white p-6 sm:p-8 rounded-[1.25rem] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100/80 hover:border-indigo-100 hover:shadow-[0_8px_24px_rgba(99,102,241,0.05)] transition-all group">
                {/* Decorative side accent */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-[1.25rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                  <h3 className="text-lg font-black text-gray-900 tracking-tight group-hover:text-indigo-900 transition-colors">{ann.title}</h3>
                  <div className="flex items-center space-x-3 border ml-0 sm:ml-4 border-gray-100 bg-gray-50/50 px-3 py-1.5 rounded-lg shrink-0">
                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center">
                       <Eye size={12} className="mr-1.5" /> 
                       {ann.createdAt ? format(ann.createdAt.toDate ? ann.createdAt.toDate() : new Date(ann.createdAt), 'MMM dd, HH:mm') : 'Just now'}
                     </span>
                  </div>
                </div>
                
                <p className="text-sm font-medium text-gray-600 leading-relaxed max-w-3xl">
                  {ann.message}
                </p>
                
                {/* Visual tags for UI polish */}
                <div className="flex items-center space-x-2 mt-6 pt-4 border-t border-gray-50">
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[10px] uppercase font-bold tracking-widest rounded-md border border-indigo-100/50">{ann.audience || 'Central'} Segment</span>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] uppercase font-bold tracking-widest rounded-md border border-emerald-100/50">Delivery Confirmed</span>
                </div>
              </div>
            ))}
            </div>
          );
        })()}
      </div>

    </div>
  );
};

export default Announcements;
