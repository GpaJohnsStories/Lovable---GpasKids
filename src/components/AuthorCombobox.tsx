import * as React from "react";
import { SearchableCombobox } from "@/components/ui/SearchableCombobox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthorComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AuthorCombobox({ value, onValueChange, placeholder = "Select or create author...", className, style }: AuthorComboboxProps) {
  const [authors, setAuthors] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);

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

        // Get unique authors
        const uniqueAuthors = [...new Set(data.map(story => story.author))].sort();
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

  const handleCreateNew = (newAuthor: string) => {
    if (!authors.includes(newAuthor)) {
      setAuthors(prev => [...prev, newAuthor].sort());
    }
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
    <SearchableCombobox
      value={value}
      onValueChange={onValueChange}
      options={authors}
      placeholder={placeholder}
      emptyText="No authors found."
      allowCreate={true}
      onCreateNew={handleCreateNew}
      className={className}
      style={style}
    />
  );
}