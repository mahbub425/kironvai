import { useEffect, useState } from 'react';
import { User, Lock, Save, Globe, Smartphone, Mail, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useSiteSettings } from '../../hooks/useSiteSettings';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'system'>('profile');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [savingSystem, setSavingSystem] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const { siteTitle, defaultSiteTitle, loading, refetch } = useSiteSettings();
  const [siteTitleInput, setSiteTitleInput] = useState(defaultSiteTitle);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!loading) setSiteTitleInput(siteTitle);
  }, [loading, siteTitle]);

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    showSaved();
  };

  const handleSystemSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const nextTitle = siteTitleInput.trim();
    if (!nextTitle) {
      setError('ব্রাউজার ট্যাবের লেখা খালি রাখা যাবে না।');
      return;
    }

    setSavingSystem(true);
    const { error: saveError } = await supabase
      .from('app_settings')
      .upsert(
        {
          setting_key: 'site_title',
          setting_value: nextTitle,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'setting_key' }
      );

    if (saveError) {
      console.error(saveError);
      setError(`সেটিংস সেভ হয়নি: ${saveError.message}. Supabase SQL Editor-এ create_app_settings_table.sql রান করুন।`);
      setSavingSystem(false);
      return;
    }

    document.title = nextTitle;
    await refetch();
    showSaved();
    setSavingSystem(false);
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (passwordData.newPassword.length < 6) {
      setError('নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('নতুন পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মিলছে না।');
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setError('নতুন পাসওয়ার্ড বর্তমান পাসওয়ার্ডের মতো রাখা যাবে না।');
      return;
    }

    setSavingPassword(true);

    const { data: userData, error: userError } = await supabase.auth.getUser();
    const email = userData.user?.email;

    if (userError || !email) {
      setError('অ্যাডমিন অ্যাকাউন্ট খুঁজে পাওয়া যায়নি। আবার লগইন করে চেষ্টা করুন।');
      setSavingPassword(false);
      return;
    }

    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email,
      password: passwordData.currentPassword,
    });

    if (verifyError) {
      setError('বর্তমান পাসওয়ার্ড সঠিক নয়।');
      setSavingPassword(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: passwordData.newPassword,
    });

    if (updateError) {
      setError(`পাসওয়ার্ড আপডেট হয়নি: ${updateError.message}`);
      setSavingPassword(false);
      return;
    }

    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    showSaved();
    setSavingPassword(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">সেটিংস</h1>
        <p className="text-slate-500 font-medium">অ্যাডমিন প্রোফাইল এবং সিস্টেম কনফিগারেশন</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 shrink-0 space-y-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'profile' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <User size={18} /> প্রোফাইল তথ্য
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'security' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Lock size={18} /> পাসওয়ার্ড ও নিরাপত্তা
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'system' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Globe size={18} /> সিস্টেম সেটিংস
          </button>
        </div>

        <div className="flex-grow bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100">
          {saved && (
            <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-700">
              <CheckCircle2 size={20} className="shrink-0" />
              <p className="font-bold">পরিবর্তনগুলো সফলভাবে সংরক্ষণ করা হয়েছে!</p>
            </div>
          )}

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <p className="font-bold text-sm leading-relaxed">{error}</p>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center gap-6 pb-8 border-b border-slate-100">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-3xl font-black shrink-0">
                  A
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">অ্যাডমিন ইউজার</h3>
                  <p className="text-slate-500">প্রধান নিয়ন্ত্রক (Super Admin)</p>
                  <button className="mt-3 text-sm font-bold text-emerald-600 hover:text-emerald-700">ছবি পরিবর্তন করুন</button>
                </div>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">পুরো নাম</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="text" defaultValue="অ্যাডমিন ইউজার" className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-emerald-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">ইমেইল</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="email" defaultValue="admin@kironvai.com" disabled className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 outline-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">মোবাইল নম্বর</label>
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="tel" defaultValue="01700000000" className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-emerald-500" />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-200 transition-all">
                    <Save size={20} /> প্রোফাইল আপডেট করুন
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">পাসওয়ার্ড পরিবর্তন</h3>
                <p className="text-slate-500 text-sm">আপনার অ্যাকাউন্টের নিরাপত্তা নিশ্চিত করতে নিয়মিত পাসওয়ার্ড পরিবর্তন করুন।</p>
              </div>

              <form onSubmit={handlePasswordSave} className="space-y-6 max-w-md">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">বর্তমান পাসওয়ার্ড</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">নতুন পাসওয়ার্ড</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    minLength={6}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">নতুন পাসওয়ার্ড নিশ্চিত করুন</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    minLength={6}
                    required
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    {savingPassword ? <Loader2 size={20} className="animate-spin" /> : <Lock size={20} />}
                    পাসওয়ার্ড আপডেট
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">ব্রাউজার ট্যাবের লেখা</h3>
                <p className="text-slate-500 text-sm">ওয়েবসাইট ওপেন করলে ব্রাউজারের ট্যাবে যে নাম দেখা যায় সেটি এখান থেকে পরিবর্তন করুন।</p>
              </div>

              <form onSubmit={handleSystemSave} className="space-y-6 max-w-2xl">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">সাইট টাইটেল</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      value={siteTitleInput}
                      onChange={(e) => setSiteTitleInput(e.target.value)}
                      placeholder={defaultSiteTitle}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                    />
                  </div>
                  <p className="text-xs text-slate-400">বর্তমান ট্যাব প্রিভিউ: {siteTitleInput || defaultSiteTitle}</p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={savingSystem}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-200 transition-all disabled:opacity-50"
                  >
                    {savingSystem ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                    সাইট টাইটেল সেভ করুন
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
