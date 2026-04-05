-- Migration: 006_contact_management
-- contact_submissions 테이블에 관리 컬럼 추가
-- (Admin can update 정책은 005에서 이미 생성됨)

ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS is_replied BOOLEAN DEFAULT FALSE;
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS replied_at TIMESTAMPTZ;
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS admin_note TEXT;
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT FALSE;
