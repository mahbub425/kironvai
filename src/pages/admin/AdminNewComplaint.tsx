import SubmitComplaint from '../SubmitComplaint';

const AdminNewComplaint = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">নতুন অভিযোগ যুক্ত করুন</h1>
        <p className="text-slate-500 font-medium">নাগরিকের পক্ষে সরাসরি অভিযোগ ফর্ম পূরণ করুন</p>
      </div>
      
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100">
        <SubmitComplaint isAdmin={true} />
      </div>
    </div>
  );
};

export default AdminNewComplaint;
