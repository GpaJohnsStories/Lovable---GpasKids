
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown, Users } from "lucide-react";

type SortField = 'story_code' | 'title' | 'author' | 'category' | 'published' | 'read_count' | 'thumbs_up_count' | 'updated_at';
type SortDirection = 'asc' | 'desc';

interface StoriesTableHeaderProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  showActions?: boolean;
  showPublishedColumn?: boolean;
  hideAuthorColumn?: boolean;
  groupByAuthor?: boolean;
  onToggleGroupByAuthor?: () => void;
}

const StoriesTableHeader = ({ 
  sortField, 
  sortDirection, 
  onSort, 
  showActions = true,
  showPublishedColumn = true,
  hideAuthorColumn = false,
  groupByAuthor = false,
  onToggleGroupByAuthor
}: StoriesTableHeaderProps) => {
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  };

  const handleSort = (field: SortField) => {
    onSort(field);
  };

  return (
    <TableHeader>
      <TableRow className="bg-amber-50 hover:bg-amber-50">
        {/* Story Code */}
        <TableHead className="text-center w-20" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSort('story_code')}
            className="font-bold text-amber-800 hover:text-amber-900 h-8 px-2"
          >
            Code
            {getSortIcon('story_code')}
          </Button>
        </TableHead>

        {/* Title */}
        <TableHead className="w-[220px]" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSort('title')}
            className="font-bold text-amber-800 hover:text-amber-900 h-8 px-2"
          >
            Title
            {getSortIcon('title')}
          </Button>
        </TableHead>

        {/* Author - conditionally hidden */}
        {!hideAuthorColumn && (
          <TableHead className="text-center w-[120px]" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('author')}
                className="font-bold text-amber-800 hover:text-amber-900 h-8 px-2"
              >
                Author
                {getSortIcon('author')}
              </Button>
              {onToggleGroupByAuthor && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleGroupByAuthor}
                  className={`h-6 w-6 p-0 ${
                    groupByAuthor 
                      ? 'bg-amber-200 text-amber-900' 
                      : 'text-amber-700 hover:bg-amber-100'
                  }`}
                  title={groupByAuthor ? "Exit group by author view" : "Group stories by author"}
                >
                  <Users className="h-3 w-3" />
                </Button>
              )}
            </div>
          </TableHead>
        )}

        {/* Category */}
        <TableHead className="text-center w-25" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSort('category')}
            className="font-bold text-amber-800 hover:text-amber-900 h-8 px-2"
          >
            Category
            {getSortIcon('category')}
          </Button>
        </TableHead>

        {/* Copyright Status */}
        <TableHead className="text-center w-28" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <span className="font-bold text-amber-800 text-sm">
            Copyright
          </span>
        </TableHead>

        {/* Published - conditionally shown */}
        {showPublishedColumn && (
          <TableHead className="text-center w-24" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSort('published')}
              className="font-bold text-amber-800 hover:text-amber-900 h-8 px-2"
            >
              Status
              {getSortIcon('published')}
            </Button>
          </TableHead>
        )}

        {/* Stats */}
        <TableHead className="text-center w-20" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <div className="flex flex-col">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSort('read_count')}
              className="font-bold text-amber-800 hover:text-amber-900 h-6 px-1 text-xs"
            >
              Reads
              {getSortIcon('read_count')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSort('thumbs_up_count')}
              className="font-bold text-amber-800 hover:text-amber-900 h-6 px-1 text-xs"
            >
              Likes
              {getSortIcon('thumbs_up_count')}
            </Button>
          </div>
        </TableHead>

        {/* Updated */}
        <TableHead className="text-center w-20" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSort('updated_at')}
            className="font-bold text-amber-800 hover:text-amber-900 h-8 px-2"
          >
            Updated
            {getSortIcon('updated_at')}
          </Button>
        </TableHead>

        {/* Actions */}
        {showActions && (
          <TableHead className="text-center w-28" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <span className="font-bold text-amber-800 text-sm">Actions</span>
          </TableHead>
        )}
      </TableRow>
    </TableHeader>
  );
};

export default StoriesTableHeader;
