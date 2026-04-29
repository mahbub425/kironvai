-- Dummy data for development works
-- Run this in Supabase SQL Editor.

ALTER TABLE development_works ADD COLUMN IF NOT EXISTS upazila_id UUID REFERENCES upazilas(id);
ALTER TABLE development_works ADD COLUMN IF NOT EXISTS union_id UUID REFERENCES unions(id);
ALTER TABLE development_works ADD COLUMN IF NOT EXISTS ward_id UUID REFERENCES wards(id);
ALTER TABLE development_works ADD COLUMN IF NOT EXISTS gram_moholla TEXT;

ALTER TABLE development_works ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read for dev_works" ON development_works;
CREATE POLICY "Allow public read for dev_works"
ON development_works FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow admin insert for dev_works" ON development_works;
CREATE POLICY "Allow admin insert for dev_works"
ON development_works FOR INSERT TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin update for dev_works" ON development_works;
CREATE POLICY "Allow admin update for dev_works"
ON development_works FOR UPDATE TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin delete for dev_works" ON development_works;
CREATE POLICY "Allow admin delete for dev_works"
ON development_works FOR DELETE TO authenticated
USING (true);

INSERT INTO development_works (
  title_bn,
  description_bn,
  image_path,
  location_text_bn,
  work_date,
  work_status,
  is_featured,
  sort_order
) VALUES
(
  'ভূরুঙ্গামারী সদর সড়ক সংস্কার ও প্রশস্তকরণ',
  'ভূরুঙ্গামারী সদর বাজার থেকে বাসস্ট্যান্ড পর্যন্ত গুরুত্বপূর্ণ সড়কটি সংস্কার ও প্রশস্তকরণের কাজ সম্পন্ন করা হয়েছে। এতে স্থানীয় ব্যবসায়ী, শিক্ষার্থী ও সাধারণ মানুষের যাতায়াত আরও সহজ ও নিরাপদ হবে।',
  'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=1200',
  'ভূরুঙ্গামারী সদর',
  '2026-01-15',
  'সম্পন্ন',
  true,
  1
),
(
  'নাগেশ্বরী উপজেলা স্বাস্থ্য কমপ্লেক্সে নতুন ওয়ার্ড নির্মাণ',
  'রোগীদের চাপ কমাতে এবং চিকিৎসা সেবার মান উন্নত করতে উপজেলা স্বাস্থ্য কমপ্লেক্সে নতুন ওয়ার্ড নির্মাণের কাজ চলমান রয়েছে। নতুন ওয়ার্ডে অতিরিক্ত বেড, উন্নত আলো-বাতাস এবং জরুরি চিকিৎসা সুবিধা থাকবে।',
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200',
  'নাগেশ্বরী উপজেলা স্বাস্থ্য কমপ্লেক্স',
  '2026-02-10',
  'চলমান',
  true,
  2
),
(
  'চরাঞ্চলে সোলার স্ট্রিট লাইট স্থাপন',
  'রাতের নিরাপত্তা বৃদ্ধি এবং মানুষের চলাচল সহজ করতে চরাঞ্চলের গুরুত্বপূর্ণ রাস্তা, ঘাট ও বাজার এলাকায় সোলার স্ট্রিট লাইট স্থাপনের উদ্যোগ নেওয়া হয়েছে।',
  'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=1200',
  'ব্রহ্মপুত্র নদসংলগ্ন চরাঞ্চল',
  '2026-03-05',
  'পরিকল্পিত',
  true,
  3
),
(
  'প্রাথমিক বিদ্যালয়ে নিরাপদ পানির ব্যবস্থা',
  'শিক্ষার্থীদের সুস্বাস্থ্য নিশ্চিত করতে কয়েকটি প্রাথমিক বিদ্যালয়ে গভীর নলকূপ ও পানি বিশুদ্ধকরণ ব্যবস্থা স্থাপন করা হয়েছে। এর মাধ্যমে বিদ্যালয়ের শিশুদের নিরাপদ পানির চাহিদা পূরণ হবে।',
  'https://images.unsplash.com/photo-1541976844346-f18aeac57b06?auto=format&fit=crop&q=80&w=1200',
  'ভূরুঙ্গামারী ও নাগেশ্বরীর নির্বাচিত বিদ্যালয়',
  '2026-03-20',
  'সম্পন্ন',
  false,
  4
),
(
  'গ্রামীণ ব্রিজ সংস্কার প্রকল্প',
  'বর্ষাকালে যোগাযোগ বিচ্ছিন্নতা কমাতে ক্ষতিগ্রস্ত গ্রামীণ ব্রিজগুলো সংস্কারের পরিকল্পনা গ্রহণ করা হয়েছে। প্রকল্পটি বাস্তবায়িত হলে কৃষিপণ্য পরিবহন ও জরুরি যাতায়াত সহজ হবে।',
  'https://images.unsplash.com/photo-1513828742140-ccaa28f3eda0?auto=format&fit=crop&q=80&w=1200',
  'জয়মনিরহাট ও আশপাশের গ্রামীণ এলাকা',
  '2026-04-01',
  'পরিকল্পিত',
  false,
  5
),
(
  'ড্রেনেজ উন্নয়ন ও জলাবদ্ধতা নিরসন',
  'বাজার ও আবাসিক এলাকায় জলাবদ্ধতা কমাতে নতুন ড্রেন নির্মাণ এবং পুরোনো ড্রেন পরিষ্কার-সংস্কারের কাজ শুরু হয়েছে। এতে বর্ষাকালে মানুষের দুর্ভোগ কমবে।',
  'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&q=80&w=1200',
  'নাগেশ্বরী বাজার এলাকা',
  '2026-04-12',
  'চলমান',
  false,
  6
),
(
  'কৃষক সহায়ক সেচ নালা পুনঃখনন',
  'কৃষি উৎপাদন বাড়াতে এবং জমিতে পানি সরবরাহ সহজ করতে পুরোনো সেচ নালা পুনঃখননের কাজ হাতে নেওয়া হয়েছে। স্থানীয় কৃষকেরা এতে বোরো ও আমন মৌসুমে সরাসরি উপকৃত হবেন।',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200',
  'পাথরডুবি ইউনিয়ন',
  '2026-04-25',
  'চলমান',
  false,
  7
);

NOTIFY pgrst, 'reload schema';
