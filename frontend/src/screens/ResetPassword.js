import React, {useState} from 'react'
import { useParams, useNavigate } from "react-router-dom";
import { enqueueSnackbar } from 'notistack';
import AForm from '../components/aform';
import axios from 'axios';
import { Row } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux'
import Loader from '../components/Loader2'
import { reset_password } from '../actions/userAction';




const ResetPassword = () => {
  const navigate=useNavigate()
  const {uid, token}=useParams()
  const [newpasswords, setNewPassword]=useState({
    password:"",
    confirm_password:"",
  })
  const {password, confirm_password}=newpasswords

  const handleChange=(e)=>{
    setNewPassword({...newpasswords, [e.target.name]:e.target.value})
}

const data={
  "password":password,
  "confirm_password":confirm_password,
  "uidb64":uid,
  "token": token,
}

const resetPassword = useSelector((state) => state.resetPassword);
const { error, loading, success } = resetPassword;

const dispatch = useDispatch()



 const handleSubmit2 =  () => {

  if (password !== confirm_password) {
    enqueueSnackbar("The Passwords Did not Match ! ", { variant: 'error' })
  }

  dispatch(reset_password(data))
  {loading && <Loader/>}
  {success &&  enqueueSnackbar(' You Can Log In With Your New Password', { variant: 'success' });

}

  

};
return (
  <div>
        <br />
        <br />
        <br />
        <br />
        <Row className='justify-content-center'>
{error && 
<h6 style={{ color:"red" }}>{error}</h6>
}
</Row>
    {loading ? (
      // Display loader when loading is true
      <Loader/>
    ) : success ? (
      // Display success message when success is true
      <div>
        {success && enqueueSnackbar('You Can Log In With Your New Password', { variant: 'success' })}
        {navigate('/login')}
      </div>
) : error ? (
  <div>
  <div>
    {/* {error && enqueueSnackbar('Your Password Must be:  a mix of letters (both uppercase and lowercase), numbers, and special characters for increased security.', { variant: 'error' })} */}
  </div>
        <div className='form-container'>

        <Row className='justify-content-center align-items-center'>
          <div className='wrapper' style={{ width: "100%" }}>
            <h6 style={{ textAlign: "center" }}>Enter your New Password</h6>
            <AForm resetScreen={true} forgotScreen={false} onSubmit={handleSubmit2} value2={password} value3={confirm_password} onChange2={handleChange} onChange3={handleChange} />
          </div>
        </Row>
      </div>
      </div>
):
    
    
    (
      // Display form when neither loading nor success is true
      <div className='form-container'>
        <Row className='justify-content-center align-items-center'>
          <div className='wrapper' style={{ width: "100%" }}>
            <h6 style={{ textAlign: "center" }}>Enter your New Password</h6>
            <AForm resetScreen={true} forgotScreen={false} onSubmit={handleSubmit2} value2={password} value3={confirm_password} onChange2={handleChange} onChange3={handleChange} />
          </div>
        </Row>
      </div>
    )}
  </div>
);
};


export default ResetPassword