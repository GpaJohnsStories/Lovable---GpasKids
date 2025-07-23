import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, GripVertical } from 'lucide-react';
import { MenuSubitem } from '@/hooks/useMenuData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MenuSubitemsEditorProps {
  parentButtonCode: string;
  subitems: MenuSubitem[];
  onUpdate: (subitems: MenuSubitem[]) => void;
}

const MenuSubitemsEditor: React.FC<MenuSubitemsEditorProps> = ({
  parentButtonCode,
  subitems,
  onUpdate,
}) => {
  const [newSubitem, setNewSubitem] = useState({ name: '', path: '' });
  const [loading, setLoading] = useState(false);

  const handleAddSubitem = async () => {
    if (!newSubitem.name.trim() || !newSubitem.path.trim()) {
      toast.error('Both name and path are required');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('menu_subitems')
        .insert({
          parent_button_code: parentButtonCode,
          subitem_name: newSubitem.name,
          subitem_path: newSubitem.path,
          display_order: subitems.length,
        })
        .select()
        .single();

      if (error) throw error;

      onUpdate([...subitems, data]);
      setNewSubitem({ name: '', path: '' });
      toast.success('Subitem added successfully');
    } catch (error) {
      console.error('Error adding subitem:', error);
      toast.error('Failed to add subitem');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubitem = async (subitemId: string) => {
    try {
      const { error } = await supabase
        .from('menu_subitems')
        .delete()
        .eq('id', subitemId);

      if (error) throw error;

      onUpdate(subitems.filter(item => item.id !== subitemId));
      toast.success('Subitem deleted successfully');
    } catch (error) {
      console.error('Error deleting subitem:', error);
      toast.error('Failed to delete subitem');
    }
  };

  const handleUpdateSubitem = async (subitemId: string, field: string, value: string) => {
    try {
      const { error } = await supabase
        .from('menu_subitems')
        .update({ [field]: value })
        .eq('id', subitemId);

      if (error) throw error;

      onUpdate(subitems.map(item => 
        item.id === subitemId ? { ...item, [field]: value } : item
      ));
    } catch (error) {
      console.error('Error updating subitem:', error);
      toast.error('Failed to update subitem');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dropdown Menu Items</CardTitle>
        <CardDescription>
          Add sub-navigation items that appear when this button is clicked
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Subitems */}
        {subitems.length > 0 && (
          <div className="space-y-3">
            {subitems.map((subitem, index) => (
              <div key={subitem.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <div className="flex-grow grid grid-cols-2 gap-3">
                  <Input
                    value={subitem.subitem_name}
                    onChange={(e) => handleUpdateSubitem(subitem.id, 'subitem_name', e.target.value)}
                    placeholder="Item name"
                  />
                  <Input
                    value={subitem.subitem_path}
                    onChange={(e) => handleUpdateSubitem(subitem.id, 'subitem_path', e.target.value)}
                    placeholder="Item path"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteSubitem(subitem.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Subitem */}
        <div className="border-t pt-4">
          <Label className="text-sm font-medium mb-3 block">Add New Dropdown Item</Label>
          <div className="flex items-center gap-3">
            <Input
              placeholder="Item name (e.g., Make Comment)"
              value={newSubitem.name}
              onChange={(e) => setNewSubitem(prev => ({ ...prev, name: e.target.value }))}
            />
            <Input
              placeholder="Item path (e.g., /make-comment)"
              value={newSubitem.path}
              onChange={(e) => setNewSubitem(prev => ({ ...prev, path: e.target.value }))}
            />
            <Button onClick={handleAddSubitem} disabled={loading} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>

        {subitems.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No dropdown items. This button will navigate directly to its path.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MenuSubitemsEditor;
