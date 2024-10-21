import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePost } from '../actions/postActions';
import { enqueueSnackbar } from 'notistack';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

const UpdatePostPopup = ({ postId, open, handleClose, p_caption, p_description }) => {
  const dispatch = useDispatch();
  const [caption, setCaption] = useState(p_caption);
  const [description, setDescription] = useState(p_description);

  const postUpdate = useSelector((state) => state.postUpdate);
  const { loading, error, success } = postUpdate;

  const submitPost = () => {
    dispatch(
      updatePost({
        id: postId,
        caption: caption,
        description: description,
      })
    );
  };

  useEffect(() => {
    if (success) {
      enqueueSnackbar('Post updated successfully', { variant: 'success' });
      handleClose();
    } else if (error) {
      enqueueSnackbar(error, { variant: 'error' });
    }
  }, [success, error]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Update Post</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="caption"
          label="Caption"
          type="text"
          fullWidth
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <TextField
          margin="dense"
          id="description"
          label="Description"
          type="text"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={submitPost} color="primary" disabled={loading}>
          {loading ? 'Updating...' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdatePostPopup;
