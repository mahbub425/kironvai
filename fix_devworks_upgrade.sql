-- Add location columns to development_works
-- Run this in Supabase SQL Editor

ALTER TABLE development_works ADD COLUMN IF NOT EXISTS upazila_id UUID REFERENCES upazilas(id);
ALTER TABLE development_works ADD COLUMN IF NOT EXISTS union_id UUID REFERENCES unions(id);
ALTER TABLE development_works ADD COLUMN IF NOT EXISTS ward_id UUID REFERENCES wards(id);
ALTER TABLE development_works ADD COLUMN IF NOT EXISTS gram_moholla TEXT;

-- Create storage bucket for images (run separately if needed)
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read on storage
CREATE POLICY "Public read images" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Auth upload images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'images');
CREATE POLICY "Auth update images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'images');
CREATE POLICY "Auth delete images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'images');
