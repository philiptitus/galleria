import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Badge from '@mui/material/Badge';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import IconButton from '@mui/material/IconButton';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../actions/userAction';
import { connectWebsocket, disconnectWebsocket } from '../actions/realActions'; // Adjust the import path as needed

function UserConversationsScreen() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { userInfo } = useSelector((state) => state.userLogin);

  // Access websocket state (including realtime conversation updates)
  const websocket = useSelector((state) => state.websocket);
  const { connected, conversations: wsConversations } = websocket;

  // Connect to the websocket on mount, and disconnect on unmount
  useEffect(() => {
    if (userInfo) {
      dispatch(connectWebsocket());
    }
    return () => {
      dispatch(disconnectWebsocket());
    };
  }, [dispatch, userInfo]);

  // Redirect to home if not logged in
  useEffect(() => {
    if (!userInfo) {
      navigate('/home');
    }
  }, [userInfo, navigate]);

  // Initial API fetch for conversations
  useEffect(() => {
    if (userInfo) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userInfo.token}`,
            },
          };
          const response = await axios.get(
            `/api/notifications/conversations/?name=${searchText}&page=${page}`,
            config
          );
          setConversations(response.data.results);
          setTotalPages(response.data.total_pages);
        } catch (error) {
          console.error('Error fetching conversations:', error);
          enqueueSnackbar('Error fetching conversations', { variant: 'error' });
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [userInfo, page, searchText, enqueueSnackbar]);

  // Merge realtime conversation updates with the existing HTTP-fetched list
  useEffect(() => {
    if (wsConversations && wsConversations.length > 0) {
      setConversations((prevConversations) => {
        let updatedConversations = [...prevConversations];
        wsConversations.forEach((wsConv) => {
          // Remove any conversation with the same user_id
          updatedConversations = updatedConversations.filter(
            (conv) => conv.user_id !== wsConv.user_id
          );
          // Add the new/updated conversation at the beginning of the list
          updatedConversations.unshift(wsConv);
        });
        return updatedConversations;
      });
    }
  }, [wsConversations]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/home');
    window.location.reload();
  };

  return (
    <div>
      <Row>
        <h1>Conversations</h1>
      </Row>
      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <>
          {conversations.length < 1 ? (
            <h6>
              Nothing Here. Start a conversation by messaging one of your friends!
            </h6>
          ) : (
            conversations.map((conversation) => (
              <List
                key={conversation.id || conversation.user_id}
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
                <Link
                  to={`/userchat/${conversation._id || conversation.user_id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <ListItem alignItems="flex-start" sx={{ padding: '15px' }}>
                    <ListItemAvatar>
                      <Avatar alt={conversation.name} src={conversation.avi} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={<span style={{ fontWeight: 'bold' }}>{conversation.name}</span>}
                      secondary={
                        conversation.last_message_timestamp
                          ? new Date(conversation.last_message_timestamp).toLocaleString()
                          : ''
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
                      <NotificationsNoneOutlinedIcon />
                    </Badge>
                  </ListItem>
                </Link>
                <Divider variant="inset" component="li" />
              </List>
            ))
          )}
          {conversations.length > 9 && (
            <Row className="justify-content-center">
              <IconButton style={{ color: 'red' }} onClick={handleLoadMore} disabled={loading}>
                <KeyboardArrowDownIcon />
              </IconButton>
            </Row>
          )}
        </>
      )}
    </div>
  );
}

export default UserConversationsScreen;
