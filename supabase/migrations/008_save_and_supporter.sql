-- Migration: 008_save_and_supporter
-- Save/Favorite 기능 + Supporter 배지

-- Save/Favorite 기능
CREATE TABLE IF NOT EXISTS content_saves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  content_id UUID REFERENCES contents(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, content_id)
);

ALTER TABLE content_saves ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'content_saves' AND policyname = 'Users can manage own saves'
  ) THEN
    CREATE POLICY "Users can manage own saves" ON content_saves
      FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- Supporter 배지
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_supporter BOOLEAN DEFAULT FALSE;
