import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { MenuButton } from '@/hooks/useMenuData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MenuButtonListProps {
  buttons: MenuButton[];
  onEditButton: (buttonCode: string) => void;
  onRefetch: () => void;
}

const MenuButtonList: React.FC<MenuButtonListProps> = ({ 
  buttons, 
  onEditButton, 
  onRefetch 
}) => {
  const handleToggleActive = async (buttonCode: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('menu_buttons')
        .update({ is_active: !currentActive })
        .eq('button_code', buttonCode);

      if (error) throw error;

      toast.success(`Button ${!currentActive ? 'activated' : 'deactivated'}`);
      onRefetch();
    } catch (error) {
      console.error('Error toggling button active state:', error);
      toast.error('Failed to update button status');
    }
  };

  const handleDelete = async (buttonCode: string) => {
    if (!confirm('Are you sure you want to delete this button? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('menu_buttons')
        .delete()
        .eq('button_code', buttonCode);

      if (error) throw error;

      toast.success('Button deleted successfully');
      onRefetch();
    } catch (error) {
      console.error('Error deleting button:', error);
      toast.error('Failed to delete button');
    }
  };

  const getDisplayName = (button: MenuButton) => {
    return button.button_name?.trim() || 
           (button.button_code.charAt(0).toUpperCase() + button.button_code.slice(1));
  };

  if (buttons.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          No buttons found for this menu group. Click "Add New Button" to create one.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {buttons.map((button) => (
        <Card key={button.button_code} className="relative">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              {/* Button Preview */}
              <div className="flex-shrink-0">
                <div
                  className={`
                    px-4 py-2 rounded-lg border-2 font-semibold text-sm
                    ${button.bg_color} ${button.text_color}
                    ${!button.is_active ? 'opacity-50' : ''}
                  `}
                >
                  <div className="flex items-center gap-2">
                    {button.icon_url && (
                      <img 
                        src={button.icon_url} 
                        alt="" 
                        className="w-4 h-4 object-contain"
                      />
                    )}
                    <span>{getDisplayName(button)}</span>
                  </div>
                </div>
              </div>

              {/* Button Details */}
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold truncate">
                    {getDisplayName(button)}
                  </h4>
                  <Badge variant={button.is_active ? "default" : "secondary"}>
                    {button.is_active ? "Active" : "Inactive"}
                  </Badge>
                  {button.subitems && button.subitems.length > 0 && (
                    <Badge variant="outline">
                      {button.subitems.length} subitem{button.subitems.length !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  Code: <code className="bg-muted px-1 rounded">{button.button_code}</code>
                </p>
                {button.description && (
                  <p className="text-sm text-muted-foreground truncate">
                    {button.description}
                  </p>
                )}
                {button.path && (
                  <p className="text-sm text-muted-foreground">
                    Path: <code className="bg-muted px-1 rounded">{button.path}</code>
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleActive(button.button_code, button.is_active)}
                  title={button.is_active ? "Deactivate" : "Activate"}
                >
                  {button.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditButton(button.button_code)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(button.button_code)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MenuButtonList;