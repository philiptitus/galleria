// CommentSection.js
import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import {  deleteComment } from '../actions/postActions';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import LoadingSpinner from '../components/LoadingSpinner';
import Post from '../components/Post';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Loader from './Loader2';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import IconButton from '@mui/material/IconButton';


function Comment({ id , showDelete = true}) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const dispatch = useDispatch();

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;
  
  const { enqueueSnackbar } = useSnackbar();


  const postDelete = useSelector((state) => state.postDelete);
  const { success, error:errorDelete } = postDelete;

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    const now = new Date();
    const timeDifference = formatDistanceToNow(date, { addSuffix: true });
    return timeDifference;
  };

  const deleteCommentHandler = (postId) => {
    dispatch(deleteComment(postId));
    enqueueSnackbar('Deleting in A Moment', { variant: 'success' });
    window.location.reload();
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          }, 
        };
        setLoading(true);
        const response = await axios.get(`/api/posts/${id}/comments/?name=${searchText}&page=${page}`, config);
        setComments((prevPosts) => [...prevPosts, ...response.data.results]);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, searchText, success]);

  const handleLoadMore = () => {
    // Increment the page to fetch the next set of posts
    setPage((prevPage) => prevPage + 1);
  };

  const renderComments = () => {
    return (
      <List sx={{ width: '100%', maxWidth: 600, backgroundColor:"black" }}>
        {comments.map((comment, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt={`Avatar for ${comment.user}`} src={comment.comment_avi} />
              </ListItemAvatar>
              <ListItemText
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {comment.user}
                    </Typography>
                    {" — "}
                    <Link to={`/post/${comment.post}`} style={{ color: 'white' }} key={comment.post}>

                    {comment.message}
                    </Link>

                  </React.Fragment>
                }
              />
              {showDelete && 
                            <Button
                            onClick={() => deleteCommentHandler(comment.id)}
                            style={{
                              backgroundColor:"transparent"
                            }}
                            >
                            <HighlightOffIcon
                                                        style={{
                                                          backgroundColor:"transparent"
                                                        }}
                            />
                            </Button>
              
              }

            </ListItem>
            <h6 style={{ fontSize:"6px" }}>{formatTimestamp(comment.created_at)}</h6>
            {index < comments.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>
    );
  };

  return (
    <div>
      <br />
      <br />

        <div>
          {comments && comments.length > 0 ? (

<React.Fragment>
<Row className='justify-content-center'>
  {renderComments()}
</Row>
<br />
<br />
</React.Fragment>

          ) : (
<h6>No comments Yet...<Link style={{ color: "red" }} to='/galleria'>Explore</Link></h6> 




          )}
        </div>
        {
  comments.length > 9 &&
        <Row className='justify-content-center'>
    <IconButton
        style={{  color: 'red' }}
        onClick={handleLoadMore}
        disabled={loading}
      >
        <KeyboardArrowDownIcon />
      </IconButton>
</Row>
}
{loading && <Loader/>}
    </div>
  );
}

export default Comment;
