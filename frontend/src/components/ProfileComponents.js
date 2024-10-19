import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Carousel from './Carousel';

import Loader from './Loader2';
import { formatDistanceToNow } from 'date-fns';
import Post from '../components/Post';
import { Link } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import IconButton from '@mui/material/IconButton';
function ProfileComponents({id, showLike = false, showBookmark = false, showAlbum = false }) {

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [totalPages, setTotalPages] = useState(1);
    const dispatch = useDispatch();


    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    
  const postDelete = useSelector((state) => state.postDelete);
  const { success } = postDelete;

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

    const postCommentCreate = useSelector((state) => state.postCommentCreate);
    const {
  
      success: successCreate,
  } = postCommentCreate



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
    
          let response; // Declare response variable
    
          if (showLike) {
            response = await axios.get(`/api/posts/${id}/likes/?name=${searchText}&page=${page}`, config);
          } else if (showBookmark) {
            response = await axios.get(`/api/posts/bookmarks/?name=${searchText}&page=${page}`, config);
          } else if (showAlbum) {
            response = await axios.get(`/api/posts/${id}/album/?name=${searchText}&page=${page}`, config);
          }
    
          // Check if response.data.results is iterable
          const results = response.data.results;
          const iterableResults = Array.isArray(results) ? results : [];
    
          setPosts((prevPosts) => [...prevPosts, ...iterableResults]);
          setTotalPages(response.data.total_pages);
        } catch (error) {
          console.error('Error fetching posts:', error);
        } finally {
          setLoading(false);
        }
      };
    
      fetchData();
    }, [page, searchText, showAlbum, showLike, showBookmark, success]);
    


    const handleLoadMore = () => {
      // Increment the page to fetch the next set of posts
      setPage((prevPage) => prevPage + 1);
    };

 

    



      return (
<div>
  <br />
  <br />
    <div className='container text-center'>
      {Array.isArray(posts) && posts.length > 0 ? (
        // If there are posts, map over them and render each post
        posts.map((post, index) => (
          <React.Fragment key={index}>
            {/* Render each post using a Post component */}
            <Row className='justify-content-center'>
              <Post
                date={formatTimestamp(post.created_date)}
                user={post.user}
                caption={post.caption}
                description={post.description}
                total_likes={post.total_likes}
                total_bookmarks={post.total_bookmarks}
                total_comments={successCreate ? post.total_comments + 1 : post.total_comments}
                avi={post.user_avi}
                name={post.user_name}
                id={post.id}
                likers={post.likers} 
                bookers={post.bookers}  
                currentUserEmail={userInfo.email}
                poster={post}

              />
            </Row>
            <br />
            <br />
          </React.Fragment>
        ))
      ) : (
        // If there are no posts, show a message with a link to explore
        <h6 style={{ color:"white" }}>Nothing To See Here Yet...<Link style={{ color: "red" }} to='/galleria'>Explore</Link></h6>
      )}
      
      {
  posts.length > 9 &&
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
</div>


      );
}

export default ProfileComponents