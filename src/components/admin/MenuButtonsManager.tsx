import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useMenuData } from '@/hooks/useMenuData';
import MenuButtonEditor from './MenuButtonEditor';
import MenuButtonList from './MenuButtonList';

const MenuButtonsManager = () => {
  const [selectedMenuGroup, setSelectedMenuGroup] = useState<string>('Public');
  const [editingButton, setEditingButton] = useState<string | null>(null);
  const [showingEditor, setShowingEditor] = useState(false);
  const { data: menuButtons, isLoading, refetch } = useMenuData();

  const menuGroups = ['Public', 'Admin'];
  const filteredButtons = menuButtons?.filter(button => button.menu_group === selectedMenuGroup) || [];

  const handleCreateNew = () => {
    setEditingButton(null);
    setShowingEditor(true);
  };

  const handleEditButton = (buttonCode: string) => {
    setEditingButton(buttonCode);
    setShowingEditor(true);
  };

  const handleCloseEditor = () => {
    setShowingEditor(false);
    setEditingButton(null);
    refetch();
  };

  if (showingEditor) {
    return (
      <MenuButtonEditor
        buttonCode={editingButton}
        menuGroup={selectedMenuGroup}
        onClose={handleCloseEditor}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Menu Navigation Manager</CardTitle>
          <CardDescription>
            Create and manage navigation buttons for your website menus
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Menu Group Selector */}
            <div className="lg:w-1/4">
              <h3 className="text-lg font-semibold mb-4">Menu Groups</h3>
              <div className="space-y-2">
                {menuGroups.map((group) => (
                  <Button
                    key={group}
                    variant={selectedMenuGroup === group ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedMenuGroup(group)}
                  >
                    {group}
                  </Button>
                ))}
              </div>
              <Button
                onClick={handleCreateNew}
                className="w-full mt-4"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Button
              </Button>
            </div>

            {/* Button List */}
            <div className="lg:w-3/4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {selectedMenuGroup} Menu Buttons
                </h3>
                <span className="text-sm text-muted-foreground">
                  {filteredButtons.length} button{filteredButtons.length !== 1 ? 's' : ''}
                </span>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse bg-muted rounded h-20 w-full"></div>
                  ))}
                </div>
              ) : (
                <MenuButtonList
                  buttons={filteredButtons}
                  onEditButton={handleEditButton}
                  onRefetch={refetch}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MenuButtonsManager;