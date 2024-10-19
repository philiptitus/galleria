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
import CircularProgress from '@mui/material/CircularProgress';

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
  const [loading2, setLoading2] = useState(true);

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
          setLoading2(false);

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
              <div>
      {conversations.length < 1 && (
        loading2 ? (
          <div
          style={{

            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh', // Full viewport height
            textAlign: 'center', // Center text horizontally


          }}
          >
                      <CircularProgress />

            </div>
        ) : (
          <h6 variant="success">
            Nothing Here. Hop Over To A Friend's Profile And Click On <SendIcon /> To Start The Conversation...
          </h6>
        )
      )}
    </div>




{conversations.map((conversation) => (
  <List
    key={conversation.id}
    sx={{
      width: '100%',
      bgcolor: 'background.paper',
      marginBottom: '10px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      '&:hover': {
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
      },
    }}
  >
    <Link to={`/userchat/${conversation._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <ListItem alignItems="flex-start" sx={{ padding: '15px' }}>
        <ListItemAvatar>
          <Avatar alt={conversation.name} src={conversation.avi} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {conversation.name}
            </Typography>
          }
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: 'inline', color: 'text.secondary' }}
                component="span"
                variant="body2"
              >
                {conversation.name}
              </Typography>
            </React.Fragment>
          }
        />
        <Badge
          color="error"
          badgeContent={conversation.unread_count}
          max={99}
          sx={{
            '.MuiBadge-badge': {
              fontSize: '0.8rem',
              height: '20px',
              minWidth: '20px',
            },
          }}
        >
          <NotificationsNoneOutlinedIcon sx={{ color: 'text.primary' }} />
        </Badge>
      </ListItem>
    </Link>
    <Divider variant="inset" component="li" />
  </List>
))}

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