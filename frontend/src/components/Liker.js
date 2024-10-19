import React, { useState } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Bookmark from '@mui/icons-material/Bookmark';

function Liker({ total, red = false, bookmark = false }) {
  const [likeCount, setLikeCount] = useState(total);
  const [liked, setLiked] = useState(red);

  const toggleDisplay = () => {
    setLiked(!liked);
    setLikeCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
  };

  // Styles object
  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    heartBg: {
      background: liked ? 'rgba(255, 192, 200, 0.7)' : 'rgba(255, 192, 200, 0)',
      borderRadius: '50%',
      height: '30px',
      width: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 100ms ease',
      cursor: 'pointer',
    },
    heartIcon: {
      fontSize: '48px',
      color: liked ? 'red' : 'grey',
    },
    likesAmount: {
      fontSize: '20px',
      fontFamily: 'Roboto, sans-serif',
      color: liked ? 'red' : '#888',
      fontWeight: '900',
      marginLeft: '6px',
    },
  };

  return (
    <div style={styles.container}>
      <div className='heart-bg' style={styles.heartBg} onClick={toggleDisplay}>
        {!bookmark ? (
                    <FavoriteIcon style={styles.heartIcon} />

        ):
        (
            <Bookmark style={styles.heartIcon} />

        )}
      </div>
      <div className='likes-amount' style={styles.likesAmount}>
        {likeCount}
      </div>
    </div>
  );
}

export default Liker;
