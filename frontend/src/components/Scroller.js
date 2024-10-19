import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { Link } from 'react-router-dom';

import CommentIcon from '@mui/icons-material/Comment';

import Avatar from '@mui/material/Avatar';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { FixedSizeList, ListChildComponentProps } from 'react-window'; 
import { useSnackbar } from 'notistack';
import {  deleteComment } from '../actions/postActions';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { logout } from '../actions/userAction'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import IconButton from '@mui/material/IconButton';














interface ListProps {
  avatar: boolean;
  postId: string;
  user: string;
  total: number;
  showLike?: boolean;
  showBookmark?: boolean;
  showComment?: boolean;

}

const Scroller = ({ user,avatar, postId, total, showLike = false, showBookmark = false, showComment = false }: ListProps) => {
  const postDetails = useSelector((state) => state.postDetails);
  const { post, loading, error, success:successPost } = postDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const postDelete = useSelector((state) => state.postDelete);
  const { success, error:errorDelete } = postDelete;

  const navigate = useNavigate();

  const postCommentCreate = useSelector((state) => state.postCommentCreate);
  const {

    success: successCreate,
} = postCommentCreate

  const deleteCommentHandler = (postId) => {
    dispatch(deleteComment(postId));
    enqueueSnackbar('Deleting in A Moment', { variant: 'success' });
    window.location.reload();
  };

  const [searchText, setSearchText] = useState("");

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  
  useEffect(() => {
  
  }, [dispatch, success, successPost, successCreate]);

  let dynamicData;
  if (showBookmark) {
    dynamicData = post.bookers.map((booker) => ({
      id: booker.booker,
      text: booker.booker_name,
      imageUrl: booker.booker_avi,
    }));
  } else if (showLike) {
    dynamicData = post.likers.map((liker) => ({
      id: liker.liker,
      text: liker.liker_name,
      imageUrl: liker.liker_avi,
    }));
  }
  else if (showComment) {
    dynamicData = post.comments.map((comment) => ({
        id: comment.user,
        _id: comment.id,
        text: comment.message,
        imageUrl: comment.comment_avi,
        emailer: comment.comment_email,
    }));
  }

  const renderRow = (props: ListChildComponentProps) => {
    const { index, style } = props;
    const item = dynamicData[index];



    return (
      <ListItem style={style} key={index} component="div" disablePadding>
        <ListItemButton>
        <Link to={`/user/${item.id}`} style={{ color: 'black' }} key={item.id}>
          <ListItemAvatar>
            <Avatar alt={`Avatar for ${item.text}`} src={item.imageUrl} />
            {showComment && <p style={{ fontSize: "5px", color:"white" }}>{item.emailer}</p>}
          </ListItemAvatar>
          </Link>



          <ListItemText  primary=<p style={{ fontSize:"small" }}>{item.text} </p>/>
          
        </ListItemButton>
        {showComment && user === userInfo.id && (
  <Button 
  
  style={{
    backgroundColor:"transparent"
  }}
  onClick={() => deleteCommentHandler(item._id)}>
    <HighlightOffIcon />
  </Button>
)}

      </ListItem>
    );
  };

  return (
    <Box sx={{ width: '100%', height: 400, maxWidth: 400, bgcolor: 'black' }}>
      {dynamicData.length === 0 && (
        <div>
          {showLike && <p>No Likes Available Yet: <FavoriteBorderIcon /></p>}
          {showBookmark && <p>No Bookmarks Available Yet: <BookmarkBorderIcon /></p>}
          {showComment && <p>No Comments Available Yet: <CommentIcon /></p>}

        </div>
      )}

      {dynamicData.length > 0 && (
        <div>
          {showLike && <p>Likes: {total}<FavoriteBorderIcon /></p>}
          {showBookmark && <p>Bookmarks: {total}<BookmarkBorderIcon /></p>}
          {showComment && <p>Comments: {total}<CommentIcon /></p>}
<FixedSizeList
  height={400} // Adjust this based on your content
  itemSize={46} // Adjust this based on your content
  itemCount={dynamicData.length}
  overscanCount={5}
>
  {renderRow}
</FixedSizeList>

        </div>
      )}
    </Box>
  );
};

export default Scroller;
