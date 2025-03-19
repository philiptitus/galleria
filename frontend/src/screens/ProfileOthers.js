import React, { useState, useEffect } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import FollowButton from '../components/FollowButton';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import SendIcon from '@mui/icons-material/Send';
import { useDispatch, useSelector } from 'react-redux';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { getUserDetails, followUser, followPrivate } from '../actions/userAction';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import LabTabs from '../components/Tab';
import LabTabsMobile from '../components/MobileTab';
import { Row, Col } from 'react-bootstrap';
import FollowerList from '../components/Follower';
import FollowingList from '../components/Following';
import Popup from '../components/PopUp';
import GroupIcon from '@mui/icons-material/Group';
import Follow from '@mui/icons-material/AddToPhotos';
import { Link } from 'react-router-dom';
import { logout } from '../actions/userAction';


import { useNavigate } from 'react-router-dom';





function ScrollableTabsButtonAuto() {
    const [value, setValue] = React.useState(0);
  
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };
  
    return (
      <Box
        sx={{
          maxWidth: { xs: 320, sm: 480 },
          bgcolor: 'black', // Set background color to black
          display: 'flex',
          justifyContent: 'center', // Align at the center horizontally
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          textColor="white" // Set text color to white
          aria-label="scrollable auto tabs example"
        >
          <Tab label="MY ALBUM" />
          <Tab label="Likes" />
          <Tab label="BookMarks" />
          <Tab label="Comments" />
          <Tab label="Reposts" />
        </Tabs>
      </Box>
    );
  }


  function ProfileOthers() {
    const [isCurrentUserFollower, setIsCurrentUserFollower] = useState(false);
    const { id } = useParams();
    const isLargeScreen = useMediaQuery('(min-width: 600px)');
    const isSmallScreen = useMediaQuery('(max-width: 480px)');
    const userLogin = useSelector((state) => state.userLogin);
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
    const followUserState = useSelector((state) => state.userFollow) || {};
    const {
      error: errorFollow,
      success: successFollow,
    } = followUserState;

    const followPrivateState = useSelector((state) => state.privateFollow) || {};
    const {
      error: errorFollowPrivate,
      success: successFollowPrivate,
    } = followPrivateState;
  
    const { enqueueSnackbar } = useSnackbar();
    const [selectedOption, setSelectedOption] = useState(0);
  
    const handleOptionChange = (event, newValue) => {
      setSelectedOption(newValue);
    };
  
    const dispatch = useDispatch();
      

 

    const handleClickPrivate = () => {
      // Show a success snackbar when the button is clicked
      dispatch(followUser(id));
      {successFollowPrivate && enqueueSnackbar("Requested", { variant: 'success' })}
      {errorFollowPrivate && enqueueSnackbar("Your Request Has already been Sent", { variant: 'info' })}


    };
  
    const userDetails = useSelector((state) => state.userDetails);
    const {  loading, user } = userDetails;
    const navigate = useNavigate()


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
      dispatch(getUserDetails(id));
      

      if (id == userInfo?.id) {
        navigate("/profile")
      }


    }, [dispatch, id, successFollow]);

    const followers = user.followers
    if (userInfo) {
      
    }
    const currentUserEmail = userInfo?.email;

    // Rest of your code here
    

    useEffect(() => {
      if (Array.isArray(followers)) {
        setIsCurrentUserFollower(followers.some(follower => follower.follower_name === currentUserEmail));
      } else {
        setIsCurrentUserFollower(false);
      }
      
      // Log a message when the component is loaded
  
    }, [currentUserEmail, followers]);

    const handleClick = () => {
      // Show a success snackbar when the button is clicked
            dispatch(followUser(id));
            {!isCurrentUserFollower && user.isPrivate && successFollow && enqueueSnackbar("Requested", { variant: 'success' })}
            {!isCurrentUserFollower && user.isPrivate && errorFollow && enqueueSnackbar("Your Request Has Already Been Sent..", { variant: 'info' })}


    };
  

  
        return (
          <div>
            <br />
            <br />
            <br />
            <br />
      
            <Container>
              <Row>
              <Col xs={3} md={1}>
  {user && user.avi ? (
    <Image src={user.avi} alt='User Avatar' thumbnail />
  ) : (
    <Image src='https://images.pexels.com/photos/1578877/pexels-photo-1578877.jpeg?auto=compress&cs=tinysrgb&w=600' alt='Default Avatar' thumbnail />
  )}
</Col>


              </Row>
              <br />
      
              <Row>
                {user && user.isPrivate && <p style={{fontSize:"6px", color:"blue" }}>PRIVATE ACCOUNT</p> }
                <h6>{user && user.name}</h6>
                <h6 style={{ fontSize: '12px', color: "red" }}>@{user && user.email}</h6>
                <b>Joined: {formatTimestamp(user && user.date_joined)}</b>
                <br/>
                <br/>
                <Col style={{ textAlign: "right" }}>
                  
                </Col>
              </Row>

              <Row>
              <p>{user &&  user.bio}</p>
              </Row>
              <Link to={`/userchat/${id}`}  key={id} style={{ color:"red" }} >

              <SendIcon/>
              </Link>

      
              <Row className='justify-content-center'>
                <Col md={2}>
                  <Popup component={<FollowerList avatar={true} userId={user &&  user.id} />} word={user && user.total_followers} icon={GroupIcon} pre="Followers:  " />
                </Col>
                <Col md={2} style={{ marginLeft:isLargeScreen ?  '-61px': "" }}>
                  <Popup component={<FollowingList avatar={true} userId={user &&  user.id} />} word={user && user.total_following} icon={GroupIcon} pre="Following:  " />

                </Col>
                {user && user.isPrivate ?
                 (

                  <Col md={2} style={{ marginLeft: isLargeScreen ? '-11px' : ""}}>
                    {isCurrentUserFollower && 
<FollowButton red={true} clicker={handleClick}

/>  

                  
                    }

{!isCurrentUserFollower && 
<FollowButton  clicker={handleClick}/>                    
                    }
                  
                  </Col>


                ): 
                (
                  <Col md={2} style={{ marginLeft: isLargeScreen ? '-11px' : ""}}>
                    {isCurrentUserFollower && 
<FollowButton red={true} clicker={handleClick}/>                    
                    }

{!isCurrentUserFollower && 
<FollowButton  clicker={handleClick}/>                    
                    }
                  
                  </Col>

                )}


              </Row>
              <br />
              <br />
              {isSmallScreen && (
                <Row>
                  <Col>
<LabTabsMobile id={id}/>
                  </Col>
                </Row>
              )}
              <br />
      
              {isLargeScreen && (
                <Row>
                  <Col>
                  <LabTabs id={id}/>
                  </Col>
                </Row>
              )}
      
              <Row>
              </Row>
      
              <Row>
      
              </Row>
              <br />
            </Container>
          </div>
        );
      }
      

      export default ProfileOthers;
      
      
