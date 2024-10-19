import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../actions/userAction';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { Link } from 'react-router-dom';

interface FollowerListProps {
  avatar: boolean;
  userId: string; // Assuming userId is a string, adjust the type accordingly
}

const FollowerList = ({ avatar, userId }: FollowerListProps) => {
  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserDetails(userId));
  }, [dispatch]);

  const dynamicData = user && user.followers.map((follower) => ({
    id: follower.custom_id,
    text: follower.follower_name,
    imageUrl: follower.follower_avi,
  }));

  const renderRow = (props: VirtualizedListItemProps) => {
    const { index, style, avatar } = props;
    const item = dynamicData[index];

    return (
      <div>
      <ListItem style={style} key={index} component="div" disablePadding>
        <ListItemButton>
        <Link to={`/user/${item.id}`} key={item.id}>
          <ListItemAvatar>
            <Avatar alt={`Avatar for ${item.text}`} src={item.imageUrl} />
          </ListItemAvatar>
          </Link>
          <ListItemText primary={item.text} />
        </ListItemButton>
      </ListItem>
      </div>
    );
  };

  return (
    <Box sx={{ width: '100%', height: 200, maxWidth: 360, bgcolor: 'background.paper' }}>
      {dynamicData &&  dynamicData.length === 0 ? (
        <p>No users found</p>
      ) : (
        <FixedSizeList
          height={200}
          width={360}
          itemSize={avatar ? 72 : 46}
          itemCount={dynamicData && dynamicData.length}
          overscanCount={5}
        >
          {(props) => renderRow({ ...props, avatar })}
        </FixedSizeList>
      )}
    </Box>
  );
};

export default FollowerList;
