import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row } from 'react-bootstrap'
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import { useDispatch, useSelector } from 'react-redux';

import Loader from '../components/Loader2'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Link } from 'react-router-dom';
import { logout } from '../actions/userAction'


import { useNavigate } from 'react-router-dom';
function Galleria() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const dispatch = useDispatch()

  const navigate = useNavigate();

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

    
  const [hasExpired, setHasExpired] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const expirationTime = userInfo?.expiration_time



  useEffect(() => {
    if (!userInfo) {
      navigate('/home')
    }
      }, [navigate,userInfo]);

      const logoutHandler = () => {
        dispatch(logout())
        navigate('/home')
        window.location.reload();
        
      };

      useEffect(() => {
        // Parse the expiration time string into components
        if (userInfo) {
          
        const [, year, month, day, hour, minute, second] = expirationTime.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
    
        // Create a Date object with the parsed components
        const expirationDateTime = new Date(year, month - 1, day, hour, minute, second);
    
        // Update the state with the expiration time
        setCurrentTime(new Date());
        setHasExpired(expirationDateTime < new Date());
    
        // Set up a timer to update the current time every second
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
        // Clean up the interval on component unmount
        return () => clearInterval(timer);
      }
    
      }, [expirationTime]); // Run effect whenever expirationTime changes
    
    
    
      useEffect(() => {
        if (hasExpired) {
          logoutHandler()
        }
          }, [navigate, hasExpired]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/posts/gallery/?name=${searchText}&page=${page}`);
        setPosts((prevPosts) => [...prevPosts, ...response.data.results]);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, searchText]);

  const handleLoadMore = () => {
    // Increment the page to fetch the next set of posts
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div>
      <br/>
      <br/>
      <br/>
      <h1>eXplore</h1>
      <h6>Find new people to follow from these posts</h6>

      <ImageList style={{ padding: 0 }}>
        {Array.isArray(posts) &&
          posts.length > 0 &&
          posts.map((post, index) => (

<Link to={`/post/${post.id}`} style={{ color: 'red' }} key={post.id}>
            <ImageListItem key={post.id}>
              <img
                srcSet={`${post.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                src={`${post.image}?w=248&fit=crop&auto=format`}
                alt={post.title}
                loading="lazy"
              />
              <ImageListItemBar
                title={post.caption}
                subtitle={post.user_name}
                actionIcon={
                  <IconButton sx={{ color: 'red' }} aria-label={`info about ${post.title}`} 
                  >
            <Link to={`/post/${post.id}`} style={{ color: 'red' }} key={post.id}><InfoIcon/></Link>
                  </IconButton>
                }
              />
            </ImageListItem>
</Link>

          ))}
      </ImageList>

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
  );
}

export default Galleria;
