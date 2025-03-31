
import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';

interface DataTableProps {
  data: any[];
  columns: {
    key: string;
    header: string;
    render?: (value: any, row: any) => React.ReactNode;
  }[];
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  isLoading?: boolean;
}

const DataTable = ({ 
  data, 
  columns, 
  onEdit, 
  onDelete, 
  isLoading = false 
}: DataTableProps) => {
  if (isLoading) {
    return <div className="py-8 text-center">Loading data...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="py-8 text-center">No data available</div>;
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.header}</TableHead>
            ))}
            {(onEdit || onDelete) && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={row.id || rowIndex}>
              {columns.map((column) => (
                <TableCell key={`${rowIndex}-${column.key}`}>
                  {column.render 
                    ? column.render(row[column.key], row) 
                    : String(row[column.key] || '-')}
                </TableCell>
              ))}
              {(onEdit || onDelete) && (
                <TableCell>
                  <div className="flex space-x-2">
                    {onEdit && (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => onEdit(row)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => onDelete(row)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
