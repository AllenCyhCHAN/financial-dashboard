import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  onEdit?: (row: T) => void;
  onDelete?: (id: string) => void;
  getRowId: (row: T) => string;
  loading?: boolean;
  emptyMessage?: string;
  sx?: any;
}

export function DataTable<T>({
  data,
  columns,
  onEdit,
  onDelete,
  getRowId,
  loading = false,
  emptyMessage = 'No data available',
  sx = {},
}: DataTableProps<T>) {
  const renderCellContent = (column: TableColumn<T>, row: T) => {
    const value =
      typeof column.key === 'string'
        ? (row as any)[column.key]
        : row[column.key as keyof T];

    if (column.render) {
      return column.render(value, row);
    }

    return value;
  };

  if (loading) {
    return (
      <TableContainer component={Paper} sx={sx}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell key={index} align={column.align}>
                  {column.label}
                </TableCell>
              ))}
              {(onEdit || onDelete) && (
                <TableCell align="center">Actions</TableCell>
              )}
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
    );
  }

  if (data.length === 0) {
    return (
      <TableContainer component={Paper} sx={sx}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell key={index} align={column.align}>
                  {column.label}
                </TableCell>
              ))}
              {(onEdit || onDelete) && (
                <TableCell align="center">Actions</TableCell>
              )}
            </TableRow>
          </TableHead>
        </Table>
        <Box sx={{ p: 3, textAlign: 'center' }}>{emptyMessage}</Box>
      </TableContainer>
    );
  }

  return (
    <TableContainer component={Paper} sx={sx}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell
                key={index}
                align={column.align}
                sx={{ width: column.width }}
              >
                {column.label}
              </TableCell>
            ))}
            {(onEdit || onDelete) && (
              <TableCell align="center" sx={{ width: 120 }}>
                Actions
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(row => (
            <TableRow key={getRowId(row)} hover>
              {columns.map((column, index) => (
                <TableCell
                  key={index}
                  align={column.align}
                  sx={{ width: column.width }}
                >
                  {renderCellContent(column, row)}
                </TableCell>
              ))}
              {(onEdit || onDelete) && (
                <TableCell align="center">
                  <Box
                    sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}
                  >
                    {onEdit && (
                      <IconButton
                        size="small"
                        onClick={() => onEdit(row)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                    {onDelete && (
                      <IconButton
                        size="small"
                        onClick={() => onDelete(getRowId(row))}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// Helper function to create status chip
export const createStatusChip = (
  status: string,
  color:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning' = 'default'
) => <Chip label={status} color={color} size="small" />;

// Helper function to create currency cell
export const createCurrencyCell = (amount: number, currency: string) => (
  <Box sx={{ fontWeight: 'medium' }}>
    {new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)}
  </Box>
);

// Helper function to create date cell
export const createDateCell = (date: Date | string) => (
  <Box>{new Date(date).toLocaleDateString()}</Box>
);
