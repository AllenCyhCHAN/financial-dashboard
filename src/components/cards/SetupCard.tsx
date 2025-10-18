import React from 'react';
import { Card, CardContent, Grid, Button, Box } from '@mui/material';
import { FormField, FormRow } from '../forms/FormField';

interface SetupCardProps {
  title: string;
  description: string;
  items: any[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, field: string, value: any) => void;
  fields: Array<{
    key: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'date' | 'currency';
    options?: Array<{ value: string; label: string }>;
    placeholder?: string;
    xs?: number;
    sm?: number;
    md?: number;
  }>;
  addButtonText: string;
  addButtonIcon?: React.ReactNode;
}

export const SetupCard: React.FC<SetupCardProps> = ({
  title,
  description,
  items,
  onAdd,
  onRemove,
  onChange,
  fields,
  addButtonText,
  addButtonIcon,
}) => {
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <h6>{title}</h6>
        <p style={{ color: '#666', marginBottom: '16px' }}>{description}</p>
      </Box>

      {items.map((item, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              {fields.map(field => (
                <FormRow
                  key={field.key}
                  xs={field.xs || 12}
                  sm={field.sm || 6}
                  md={field.md || 3}
                >
                  <FormField
                    type={field.type}
                    label={field.label}
                    value={item[field.key]}
                    onChange={value => onChange(index, field.key, value)}
                    options={field.options}
                    placeholder={field.placeholder}
                  />
                </FormRow>
              ))}
              <FormRow xs={12} sm={1}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => onRemove(index)}
                  fullWidth
                >
                  ×
                </Button>
              </FormRow>
            </Grid>
          </CardContent>
        </Card>
      ))}

      <Button variant="outlined" onClick={onAdd} startIcon={addButtonIcon}>
        {addButtonText}
      </Button>
    </Box>
  );
};
