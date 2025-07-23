-- Create storage bucket for menu icons
INSERT INTO storage.buckets (id, name, public) VALUES ('menu-icons', 'menu-icons', true);

-- Create menu_buttons table
CREATE TABLE public.menu_buttons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  button_code TEXT NOT NULL UNIQUE,
  button_name TEXT,
  menu_group TEXT NOT NULL DEFAULT 'Public',
  display_order INTEGER NOT NULL DEFAULT 0,
  icon_url TEXT,
  bg_color TEXT NOT NULL DEFAULT 'bg-blue-500',
  hover_bg_color TEXT NOT NULL DEFAULT 'hover:bg-blue-600',
  text_color TEXT NOT NULL DEFAULT 'text-white',
  hover_shadow TEXT,
  button_size TEXT NOT NULL DEFAULT 'default',
  is_active BOOLEAN NOT NULL DEFAULT true,
  path TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create menu_subitems table
CREATE TABLE public.menu_subitems (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_button_code TEXT NOT NULL,
  subitem_name TEXT NOT NULL,
  subitem_path TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (parent_button_code) REFERENCES public.menu_buttons(button_code) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.menu_buttons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_subitems ENABLE ROW LEVEL SECURITY;

-- RLS policies for menu_buttons
CREATE POLICY "Anyone can view menu buttons" 
ON public.menu_buttons 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage menu buttons" 
ON public.menu_buttons 
FOR ALL 
USING (is_admin()) 
WITH CHECK (is_admin());

-- RLS policies for menu_subitems
CREATE POLICY "Anyone can view menu subitems" 
ON public.menu_subitems 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage menu subitems" 
ON public.menu_subitems 
FOR ALL 
USING (is_admin()) 
WITH CHECK (is_admin());

-- Storage policies for menu icons
CREATE POLICY "Anyone can view menu icons" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'menu-icons');

CREATE POLICY "Admins can upload menu icons" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'menu-icons' AND is_admin());

CREATE POLICY "Admins can update menu icons" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'menu-icons' AND is_admin());

CREATE POLICY "Admins can delete menu icons" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'menu-icons' AND is_admin());

-- Create update trigger for menu_buttons
CREATE TRIGGER update_menu_buttons_updated_at
BEFORE UPDATE ON public.menu_buttons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create update trigger for menu_subitems
CREATE TRIGGER update_menu_subitems_updated_at
BEFORE UPDATE ON public.menu_subitems
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default menu buttons to replace current hardcoded navigation
INSERT INTO public.menu_buttons (button_code, button_name, menu_group, display_order, path, bg_color, hover_bg_color, text_color, hover_shadow, description) VALUES
('stories', '', 'Public', 1, '/library', 'bg-blue-500', 'hover:bg-blue-600', 'text-white', 'hover:shadow-[0_4px_0_#1d4ed8,0_6px_12px_rgba(0,0,0,0.4)]', 'Browse All Stories'),
('about', '', 'Public', 2, '/about', 'bg-green-500', 'hover:bg-green-600', 'text-white', 'hover:shadow-[0_4px_0_#16a34a,0_6px_12px_rgba(0,0,0,0.4)]', 'About Grandpa John'),
('writing', '', 'Public', 3, '/writing', 'bg-purple-500', 'hover:bg-purple-600', 'text-white', 'hover:shadow-[0_4px_0_#9333ea,0_6px_12px_rgba(0,0,0,0.4)]', 'Submit Your Story'),
('comments', '', 'Public', 4, NULL, 'bg-yellow-500', 'hover:bg-yellow-600', 'text-green-800', 'hover:shadow-[0_4px_0_#ca8a04,0_6px_12px_rgba(0,0,0,0.4)]', 'Make a Comment or View All Comments'),
('help', '', 'Public', 5, '/help-gpa', 'bg-red-500', 'hover:bg-red-600', 'text-white', 'hover:shadow-[0_4px_0_#dc2626,0_6px_12px_rgba(0,0,0,0.4)]', 'Get Help Using This Site'),
('admin', '', 'Admin', 1, '/buddys_admin', 'bg-gray-700', 'hover:bg-gray-800', 'text-white', 'hover:shadow-[0_4px_0_#374151,0_6px_12px_rgba(0,0,0,0.4)]', 'Admin Dashboard');

-- Insert subitems for comments dropdown
INSERT INTO public.menu_subitems (parent_button_code, subitem_name, subitem_path, display_order) VALUES
('comments', 'Make Comment', '/make-comment', 1),
('comments', 'View Comments', '/view-comments', 2);