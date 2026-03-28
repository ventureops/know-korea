-- Rename old category slugs to new ones
-- life-in-korea → living-in-korea
-- comparison → korea-in-the-world

UPDATE contents SET category = 'living-in-korea' WHERE category = 'life-in-korea';
UPDATE contents SET category = 'korea-in-the-world' WHERE category = 'comparison';

UPDATE qa_posts SET category = 'living-in-korea' WHERE category = 'life-in-korea';
UPDATE qa_posts SET category = 'korea-in-the-world' WHERE category = 'comparison';
