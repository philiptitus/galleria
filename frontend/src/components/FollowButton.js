import React, { useState } from 'react';
import Button from '@mui/material/Button';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonAddDisabledIcon from '@mui/icons-material/PersonAddDisabled';

function FollowButton({ red, clicker }) {
  const [isFollowing, setIsFollowing] = useState(red);

  const handleButtonClick = async () => {
    setIsFollowing((prev) => !prev);

    // Call the provided clicker function with the current follow state
    if (clicker) {
      clicker(!isFollowing);
    }

    // Additional logic if needed
  };

  return (
    <Button
      variant="contained"
      color={isFollowing ? 'error' : 'primary'}
      onClick={handleButtonClick}
      startIcon={isFollowing ? <PersonAddDisabledIcon /> : <PersonAddIcon />}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  );
}

export default FollowButton;
