-- =====================================================
-- Dummy Data for Development and Social Works
-- Run this SQL in your Supabase SQL Editor
-- =====================================================

-- Insert Dummy Development Works
INSERT INTO development_works (
    title_bn, 
    description_bn, 
    work_status, 
    location_text_bn, 
    work_date, 
    image_path, 
    is_featured, 
    sort_order
) VALUES 
(
    'নতুন পাকা রাস্তা নির্মাণ', 
    'ভূরুঙ্গামারী সদর থেকে বাস স্ট্যান্ড পর্যন্ত ২ কিলোমিটার নতুন পাকা রাস্তা নির্মাণের কাজ সম্পন্ন হয়েছে। এর ফলে এলাকার মানুষের যাতায়াত অনেক সহজ হবে।', 
    'সম্পন্ন', 
    'ভূরুঙ্গামারী সদর', 
    '2025-10-15', 
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800', 
    true, 
    1
),
(
    'আদর্শ উচ্চ বিদ্যালয়ে নতুন ভবন', 
    'শিক্ষার্থীদের জন্য আধুনিক সুবিধা সম্পন্ন একটি নতুন ৪ তলা ভবনের কাজ শুরু হয়েছে।', 
    'চলমান', 
    'আন্ধারীঝাড়', 
    '2026-02-10', 
    'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=800', 
    true, 
    2
),
(
    'ব্রিজ সংস্কার ও পুনঃনির্মাণ', 
    'বন্যায় ক্ষতিগ্রস্ত ব্রিজটির সংস্কার কাজের পরিকল্পনা গ্রহণ করা হয়েছে, যা আগামী মাসে শুরু হবে।', 
    'পরিকল্পিত', 
    'জয়মনিরহাট', 
    '2026-05-01', 
    'https://images.unsplash.com/photo-1513828742140-ccaa28f3eda0?auto=format&fit=crop&q=80&w=800', 
    true, 
    3
);

-- Insert Dummy Social Works
INSERT INTO social_works (
    title_bn, 
    description_bn, 
    work_type, 
    location_text_bn, 
    work_date, 
    image_path, 
    is_featured, 
    sort_order
) VALUES 
(
    'শীতবস্ত্র বিতরণ কর্মসূচি', 
    'অসহায় ও দরিদ্র শীতার্ত মানুষদের মাঝে ৫০০০-এর বেশি কম্বল ও শীতবস্ত্র বিতরণ করা হয়েছে।', 
    'ত্রাণ বিতরণ', 
    'ভূরুঙ্গামারী সদর ও চর এলাকা', 
    '2025-12-25', 
    'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=800', 
    true, 
    1
),
(
    'ফ্রি মেডিকেল ক্যাম্প ও ঔষধ বিতরণ', 
    'বিশেষজ্ঞ ডাক্তারদের মাধ্যমে দিনব্যাপী বিনামূল্যে চিকিৎসা সেবা এবং প্রয়োজনীয় ঔষধ প্রদান করা হয়।', 
    'স্বাস্থ্য ক্যাম্প', 
    'পাথরডুবি ইউনিয়ন', 
    '2026-01-20', 
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800', 
    true, 
    2
),
(
    'মেধাবী শিক্ষার্থীদের বৃত্তি প্রদান', 
    'দরিদ্র ও মেধাবী শিক্ষার্থীদের মাঝে শিক্ষাসামগ্রী ও নগদ অর্থ বৃত্তি হিসেবে প্রদান করা হয়েছে।', 
    'শিক্ষা সহায়তা', 
    'বঙ্গসোনাহাট', 
    '2026-03-15', 
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800', 
    true, 
    3
);
