import React, { useState, useEffect } from 'react';
import { Col, Image, Row } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import Post from '../components/Post';
import { listPostDetails } from '../actions/postActions';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import ReactPlayer from 'react-player'
import Loader from '../components/Loader2';
import { useTheme } from '@mui/material/styles';
import VideoPlayer from '../components/VideoPlayer';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';

import Carousel from '../components/Carousel';
import { logout } from '../actions/userAction';




function PostScreen() {
    const { id } = useParams();
    const navigate = useNavigate()

    const postDelete = useSelector((state) => state.postDelete);
    const { success } = postDelete;

    const postUpdate = useSelector((state) => state.postUpdate);
    const { loading:loadingUpdate, error:errorUpdate, success:successUpdate } = postUpdate;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;
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


    const postDetails = useSelector((state) => state.postDetails);
    const {  loading, post, success:successPost } = postDetails;
    const dispatch = useDispatch()




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
      if (userInfo) {
        dispatch(listPostDetails(id));
      }

      if (successUpdate) {
        dispatch(listPostDetails(id));
      }
    }, [dispatch, id, success, successPost, successCreate, userInfo, successUpdate]);
    


      useEffect(() => {
        if (!loading && successPost && !post) {
          // If the post does not exist, navigate to "/profile"
          navigate('/profile');
        }
      }, [loading, successPost, post, navigate]);
  


  
      return (
        <div>
          {loading && <Loader/>}
          <br />
          <br />
          <br />
          <div className='container text-center'>
            {loading ? (
              Loader
            ) : post ? (
              <Row className='justify-content-center' style={{ color: "white" }}>
                <Col className='justify-content-center' style={{ maxWidth: "500px" }}>
                  <Post
                    // image={post.image}
                //     image={post.isSlice ?  
                //       <ReactPlayer
                //       width='470px'
                //       // height='500px'
                //       controls
                //       url={post.video}
                //     />
                    
                //   :  
                // <Carousel id={post.id}/>

                //   }
                    date={formatTimestamp(post.created_date)}
                    user={post.user}
                    caption={post.caption}
                    description={post.description}
                    total_likes={post.total_likes}
                    total_bookmarks={post.total_bookmarks}
                    total_comments={post.total_comments}
                    avi={post.user_avi}
                    name={post.user_name}
                    id={post.id}
                    screen={true}
                    card={false}
                    likers={post.likers}
                    bookers={post.bookers}
                    currentUserEmail={userInfo?.email}
                    poster={post}
                    
                  />
                  
                  {/* <SwipeableTextMobileStepper/> */}

                  <div className="container">
     

      </div>

                </Col>
                
              </Row>
              
            ) : (
              <h1 style={{ color: "white" }}>This Post does Not Exist Anymore Or Was Deleted</h1>
              
            )}
          </div>
        </div>
      );
      
}

export default PostScreen