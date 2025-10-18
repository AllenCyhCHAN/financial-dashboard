import React from 'react';
import { Snackbar, Alert, IconButton } from '@mui/material';
import type { AlertColor } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useNotificationStore } from '../store';

interface NotificationProps {
  id: string;
  message: string;
  type: AlertColor;
  duration?: number;
}

export const Notification: React.FC<NotificationProps> = ({
  id,
  message,
  type,
  duration = 6000,
}) => {
  const removeNotification = useNotificationStore(
    state => state.removeNotification
  );

  const handleClose = () => {
    removeNotification(id);
  };

  return (
    <Snackbar
      open={true}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={handleClose}
        severity={type}
        variant="filled"
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export const NotificationContainer: React.FC = () => {
  const notifications = useNotificationStore(state => state.notifications);

  return (
    <>
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          id={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
        />
      ))}
    </>
  );
};
