import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

const PreferredColorsTable: React.FC = () => {
  // Create 4 rows of 4 cells each
  const rows = Array.from({ length: 4 }, (_, rowIndex) => 
    Array.from({ length: 4 }, (_, colIndex) => `${rowIndex + 1}-${colIndex + 1}`)
  );

  return (
    <Card className="w-full bg-white shadow-lg rounded-2xl border-2 border-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-black">
          Preferred Colors
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cellId, colIndex) => (
                  <TableCell 
                    key={colIndex}
                    className="h-16 w-16 border border-gray-300 bg-gray-50"
                  >
                    {/* Empty cell for now */}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PreferredColorsTable;