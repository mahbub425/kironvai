import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  Search, 
  Clock, 
  AlertCircle, 
  MapPin, 
  User, 
  Phone,
  Calendar,
  Loader2,
  ExternalLink,
  X,
  Download,
  FileText,
  Trash2
} from 'lucide-react';

interface Location {
  id: string;
  name_bn: string;
}

interface Complaint {
  id: string;
  complaint_id: string;
  name: string;
  phone: string;
  email?: string;
  problem_details: string;
  status: string;
  created_at: string;
  gram_moholla: string;
  upazila_id: string;
  union_id: string;
  ward_id: string;
  problem_categories: { name_bn: string };
  upazilas: { name_bn: string };
  unions: { name_bn: string };
  wards: { name_bn: string };
}

const AdminComplaints = () => {
  const location = useLocation();
  const isResolvedPage = location.pathname.includes('/resolved');
  
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(isResolvedPage ? 'সমস্যার সমাধান করা হয়েছে' : 'all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Complaint | null>(null);

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // New Filter States
  const [upazilas, setUpazilas] = useState<Location[]>([]);
  const [unions, setUnions] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);
  const [filterUpazila, setFilterUpazila] = useState('');
  const [filterUnion, setFilterUnion] = useState('');
  const [filterWard, setFilterWard] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // If we navigate between /admin/complaints and /admin/complaints/resolved, reset filter
  useEffect(() => {
    setStatusFilter(isResolvedPage ? 'সমস্যার সমাধান করা হয়েছে' : 'all');
  }, [isResolvedPage]);

  // Fetch initial upazilas
  useEffect(() => {
    const fetchUpazilas = async () => {
      const { data } = await supabase.from('upazilas').select('id, name_bn').eq('status', 'active');
      if (data) setUpazilas(data);
    };
    fetchUpazilas();
  }, []);

  // Fetch Unions when Upazila changes
  useEffect(() => {
    const fetchUnions = async () => {
      if (!filterUpazila) {
        setUnions([]);
        return;
      }
      const { data } = await supabase.from('unions').select('id, name_bn').eq('upazila_id', filterUpazila).eq('status', 'active');
      if (data) setUnions(data);
    };
    fetchUnions();
  }, [filterUpazila]);

  // Fetch Wards when Union changes
  useEffect(() => {
    const fetchWards = async () => {
      if (!filterUnion) {
        setWards([]);
        return;
      }
      const { data } = await supabase.from('wards').select('id, name_bn').eq('union_id', filterUnion).eq('status', 'active');
      if (data) setWards(data);
    };
    fetchWards();
  }, [filterUnion]);

  const statuses = [
    'এখনো ভিজিট করা হয়নি',
    'ভিজিট করা হয়েছে',
    'কর্তৃপক্ষের কাছে অভিযোগ জানানো হয়েছে',
    'অভিযোগ নিয়ে কাজ করা হচ্ছে',
    'সমস্যার সমাধান করা হয়েছে'
  ];

  const fetchComplaints = async () => {
    setLoading(true);
    let query = supabase
      .from('complaints')
      .select(`
        *,
        problem_categories(name_bn),
        upazilas(name_bn),
        unions(name_bn),
        wards(name_bn)
      `)
      .order('created_at', { ascending: false });

    const { data } = await query;
    if (data) setComplaints(data as any);
    setLoading(false);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    const updatedAt = new Date().toISOString();
    const { error } = await supabase
      .from('complaints')
      .update({ 
        status: newStatus,
        updated_at: updatedAt
      })
      .eq('id', id);

    if (error) {
      console.error(error);
      window.alert(`Status update save hoyni: ${error.message}`);
      setUpdatingId(null);
      return;
    }

    const { data: savedComplaint, error: verifyError } = await supabase
      .from('complaints')
      .select(`
        *,
        problem_categories(name_bn),
        upazilas(name_bn),
        unions(name_bn),
        wards(name_bn)
      `)
      .eq('id', id)
      .single();

    if (verifyError || !savedComplaint || savedComplaint.status !== newStatus) {
      console.error(verifyError);
      window.alert('Status update save hoyni. Supabase SQL Editor-e fix_complaints_status_update_policy.sql file-er query run korun.');
      setUpdatingId(null);
      return;
    }

    const updatedComplaint = savedComplaint as Complaint;
    setComplaints(complaints.map(c => c.id === id ? updatedComplaint : c));
    if (selectedComplaint?.id === id) {
      setSelectedComplaint(updatedComplaint);
    }
    setUpdatingId(null);
  };

  const openDeleteConfirm = (complaint: Complaint) => {
    setDeleteTarget(complaint);
  };

  const handleDeleteComplaint = async () => {
    if (!deleteTarget) return;

    setDeletingId(deleteTarget.id);
    const { error } = await supabase
      .from('complaints')
      .delete()
      .eq('id', deleteTarget.id);

    if (error) {
      console.error(error);
      window.alert(`অভিযোগ ডিলিট করা যায়নি: ${error.message}`);
      setDeletingId(null);
      return;
    }

    setComplaints(complaints.filter(c => c.id !== deleteTarget.id));
    if (selectedComplaint?.id === deleteTarget.id) {
      setSelectedComplaint(null);
    }
    setDeleteTarget(null);
    setDeletingId(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'সমস্যার সমাধান করা হয়েছে': return 'bg-emerald-100 text-emerald-700';
      case 'অভিযোগ নিয়ে কাজ করা হচ্ছে': return 'bg-blue-100 text-blue-700';
      case 'কর্তৃপক্ষের কাছে অভিযোগ জানানো হয়েছে': return 'bg-purple-100 text-purple-700';
      case 'ভিজিট করা হয়েছে': return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const filteredComplaints = complaints.filter(c => {
    // Date filter
    const complaintDate = new Date(c.created_at).getTime();
    const matchesDateFrom = dateFrom ? complaintDate >= new Date(dateFrom).getTime() : true;
    const matchesDateTo = dateTo ? complaintDate <= new Date(dateTo).setHours(23, 59, 59, 999) : true;

    // Location & Status filter
    const matchesUpazila = filterUpazila ? c.upazila_id === filterUpazila : true;
    const matchesUnion = filterUnion ? c.union_id === filterUnion : true;
    const matchesWard = filterWard ? c.ward_id === filterWard : true;
    const matchesStatus = statusFilter === 'all' ? true : c.status === statusFilter;

    // Search term
    const term = searchTerm.toLowerCase();
    const matchesSearch = !term || (
      c.complaint_id?.toLowerCase().includes(term) ||
      c.name?.toLowerCase().includes(term) ||
      c.phone?.includes(term) ||
      (c.email && c.email.toLowerCase().includes(term)) ||
      c.problem_details?.toLowerCase().includes(term) ||
      c.upazilas?.name_bn?.toLowerCase().includes(term) ||
      c.unions?.name_bn?.toLowerCase().includes(term) ||
      c.wards?.name_bn?.toLowerCase().includes(term) ||
      c.status?.toLowerCase().includes(term)
    );

    return matchesDateFrom && matchesDateTo && matchesUpazila && matchesUnion && matchesWard && matchesStatus && matchesSearch;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter(isResolvedPage ? 'সমস্যার সমাধান করা হয়েছে' : 'all');
    setFilterUpazila('');
    setFilterUnion('');
    setFilterWard('');
    setDateFrom('');
    setDateTo('');
  };

  const exportCSV = () => {
    const headers = ['নাম', 'মোবাইল নম্বর', 'উপজেলা', 'ইউনিয়ন', 'ওয়ার্ড', 'গ্রাম/মহল্লা', 'সমস্যার ধরন', 'সমস্যার বিবরণ'];
    const rows = filteredComplaints.map(c => [
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.phone}"`,
      `"${c.upazilas?.name_bn || ''}"`,
      `"${c.unions?.name_bn || ''}"`,
      `"${c.wards?.name_bn || ''}"`,
      `"${c.gram_moholla || ''}"`,
      `"${c.problem_categories?.name_bn || ''}"`,
      `"${c.problem_details.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `complaints_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const exportPDF = () => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    const html = `
      <html>
        <head>
          <title>Complaints Export</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            h2 { text-align: center; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #000; padding: 10px; text-align: left; font-size: 13px; }
            th { background-color: #f1f5f9; font-weight: bold; }
          </style>
        </head>
        <body>
          <h2>অভিযোগ তালিকা</h2>
          <table>
            <thead>
              <tr>
                <th>নাম</th>
                <th>মোবাইল নম্বর</th>
                <th>উপজেলা</th>
                <th>ইউনিয়ন</th>
                <th>ওয়ার্ড</th>
                <th>গ্রাম/মহল্লা</th>
                <th>সমস্যার ধরন</th>
                <th>সমস্যার বিবরণ</th>
              </tr>
            </thead>
            <tbody>
              ${filteredComplaints.map(c => `
                <tr>
                  <td>${c.name}</td>
                  <td>${c.phone}</td>
                  <td>${c.upazilas?.name_bn || '-'}</td>
                  <td>${c.unions?.name_bn || '-'}</td>
                  <td>${c.wards?.name_bn || '-'}</td>
                  <td>${c.gram_moholla || '-'}</td>
                  <td>${c.problem_categories?.name_bn || '-'}</td>
                  <td>${c.problem_details}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    doc.open();
    doc.write(html);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 250);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">অভিযোগ ব্যবস্থাপনা</h1>
            <p className="text-slate-500 font-medium">সকল নাগরিক অভিযোগের তালিকা ও আপডেট</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={exportCSV} className="bg-emerald-50 text-emerald-600 px-4 py-2.5 rounded-xl border border-emerald-200 font-bold hover:bg-emerald-100 transition-all flex items-center gap-2 text-sm">
              <Download size={18} /> CSV
            </button>
            <button onClick={exportPDF} className="bg-red-50 text-red-600 px-4 py-2.5 rounded-xl border border-red-200 font-bold hover:bg-red-100 transition-all flex items-center gap-2 text-sm">
              <FileText size={18} /> PDF
            </button>
            <button onClick={fetchComplaints} className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
              <Clock size={20} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-4">
          {/* Search and Reset */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="নাম, মোবাইল, ইমেইল, অভিযোগ নম্বর, সমস্যা বা লোকেশন দিয়ে খুঁজুন..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={clearFilters}
              className="px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-all whitespace-nowrap flex items-center justify-center gap-2"
            >
              <X size={18} /> ফিল্টার রিসেট
            </button>
          </div>

          {/* Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500">স্ট্যাটাস</label>
              <select 
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 outline-none text-sm text-slate-700"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">সকল অবস্থা</option>
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500">উপজেলা</label>
              <select 
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 outline-none text-sm text-slate-700"
                value={filterUpazila}
                onChange={(e) => { setFilterUpazila(e.target.value); setFilterUnion(''); setFilterWard(''); }}
              >
                <option value="">সকল উপজেলা</option>
                {upazilas.map(u => <option key={u.id} value={u.id}>{u.name_bn}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500">ইউনিয়ন</label>
              <select 
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 outline-none text-sm text-slate-700 disabled:bg-slate-50"
                value={filterUnion}
                onChange={(e) => { setFilterUnion(e.target.value); setFilterWard(''); }}
                disabled={!filterUpazila}
              >
                <option value="">সকল ইউনিয়ন</option>
                {unions.map(u => <option key={u.id} value={u.id}>{u.name_bn}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500">ওয়ার্ড</label>
              <select 
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 outline-none text-sm text-slate-700 disabled:bg-slate-50"
                value={filterWard}
                onChange={(e) => setFilterWard(e.target.value)}
                disabled={!filterUnion}
              >
                <option value="">সকল ওয়ার্ড</option>
                {wards.map(u => <option key={u.id} value={u.id}>{u.name_bn}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500">শুরুর তারিখ</label>
              <input 
                type="date"
                className="w-full py-2 px-3 rounded-xl border border-slate-200 outline-none text-sm text-slate-700"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500">শেষ তারিখ</label>
              <input 
                type="date"
                className="w-full py-2 px-3 rounded-xl border border-slate-200 outline-none text-sm text-slate-700"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Table / Mobile Cards */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">অভিযোগ নম্বর</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">নাম</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">মোবাইল নম্বর</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">উপজেলা</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ইউনিয়ন</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ওয়ার্ড</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">গ্রাম/মহল্লা</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">সমস্যার ধরন</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">সমস্যার বিবরণ</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">বর্তমান অবস্থা</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">জমা দেওয়ার তারিখ</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action / কার্যক্রম</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={12} className="p-20 text-center">
                      <Loader2 className="animate-spin mx-auto text-emerald-500" size={40} />
                      <p className="mt-4 text-slate-500 font-bold">লোড হচ্ছে...</p>
                    </td>
                  </tr>
                ) : filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="p-20 text-center">
                      <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle size={32} />
                      </div>
                      <p className="text-slate-500 font-bold">কোনো অভিযোগ পাওয়া যায়নি</p>
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((c) => (
                    <tr 
                      key={c.id} 
                      className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                      onClick={() => setSelectedComplaint(c)}
                    >
                      <td className="p-4 text-sm">
                        <span className="text-emerald-600 font-black tracking-tight">{c.complaint_id}</span>
                      </td>
                      <td className="p-4 text-sm font-bold text-slate-900">{c.name}</td>
                      <td className="p-4 text-sm text-slate-600">{c.phone}</td>
                      <td className="p-4 text-sm text-slate-600">{c.upazilas?.name_bn || '-'}</td>
                      <td className="p-4 text-sm text-slate-600">{c.unions?.name_bn || '-'}</td>
                      <td className="p-4 text-sm text-slate-600">{c.wards?.name_bn || '-'}</td>
                      <td className="p-4 text-sm text-slate-600">{c.gram_moholla || '-'}</td>
                      <td className="p-4 text-sm text-slate-600">{c.problem_categories?.name_bn || '-'}</td>
                      <td className="p-4 text-sm">
                        <p className="text-slate-700" title={c.problem_details}>
                          {c.problem_details.length > 30 ? c.problem_details.substring(0, 30) + '...' : c.problem_details}
                        </p>
                      </td>
                      <td className="p-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider ${getStatusColor(c.status)}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-500">
                        {new Date(c.created_at).toLocaleDateString('bn-BD')}
                      </td>
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <select 
                            className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 outline-none focus:border-emerald-500 w-[140px]"
                            value={c.status}
                            onChange={(e) => handleStatusUpdate(c.id, e.target.value)}
                            disabled={updatingId === c.id || deletingId === c.id}
                          >
                            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <button
                            onClick={() => openDeleteConfirm(c)}
                            disabled={deletingId === c.id}
                            className="p-2 bg-red-50 text-red-600 rounded-lg border border-red-100 hover:bg-red-100 transition-all disabled:opacity-50"
                            title="অভিযোগ ডিলিট করুন"
                          >
                            {deletingId === c.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="lg:hidden divide-y divide-slate-100">
            {loading ? (
              <div className="p-12 text-center">
                <Loader2 className="animate-spin mx-auto text-emerald-500" size={32} />
              </div>
            ) : filteredComplaints.length === 0 ? (
              <div className="p-12 text-center">
                <AlertCircle size={32} className="mx-auto text-slate-300 mb-2" />
                <p className="text-slate-500 font-bold">কোনো অভিযোগ পাওয়া যায়নি</p>
              </div>
            ) : (
              filteredComplaints.map((c) => (
                <div 
                  key={c.id} 
                  className="p-4 space-y-4 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                  onClick={() => setSelectedComplaint(c)}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-emerald-600 font-black text-xs tracking-tight">{c.complaint_id}</span>
                      <h4 className="font-bold text-slate-900">{c.name}</h4>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-black tracking-wider shadow-sm ${getStatusColor(c.status)}`}>
                      {c.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Phone size={14} className="text-slate-400" /> {c.phone}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar size={14} className="text-slate-400" /> {new Date(c.created_at).toLocaleDateString('bn-BD')}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 col-span-2">
                      <MapPin size={14} className="text-slate-400 shrink-0" /> 
                      <span className="truncate">{c.upazilas?.name_bn}, {c.unions?.name_bn}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 line-clamp-2 italic">
                    "{c.problem_details}"
                  </div>

                  <div className="flex gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                    <select 
                      className="flex-1 text-xs bg-white border border-slate-200 rounded-lg p-2 outline-none focus:border-emerald-500"
                      value={c.status}
                      onChange={(e) => handleStatusUpdate(c.id, e.target.value)}
                      disabled={updatingId === c.id || deletingId === c.id}
                    >
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button 
                      className="p-2 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100"
                      onClick={() => setSelectedComplaint(c)}
                    >
                      <ExternalLink size={16} />
                    </button>
                    <button 
                      className="p-2 bg-red-50 text-red-600 rounded-lg border border-red-100 disabled:opacity-50"
                      onClick={() => openDeleteConfirm(c)}
                      disabled={deletingId === c.id}
                    >
                      {deletingId === c.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 sticky top-0">
              <div>
                <h2 className="text-xl font-black text-slate-900">অভিযোগ বিস্তারিত</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">অভিযোগ আইডি: <span className="text-emerald-600 font-bold">{selectedComplaint.complaint_id}</span></p>
              </div>
              <button 
                onClick={() => setSelectedComplaint(null)}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 shadow-sm transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="space-y-6">
                {/* User Info */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                    <User size={14} /> আবেদনকারীর তথ্য
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">নাম</p>
                      <p className="font-bold text-slate-900">{selectedComplaint.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">মোবাইল নম্বর</p>
                      <p className="font-bold text-slate-900">{selectedComplaint.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Location Info */}
                <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100/50">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-4 flex items-center gap-2">
                    <MapPin size={14} /> লোকেশন বিস্তারিত
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">উপজেলা</p>
                      <p className="font-bold text-slate-900">{selectedComplaint.upazilas?.name_bn || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">ইউনিয়ন</p>
                      <p className="font-bold text-slate-900">{selectedComplaint.unions?.name_bn || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">ওয়ার্ড</p>
                      <p className="font-bold text-slate-900">{selectedComplaint.wards?.name_bn || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">গ্রাম/মহল্লা</p>
                      <p className="font-bold text-slate-900">{selectedComplaint.gram_moholla || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Problem Info */}
                <div className="bg-amber-50/50 rounded-2xl p-5 border border-amber-100/50">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-4 flex items-center gap-2">
                    <AlertCircle size={14} /> সমস্যার বিস্তারিত
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">সমস্যার ধরন</p>
                      <span className="inline-block px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700">
                        {selectedComplaint.problem_categories?.name_bn || '-'}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-2">সমস্যার পূর্ণ বিবরণ</p>
                      <div className="bg-white p-4 rounded-xl border border-slate-200 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {selectedComplaint.problem_details}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status & Date */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <p className="text-xs text-slate-500 mb-2 flex items-center gap-2">
                      <Clock size={14} /> বর্তমান অবস্থা
                    </p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-black tracking-wider ${getStatusColor(selectedComplaint.status)}`}>
                      {selectedComplaint.status}
                    </span>
                  </div>
                  <div className="flex-1 bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <p className="text-xs text-slate-500 mb-2 flex items-center gap-2">
                      <Calendar size={14} /> জমা দেওয়ার তারিখ
                    </p>
                    <p className="font-bold text-slate-900">
                      {new Date(selectedComplaint.created_at).toLocaleDateString('bn-BD', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50/50">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-500 mb-2 block">অবস্থা পরিবর্তন করুন</label>
                  <select 
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 outline-none focus:border-emerald-500 font-medium text-sm"
                    value={selectedComplaint.status}
                    onChange={(e) => handleStatusUpdate(selectedComplaint.id, e.target.value)}
                    disabled={updatingId === selectedComplaint.id || deletingId === selectedComplaint.id}
                  >
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => openDeleteConfirm(selectedComplaint)}
                    disabled={deletingId === selectedComplaint.id}
                    className="px-5 py-3 bg-red-50 text-red-600 border border-red-100 font-bold rounded-xl hover:bg-red-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {deletingId === selectedComplaint.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                    ডিলিট
                  </button>
                  <button 
                    onClick={() => setSelectedComplaint(null)}
                    className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all"
                  >
                    বন্ধ করুন
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-red-100 overflow-hidden">
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
                <Trash2 size={30} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900">আপনি কি ডিলিট করতে চান?</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  অভিযোগ নম্বর <span className="font-bold text-slate-900">{deleteTarget.complaint_id}</span> ডিলিট করলে আর রিকভার করা যাবে না।
                </p>
              </div>
            </div>
            <div className="p-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deletingId === deleteTarget.id}
                className="flex-1 px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition-all disabled:opacity-50"
              >
                বাতিল করুন
              </button>
              <button
                onClick={handleDeleteComplaint}
                disabled={deletingId === deleteTarget.id}
                className="flex-1 px-5 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {deletingId === deleteTarget.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                হ্যাঁ, ডিলিট করতে চাই
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminComplaints;
