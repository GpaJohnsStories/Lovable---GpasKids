-- Add usage_locations column to icon_library table
ALTER TABLE public.icon_library ADD COLUMN usage_locations JSONB DEFAULT '[]'::jsonb;

-- Update existing records with usage location data
UPDATE public.icon_library SET usage_locations = '[
  {
    "component": "SimpleVerticalMenu",
    "location": "Main Vertical Menu → Button 1 (Guide)",
    "context": "Guide navigation"
  }
]'::jsonb WHERE file_name_path = 'ICO-GU1.jpg';

UPDATE public.icon_library SET usage_locations = '[
  {
    "component": "SimpleVerticalMenu",
    "location": "Main Vertical Menu → Button 2 (Home)",
    "context": "Home navigation"
  }
]'::jsonb WHERE file_name_path = '!CO-HOX.jpg';

UPDATE public.icon_library SET usage_locations = '[
  {
    "component": "SimpleVerticalMenu",
    "location": "Main Vertical Menu → Button 3 (Library)",
    "context": "Library navigation"
  }
]'::jsonb WHERE file_name_path = '!CO-LB1.gif';

UPDATE public.icon_library SET usage_locations = '[
  {
    "component": "SimpleVerticalMenu",
    "location": "Main Vertical Menu → Button 4 (Read Story)",
    "context": "Read story navigation"
  }
]'::jsonb WHERE file_name_path = '!CO-LB3.gif';

UPDATE public.icon_library SET usage_locations = '[
  {
    "component": "SimpleVerticalMenu",
    "location": "Main Vertical Menu → Button 5 (Comments)",
    "context": "Comments navigation"
  }
]'::jsonb WHERE file_name_path = '!CO-CO1.gif';

UPDATE public.icon_library SET usage_locations = '[
  {
    "component": "SimpleVerticalMenu",
    "location": "Comments Submenu → Button 1 (Make Comment)",
    "context": "Make comment action"
  }
]'::jsonb WHERE file_name_path = '!CO-CO2.gif';

UPDATE public.icon_library SET usage_locations = '[
  {
    "component": "SimpleVerticalMenu",
    "location": "Comments Submenu → Button 2 (View Comments)",
    "context": "View comments action"
  }
]'::jsonb WHERE file_name_path = '!CO-CO3.gif';

UPDATE public.icon_library SET usage_locations = '[
  {
    "component": "SimpleVerticalMenu",
    "location": "Main Vertical Menu → Button 6 (Writing)",
    "context": "Writing navigation"
  }
]'::jsonb WHERE file_name_path = '!CO-WR3.jpg';

UPDATE public.icon_library SET usage_locations = '[
  {
    "component": "SimpleVerticalMenu",
    "location": "Writing Submenu → Button 1 (Submit Story)",
    "context": "Submit story action"
  }
]'::jsonb WHERE file_name_path = '!CO-WR2.gif';

UPDATE public.icon_library SET usage_locations = '[
  {
    "component": "SimpleVerticalMenu",
    "location": "Main Vertical Menu → Button 7 (About Us)",
    "context": "About Us navigation"
  }
]'::jsonb WHERE file_name_path = '!CO-AB1.jpg';

UPDATE public.icon_library SET usage_locations = '[
  {
    "component": "SimpleVerticalMenu",
    "location": "About Us Submenu → Button 2 (3 Helpers)",
    "context": "3 Helpers section"
  }
]'::jsonb WHERE file_name_path = '!CO-AB3.jpg';

UPDATE public.icon_library SET usage_locations = '[
  {
    "component": "SimpleVerticalMenu",
    "location": "About Us Submenu → Button 4 (3 Helpful AIs)",
    "context": "3 Helpful AIs section"
  }
]'::jsonb WHERE file_name_path = '!CO-AB5.jpg';

UPDATE public.icon_library SET usage_locations = '[
  {
    "component": "SimpleVerticalMenu",
    "location": "Main Vertical Menu → Button 8 (Safe & Secure)",
    "context": "Safe & Secure navigation"
  }
]'::jsonb WHERE file_name_path = '!CO-SA1.jpg';