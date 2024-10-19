// import React, { useState, useEffect } from 'react';
// import { styled } from '@mui/material/styles';
// import Card from '@mui/material/Card';
// import CardHeader from '@mui/material/CardHeader';
// import CardMedia from '@mui/material/CardMedia';
// import CardContent from '@mui/material/CardContent';
// import CardActions from '@mui/material/CardActions';
// import { useNavigate } from 'react-router-dom';
// import Collapse from '@mui/material/Collapse';
// import Avatar from '@mui/material/Avatar';
// import FormProp from './Form';
// import Liker from './Liker';
// import AddCommentIcon from '@mui/icons-material/AddComment';
// import IconButton, { IconButtonProps } from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import { red } from '@mui/material/colors';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import ShareIcon from '@mui/icons-material/Share';
// import BookmarkIcon from '@mui/icons-material/Bookmark';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import MenuItem from '@mui/material/MenuItem';
// import CommentIcon from '@mui/icons-material/Comment';
// import Menu from '@mui/material/Menu';
// import { getUserDetails, followUser } from '../actions/userAction';
// import { useDispatch, useSelector,  } from 'react-redux';
// import Popup from '../components/PopUp';
// import Scroller from './Scroller';
// import { Link } from 'react-router-dom';
// import { listPostDetails } from '../actions/postActions';
// import AddIcon from '@mui/icons-material/Add';
// import { enqueueSnackbar } from 'notistack';
// import { createBookmark, createLike } from '../actions/postActions';
// import { deletePost, deleteComment } from '../actions/postActions';



// interface ExpandMoreProps extends IconButtonProps {
//   expand: boolean;
// }

// const ExpandMore = styled((props: ExpandMoreProps) => {
//   const { expand, ...other } = props;
//   return <IconButton {...other} />;
// })(({ theme, expand }) => ({
//   transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
//   marginLeft: 'auto',
//   transition: theme.transitions.create('transform', {
//     duration: theme.transitions.duration.shortest,
//   }),
// }));

// export default function Post({image, date, caption, description, total_likes, total_bookmarks, total_comments, avi, name, id, user, card = true, screen = false, showFollow = false, likers, currentUserEmail, bookers}) {
//   const [isCurrentUserLiker, setIsCurrentUserLiker] = useState(false);


  
//   const [isCurrentUserBooker, setIsCurrentUserBooker] = useState(false);


  
//   const [expanded, setExpanded] = React.useState(false);
//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const  dispatch = useDispatch()
//   const navigate = useNavigate();

//   const postDelete = useSelector((state) => state.postDelete);
//   const { success, error } = postDelete;
//   const userLogin = useSelector((state) => state.userLogin);
//   const { userInfo } = userLogin;

//   const postDetails = useSelector(state => state.postDetails);
//   const { error:errorPost, loading, post, success: successPost } = postDetails;



//   const postCommentCreate = useSelector((state) => state.postCommentCreate);
//   const {

//     success: successCreate,
// } = postCommentCreate


  



//   const deletePostHandler = (postId) => {
//     dispatch(deletePost(postId));
//     enqueueSnackbar('Deleting in A Moment', { variant: 'success' });
//     window.location.reload();

//   };


//   const handleExpandClick = () => {
//     setExpanded(!expanded);
//   };

  
//   useEffect(() => {
//     if (screen) {
//       handleExpandClick();
//     }
//   }, [screen]); // Listen to changes in `screen`

//   const handleMenuClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const HandleFollow = () => {
//     // Show a success snackbar when the button is clicked
//     enqueueSnackbar('Following', { variant: 'success' });
//     dispatch(followUser(user));
//   };

//   const HandleLike = () => {
//     // Show a success snackbar when the button is clicked
//     dispatch(createLike(id));
//   };

//   const HandleBookmark = () => {
//     // Show a success snackbar when the button is clicked
//     dispatch(createBookmark(id));
//   };



//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };


//   useEffect(() => {
//     if (Array.isArray(likers)) {
//       setIsCurrentUserLiker(likers.some(liker => liker.liker_name === currentUserEmail));
//     } else {
//       setIsCurrentUserLiker(false);
//     }
    
//     // Log a message when the component is loaded

//   }, [currentUserEmail, likers]);


//   useEffect(() => {
//     if (Array.isArray(likers)) {
//       setIsCurrentUserBooker(bookers.some(booker => booker.booker_name === currentUserEmail));
//     } else {
//       setIsCurrentUserBooker(false);
//     }
    
//     // Log a message when the component is loaded

//   }, [currentUserEmail, bookers]);

//   useEffect(() => {
//     console.log('userInfoId:', userInfo?._id);
//     console.log('user:', user);
  
//     // Additional logic or side effects can be added here
  
//   }, [userInfo, user]); // Include dependencies if required
  

//   useEffect(() => {
//     if (userInfo) {
//       dispatch(listPostDetails(id));
//     }
//   }, [dispatch, id, successPost, userInfo]);


//   return (
// <Card
//   sx={{
//     maxWidth: card ? 345 : 500,
//     border: screen ? 'none' : '1px dashed red', // Adjust border condition
//     borderRadius: '10px',
//   }}
//   style={{ backgroundColor: "black", color: "white" }}
// >
//       <CardHeader
//         avatar={
//           <Link to={`/user/${user}`} style={{ color: 'black' }} key={user}><Avatar alt={`Avatar for user`} src={avi} /></Link>

//         }
//         action={
//           <>
//             <IconButton aria-label="settings" onClick={handleMenuClick}>
//               <MoreVertIcon style={{ color:"red" }} />
//             </IconButton>
//             {showFollow && 
//                         <IconButton onClick={HandleFollow}>
//                         <AddIcon  style={{color:"red" }}/>
          
//                       </IconButton>
            
//             }

//             <Menu
//             style={{ color:"white" }}
//               anchorEl={anchorEl}
//               open={Boolean(anchorEl)}
//               onClose={handleMenuClose}
//             >
//               <MenuItem ><Link to={`/user/${user}`} style={{ color: 'black' }} key={user}>View Profile</Link></MenuItem>
//               {!screen && <MenuItem><Link to={`/post/${id}`} style={{ color: 'black' }} key={id}>View Post</Link></MenuItem> }
              
//               {userInfo?.id == user &&

// <MenuItem  
// onClick={() => deletePostHandler(id)}
// style={{color:"red"}}>Delete Post</MenuItem>

              
//               }


//             </Menu>
//           </>
//         }
//         title={name}
//         subheader=<h6 style={{ color:"white" }}>{date}</h6>
//       />
//       {/* <CardMedia
//         component="img"
//         height={card ? "194" : "610"}
//         image={image}
//         alt="Paella dish"
//       /> */}
//       {image}
//             <CardActions disableSpacing>
//         <IconButton aria-label="add to favorites" onClick={HandleLike}>
//         {/* <FavoriteIcon style={{ color:"red" }}/> */}
//         {isCurrentUserLiker &&  <Liker total={total_likes} 
//         red={true} />}
//         {!isCurrentUserLiker && <Liker total={total_likes} 
//         />}
//         {/* <h3 style={{ color:"red" }}>{total_likes}</h3> */}

//         </IconButton>
//         <IconButton aria-label="add to favorites">
//         <Popup component={<FormProp postID={id}/>}  icon={AddCommentIcon} word={total_comments}/>
//         </IconButton>
//         <IconButton aria-label="share"  onClick={HandleBookmark}>

//         {/* <BookmarkIcon style={{ color:"red" }}/> */}
//         {/* <h3 style={{ color:"red" }}>{total_bookmarks}</h3> */}
//         {isCurrentUserBooker &&  <Liker total={total_bookmarks} 
//         red={true}  bookmark={true} />}
//         {!isCurrentUserBooker && <Liker total={total_bookmarks} 
        
//         bookmark={true}
//         />}


//         </IconButton>
//       </CardActions>
//       <CardContent style={{ textAlign:"left", color:"white" }}>
//         <Typography variant="body2" color="white">
//         {caption}
//         </Typography>
//       </CardContent>
//       <CardActions disableSpacing>
//         <ExpandMore
//           expand={expanded}
//           onClick={handleExpandClick}
//           aria-expanded={expanded}
//           aria-label="show more"
//           style={{ color:"red" }}
//         >
//           <ExpandMoreIcon />
//         </ExpandMore>
//       </CardActions>
//       <Collapse in={expanded} timeout="auto" unmountOnExit>
//         <CardContent>
//           <Typography paragraph>
//             {description}
//  </Typography>
//         </CardContent>
//         {screen &&
//         <div>
//                           <CardContent>
//                 <Typography paragraph>
//                 <Scroller avatar={true} word={total_comments} postId={id} icon={AddCommentIcon} total={total_comments} showComment={true} user = {user}/>

//        </Typography>
      
//               </CardContent>
//               <CardContent>
//                 <Typography paragraph>
//                 <Scroller avatar={true} word={total_likes} postId={id} icon={FavoriteIcon} total={total_likes} showLike={true}/>

//        </Typography>
      
//               </CardContent>
              
//               {userInfo?._id === user && (
//   <CardContent>
//     <Typography paragraph>
//       <Scroller avatar={true} word={total_bookmarks} postId={id} icon={BookmarkIcon} total={total_bookmarks} showBookmark={true}/>
//     </Typography>
//   </CardContent>
// )}





//         </div>

//         }


//       </Collapse>
//     </Card>
//   );
// }

import React, { useRef, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { useNavigate } from 'react-router-dom';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import FormProp from './Form';
import Liker from './Liker';
import AddCommentIcon from '@mui/icons-material/AddComment';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuItem from '@mui/material/MenuItem';
import CommentIcon from '@mui/icons-material/Comment';
import Menu from '@mui/material/Menu';
import { getUserDetails, followUser } from '../actions/userAction';
import { useDispatch, useSelector,  } from 'react-redux';
import Popup from '../components/PopUp';
import Scroller from './Scroller';
import { Link } from 'react-router-dom';
import { listPostDetails } from '../actions/postActions';
import AddIcon from '@mui/icons-material/Add';
import { enqueueSnackbar } from 'notistack';
import { createBookmark, createLike } from '../actions/postActions';
import { deletePost, deleteComment } from '../actions/postActions';
import ReactPlayer from 'react-player';
import Carousel from './Carousel';
import { Row } from 'react-bootstrap';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function Post({image, date, caption, description, total_likes, total_bookmarks, total_comments, avi, name, id, user, card = true, screen = false, showFollow = false, likers, currentUserEmail, bookers, poster}) {
  const [isCurrentUserLiker, setIsCurrentUserLiker] = useState(false);


  
  const [isCurrentUserBooker, setIsCurrentUserBooker] = useState(false);


  
  const [expanded, setExpanded] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const  dispatch = useDispatch()
  const navigate = useNavigate();

  const postDelete = useSelector((state) => state.postDelete);
  const { success, error } = postDelete;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const postDetails = useSelector(state => state.postDetails);
  const { error:errorPost, loading, post, success: successPost } = postDetails;



  const postCommentCreate = useSelector((state) => state.postCommentCreate);
  const {

    success: successCreate,
} = postCommentCreate


const playerRef = useRef(null);
const [isPlaying, setIsPlaying] = useState(false);

useEffect(() => {
  const player = playerRef.current;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsPlaying(true);
        } else {
          setIsPlaying(false);
        }
      });
    },
    {
      threshold: 0.5, // Adjust the threshold as needed
    }
  );

  if (player) {
    observer.observe(player);
  }

  return () => {
    if (player) {
      observer.unobserve(player);
    }
  };
}, [playerRef]);
  


const ThinRedLine = () => {
  const lineStyle = {
    width: '50%',
    height: '1px',
    backgroundColor: 'red',
    margin: '0 auto', // Center the line horizontally
    opacity: '0.5', // Adjust opacity to make it barely visible
  };

  return <div style={lineStyle}></div>;
};


  const deletePostHandler = (postId) => {
    dispatch(deletePost(postId));
    enqueueSnackbar('Deleting in A Moment', { variant: 'success' });
    window.location.reload();

  };


  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  
  useEffect(() => {
    if (screen) {
      handleExpandClick();
    }
  }, [screen]); // Listen to changes in `screen`

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const HandleFollow = () => {
    // Show a success snackbar when the button is clicked
    enqueueSnackbar('Following', { variant: 'success' });
    dispatch(followUser(user));
  };

  const HandleLike = () => {
    // Show a success snackbar when the button is clicked
    dispatch(createLike(id));
  };

  const HandleBookmark = () => {
    // Show a success snackbar when the button is clicked
    dispatch(createBookmark(id));
  };



  const handleMenuClose = () => {
    setAnchorEl(null);
  };


  useEffect(() => {
    if (Array.isArray(likers)) {
      setIsCurrentUserLiker(likers.some(liker => liker.liker_name === currentUserEmail));
    } else {
      setIsCurrentUserLiker(false);
    }
    
    // Log a message when the component is loaded

  }, [currentUserEmail, likers]);


  useEffect(() => {
    if (Array.isArray(likers)) {
      setIsCurrentUserBooker(bookers.some(booker => booker.booker_name === currentUserEmail));
    } else {
      setIsCurrentUserBooker(false);
    }
    
    // Log a message when the component is loaded

  }, [currentUserEmail, bookers]);

  useEffect(() => {
    console.log('userInfoId:', userInfo?._id);
    console.log('user:', user);
  
    // Additional logic or side effects can be added here
  
  }, [userInfo, user]); // Include dependencies if required
  

  // useEffect(() => {
  //   if (userInfo) {
  //     dispatch(listPostDetails(id));
  //   }
  // }, [dispatch, id, successPost, userInfo]);


  return (

    <Row style={{ display: 'flex', justifyContent: 'center' }}>

  <Card
      sx={{
        maxWidth: card ? 345 : 500,
        minWidth: card ? 345 : 375,
        borderBottom: screen ? 'none' : '0.5px dashed red', // Apply border to bottom edge only
        borderRadius: '10px',
      }}
  style={{ backgroundColor: "black", color: "white" }}
>
      <CardHeader
        avatar={
          <Link to={`/user/${user}`} style={{ color: 'black' }} key={user}><Avatar alt={`Avatar for user`} src={avi} /></Link>

        }
        action={
          <>
            <IconButton aria-label="settings" onClick={handleMenuClick}>
              <MoreVertIcon style={{ color:"red" }} />
            </IconButton>
            {showFollow && 
                        <IconButton onClick={HandleFollow}>
                        <AddIcon  style={{color:"red" }}/>
          
                      </IconButton>
            
            }

            <Menu
            style={{ 
              color:"white",

            }}
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <Row
              style={{
                marginRight:"25px",
                marginLeft:"25px"
              }}
              >

              <MenuItem ><Link to={`/user/${user}`} style={{ color: 'black' }} key={user}>View Profile</Link></MenuItem>
                            </Row>
<Row

style={{
  marginRight:"25px",
  marginLeft:"25px"
}}
>
              {!screen && <MenuItem><Link to={`/post/${id}`} style={{ color: 'black' }} key={id}>View Post</Link></MenuItem> }
  </Row>

  <Row
  
  style={{
    marginRight:"25px",
    marginLeft:"25px"
  }}
  >
                  {userInfo?.id == user &&

<MenuItem  
onClick={() => deletePostHandler(id)}
style={{color:"red"}}>Delete Post</MenuItem>

              
              }
    </Row>            



            </Menu>
          </>
        }
        title={name}
        subheader=<h6 style={{ color:"white" }}>{date}</h6>
      />
      {/* <CardMedia
        component="img"
        height={card ? "194" : "610"}
        image={image}
        alt="Paella dish"
      /> */}
      {
poster?.isSlice ? 
<div ref={playerRef}>
<ReactPlayer
  ref={playerRef}
  width={card? "320px": "400px"}
  controls
  url={poster.video}
  playing={isPlaying}
  muted={true} // Start the video on mute
  config={{
    file: {
      attributes: {
        controlsList: 'nodownload', // Remove download option
      },
    },
  }}

/>
</div>
: 

<Carousel post={poster}/>

      }
            <CardActions disableSpacing>
        <IconButton aria-label="add to favorites" onClick={HandleLike}>
        {/* <FavoriteIcon style={{ color:"red" }}/> */}
        {isCurrentUserLiker &&  <Liker total={total_likes} 
        red={true} />}
        {!isCurrentUserLiker && <Liker total={total_likes} 
        />}
        {/* <h3 style={{ color:"red" }}>{total_likes}</h3> */}

        </IconButton>

        <IconButton aria-label="share"  onClick={HandleBookmark}>

        {/* <BookmarkIcon style={{ color:"red" }}/> */}
        {/* <h3 style={{ color:"red" }}>{total_bookmarks}</h3> */}
        {isCurrentUserBooker &&  <Liker total={total_bookmarks} 
        red={true}  bookmark={true} />}
        {!isCurrentUserBooker && <Liker total={total_bookmarks} 
        
        bookmark={true}
        />}


        </IconButton>

        <IconButton aria-label="add to favorites">
        <Popup component={<FormProp postID={id}/>}  icon={AddCommentIcon} word={total_comments}/>
        </IconButton>
      </CardActions>
      <CardContent style={{ textAlign:"left", color:"white" }}>
        <Typography variant="body2" color="white">
        {caption}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
          style={{ color:"red" }}
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>
            {description}
 </Typography>
        </CardContent>
        {screen &&
        <div>
                          <CardContent>
                <Typography paragraph>
                <Scroller avatar={true} word={total_comments} postId={id} icon={AddCommentIcon} total={total_comments} showComment={true} user = {user}/>

       </Typography>
      
              </CardContent>
              <CardContent>
                <Typography paragraph>
                <Scroller avatar={true} word={total_likes} postId={id} icon={FavoriteIcon} total={total_likes} showLike={true}/>

       </Typography>
      
              </CardContent>
              
              {userInfo?._id === user && (
  <CardContent>
    <Typography paragraph>
      <Scroller avatar={true} word={total_bookmarks} postId={id} icon={BookmarkIcon} total={total_bookmarks} showBookmark={true}/>
    </Typography>
  </CardContent>
)}





        </div>

        }


      </Collapse>

    </Card>


    </Row>


  );
}