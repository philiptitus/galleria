import React, { useState, useEffect, useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { listChats, createChat, deleteMessage } from '../actions/notificationActions';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

import { logout } from '../actions/userAction';
import { Link, useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { CHAT_CREATE_RESET } from '../constants/notificationConstants';
import SendIcon from '@mui/icons-material/Send';
import Loader from '../components/Loader2';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import IconButton from '@mui/material/IconButton';
import { TextField } from '@mui/material';
import axios from 'axios'



function UserChatScreen() {

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const { enqueueSnackbar } = useSnackbar(); // useSnackbar hook
  const dispatch = useDispatch();
  const { id } = useParams();

  const [messages, setMessages] = useState([]);
  const pusherNotificationsRef = useRef(null);
  const messageListRef = useRef(null);
  const navigate = useNavigate();


  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [message, setMessage] = useState([])
  let [newMessage, setnewMessage] = useState({message: "",});



  const [receiver_id, setReceiver_id] = useState(id);
  const [content, setContent] = useState('');

  const chatCreate = useSelector((state) => state.chatCreate);
  const { loading: loadingChat, error: errorChat, success, chat } = chatCreate;



 

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
      const fetchData = async () => {
        try {
          const config = {
            headers: {
              'Content-type': 'application/json',
              Authorization: `Bearer ${userInfo.token}`,
            },
          };
          setLoading(true);
          const response = await axios.get(`/api/notifications/chats/${id}/?name=${searchText}&page=${page}`, config);
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

  const handleChange = (event) => {
    setnewMessage({
      ...newMessage,
      [event.target.name]: event.target.value,
    });
  };

  const handleDelete = (messageId) => {
    // Dispatch an action to delete the message with the messageId
    dispatch(deleteMessage(messageId));
  };
  



  const submitHandler = () => {

    dispatch(
      createChat({
        receiver_id,
        content,
      })
    );
  };

  return (
    <div>
      <br/>
      <br/>
      <br/>
      <div>
        <form onSubmit={submitHandler}>
        <TextField
            className="form-control"
            placeholder="Write a message"
            multiline
            value={content}
            onChange={(e) => setContent(e.target.value)}
            autoFocus={false}
          />
          <button type="submit" className="btn btn-primary mt-2">
            <SendIcon />
          </button>
        </form>
      </div>
      <br />
      <br />

        <div className="list-group list-group-flush border-bottom scrollarea" ref={messageListRef}>
          <div ref={pusherNotificationsRef}></div>
          {conversations.length < 1 && <h6 variant="success">Nothing Here Start Talking..</h6>}

          {conversations.map((msg, index) => (
  <div key={index} className="list-group-item list-group-item-action py-3 lh-tight">
    <div className="d-flex w-100 align-items-center justify-content-between">
      <p style={{ fontSize: 'small', color: userInfo.email === msg.name ? 'red' : 'blue' }}>{msg.name}</p>
      <strong className="mb-1">{formatTimestamp(msg.timestamp)}</strong>

        {!msg.is_read && userInfo.id == msg.sender &&
              <DeleteIcon style={{ cursor: 'pointer', color: 'red' }} onClick={() => handleDelete(msg.id)} />
}

{msg.is_read && userInfo.id == msg.sender &&
              <VisibilityIcon style={{ cursor: 'pointer', color: 'blue' }} />
}

    </div>
    <div className="col-10 mb-1 small" style={{ whiteSpace: 'pre-line', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
      <Typography variant="body2" component="div">
        {msg.content}
      </Typography>
    </div>
  </div>
))}

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

        </div>
    </div>
  );
}

export default UserChatScreen;
