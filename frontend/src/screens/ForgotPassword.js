import React, { useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import AForm from '../components/aform';
import { Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { forgot_password } from '../actions/userAction';
import { useSelector, useDispatch } from 'react-redux'
import Loader from '../components/Loader2'


const PasswordResetRequest = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate()

  const forgotPassword = useSelector((state) => state.forgotPassword);
  const { error, loading, success } = forgotPassword;

  const dispatch = useDispatch()


  const handleSubmit2 =  () => {

    dispatch(forgot_password(email))
    {loading && <Loader/>}
    {success &&  enqueueSnackbar('A link to reset your password has been sent to your email', { variant: 'success' });

  }
  {error &&  enqueueSnackbar('An Unexpected Error Occured', { variant: 'error' });}

    

  };


  return (
    <div>
      { loading ? (
        <Loader/>
      ) : success ? (

        <div>
        {success && enqueueSnackbar('A Link To Reset Your Password Was Sent To Your Email Address', { variant: 'success' })}
        {navigate('/login')}
      </div>

      ):  error ? (
        <div>
        <div>
        {error && enqueueSnackbar('Check Your Email And Try Again', { variant: 'error' })}
      </div>
      <div>
        <br />
        <br />
        <br />
        <br />
        <Row className='justify-content-center align-items-center'>
          <div className='wrapper text-center'>
          <h6>Enter your registered email</h6>
  
            <AForm
              forgotScreen={true}
              resetScreen={false}
              onSubmit={handleSubmit2}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </Row>
        </div>
      </div>
      ):  
      
      (
<div>
        <br />
        <br />
        <br />
        <br />
        <Row className='justify-content-center align-items-center'>
          <div className='wrapper text-center'>
          <h6>Enter your registered email</h6>
  
            <AForm
              forgotScreen={true}
              resetScreen={false}
              onSubmit={handleSubmit2}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </Row>
        </div>

      )
      }

    </div>
  );
};

export default PasswordResetRequest;
