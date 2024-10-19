import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { listRequests,  followPrivate } from '../actions/userAction'
import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import IconButton from '@mui/material/IconButton';
import Loader from './Loader2';


function Requests() {

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [totalPages, setTotalPages] = useState(1);


    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const followUserState = useSelector((state) => state.userFollow) || {};
    const {
      error: errorFollow,
      success: successFollow,
    } = followUserState;


    const { enqueueSnackbar } = useSnackbar();


    const handleAcceptRequest = (id) => {
        // Show a success snackbar when the button is clicked
        dispatch(followPrivate
            (id, {
                'action':"accept"
            })
            );
            enqueueSnackbar('Sending Response..', { variant: 'success' });
            window.location.reload();
  
      };

      const handleRejectRequest = (id) => {
        // Show a success snackbar when the button is clicked
        dispatch(followPrivate
            (id, {
                'action':"decline"
            })
            );    
            enqueueSnackbar('Sending Response..', { variant: 'info' });
            window.location.reload();
      };




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
          const response = await axios.get(`/api/users/requests/?name=${searchText}&page=${page}`, config);
          setRequests((prevPosts) => [...prevPosts, ...response.data.results]);
          setTotalPages(response.data.total_pages);
        } catch (error) {
          console.error('Error fetching posts:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [page, searchText, successFollow]);
  
    const handleLoadMore = () => {
      // Increment the page to fetch the next set of posts
      setPage((prevPage) => prevPage + 1);
    };
  

      const renderRequests = () => {
        return (
          <List sx={{ width: '100%', maxWidth: 600, backgroundColor: 'black' }}>
            {requests.map((request, index) => (
              <React.Fragment key={index}>
                <ListItem alignItems="flex-start">
                <Link to={`/user/${request.requester}`} style={{ color:"white" }}  key={request.requester}>

                  <ListItemAvatar>
                    <Avatar alt={`Avatar for ${request.requester}`} src={request.avi} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={request.name}
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {request.name}
                        </Typography>
                        {' — '}
                        {request.name}
                      </React.Fragment>
                    }
                  />
                                  </Link>

                  {/* Green tick icon for accepting request */}
                  <CheckCircleIcon
                    style={{ color: 'green', cursor: 'pointer' }}
                    onClick={() => handleAcceptRequest(request.id)}
                  />
          
                  {/* Red x icon for rejecting request */}
                  <CancelIcon
                    style={{ color: 'red', cursor: 'pointer' }}
                    onClick={() => handleRejectRequest(request.id)}
                  />
                </ListItem>
                {index < requests.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        );
      };
      

      
  return (
    <div>
      <br />
      <br />

        <div>
          {requests && requests.length > 0 ? (
            <React.Fragment>
              <Row className='justify-content-center'>
                {renderRequests()}
              </Row>
              <br />
              <br />
            </React.Fragment>
          ) : (
            <h6>No requests Yet...<Link style={{ color: "red" }} to='/galleria'>Explore</Link></h6>
          )}

{
  requests.length > 9 &&
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
    </div>  )
}

export default Requests