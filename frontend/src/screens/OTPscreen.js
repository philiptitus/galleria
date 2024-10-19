import React, { useState, useRef } from 'react';
import { styled } from '@mui/system';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { verifyOtpAction } from '../actions/userAction';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { getUserDetails } from '../actions/userAction';
import { logout } from '../actions/userAction'
import Loader from '../components/Loader2';


const StyledForm = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px',
  borderRadius: '8px',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#fff',
});

const OTPTextField = styled(TextField)({
  width: '48px', // Adjust the width as needed
  margin: '0 4px', // Adjust the margin as needed
  textAlign: 'center',
  '& input': {
    textAlign: 'center',
    maxLength: 1,
  },
});

const StyledButton = styled(Button)({
  marginTop: '16px',
  minWidth: '150px',
});

const OTPScreen = () => {
  const [otp, setOTP] = useState(new Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate()
  const {enqueueSnackbar} = useSnackbar()
  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const {  user } = userDetails;


  const verifyOtp = useSelector((state) => state.verifyOtp);
  const { loading: loadingOtp, error: errorOtp, success:successOtp, Otp } = verifyOtp;
  
  // const [top, setop] = useState('');
 
  const [hasExpired, setHasExpired] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const expirationTime = userInfo?.expiration_time


  useEffect(() => {
    if (!userInfo) {
      navigate('/forte')
    }
      }, [navigate,userInfo]);
  
  const logoutHandler = () => {
    dispatch(logout())
    navigate('/forte')
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
    
    
const dispatch = useDispatch()

  const submitHandler = () => {

    dispatch(
      verifyOtpAction({
        otp


      })
    );


  };




  const handleChange = (index, value) => {
    if (value.length > 1) return; // Limit to one digit
    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);
    // Move focus to the next input box
    if (index < 5 && value !== '') {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    // Perform OTP verification logic here
    setLoading(true); // Simulate loading
    setTimeout(() => {
      setLoading(false);
      dispatch(verifyOtpAction(otpValue));

      // Handle OTP verification success or failure
    }, 2000);
  };
  

  useEffect(() => {

    if (successOtp) {
      enqueueSnackbar("OTP verification Success :)", { variant: 'success' });
    navigate("/")
    }
    if (errorOtp) {
      enqueueSnackbar(errorOtp, { variant: 'error' });
    }
    
    
  }, [navigate, loadingOtp, successOtp, errorOtp]);


  useEffect(() => {
    if (userInfo) {
      dispatch(getUserDetails('profile'));
    }
  }, [dispatch, userInfo]);


  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      {loadingOtp && <Loader/>}
      <StyledForm onSubmit={handleSubmit}>
      <i
              style={{
                color:"black"
              }}
      >We Sent An OTP to </i><b
      
      style={{
        color:"black"
      }}
      >{user.email}</b>
<i
style={{
  color:"black"
}}
>Check your spam mails</i>
        <Typography variant="h5" gutterBottom
        
        style={{
          color:"black"
        }}
        >
          Enter OTP
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {otp.map((value, index) => (
            <OTPTextField
              key={index}
              variant="outlined"
              type="text"
              value={value}
              onChange={(e) => handleChange(index, e.target.value)}
              inputRef={(el) => (inputRefs.current[index] = el)}
            />
          ))}
        </div>
        <StyledButton
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading || otp.some((value) => value === '')}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify'}
        </StyledButton>
      </StyledForm>
    </div>
  );
};

export default OTPScreen;
