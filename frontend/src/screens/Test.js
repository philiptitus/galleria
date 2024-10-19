import { useEffect, useState } from "react";
import { Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';
import Loader from '../components/Loader2'
import { useNavigate } from 'react-router-dom';
import { logout } from "../actions/userAction";

function Test() {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [searchText, setSearchText] = useState('');
    const [totalPages, setTotalPages] = useState(1);


    const navigate = useNavigate();

    const dispatch = useDispatch();






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
            const response = await axios.get(`/api/notifications/?name=${searchText}&page=${page}`, config);
            setNotifications((prevPosts) => [...prevPosts, ...response.data.results]);
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
        <div className="container">
<br/>
<br/>
<br/>
<h5>Notifications</h5>

            <div>
        <Row>
          {notifications.length < 1  && (
          <h6 variant='success'>Nothing Here</h6>
          )}
          {notifications.map((notification) => (
            <ul key={notification.id} sm={12} md={6} lg={4} xl={3}>
                {notification.notification_type == 'account'   && <h6 style={{ color:"red",  fontSize:"6px" }}>ACCOUNT</h6>}
                {notification.notification_type == 'chat'   && <h6 style={{ color:"green",  fontSize:"6px" }}>CHAT</h6>}
                {notification.notification_type == 'comment'   && <h6 style={{ color:"blue",  fontSize:"6px" }}>COMMENT</h6>}
                {notification.notification_type == 'like'   && <h6 style={{ color:"orange",  fontSize:"6px" }}>LIKE</h6>}
                {notification.notification_type == 'follow'   && <h6 style={{ color:"yellow",  fontSize:"6px" }}>FOLLOWS</h6>}




              <li>
                <h6>{notification.message}</h6>     
          </li>
            </ul>
          ))}
        </Row>
        {
  notifications.length > 9 &&
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

export default Test;
