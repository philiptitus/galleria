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
import CircularProgress from '@mui/material/CircularProgress';
import { connectWebsocket, disconnectWebsocket, receiveChatMessage } from '../actions/realActions'; // Correct import path
import { sendChat } from '../actions/realActions';
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
  const conversations = useSelector((state) => state.websocket.messages); // Messages from Redux store

  // const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const { enqueueSnackbar } = useSnackbar(); // useSnackbar hook
  const dispatch = useDispatch();
  const { id } = useParams();
  const [loading2, setLoading2] = useState(true);

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

  const websocket = useSelector((state) => state.websocket); // Access the websocket state from the store
  const isConnected = websocket.connected;
  const socket = websocket.socket; // Get the actual socket instance

useEffect(() => {
  if (userInfo) {  // Connect only if user is logged in
      dispatch(connectWebsocket());
  }

  return () => {
    dispatch(disconnectWebsocket()); // Disconnect when the component unmounts
  };
}, [dispatch, userInfo]); // Include userInfo in the dependency array


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
                        setLoading(true);
                        const config = {
                            headers: {
                                'Content-type': 'application/json',
                                Authorization: `Bearer ${userInfo.token}`,
                            },
                        };
                        const response = await axios.get(`/api/notifications/chats/${id}/?name=${searchText}&page=${page}`, config);
                        dispatch(receiveChatMessage({ type: "INITIAL_MESSAGES", payload: response.data.results }));
                        setTotalPages(response.data.total_pages);
                        console.log('Combined messages from Redux:', conversations);

                    } catch (error) {
                        console.error('Error fetching posts:', error);
                    } finally {
                        setLoading(false);
                        setLoading2(false);
                    }
                };
                fetchData();
            }
        }, [page, searchText, userInfo]); //Only run when these change
        

      //   useEffect(() => {
      //     //Combine initial messages with the messages from Redux ONLY when loading is false
      //     if (!loading && userInfo && conversations.length > 0) {
      //         const combinedMessages = [...conversations, ...messagesFromRedux];
      //         setConversations(combinedMessages);
      //     }
      // }, [messagesFromRedux, loading, userInfo, conversations]); // Only run when these change
      
      useEffect(() => {
        if (socket && isConnected) {
            socket.onmessage = (event) => {
                const incomingMessage = JSON.parse(event.data).message;
                dispatch(receiveChatMessage(incomingMessage));
            };
        }
        return () => {
            if (socket) {
                socket.onmessage = null;
            }
        };
    }, [socket, isConnected, dispatch]);
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
      sendChat({
        receiver_id,
        content,
      })
    );
    setContent("")
  };




  return (
    <div style={{

    }}>
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
  style={{
    backgroundColor: '#fff5f5', // light red background
    border: '1px solid #ffcccc', // light red border
    borderRadius: '20px', // rounded corners for cloud effect
    padding: '15px 20px', // internal padding
    color: '#333', // text color
    fontFamily: 'Arial, sans-serif', // font family
    fontSize: '14px', // font size
    outline: 'none', // remove default outline
    boxShadow: '0 4px 8px rgba(255, 0, 0, 0.1)', // subtle shadow
    transition: 'box-shadow 0.3s ease-in-out', // smooth transition for shadow
  }}
  onFocus={(e) => e.target.style.boxShadow = '0 4px 12px rgba(255, 0, 0, 0.2)'}
  onBlur={(e) => e.target.style.boxShadow = '0 4px 8px rgba(255, 0, 0, 0.1)'}
/>

          {loadingChat ? <CircularProgress/> :
                    <button type="submit" className="btn btn-primary mt-2">
                    <SendIcon />
                  </button>
          }

        </form>
      </div>


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
            No New Chat :(
          </h6>
        )
      )}
    </div>


      <br />
      <br />

        <div className="list-group list-group-flush border-bottom scrollarea" ref={messageListRef}>
          <div ref={pusherNotificationsRef}></div>

          {conversations.map((msg, index) => (

<div
  key={index}
  style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: userInfo.id === msg.sender ? 'flex-end' : 'flex-start',
    margin: '10px 0'
  }}
>
  <div
    style={{
      backgroundColor: userInfo.id === msg.sender ? '#e0f7fa' : '#f1f1f1',
      color: '#000',
      borderRadius: '20px',
      padding: '10px 20px',
      maxWidth: '75%',
      alignSelf: userInfo.id === msg.sender ? 'flex-end' : 'flex-start',
      wordWrap: 'break-word', // Ensures long words break and the div expands
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Adds a subtle shadow
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <p
        style={{
          fontSize: 'small',
          color: userInfo.email === msg.name ? 'red' : 'blue',
          margin: 0 // Removes default margin
        }}
      >
        {userInfo.email === msg.name ?
        <i
          style={{
            fontSize: 'small',
            color: userInfo.email === msg.name ? 'red' : 'blue'
          }}
        >
          Me
        </i> :
        <span>{msg.name}</span>
        }
      </p>
      <strong
        style={{
          fontSize: 'x-small',
          color: '#555'
        }}
      >
        {formatTimestamp(msg.timestamp)}
      </strong>
      <div>
        {!msg.is_read && userInfo.id === msg.sender && (
          <DeleteIcon
            style={{
              cursor: 'pointer',
              marginLeft: '10px',
              color: 'red'
            }}
            onClick={() => handleDelete(msg.id)}
          />
        )}
        {msg.is_read && userInfo.id === msg.sender && (
          <VisibilityIcon
            style={{
              cursor: 'pointer',
              marginLeft: '10px',
              color: 'blue'
            }}
          />
        )}
      </div>
    </div>
    <div
      style={{
        whiteSpace: 'pre-line',
        overflow: 'hidden',
        marginTop: '5px' // Adds a small gap between the header and the content
      }}
    >
      <Typography variant="body2" component="div">
        {msg.content}
      </Typography>
    </div>
  </div>
</div>

))}

{/* {

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
} */}

        </div>
    </div>
  );
}

export default UserChatScreen;
