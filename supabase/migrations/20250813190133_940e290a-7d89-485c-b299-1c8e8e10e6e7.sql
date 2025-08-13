-- Step 1: Rename file_path column to file_name_path
ALTER TABLE public.icon_library RENAME COLUMN file_path TO file_name_path;

-- Step 2: Delete id column (first drop primary key constraint)
ALTER TABLE public.icon_library DROP CONSTRAINT icon_library_pkey;
ALTER TABLE public.icon_library DROP COLUMN id;

-- Step 3: Make icon_name a secondary key (add index)
CREATE INDEX idx_icon_library_icon_name ON public.icon_library(icon_name);

-- Step 4: Make file_name_path the primary key
ALTER TABLE public.icon_library ADD PRIMARY KEY (file_name_path);