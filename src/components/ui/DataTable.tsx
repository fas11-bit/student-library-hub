
import React from 'react';
import { cn } from '@/lib/utils';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  keyExtractor: (row: T) => string | number;
}

export function DataTable<T>({ columns, data, onRowClick, keyExtractor }: DataTableProps<T>) {
  return (
    <div className="w-full overflow-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border/60">
            {columns.map((column, i) => (
              <th
                key={i}
                className={cn(
                  "text-left py-3 px-4 text-sm font-medium text-muted-foreground",
                  column.className
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={keyExtractor(row)}
              onClick={() => onRowClick?.(row)}
              className={cn(
                "border-b border-border/40 text-sm",
                onRowClick && "cursor-pointer hover:bg-secondary/50 transition-colors"
              )}
            >
              {columns.map((column, i) => (
                <td key={i} className={cn("py-3 px-4", column.className)}>
                  {typeof column.accessor === 'function'
                    ? column.accessor(row)
                    : row[column.accessor] as React.ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {data.length === 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          No data available
        </div>
      )}
    </div>
  );
}
