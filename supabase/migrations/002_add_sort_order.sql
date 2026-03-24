-- Add sort_order column to contents table
ALTER TABLE contents ADD COLUMN IF NOT EXISTS sort_order INTEGER;

-- Set initial sort_order based on created_at ascending
UPDATE contents
SET sort_order = sub.rn
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) AS rn
  FROM contents
) sub
WHERE contents.id = sub.id;

-- Create index for faster ordering
CREATE INDEX IF NOT EXISTS idx_contents_sort_order ON contents(sort_order);
