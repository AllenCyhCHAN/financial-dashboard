import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from '@mui/material';

interface DialogWrapperProps {
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
  title: string;
  children: React.ReactNode;
  saveText?: string;
  cancelText?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  disableSave?: boolean;
  showActions?: boolean;
}

export const DialogWrapper: React.FC<DialogWrapperProps> = ({
  open,
  onClose,
  onSave,
  title,
  children,
  saveText = 'Save',
  cancelText = 'Cancel',
  maxWidth = 'sm',
  fullWidth = true,
  disableSave = false,
  showActions = true,
}) => {
  const handleSave = () => {
    if (onSave) {
      onSave();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
    >
      <DialogTitle>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 1 }}>{children}</Box>
      </DialogContent>

      {showActions && (
        <DialogActions>
          <Button onClick={onClose}>{cancelText}</Button>
          {onSave && (
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={disableSave}
            >
              {saveText}
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};
