import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface MenuButton {
  id: string;
  button_code: string;
  button_name: string | null;
  menu_group: string;
  display_order: number;
  icon_url: string | null;
  bg_color: string;
  hover_bg_color: string;
  text_color: string;
  hover_shadow: string | null;
  button_width: number;
  button_height: number;
  top_color: string;
  bottom_color: string;
  button_shape: string;
  is_active: boolean;
  path: string | null;
  description: string | null;
  subitems?: MenuSubitem[];
}

export interface MenuSubitem {
  id: string;
  parent_button_code: string;
  subitem_name: string;
  subitem_path: string;
  display_order: number;
  is_active: boolean;
}

export const useMenuData = (menuGroup?: string) => {
  return useQuery({
    queryKey: ['menu-data', menuGroup],
    queryFn: async () => {
      // Get menu buttons
      let buttonsQuery = supabase
        .from('menu_buttons')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (menuGroup) {
        buttonsQuery = buttonsQuery.eq('menu_group', menuGroup);
      }

      const { data: buttons, error: buttonsError } = await buttonsQuery;

      if (buttonsError) {
        console.error('Error fetching menu buttons:', buttonsError);
        throw buttonsError;
      }

      // Get all subitems for the buttons
      const { data: subitems, error: subitemsError } = await supabase
        .from('menu_subitems')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (subitemsError) {
        console.error('Error fetching menu subitems:', subitemsError);
        throw subitemsError;
      }

      // Group subitems by parent button code
      const subitemsMap = (subitems || []).reduce((acc, subitem) => {
        if (!acc[subitem.parent_button_code]) {
          acc[subitem.parent_button_code] = [];
        }
        acc[subitem.parent_button_code].push(subitem);
        return acc;
      }, {} as Record<string, MenuSubitem[]>);

      // Attach subitems to buttons
      const buttonsWithSubitems = (buttons || []).map(button => ({
        ...button,
        subitems: subitemsMap[button.button_code] || []
      }));

      return buttonsWithSubitems as MenuButton[];
    },
  });
};