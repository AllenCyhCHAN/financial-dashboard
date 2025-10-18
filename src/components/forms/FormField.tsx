import React from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Currency } from '../../types/index.js';

interface FormFieldProps {
  type: 'text' | 'number' | 'select' | 'date' | 'currency';
  label: string;
  value: any;
  onChange: (value: any) => void;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  fullWidth?: boolean;
  required?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
}

export const FormField: React.FC<FormFieldProps> = ({
  type,
  label,
  value,
  onChange,
  options = [],
  placeholder,
  fullWidth = true,
  required = false,
  disabled = false,
  multiline = false,
  rows = 1,
}) => {
  const handleChange = (event: any) => {
    if (type === 'number') {
      onChange(parseFloat(event.target.value) || 0);
    } else {
      onChange(event.target.value);
    }
  };

  const handleDateChange = (newValue: Date | null) => {
    onChange(newValue);
  };

  const renderField = () => {
    switch (type) {
      case 'text':
        return (
          <TextField
            fullWidth={fullWidth}
            label={label}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            multiline={multiline}
            rows={rows}
          />
        );

      case 'number':
        return (
          <TextField
            fullWidth={fullWidth}
            label={label}
            type="number"
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
          />
        );

      case 'select':
        return (
          <FormControl
            fullWidth={fullWidth}
            required={required}
            disabled={disabled}
          >
            <InputLabel>{label}</InputLabel>
            <Select value={value} label={label} onChange={handleChange}>
              {options.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'currency':
        return (
          <FormControl
            fullWidth={fullWidth}
            required={required}
            disabled={disabled}
          >
            <InputLabel>{label}</InputLabel>
            <Select value={value} label={label} onChange={handleChange}>
              <MenuItem value={Currency.USD}>USD</MenuItem>
              <MenuItem value={Currency.HKD}>HKD</MenuItem>
            </Select>
          </FormControl>
        );

      case 'date':
        return (
          <DatePicker
            label={label}
            value={value}
            onChange={handleDateChange}
            slotProps={{
              textField: {
                fullWidth: fullWidth,
                required: required,
                disabled: disabled,
              },
            }}
          />
        );

      default:
        return null;
    }
  };

  return renderField();
};

interface FormRowProps {
  children: React.ReactNode;
  xs?: number;
  sm?: number;
  md?: number;
}

export const FormRow: React.FC<FormRowProps> = ({
  children,
  xs = 12,
  sm = 6,
  md = 4,
}) => {
  return (
    <Grid item xs={xs} sm={sm} md={md}>
      {children}
    </Grid>
  );
};
