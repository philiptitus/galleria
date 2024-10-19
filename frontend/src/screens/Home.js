import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import Loader from '../components/Loader2';
import axios from 'axios';
import Post from '../components/Post';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import IconButton from '@mui/material/IconButton';
import Footer from '../components/Footer';
import Carousel from '../components/Carousel';
import { logout } from '../actions/userAction'



function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const postCommentCreate = useSelector((state) => state.postCommentCreate);
  const {

    success: successCreate,
} = postCommentCreate

  const postDelete = useSelector((state) => state.postDelete);
  const { success } = postDelete;

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
                const config = {
                  headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                  },
                };
                setLoading(true);
                const response = await axios.get(`/api/posts/?name=${searchText}&page=${page}`, config);
                if (response.data.results && response.data.results.length > 0) {
                  setPosts((prevPosts) => [...prevPosts, ...response.data.results]);
                  setTotalPages(response.data.total_pages);
                } else {
                  console.log('No posts found');
                }
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




  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    const now = new Date();
    const timeDifference = formatDistanceToNow(date, { addSuffix: true });
    return timeDifference;
  };

  // useLayoutEffect to ensure the navigation to the bottom happens after rendering





  return (
    <div>
      <br />
      <br />
        <div className='container text-center'>
        <Row className='justify-content-center'>
          <h1 style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>Your  Feed</h1>
        </Row>


        {posts.length > 0 ? (
  posts.map((post, index) => (
    <React.Fragment key={index}>
      <Row className='justify-content-center'>
        <Post 
          // image={<Carousel id={post.id}/>}
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

<div>
{ !loading &&
 <div>
    <h6>It seems you are not following anyone yet or the person you follow hasn't posted anything. Would you like to search for some suggested people to follow?</h6>
    <h6><Link style={{ color: "red" }} to='/search'>eXplore</Link></h6>
    <i>or</i>
    <h6>Browse Some Suggested Posts </h6>
    <h6><Link style={{ color: "red" }} to='/galleria'>browse</Link></h6>
  </div>}
  </div>

)}





        {/* Marker at the bottom */}
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

export default Home;
