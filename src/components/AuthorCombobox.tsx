import * as React from "react";
import { SearchableCombobox } from "@/components/ui/SearchableCombobox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface AuthorComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AuthorCombobox({ value, onValueChange, placeholder = "Select author...", className, style }: AuthorComboboxProps) {
  const [authors, setAuthors] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [newAuthorName, setNewAuthorName] = React.useState("");

  React.useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const { data, error } = await supabase
          .from('stories')
          .select('author')
          .not('author', 'is', null)
          .order('author');

        if (error) {
          console.error('Error fetching authors:', error);
          toast.error("Failed to load authors");
          return;
        }

        // Get unique authors and trim whitespace
        const uniqueAuthors = [...new Set(data.map(story => story.author?.trim()).filter(Boolean))].sort();
        setAuthors(uniqueAuthors);
      } catch (error) {
        console.error('Error in fetchAuthors:', error);
        toast.error("Failed to load authors");
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  const handleAddAuthor = () => {
    const trimmedName = newAuthorName.trim();
    
    // Validate minimum length
    if (trimmedName.length < 4) {
      toast.error("Author name must be at least 4 characters long");
      return;
    }
    
    // Check if already exists (case insensitive)
    if (authors.some(author => author.toLowerCase() === trimmedName.toLowerCase())) {
      toast.error("This author already exists");
      return;
    }
    
    // Add to authors list and select it
    setAuthors(prev => [...prev, trimmedName].sort());
    onValueChange(trimmedName);
    setNewAuthorName("");
    setDialogOpen(false);
  };

  if (loading) {
    return (
      <div className={className} style={style}>
        <div className="border border-gray-300 rounded px-3 py-2 text-gray-500">
          Loading authors...
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <SearchableCombobox
        value={value}
        onValueChange={onValueChange}
        options={authors}
        placeholder={placeholder}
        emptyText="No authors found."
        allowCreate={false}
        className={className}
        style={style}
      />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" type="button">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Author</DialogTitle>
            <DialogDescription>
              Enter the full name of the new author (minimum 4 characters).
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="author-name">Author Name</Label>
              <Input
                id="author-name"
                value={newAuthorName}
                onChange={(e) => setNewAuthorName(e.target.value)}
                placeholder="Enter full author name..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddAuthor();
                  }
                }}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAuthor}>
              Add Author
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}