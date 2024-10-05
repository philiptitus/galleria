import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap'
import SendIcon from '@mui/icons-material/Send';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { listConversations } from "../actions/notificationActions";
import LoadingSpinner from '../components/LoadingSpinner';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import axios from 'axios'
import { Link } from 'react-router-dom'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import IconButton from '@mui/material/IconButton';
import Loader from '../components/Loader2';
import { useNavigate } from 'react-router-dom';
import { logout } from '../actions/userAction'

function Chats() {

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const { enqueueSnackbar } = useSnackbar(); // useSnackbar hook
  const dispatch = useDispatch();
  const [message, setMessage] = useState([])

  const userLogin = useSelector((state) => state.userLogin);
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
    // Check if userInfo is truthy before fetching data
    if (userInfo) {
      const fetchData = async () => {
        try {
          const config = {
            headers: {
              'Content-type': 'application/json',
              Authorization: `Bearer ${userInfo.token}`,
            },
          };
          setLoading(true);
          const response = await axios.get(`/api/notifications/conversations/?name=${searchText}&page=${page}`, config);
          setConversations(response.data.results);
          setTotalPages(response.data.total_pages);
        } catch (error) {
          console.error('Error fetching posts:', error);
        } finally {
          setLoading(false);
        }
      };
  
      // Call fetchData immediately
      fetchData();
  
      // Set up interval to call fetchData every 1 second
      const intervalId = setInterval(fetchData, 1000);
  
      // Clear the interval on component unmount to avoid memory leaks
      return () => clearInterval(intervalId);
    }
  }, [page, searchText, userInfo]);
  
  
  const handleLoadMore = () => {
    // Increment the page to fetch the next set of posts
    setPage((prevPage) => prevPage + 1);
  };



    return (
        <div>
          <br/>
          <br/>
            <Row><h1>Conversations</h1></Row>

              <Row>
          {conversations.length < 1  && (
          <h6 variant='success'>Nothing Here Hop Over To A Friends Profile And Click On <SendIcon/> To Start The Conversation...</h6>
          )}
          {conversations.map(( conversation ) => (

<List  key={conversation.id} sx={{ width: '100%', bgcolor: 'background.paper' }}>
<Link to={`/userchat/${conversation._id}`}  key={conversation}>
  <ListItem alignItems="flex-start">
  <ListItemAvatar>
    <Avatar alt="Remy Sharp" src={conversation.avi} />
  </ListItemAvatar>
  <ListItemText
    primary={conversation.name}
    secondary={
      <React.Fragment>
        <Typography
          sx={{ display: 'inline' }}
          component="span"
          variant="body2"
          color="text.primary"
        >
        </Typography>
      </React.Fragment>
    }
  />
                    <Badge color="error" badgeContent={conversation.unread_count} max={99}>
                    <NotificationsNoneOutlinedIcon />
                  </Badge>
</ListItem>
<Divider variant="inset" component="li" />
</Link>


</List>

          ))

          }
              </Row>

              {
  conversations.length > 9 &&
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
                <div className="list-group list-group-flush border-bottom scrollarea">

</div>

      </div>
    );
  }
function Chat() {




  return (
    <div>
      
      <Chats/>

    
    
    </div>

  )
}

export default Chat