import React, { useState, useEffect, Component } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Button from '@mui/material/Button';
import { formatDistanceToNow } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { getUserDetails,updateUserProfile} from '../actions/userAction';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'
import { useSnackbar } from 'notistack';
import LoadingSpinner from '../components/LoadingSpinner';
import axios from 'axios';
import { Form } from 'react-bootstrap';
import LabTabs from '../components/Tab';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LabTabsMobile from '../components/MobileTab';
import Popup from '../components/PopUp';
import FollowerList from '../components/Follower';
import FollowingList from '../components/Following';
import GroupIcon from '@mui/icons-material/Group';
import EditIcon from '@mui/icons-material/Edit';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import Loader from '../components/Loader2';
import Delete from '../components/Delete';
import { logout } from '../actions/userAction';


import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { getOtpAction } from '../actions/userAction';

const FileUpload = ({ onChange }) => {

  const handleButtonClick = () => {
    document.getElementById('image').click();
  };
  return (
    <label htmlFor="image">
      <input type="file" id="image" onChange={onChange}         
      style={{ display: 'none' }}
 />
       <Button
        variant="outlined"
        component="span"
        startIcon={<CloudUploadIcon />}
        onClick={handleButtonClick}
      >UPLOAD AVI</Button>
    </label>
  );
};


function FormPropsTextFields() {
  const { enqueueSnackbar } = useSnackbar(); // useSnackbar hook

  const userDetails = useSelector((state) => state.userDetails);
  const {  loading, user } = userDetails;
  

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avi, setAvi] = useState('');
  const [uploading, setUploading] = useState(false) 
  const [isPrivate, setIsPrivate] = useState(user.isPrivate);




  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
 

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const postDelete = useSelector((state) => state.postDelete);
  const { success: successDelete } = postDelete;

  
  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success:successUpdate, error:errorUpdate, loading:loadingUpdate } = userUpdateProfile;


  const handleIsPrivateChange = (event) => {
    setIsPrivate(event.target.value === 'private');
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      enqueueSnackbar("The Passwords Did not Match ! ", { variant: 'error' })
    } else {

    dispatch(updateUserProfile({
      'id':user._id,
      'name':name,
      'email':email,
      'password':password,
      'bio':bio,
      'avi':avi,
      'isPrivate': isPrivate,


    }))

      }
    }

    useEffect(() => {
      if (!userInfo) {
        navigate('/login');
      }
    }, [navigate, userInfo]);

    useEffect(() => {
      if (!userInfo) {
        ;
      }else{
          if(!user || !user.name || successUpdate || userInfo._id !== user._id){
            dispatch({type:USER_UPDATE_PROFILE_RESET})
            dispatch(getUserDetails('profile'))
  
              
          }

          

  
          if (successUpdate) {
            {successUpdate && enqueueSnackbar("Your Profile Was Updated Successfully", { variant: 'success' })
          } 

          
         
          }
  
  
  
          else{
              setName(user.name)
              setEmail(user.email)
              setBio(user.bio)
              setAvi(user.avi)
              


          }
      }
    }, [dispatch, navigate, userInfo, user, successDelete]);
  

const uploadFileHandler = async (e) => {
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append('avi', file)
      formData.append('user_id', userInfo.id)

      setAvi(URL.createObjectURL(e.target.files[0]));

    
      setUploading(true)
      try {
        const config = {
          headers:{
            'Content-Type':'multipart/form-data'
    
          }
        }
        const{data} = await axios.post(`/api/users/upload/`, formData, config)
    
        // setAvi( URL.createObjectURL(data) )
        setUploading(false)
        
      } catch (error) {
        setUploading(false)
      }
    
    }


 return (
  <div>
    {loadingUpdate || uploading ? (

<Row className='justify-content-center align-items-center'>

<Loader/>
</Row>

    ):(
      <Box
  component="form"
  sx={{
    '& .MuiTextField-root': { m: 1, width: '25ch' },
  }}
  noValidate
  autoComplete="on"
  onSubmit={submitHandler}
>
  {loadingUpdate && <LoadingSpinner />}

  <div>
    {errorUpdate && 
    
    <p style={{ color:"red" }}>{errorUpdate}</p>
    }
    <TextField
      required
      label="Username"
      variant="filled"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
    <TextField
      required
      label="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      variant="filled"
      type="email"
    />

    <TextField
      required
      id="outlined-multiline-flexible"
      multiline
      label="Bio"
      value={bio}
      onChange={(e) => setBio(e.target.value)}
      variant="filled"
      type="text"
    />
    <br/>

<label style={{ marginTop: '10px', marginBottom: '5px' }}>Change Password</label>
<br />

{errorUpdate && 
    
    <p style={{ color:"red" }}>{errorUpdate}</p>
    }

    <TextField
      label="Password"
      type="password"
      autoComplete="current-password"
      variant="filled"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    
    <TextField
      label="Confirm Password"
      type="password"
      autoComplete="current-password"
      variant="filled"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
    />
<br/>
<label style={{ marginTop: '10px', marginBottom: '5px' }}>ACCOUNT TYPE</label>
<br />

<Row className='justify-content-center align-items-center text-center'>
<Col className='justify-content-center align-items-center text-center'>
  
<RadioGroup
      name="isPrivate"
      style={{ alignContent:"center", textAlign:"center", alignItems:"center" }}
      value={isPrivate ? 'private' : 'public'}
      onChange={handleIsPrivateChange}
    >
      <FormControlLabel value="public" control={<Radio />} label="Public" />
      <FormControlLabel value="private" control={<Radio />} label="Private" />
    </RadioGroup>
    </Col>
</Row>


    <br />




    <Button type="submit" variant="outlined" style={{ color: 'blue' }}>
      Save <i className="far fa-save"></i>
    </Button>
  </div>
</Box>


    )}

</div>

  );
}



function ChangePhoto() {
  const { enqueueSnackbar } = useSnackbar(); // useSnackbar hook

  const userDetails = useSelector((state) => state.userDetails);
  const {  loading, user } = userDetails;
  

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avi, setAvi] = useState('');
const [contactNumber, setContactNumber] = useState(''); // New constant for 'contact_number'
const [address, setAddress] = useState(''); // New constant for 'address'
const [guardianName, setGuardianName] = useState(''); // New constant for 'guardian_name'
const [guardianContact, setGuardianContact] = useState(''); // New constant for 'guardian_contact'
const [guardian2Name, setGuardian2Name] = useState(''); // New constant for 'guardian2_name'
const [guardian2Contact, setGuardian2Contact] = useState(''); // New constant for 'guardian2_contact'
  const [uploading, setUploading] = useState(false) 
  const [isPrivate, setIsPrivate] = useState(user.isPrivate);




  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
 

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const navigate = useNavigate()
  const dispatch = useDispatch()



  
  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success:successUpdate, error:errorUpdate, loading:loadingUpdate } = userUpdateProfile;

  



 


    useEffect(() => {
      if (!userInfo) {
        ;
      }else{
          if(!user || !user.name || successUpdate || userInfo._id !== user._id){
            dispatch({type:USER_UPDATE_PROFILE_RESET})
            dispatch(getUserDetails('profile'))
  
              
          }

          

  
          if (successUpdate) {
            {successUpdate && enqueueSnackbar("Your Profile Was Updated Successfully", { variant: 'success' })
          } 

          
         
          }
  
  
  
          else{
              setName(user.name)
              setEmail(user.email)
              setBio(user.bio)
              setAvi(user.avi)
              setContactNumber(user.contact_number)
              setAddress(user.address)
              setGuardianName(user.guardian_name)
              setGuardian2Name(user.guardian2_name)
              setGuardianContact(user.guardian_contact)
              setGuardian2Contact(user.guardian2_contact)
              


          }
      }
    }, [dispatch, navigate, userInfo, user]);
  



  
  

const uploadFileHandler = async (e) => {
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append('avi', file)
      formData.append('user_id', userInfo.id)

      setAvi(URL.createObjectURL(e.target.files[0]));

    
      setUploading(true)
      try {
        const config = {
          headers:{
            'Content-Type':'multipart/form-data',
            Authorization : `Bearer ${userInfo.token}`

    
          }
        }
        const{data} = await axios.post(`/api/users/upload/`, formData, config)
        enqueueSnackbar("Profile Photo Updated", { variant: 'success' })
        // setAvi( URL.createObjectURL(data) )
        setUploading(false)
        
      } catch (error) {
        setUploading(false)
      }
    
    }


 return (
  <div>
    {uploading ? (

<Row className='justify-content-center align-items-center'>

<Loader/>
</Row>

    ):(


  <div>



<label style={{ marginTop: '10px', marginBottom: '5px' }}>CHANGE YOUR AVI</label>
<br />

{avi && <img src={avi} alt={name} style={{ width: '100px', height:'100px' }} />}

    <Form.Group controlId="image">
      <FileUpload onChange={uploadFileHandler} />
      {uploading && <Loader/>}
    </Form.Group>



  </div>


    )}

</div>

  );
}




  
    function Profile() {
        const isLargeScreen = useMediaQuery('(min-width: 600px)');
        const isSmallScreen = useMediaQuery('(max-width: 480px)');
        const userLogin = useSelector(state => state.userLogin);
        const { userInfo } = userLogin;
      
        const [selectedOption, setSelectedOption] = useState(0);
      
        const handleOptionChange = (event, newValue) => {
          setSelectedOption(newValue);
        };

        const userDetails = useSelector((state) => state.userDetails);
        const {  loading, user } = userDetails;

        const dispatch = useDispatch()
        const navigate = useNavigate()

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


        const [hasExpired, setHasExpired] = useState(false);
        const [currentTime, setCurrentTime] = useState(new Date());
      
        const expirationTime = userInfo?.expiration_time
      
        const getOtp = useSelector((state) => state.getOtp);
        const { loading: loadingOtp, error: errorOtp, success:successOtp, Otp } = getOtp;
        

        const submitHandler = () => {
          dispatch(getOtpAction())


        };
      
      
      
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
            dispatch(getUserDetails('profile'));
          }
        }, [dispatch, userInfo]);
        

          useEffect(() => {

          if (successOtp) {
          navigate("/verify")
          }          
          
        }, [navigate, loadingOtp, successOtp, errorOtp]);
      




      

      
        return (
          <div>
            <br />
            <br />
            <br />
            <br />
      
            <Container>
              {loadingOtp && <Loader/>}
              <Row>
              {!user?.is_verified
            
            &&

            <Button
            style={{ backgroundColor:"red"}}
            onClick={submitHandler}
            >
       <h6>Activate My Account</h6>         
              </Button>

            }
              </Row>


              <Row>
                <Col xs={3} md={1}>
                  <Image src={user.avi} alt='https://www.svgrepo.com/show/442075/avatar-default-symbolic.svg' thumbnail />
                  <Popup component={<ChangePhoto  />}  icon={EditIcon}  />

                </Col>

              </Row>
              <br />
              {userInfo && 
              
              <Row>
              <h6>{userInfo.name}</h6>
              <h6 style={{ fontSize: '12px', color: "red" }}>@{userInfo.email}</h6>
              <b>Joined: {formatTimestamp(user.date_joined)}</b>
              <Col style={{ textAlign: "right" }}>
              <Popup component={<FormPropsTextFields />} fa={<i className="far fa-edit"></i>} />
                
              </Col>
            </Row>
              }

              <Row>
              </Row>
              <Row>
              <p>{user.bio}</p>
              </Row>
              <br />
      
              <Row className='justify-content-center' style={{ margin:"-8px"}}>
                <Col md={2} >
                  <Popup component={<FollowerList avatar={true} userId={user.id} />} word={user.total_followers} icon={GroupIcon} pre="Followers:  " />
                </Col>
                <Col md={2} style={{ marginLeft:isLargeScreen ?  '-61px': "" }}>
                  <Popup component={<FollowingList avatar={true} userId={user.id} />} word={user.total_following} icon={GroupIcon} pre="Following:  " />

                </Col>
                <Col md={2} style={{ marginLeft: isLargeScreen ? '-61px' : ""}}>
                  <Popup component={<FormPropsTextFields  />}  icon={EditIcon} pre="EDIT:  " />

                </Col>

                <Col md={2} style={{ marginLeft:isLargeScreen ? '-108px': '' }}>
                  <Popup component={<Delete  />}  icon={DeleteForeverIcon}  />

                </Col>
              </Row>
              <br />
              <br />

      

      
              {isLargeScreen && (
                <div>
                <Row>
                  <Col>
                  
                  <LabTabs id={userInfo && userInfo.id} showBookmark={true} showRequests={user.isPrivate} />

                  </Col> 
                </Row>

                </div>

              )}

                    
{isSmallScreen && (
                <Row>
                  <Col>
                  <LabTabsMobile id={user.id} showBookmark={true} showRequests={user.isPrivate}/>
                  </Col>
                </Row>
              )}
      
              <br />
            </Container>
          </div>
        );
      }
      

      export default Profile;
      
      
