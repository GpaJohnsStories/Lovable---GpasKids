
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

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
}

type SortField = 'author_name' | 'native_country_name' | 'born_date';
type SortDirection = 'asc' | 'desc';

const PublicAuthorBiosTable = ({ bios, onViewBio }: PublicAuthorBiosTableProps) => {
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

  return (
    <Card>
      <CardContent className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:bg-muted"
                onClick={() => handleSort('author_name')}
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}
              >
                Author Name {getSortIcon('author_name')}
              </TableHead>
              <TableHead>Bio Preview</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted"
                onClick={() => handleSort('native_country_name')}
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}
              >
                Country {getSortIcon('native_country_name')}
              </TableHead>
              <TableHead>Language</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted"
                onClick={() => handleSort('born_date')}
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}
              >
                Life Span {getSortIcon('born_date')}
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedBios.map((bio) => (
              <TableRow key={bio.id}>
                <TableCell 
                  className="font-semibold"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}
                >
                  {bio.author_name}
                </TableCell>
                <TableCell 
                  className="max-w-md"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}
                >
                  <div className="truncate text-sm text-amber-700">
                    {bio.bio_content 
                      ? bio.bio_content.substring(0, 100) + (bio.bio_content.length > 100 ? '...' : '')
                      : 'No biography available'
                    }
                  </div>
                </TableCell>
                <TableCell style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>
                  {bio.native_country_name || '—'}
                </TableCell>
                <TableCell style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>
                  {bio.native_language || '—'}
                </TableCell>
                <TableCell style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>
                  {formatLifeSpan(bio)}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    onClick={() => onViewBio(bio)}
                    className="cozy-button"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Bio
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PublicAuthorBiosTable;
