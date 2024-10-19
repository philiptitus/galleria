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

interface FollowingListProps {
  avatar: boolean;
  userId: string;
}

const FollowingList = ({ avatar, userId }: FollowingListProps) => {
  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserDetails(userId));
  }, [dispatch, userId]);

  const dynamicData = user.following.map((following) => ({
    id: following.custom_id,
    text: following.following_name,
    imageUrl: following.following_avi,
  }));

  const renderRow = (props: ListChildComponentProps) => {
    const { index, style } = props;
    const item = dynamicData[index];

    return (
        <ListItem style={style} component="div" disablePadding>
          <ListItemButton>
          <Link to={`/user/${item.id}`} key={item.id}>
            <ListItemAvatar>
              <Avatar alt={`Avatar for ${item.text}`} src={item.imageUrl} />
            </ListItemAvatar>
            </Link>

            <ListItemText primary={item.text} />
          </ListItemButton>
        </ListItem>
    );
  };

  return (
    <Box sx={{ width: '100%', height: 200, maxWidth: 360, bgcolor: 'background.paper' }}>
      {dynamicData.length === 0 ? (
        <p>No Users Found</p>
      ) : (
        <FixedSizeList
          height={200}
          width={360}
          itemSize={avatar ? 72 : 46}
          itemCount={dynamicData.length}
          overscanCount={5}
        >
          {renderRow}
        </FixedSizeList>
      )}
    </Box>
  );
};

export default FollowingList;
