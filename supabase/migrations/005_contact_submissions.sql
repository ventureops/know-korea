-- Migration: 005_contact_submissions
-- Creates contact_submissions table for the /contact form

CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE
);

-- RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can INSERT (form submission)
CREATE POLICY "Anyone can submit" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Admin (role=4) can SELECT and UPDATE
CREATE POLICY "Admin can read" ON contact_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role >= 4
    )
  );

CREATE POLICY "Admin can update" ON contact_submissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role >= 4
    )
  );
