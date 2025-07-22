
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { createSafeHtml } from "@/utils/xssProtection";

interface AuthorBio {
  id: string;
  author_name: string;
  bio_content: string | null;
  born_date: string | null;
  died_date: string | null;
  native_country_name: string | null;
  native_language: string | null;
}

interface PublicAuthorBiosTableProps {
  bios: AuthorBio[];
  onViewBio: (bio: AuthorBio) => void;
  isLoading?: boolean;
}

type SortField = 'author_name' | 'native_country_name' | 'born_date';
type SortDirection = 'asc' | 'desc';

const PublicAuthorBiosTable = ({ bios, onViewBio, isLoading = false }: PublicAuthorBiosTableProps) => {
  const [sortField, setSortField] = useState<SortField>('author_name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const formatLifeSpan = (bio: AuthorBio) => {
    if (!bio.born_date && !bio.died_date) return '—';
    
    const born = bio.born_date ? new Date(bio.born_date).getFullYear() : '?';
    const died = bio.died_date ? new Date(bio.died_date).getFullYear() : 'present';
    
    return `${born} - ${died}`;
  };

  const getCountryLanguageDisplay = (bio: AuthorBio) => {
    const parts = [];
    if (bio.native_country_name) parts.push(bio.native_country_name);
    if (bio.native_language) parts.push(bio.native_language);
    return parts.length > 0 ? parts.join(' • ') : '—';
  };

  const getBioPreview = (bioContent: string | null) => {
    if (!bioContent) return 'No biography available';
    
    // Create safe HTML and extract text content for preview
    const safeHtml = createSafeHtml(bioContent);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = safeHtml.__html;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    return textContent.substring(0, 100) + (textContent.length > 100 ? '...' : '');
  };

  const sortedBios = [...bios].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    if (sortField === 'born_date') {
      aValue = a.born_date ? new Date(a.born_date) : new Date(0);
      bValue = b.born_date ? new Date(b.born_date) : new Date(0);
    } else if (typeof aValue === 'string') {
      aValue = aValue?.toLowerCase() || '';
      bValue = bValue?.toLowerCase() || '';
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-amber-800 text-center">
            Meet Our Story Authors
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-amber-700 text-lg">Loading author biographies...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-amber-800 text-center">
          Meet Our Story Authors
        </CardTitle>
        <p className="text-amber-700 text-center text-lg leading-relaxed mt-2">
          Discover the talented authors who bring Grandpa's stories to life. 
          Click "View Bio" to learn more about each author's background and journey.
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:bg-muted text-amber-800 font-semibold"
                onClick={() => handleSort('author_name')}
              >
                Author Name {getSortIcon('author_name')}
              </TableHead>
              <TableHead className="text-amber-800 font-semibold">
                Bio Preview
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted text-amber-800 font-semibold"
                onClick={() => handleSort('native_country_name')}
              >
                Country & Language {getSortIcon('native_country_name')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted text-amber-800 font-semibold"
                onClick={() => handleSort('born_date')}
              >
                Life Span {getSortIcon('born_date')}
              </TableHead>
              <TableHead className="text-amber-800 font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedBios.map((bio) => (
              <TableRow key={bio.id} className="hover:bg-amber-50/50">
                <TableCell className="font-semibold text-amber-900">
                  {bio.author_name}
                </TableCell>
                <TableCell className="max-w-md">
                  <div className="text-sm text-amber-700 leading-relaxed">
                    {getBioPreview(bio.bio_content)}
                  </div>
                </TableCell>
                <TableCell className="text-amber-700">
                  <div className="text-sm">
                    {getCountryLanguageDisplay(bio)}
                  </div>
                </TableCell>
                <TableCell className="text-amber-700">
                  <div className="text-sm">
                    {formatLifeSpan(bio)}
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    onClick={() => onViewBio(bio)}
                    className="cozy-button bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Bio
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {sortedBios.length === 0 && (
          <div className="text-center py-8">
            <p className="text-amber-700 text-lg">
              No author biographies are currently available.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PublicAuthorBiosTable;
