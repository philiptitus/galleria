import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import Loader from '../components/Loader2';
import { Row } from 'react-bootstrap';
import { googleauth } from '../actions/userAction';
const Callback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar(); // useSnackbar hook



  const googleLogin = useSelector((state) => state.googleLogin);
  const { error, loading, userInfo } = googleLogin;

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');

    if (code) {
      console.log(code);
      dispatch(googleauth(code));

    }
  }, [location, dispatch]);

  React.useEffect(() => {
    if (userInfo) {


      enqueueSnackbar("You have successfully signed in. ", { variant: 'success' })


      navigate('/');
    }

    if (error) {
      enqueueSnackbar(error, { variant: 'error' })


    }
  }, [userInfo, error, navigate, enqueueSnackbar]);

  return (
    <div justifyContent="center" alignItems="center" height="100vh">
      <div textAlign="center">
        <h2 mb="4">Handling login...</h2>
        {loading ? (
  <div>
  <Row className='justify-content-center align-items-center'>

    <Loader/>
    </Row>

</div>        ) : (
          <h3>Please wait while we process your login.</h3>
        )}
      </div>
    </div>
  );
};

export default Callback;
