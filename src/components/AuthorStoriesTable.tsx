import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { getCategoryShortName } from "@/utils/categoryUtils";

interface Story {
  id: string;
  story_code: string;
  title: string;
  author: string;
  category: string;
  read_count: number;
  updated_at: string;
  created_at: string;
  tagline?: string;
  excerpt?: string;
}

interface AuthorStoriesTableProps {
  stories: Story[];
}

type SortField = 'story_code' | 'title' | 'category' | 'read_count' | 'updated_at';
type SortDirection = 'asc' | 'desc';

const AuthorStoriesTable = ({ stories }: AuthorStoriesTableProps) => {
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "Fun":
        return "bg-gradient-to-b from-blue-400 to-blue-600 border-blue-700 shadow-[0_6px_12px_rgba(37,99,235,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] text-white";
      case "Life":
        return "bg-gradient-to-b from-green-400 to-green-600 border-green-700 shadow-[0_6px_12px_rgba(34,197,94,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] text-white";
      case "North Pole":
        return "bg-gradient-to-b from-red-400 to-red-600 border-red-700 shadow-[0_6px_12px_rgba(239,68,68,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] text-white";
      case "World Changers":
        return "bg-gradient-to-b from-purple-400 to-purple-600 border-purple-700 shadow-[0_6px_12px_rgba(147,51,234,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] text-white";
      case "WebText":
        return "bg-gradient-to-b from-indigo-400 to-indigo-600 border-indigo-700 shadow-[0_6px_12px_rgba(99,102,241,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] text-white";
      case "System":
        return "bg-gradient-to-b from-gray-400 to-gray-600 border-gray-700 shadow-[0_6px_12px_rgba(75,85,99,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] text-white";
      default:
        return "bg-gradient-to-b from-gray-400 to-gray-600 border-gray-700 shadow-[0_6px_12px_rgba(75,85,99,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] text-white";
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const sortedStories = [...stories].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    if (sortField === 'updated_at') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    } else if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
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
                onClick={() => handleSort('story_code')}
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}
              >
                Story Code {getSortIcon('story_code')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted"
                onClick={() => handleSort('title')}
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}
              >
                Title {getSortIcon('title')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted"
                onClick={() => handleSort('category')}
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}
              >
                Category {getSortIcon('category')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted"
                onClick={() => handleSort('read_count')}
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}
              >
                Reads {getSortIcon('read_count')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted"
                onClick={() => handleSort('updated_at')}
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}
              >
                Updated {getSortIcon('updated_at')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedStories.map((story) => (
              <TableRow key={story.id}>
                <TableCell 
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}
                  className="font-mono"
                >
                  {story.story_code}
                </TableCell>
                <TableCell style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>
                  <div>
                    <Link 
                      to={`/story/${story.story_code}`} 
                      className="hover:text-red-600 transition-colors duration-300 font-medium text-base"
                    >
                      {story.title}
                    </Link>
                    {story.tagline && (
                      <div className="text-sm font-medium text-amber-700 italic mt-1">
                        {story.tagline}
                      </div>
                    )}
                    {story.excerpt && (
                      <div className="text-sm text-amber-600 mt-1 leading-relaxed">
                        {story.excerpt}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>
                  <Badge 
                    className={`${getCategoryBadgeColor(story.category)} text-white w-full text-center`}
                  >
                    {getCategoryShortName(story.category)}
                  </Badge>
                </TableCell>
                <TableCell style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>
                  {story.read_count}
                </TableCell>
                <TableCell style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>
                  {new Date(story.updated_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AuthorStoriesTable;