// import React, { useState, useEffect, useRef } from 'react';
// import Box from '@mui/material/Box';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import { useDispatch, useSelector } from 'react-redux';
// import { useSnackbar } from 'notistack';
// import Loader from '../components/Loader2';
// import axios from 'axios';
// import { useNavigate, useParams } from 'react-router-dom';
// import { updatePost } from '../actions/postActions';
// import { Form } from 'react-bootstrap';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import { Row } from 'react-bootstrap';
// import 'react-image-crop/dist/ReactCrop.css';
// import { logout } from '../actions/userAction';

// import { POST_UPDATE_RESET } from '../constants/postConstants';

// const FileUpload = ({ onChange }) => {
//   const handleButtonClick = () => {
//     document.getElementById('image').click();
//   };

//   return (
//     <div>
//       <input
//         type="file"
//         id="image"
//         accept="image/*"
//         style={{ display: 'none' }}
//         onChange={onChange}
//       />
//       <Button
//         variant="outlined"
//         component="span"
//         startIcon={<CloudUploadIcon />}
//         onClick={handleButtonClick}
//       >
//         Upload Image
//       </Button>
//     </div>
//   );
// };



// const VideoUpload = ({ onChange }) => {
//   const handleButtonClick = () => {
//     document.getElementById('video').click();
//   };

//   return (
//     <div>
//       <input
//         type="file"
//         id="video"
//         accept="video/*"  // Accept video files
//         style={{ display: 'none' }}
//         onChange={onChange}
//       />
//       <Button
//         variant="outlined"
//         component="span"
//         startIcon={<CloudUploadIcon />}
//         onClick={handleButtonClick}
//       >
//         Upload Video  {/* Update button text */}
//       </Button>
//     </div>
//   );
// };






// const FilesUpload = ({ onChange }) => {
//   const handleButtonClick = () => {
//     document.getElementById('image').click();
//   };

//   return (
//     <div>
//       <input
//         type="file"
//         id="image"
//         accept="image/*"
//         multiple  // Allow multiple file selection
//         style={{ display: 'none' }}
//         onChange={onChange}
//       />
//       <Button
//         variant="outlined"
//         component="span"
//         startIcon={<CloudUploadIcon />}
//         onClick={handleButtonClick}
//       >
//         Upload Images
//       </Button>
//     </div>
//   );
// };







// const BasicTextFields = () => {
//   const { enqueueSnackbar } = useSnackbar();
//   const [caption, setCaption] = useState('');
//   const [description, setDescription] = useState('');
//   const [image, setImage] = useState('');
//   const [album, setAlbum] = useState('');
//   const [video, setVideo] = useState('');


//   const [uploading, setUploading] = useState(false);

//   const postUpdate = useSelector((state) => state.postUpdate);
//   const { success, loading, error, post } = postUpdate;

//   const userLogin = useSelector((state) => state.userLogin);
//   const { userInfo } = userLogin;

//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { id } = useParams();


//   const [hasExpired, setHasExpired] = useState(false);
//   const [currentTime, setCurrentTime] = useState(new Date());

//   const expirationTime = userInfo?.expiration_time



//   useEffect(() => {
//     if (!userInfo) {
//       navigate('/home')
//     }
//       }, [navigate,userInfo]);

//       const logoutHandler = () => {
//         dispatch(logout())
//         navigate('/home')
//         window.location.reload();
        
//       };

//       useEffect(() => {
//         // Parse the expiration time string into components
//         if (userInfo) {
          
//         const [, year, month, day, hour, minute, second] = expirationTime.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
    
//         // Create a Date object with the parsed components
//         const expirationDateTime = new Date(year, month - 1, day, hour, minute, second);
    
//         // Update the state with the expiration time
//         setCurrentTime(new Date());
//         setHasExpired(expirationDateTime < new Date());
    
//         // Set up a timer to update the current time every second
//         const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
//         // Clean up the interval on component unmount
//         return () => clearInterval(timer);
//       }
    
//       }, [expirationTime]); // Run effect whenever expirationTime changes
    
    
    
//       useEffect(() => {
//         if (hasExpired) {
//           logoutHandler()
//         }
//           }, [navigate, hasExpired]);
  

//   const uploadFileHandler = async (e) => {
//     const file = e.target.files[0];
//     const formData = new FormData();
//     formData.append('image', file);
//     formData.append('post_id', id);

//     setImage(URL.createObjectURL(e.target.files[0]));


//     setUploading(true);
//     try {
//       const config = {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       };
//       const { data } = await axios.post(`/api/posts/upload/`, formData, config);

//       setUploading(false);
//     } catch (error) {
//       setUploading(false);
//     }
//   };


//   const uploadVideoHandler = async (e) => {
//     const file = e.target.files[0];
//     const formData = new FormData();
//     formData.append('video', file); // Change 'image' to 'video' to match the backend
//     formData.append('post_id', id);
  
//     setUploading(true);
//     try {
//       const config = {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       };
//       const { data } = await axios.post(`/api/posts/videos/`, formData, config);
  
//       setUploading(false);
//     } catch (error) {
//       setUploading(false);
//     }
//   };
  



//   const uploadFilesHandler = async (e) => {
//     const files = e.target.files;
  
//     const formData = new FormData();
//     for (let i = 0; i < files.length; i++) {
//       formData.append('albums', files[i]);
//     }
//     formData.append('post_id', id);
  
//     // Assuming you want to display the first image in case of multiple uploads
//     if (files.length > 0) {
//       setAlbum(URL.createObjectURL(files[0]));
//     }
  
//     setUploading(true);
//     try {
//       const config = {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       };
//       const { data } = await axios.post(`/api/posts/uploads/`, formData, config);
  
//       setUploading(false);
//     } catch (error) {
//       setUploading(false);
//     }
//   };
  

//   const submitPost = () => {
//     dispatch(
//       updatePost({
//         id: id,
//         caption: caption,
//         description: description,
//         image: image,
//         video: video,
//         albums: album
//       })
//     );
//     if (!album) {
//       enqueueSnackbar('Upload an image to continue', { variant: 'error' });
//       return;
//     }
//     if (album) {
//       enqueueSnackbar('New Post Added :)', { variant: 'info' });
//       navigate('/profile')

      
//     }


//   };



//   useEffect(() => {
//     setImage(image)
//     setAlbum(album)
//     setVideo(video)

//     if (!userInfo) {
//       // Handle case where user is not logged in
//     } else {
//       if (success) {
//         dispatch({ type: POST_UPDATE_RESET });
//       }
//     }
//   }, [dispatch, navigate, userInfo, success]);

//   return (
//     <div>
//           <h1>Make A Post</h1>
//     <Box
//       component="form"
//       sx={{
//         '& > :not(style)': { m: 1, width: '25ch' },
//       }}
//       noValidate
//       autoComplete="off"
//       style={{ backgroundColor: 'white' }}
//       onSubmit={submitPost}
//     >
//       <TextField
//         id="filled-basic"
//         label="Caption"
//         variant="filled"
//         required
//         onChange={(e) => setCaption(e.target.value)}
//       />
//       <TextField
//         id="outlined-multiline-flexible"
//         label="Description"
//         multiline
//         maxRows={4}
//         required
//         onChange={(e) => setDescription(e.target.value)}
//       />
//       {/* {image && (
//         <img
//           src={image}
//           alt="Uploaded Image"
//           style={{ maxWidth: '100%', marginTop: '10px' }}
//         />
//       )}
//       <Form.Group controlId="image">
//         <FileUpload onChange={uploadFileHandler} required={true}  />
//         {uploading && <Loader />}

//       </Form.Group> */}

// {video && (
//   <video
//     controls
//     src={video}
//     alt="Uploaded Video"
//     style={{ maxWidth: '100%', marginTop: '10px' }}
//   />
// )}
// <Form.Group controlId="video">
//   <VideoUpload onChange={uploadVideoHandler} required={true} />
//   {uploading && <Loader />}
// </Form.Group>





 

//  {album && Array.isArray(album) && album.map((image, index) => (
//   <img
//     key={index}
//     src={image}
//     alt={`Uploaded Album ${index + 1}`}
//     style={{ maxWidth: '100%', marginTop: index > 0 ? '10px' : '0' }}
//   />
// ))} 

//  <Form.Group controlId="image">
//   <FilesUpload onChange={uploadFilesHandler} />
//   {uploading && <Loader />}
// </Form.Group> 



//       <Button type="submit" variant="outlined" style={{ color: 'blue' }}>
//         POST <i className="far fa-save"></i>
//       </Button>
//     </Box>

//     </div>

//   );
// };

// function NewPost() {
//   return (
//     <div>
//       <br />
//       <br />
//       <Row className="align-items-center">
//         <BasicTextFields />
//       </Row>
//     </div>
//   );
// }

// export default NewPost;


import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import Loader from '../components/Loader2';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { updatePost } from '../actions/postActions';
import { Form } from 'react-bootstrap';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Row } from 'react-bootstrap';
import 'react-image-crop/dist/ReactCrop.css';
import { logout } from '../actions/userAction';

import { POST_UPDATE_RESET } from '../constants/postConstants';
import { Link } from 'react-router-dom';



const VideoUpload = ({ onChange }) => {
  const handleButtonClick = () => {
    document.getElementById('video').click();
  };

  return (
    <div>
      <input
        type="file"
        id="video"
        accept="video/*"  // Accept video files
        style={{ display: 'none' }}
        onChange={onChange}
      />
      <Button
        variant="outlined"
        component="span"
        startIcon={<CloudUploadIcon />}
        onClick={handleButtonClick}
      >
        Upload Video  {/* Update button text */}
      </Button>
    </div>
  );
};




const FilesUpload = ({ onChange }) => {
  const handleButtonClick = () => {
    document.getElementById('image').click();
  };

  return (
    <div>
      <input
        type="file"
        id="image"
        accept="image/*"
        multiple  // Allow multiple file selection
        style={{ display: 'none' }}
        onChange={onChange}
      />
      <Button
        variant="outlined"
        component="span"
        startIcon={<CloudUploadIcon />}
        onClick={handleButtonClick}
      >
        Upload Images
      </Button>
    </div>
  );
};






const BasicTextFields = () => {
  const buttonRef = useRef(null);

  const { enqueueSnackbar } = useSnackbar();
  const [step, setStep] = useState(1); // Current step
  const [caption, setCaption] = useState('');
  const [description, setDescription] = useState('');
  const [album, setAlbum] = useState([]);
  const [uploading, setUploading] = useState(false);

  const postUpdate = useSelector((state) => state.postUpdate);
  const { success } = postUpdate;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (success) {
      dispatch({ type: POST_UPDATE_RESET });
      navigate('/profile');
    }
  }, [dispatch, navigate, success]);

  const uploadFilesHandler = async (e) => {
    const files = e.target.files;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('albums', files[i]);
    }
    formData.append('post_id', id);

    setUploading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const { data } = await axios.post(`/api/posts/uploads/`, formData, config);
      enqueueSnackbar("Post Created Successfully", { variant: 'success' })

      setUploading(false);
      setAlbum(Array.from(files).map((file) => URL.createObjectURL(file)));
      setStep(step + 1); // Move to the next step after uploading
    } catch (error) {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (album && buttonRef.current) {
      buttonRef.current.click();
    }
  }, [album]);

  const submitPost = () => {
    dispatch(
      updatePost({
        id: id,
        caption: caption,
        description: description,
        albums: album,
      })
    );
  };

  return (
    <div>
      <Box
        component="form"
        sx={{
          '& > :not(style)': {
            m: 1,
            '@media (max-width: 600px)': { // Adjust the max-width to target mobile screens
              minWidth: '40ch',
            },
            '@media (min-width: 601px)': { // Adjust the min-width to target larger screens
              minWidth: '128ch',

            },
          },
        }}
        noValidate
        autoComplete="off"
        style={{ backgroundColor: 'white' }}
      >
        {step === 1 && (
          <>
            <TextField
              id="filled-basic"
              label="Caption(Optional)"
              variant="filled"
              required
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <TextField
              id="outlined-multiline-flexible"
              label="Description(Optional)"
              multiline
              maxRows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button onClick={() => setStep(step + 1)}>Next</Button>
          </>
        )}
        {step === 2 && (
          <>
            <h6 style={{ color: "black", textAlign: "center" }}>Upload some Images To Finish Making Your Post</h6>
            <Form.Group controlId="image">
              <FilesUpload onChange={uploadFilesHandler} />
              {uploading && <Loader />}
            </Form.Group>
            <Button onClick={() => setStep(step - 1)}>Previous</Button>
            <Row>
            <Link to="/">
              <Button style={{ color: "red" }}>Discard Post</Button>
            </Link>
            </Row>
            <Button ref={buttonRef} onClick={submitPost} style={{ display: 'none' }}>Finish</Button>
          </>
        )}
      </Box>
    </div>
  );
};


const BasicVideoFields = () => {
  const buttonRef = useRef(null);

  const [step, setStep] = useState(1);
  const [caption, setCaption] = useState('');
  const [description, setDescription] = useState('');
  const [video, setVideo] = useState('');
  const [uploading, setUploading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();


  const postUpdate = useSelector((state) => state.postUpdate);
  const { success } = postUpdate;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const uploadVideoHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('video', file);
    formData.append('post_id', id);

    setUploading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const { data } = await axios.post(`/api/posts/videos/`, formData, config);
      enqueueSnackbar("Post Created Successfully", { variant: 'success' })


      setVideo(URL.createObjectURL(e.target.files[0])); // Set video preview
      setUploading(false);
      setStep(step + 1); // Move to the next step after uploading
    } catch (error) {
      setUploading(false);
    }
  };


  useEffect(() => {
    if (video && buttonRef.current) {
      buttonRef.current.click();
    }
  }, [video]);


  const submitPost = () => {
    dispatch(
      updatePost({
        id: id,
        caption: caption,
        description: description,
        video: video,
      })
    );
  };

  useEffect(() => {
    if (success) {
      dispatch({ type: POST_UPDATE_RESET });
      navigate('/profile');
    }
  }, [dispatch, navigate, success]);

  return (
    <div>
      <Box
        component="form"
      sx={{
        '& > :not(style)': {
          m: 1,
          '@media (max-width: 600px)': { // Adjust the max-width to target mobile screens
            minWidth: '40ch',
          },
          '@media (min-width: 601px)': { // Adjust the min-width to target larger screens
            minWidth: '128ch',
          },
        },
      }}
        noValidate
        autoComplete="off"
        style={{ backgroundColor: 'white' }}
      >
        {step === 1 && (
          <>
          <Row>
            <TextField
              id="filled-basic"
              label="Caption(Optional)"
              variant="filled"
              required
              value={caption}

              onChange={(e) => setCaption(e.target.value)}
            />
            </Row>
            <Row>
            <TextField
              id="outlined-multiline-flexible"
              label="Description(Optional)"
              multiline
              maxRows={4}
              required
              value={description}

              onChange={(e) => setDescription(e.target.value)}
            />
            </Row>
            <Button onClick={() => setStep(step + 1)}>Next</Button>
          </>
        )}
        {step === 2 && (
          <>
          <Row>
                      <h6
                                            style={{
                                              color:"black"
                                            }}
                      
                      >Upload a Video To Finish Making Your Post</h6>
</Row>

            <Form.Group controlId="video">
              <VideoUpload onChange={uploadVideoHandler} required={true} />
              {uploading && <Loader />}
            </Form.Group>
            <Button onClick={() => setStep(step - 1)}>Previous</Button>
            <Row>
            <Link to="/">
              <Button style={{ color: "red" }}>Discard Post</Button>
            </Link>
            </Row>

            <Button ref={buttonRef} onClick={submitPost} style={{ display: 'none' }}>Finish</Button>
          </>
        )}
      </Box>
    </div>
  );
};




const NewPost = () => {
  const [postType, setPostType] = useState(null);

  const handlePostTypeSelect = (type) => {
    setPostType(type);
  };

  return (
    <div className="new-post">
      <header className="header">
        <h1>Make A New Post</h1>
      </header>
      <div className="content">
        {postType === null && (
          <div className="post-type-selector">
            <h2>What post would you like to make?</h2>
            <button onClick={() => handlePostTypeSelect('normal')}>Normal Post</button>
            <button onClick={() => handlePostTypeSelect('slice')}>Slice</button>
          </div>
        )}
        {postType === 'normal' && (
          <div className="normal-post-upload">
            <BasicTextFields/>
            {/* Image upload functionality */}
          </div>
        )}
        {postType === 'slice' && (
          <div className="slice-post-upload">
            <BasicVideoFields/>
            {/* Video upload functionality */}
          </div>
        )}
      </div>
      <style>
        {`
          /* CSS styles */
          .new-post {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
          }

          .header {
            text-align: center;
            margin-bottom: 20px;
          }

          .post-type-selector {
            text-align: center;
          }

          .post-type-selector h2 {
            margin-bottom: 20px;
          }

          .post-type-selector button {
            margin: 0 10px;
            padding: 10px 20px;
            font-size: 16px;
            background-color: red;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          .post-type-selector button:hover {
            background-color: #2980b9;
          }

          .normal-post-upload, .slice-post-upload {
            text-align: center;
          }

          .normal-post-upload h2, .slice-post-upload h2 {
            margin-bottom: 20px;
          }
        `}
      </style>
    </div>
  );
};

export default NewPost;
