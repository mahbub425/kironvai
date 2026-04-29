import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  MapPin,
  CalendarDays,
  FileText,
  Eye,
  ShieldAlert
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

interface DashboardStats {
  notVisited: number;
  visited: number;
  reported: number;
  working: number;
  solved: number;
  today: number;
  thisMonth: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    notVisited: 0,
    visited: 0,
    reported: 0,
    working: 0,
    solved: 0,
    today: 0,
    thisMonth: 0,
  });

  const [statusData, setStatusData] = useState<any[]>([]);
  const [unionData, setUnionData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await supabase
          .from('complaints')
          .select(`
            *,
            unions ( name_bn ),
            problem_categories ( name_bn )
          `);
        
        if (data) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

          const counts = {
            notVisited: data.filter(c => c.status === 'এখনো ভিজিট করা হয়নি').length,
            visited: data.filter(c => c.status === 'ভিজিট করা হয়েছে').length,
            reported: data.filter(c => c.status === 'কর্তৃপক্ষের কাছে অভিযোগ জানানো হয়েছে').length,
            working: data.filter(c => c.status === 'অভিযোগ নিয়ে কাজ করা হচ্ছে').length,
            solved: data.filter(c => c.status === 'সমস্যার সমাধান করা হয়েছে').length,
            today: data.filter(c => new Date(c.created_at) >= today).length,
            thisMonth: data.filter(c => new Date(c.created_at) >= thisMonth).length
          };
          
          setStats(counts);

          // 1. Status Chart Data
          setStatusData([
            { name: 'এখনো ভিজিট করা হয়নি', value: counts.notVisited, color: '#f43f5e' }, // Rose
            { name: 'ভিজিট করা হয়েছে', value: counts.visited, color: '#f59e0b' }, // Amber
            { name: 'কর্তৃপক্ষের কাছে জানানো হয়েছে', value: counts.reported, color: '#8b5cf6' }, // Violet
            { name: 'কাজ চলছে', value: counts.working, color: '#3b82f6' }, // Blue
            { name: 'সমাধান হয়েছে', value: counts.solved, color: '#10b981' } // Emerald
          ]);

          // 2. Union Chart Data
          const uMap = new Map();
          data.forEach(c => {
            const uName = c.unions?.name_bn || 'অজানা';
            uMap.set(uName, (uMap.get(uName) || 0) + 1);
          });
          setUnionData(Array.from(uMap.entries()).map(([name, count]) => ({ name, count })).sort((a,b) => b.count - a.count));

          // 3. Category Chart Data
          const cMap = new Map();
          data.forEach(c => {
            const cName = c.problem_categories?.name_bn || 'অন্যান্য';
            cMap.set(cName, (cMap.get(cName) || 0) + 1);
          });
          setCategoryData(Array.from(cMap.entries()).map(([name, count]) => ({ name, count })).sort((a,b) => b.count - a.count));
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    { name: 'আজকের অভিযোগ', value: stats.today, icon: <CalendarDays size={24} />, color: 'bg-indigo-500' },
    { name: 'এই মাসের অভিযোগ', value: stats.thisMonth, icon: <FileText size={24} />, color: 'bg-blue-500' },
    { name: 'এখনো ভিজিট করা হয়নি', value: stats.notVisited, icon: <AlertCircle size={24} />, color: 'bg-rose-500' },
    { name: 'ভিজিট করা হয়েছে', value: stats.visited, icon: <Eye size={24} />, color: 'bg-amber-500' },
    { name: 'কর্তৃপক্ষের কাছে জানানো হয়েছে', value: stats.reported, icon: <ShieldAlert size={24} />, color: 'bg-violet-500' },
    { name: 'কাজ চলছে', value: stats.working, icon: <Clock size={24} />, color: 'bg-blue-400' },
    { name: 'সমাধান হয়েছে', value: stats.solved, icon: <CheckCircle2 size={24} />, color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">ড্যাশবোর্ড সামারি</h1>
          <p className="text-slate-500 font-medium">আজকের কার্যক্রম এবং সম্পূর্ণ ডেটা অ্যানালাইসিস</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-400">সর্বশেষ আপডেট:</span>
          <span className="text-sm font-black text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200">
            {new Date().toLocaleTimeString('bn-BD')}
          </span>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-5 xl:p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all">
            <div className={`w-14 h-14 shrink-0 ${card.color} text-white rounded-2xl flex items-center justify-center shadow-lg shadow-current/20`}>
              {card.icon}
            </div>
            <div>
              <p className="text-slate-500 font-bold text-xs xl:text-sm">{card.name}</p>
              <h3 className="text-2xl xl:text-3xl font-black text-slate-900">
                {loading ? '...' : card.value.toLocaleString('bn-BD')}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Status Pie Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-emerald-500" />
            স্ট্যাটাস অনুযায়ী অভিযোগ (Status)
          </h3>
          <div className="h-[300px] w-full">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center text-slate-400">লোড হচ্ছে...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value: any) => [value, 'টি অভিযোগ']} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Union Bar Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <MapPin size={20} className="text-blue-500" />
            ইউনিয়ন অনুযায়ী অভিযোগ (Union-wise)
          </h3>
          <div className="h-[300px] w-full">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center text-slate-400">লোড হচ্ছে...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={unionData} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748b' }} 
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <RechartsTooltip 
                    cursor={{ fill: '#f8fafc' }}
                    formatter={(value: any) => [value, 'টি অভিযোগ']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Category Bar Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm xl:col-span-2">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <MessageSquare size={20} className="text-amber-500" />
            সমস্যার ধরন অনুযায়ী অভিযোগ (Category-wise)
          </h3>
          <div className="h-[350px] w-full">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center text-slate-400">লোড হচ্ছে...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <RechartsTooltip 
                    cursor={{ fill: '#f8fafc' }}
                    formatter={(value: any) => [value, 'টি অভিযোগ']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
