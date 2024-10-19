import React, { useState, useRef, useEffect, useCallback } from 'react';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';

export default function Popup({ component, pre, word, icon: Icon , showClose = false}) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  useEffect(() => {
    const closePopperOnClickAway = (event) => {
      if (
        anchorRef.current &&
        !anchorRef.current.contains(event.target) &&
        !event.target.closest('.popup-content')
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', closePopperOnClickAway);

    return () => {
      document.removeEventListener('mousedown', closePopperOnClickAway);
    };
  }, [setOpen, anchorRef]);

  const handleToggle = useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
  }, [setOpen]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <IconButton onClick={handleToggle} style={{ color: 'red', fontSize: "16px" }} ref={anchorRef}>
        {pre}
        {Icon && <Icon />}
        {word}
      </IconButton>

      {open && (
        <Paper className="popup-content" style={{ position: 'absolute', zIndex: 1, textAlign: 'center', maxWidth: "800px" }}>

          <Typography sx={{ p: 2 }}>

            {component}

          </Typography>
          <br/>


{ showClose &&         <IconButton onClick={handleClose} style={{ position: 'absolute', top: '5px', left: '5px', color: 'red' }}>
            <CloseIcon />
          </IconButton>}

        </Paper>
      )}
    </div>
  );
}
