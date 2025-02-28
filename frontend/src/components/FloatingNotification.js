import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Snackbar, SnackbarContent } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  notification: {
    backgroundColor: '#ffcccc', // light red background
    color: '#333', // text color
    fontFamily: 'Arial, sans-serif', // font family
    fontSize: '14px', // font size
    borderRadius: '10px', // rounded corners
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // subtle shadow
    '&:hover': {
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)', // hover shadow
    },
  },
}));

const FloatingNotification = () => {

  const classes = useStyles();
  const navigate = useNavigate();
  const websocket = useSelector((state) => state.websocket);
  const { messages } = websocket;

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (messages && messages.length > 0) {
      const newNotifications = messages.map((msg) => ({
        id: msg?.id,
        sender: msg?.sender,
        content: msg?.content,
      }));
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        ...newNotifications,
      ]);
    }
  }, [messages]);

  const handleClose = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  const handleClick = (id) => {
    navigate(`/chat`);
    handleClose(id);
  };

  return (
    <>
      {notifications.map((notification) => (
        <Snackbar
          key={notification?.id}
          open={true}
          autoHideDuration={5000}
          onClose={() => handleClose(notification?.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <SnackbarContent
            className={classes.notification}
            message={`New message!`}
            onClick={() => handleClick(notification?.id)}
          />
        </Snackbar>
      ))}
    </>
  );
};

export default FloatingNotification;