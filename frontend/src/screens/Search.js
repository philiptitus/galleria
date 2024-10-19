import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { Link } from 'react-router-dom';
import axios from 'axios';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import IconButton from '@mui/material/IconButton';
import Loader from '../components/Loader2';
import { Row } from 'react-bootstrap';


import { logout } from '../actions/userAction';



const CustomList = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [totalPages, setTotalPages] = useState(1);


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [data, setData] = useState([]);

// ...


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
      const response = await axios.get(`/api/users/?name=${searchText}&page=${page}`, config);
      // const searchedUsers = response.data.results.reverse();
      setUsers(response.data.results);
      setTotalPages(response.data.total_pages);
      // setData(searchedUsers);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [page, searchText]);


const handleSearch = (e) => {
  setSearchText(e.target.value);
  setPage(1); // Reset page when searching
};
// ...

  const handleLoadMore = () => {
    // Increment the page to fetch the next set of posts
    setPage((prevPage) => prevPage + 1);
  };

  // useEffect(() => {
  //   // Update data when users change
  //   if (users) {
  //     const formattedData = users.map((user) => ({
  //       id: user.id,
  //       name: user.name,
  //       avatarUrl: user.avi,
  //     }));
  //     setData(formattedData);
  //   }
  // }, [users]);


  return (
    <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'black', color: 'white' }}>
      <div>
        <br/>
        <br/>
        <br/>
        <br/>
      <input
        type='search'
        placeholder='Search Someone Here'
        value={searchText}
        onChange={handleSearch}
        style={{
          width: '100%',
          padding: '8px',
          borderRadius: '5px',
          border: '1px solid white',
          color: 'black', // Adjust text color as needed
          background: 'white', // Adjust background color as needed
        }}
      />
      </div>
      <div>

{users.length < 1 && <h1>Nothing Found</h1>}

<div>
{users.
      map((item) => {
        const labelId = `custom-list-item-label-${item.id}`;
        return (
          <Link to={`/user/${item.id}`} style={{ color: 'white' }} key={item.id}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar alt={`Avatar for ${item.name}`} src={item.avi} />
                </ListItemAvatar>
                <ListItemText id={labelId} primary={item.name} />
              </ListItemButton>
            </ListItem>
          </Link>
        );
      })}


  </div>
  





  {
  users.length > 9 &&
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

    </List>
  );
};

const SearchScreen = () => {
  return (
    <div>
      <CustomList />
    </div>
  );
};

export default SearchScreen;
