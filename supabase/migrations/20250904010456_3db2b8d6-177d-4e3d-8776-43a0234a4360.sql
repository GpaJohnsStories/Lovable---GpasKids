-- Add 'Admin' to the story_category enum
ALTER TYPE public.story_category ADD VALUE IF NOT EXISTS 'Admin';