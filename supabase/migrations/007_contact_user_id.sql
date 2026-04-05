-- 로그인 사용자의 Contact 제출 추적을 위해 user_id 추가
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);

-- 로그인 사용자가 자신의 제출 내역을 조회할 수 있도록 RLS 정책 추가
CREATE POLICY "Users can read own submissions" ON contact_submissions
  FOR SELECT USING (auth.uid() = user_id);
