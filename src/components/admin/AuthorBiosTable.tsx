import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

type SortField = 'author_name' | 'created_at' | 'updated_at';
type SortDirection = 'asc' | 'desc';

interface AuthorBiosTableProps {
  onEditBio: (bio: any) => void;
  onCreateBio: () => void;
}

const AuthorBiosTable = ({ onEditBio, onCreateBio }: AuthorBiosTableProps) => {
  const [sortField, setSortField] = useState<SortField>('author_name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const { data: bios, isLoading: biosLoading, refetch } = useQuery({
    queryKey: ['admin-author-bios', sortField, sortDirection],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('author_bios')
        .select('*')
        .order(sortField, { ascending: sortDirection === 'asc' });
      
      if (error) throw error;
      return data;
    },
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeleteBio = async (id: string, authorName: string) => {
    if (!confirm(`Are you sure you want to delete the bio for ${authorName}?`)) return;

    const { error } = await supabase
      .from('author_bios')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Error deleting author bio");
      console.error(error);
    } else {
      toast.success("Author bio deleted successfully");
      refetch();
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Author Biographies</CardTitle>
          <Button onClick={onCreateBio} className="cozy-button">
            <Plus className="h-4 w-4 mr-2" />
            Create New Bio
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {biosLoading ? (
          <div className="text-center py-8" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>
            <BookOpen className="h-8 w-8 animate-spin text-orange-600 mx-auto mb-4" />
            <p>Loading author bios...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => handleSort('author_name')}
                >
                  Author Name {getSortIcon('author_name')}
                </TableHead>
                <TableHead>Bio Preview</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => handleSort('updated_at')}
                >
                  Last Updated {getSortIcon('updated_at')}
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bios?.map((bio) => (
                <TableRow key={bio.id}>
                  <TableCell className="font-medium">
                    {bio.author_name}
                  </TableCell>
                  <TableCell className="max-w-md">
                    <div className="truncate">
                      {bio.bio_content ? bio.bio_content.substring(0, 100) + (bio.bio_content.length > 100 ? '...' : '') : 'No bio content'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(bio.updated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEditBio(bio)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteBio(bio.id, bio.author_name)}
                        className="hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthorBiosTable;