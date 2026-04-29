-- Sample Data for Kurigram-1
-- Run this in your Supabase SQL Editor

-- 1. Get Upazila IDs (Run these one by one or as a script if you know the IDs)
-- For this script, we'll use a subquery to match names

-- Insert Unions for Bhurungamari
INSERT INTO unions (upazila_id, name_bn) 
SELECT id, 'ভূরুঙ্গামারী সদর' FROM upazilas WHERE name_bn = 'ভূরুঙ্গামারী';
INSERT INTO unions (upazila_id, name_bn) 
SELECT id, 'পাইকেরছড়া' FROM upazilas WHERE name_bn = 'ভূরুঙ্গামারী';
INSERT INTO unions (upazila_id, name_bn) 
SELECT id, 'তিলাই' FROM upazilas WHERE name_bn = 'ভূরুঙ্গামারী';

-- Insert Wards for Bhurungamari Sadar
INSERT INTO wards (upazila_id, union_id, name_bn)
SELECT u.id, un.id, '১ নং ওয়ার্ড' 
FROM upazilas u, unions un 
WHERE u.name_bn = 'ভূরুঙ্গামারী' AND un.name_bn = 'ভূরুঙ্গামারী সদর';

INSERT INTO wards (upazila_id, union_id, name_bn)
SELECT u.id, un.id, '২ নং ওয়ার্ড' 
FROM upazilas u, unions un 
WHERE u.name_bn = 'ভূরুঙ্গামারী' AND un.name_bn = 'ভূরুঙ্গামারী সদর';

-- Insert Problem Categories
INSERT INTO problem_categories (name_bn, sort_order) VALUES 
('রাস্তা সমস্যা', 1),
('ব্রিজ/কালভার্ট সমস্যা', 2),
('বিদ্যুৎ সমস্যা', 3),
('পানি সমস্যা', 4),
('শিক্ষা প্রতিষ্ঠান সমস্যা', 5),
('স্বাস্থ্যসেবা সমস্যা', 6),
('অন্যান্য', 10);
