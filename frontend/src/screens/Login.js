import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, login } from '../actions/userAction';
import { useSnackbar } from 'notistack';
import LoadingSpinner from '../components/LoadingSpinner';
import axios from "axios"
import { Row } from 'react-bootstrap'
import Loader from '../components/Loader2';

import {  Typography, Snackbar } from '@mui/material';




function LoginScreen() {
  const { enqueueSnackbar } = useSnackbar(); // useSnackbar hook
  const dispatch = useDispatch()
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const redirect =  '/login';
  const redirecter = location.search ? Number(location.search.split('=')[1]) : '/';

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const userRegister = useSelector((state) => state.userRegister);
  const { error, loading, userInfo, success } = userRegister;

  const userLogin = useSelector((state) => state.userLogin);
  const { error:errorLogin, loading:loadingLogin, userInfo:userInfoLogin, sucess:successLogin } = userLogin;





  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      enqueueSnackbar("The Passwords Did not Match ! ", { variant: 'error' })
    } else {
      try {
        await dispatch(register(name, email, password));
        {success && navigate(redirect) }
        
      } catch (error) {
        
        enqueueSnackbar(error, { variant: 'error' })
      }
    }
  };

  const LoginHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [dispatch, navigate, userInfo, redirect]);

  useEffect(() => {
    if (userInfoLogin) {
      navigate(redirecter);
    }
  }, [dispatch, navigate, userInfoLogin, redirecter]);





  
  const cssStyles = `
  body{
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    font-family: 'Jost', sans-serif;
    background: linear-gradient(to bottom, #ff0000, #000000);
  }
  .main{
    width: 350px;
    height: 570px;
    background: red;
    overflow: hidden;
    background: url("https://doc-08-2c-docs.googleusercontent.com/docs/securesc/68c90smiglihng9534mvqmq1946dmis5/fo0picsp1nhiucmc0l25s29respgpr4j/1631524275000/03522360960922298374/03522360960922298374/1Sx0jhdpEpnNIydS4rnN4kHSJtU1EyWka?e=view&authuser=0&nonce=gcrocepgbb17m&user=03522360960922298374&hash=tfhgbs86ka6divo3llbvp93mg4csvb38") no-repeat center/ cover;
    border-radius: 10px;
    box-shadow: 5px 20px 50px #000;
  }
  #chk{
    display: none;
  }
  .signup{
    position: relative;
    width:100%;
    height: 100%;
  }
  label{
    color: #fff;
    font-size: 2.3em;
    justify-content: center;
    display: flex;
    margin: 60px;
    font-weight: bold;
    cursor: pointer;
    transition: .5s ease-in-out;
  }
  .sign{

    margin: 30px;



  }
  input{
    width: 60%;
    height: 20px;
    background: #e0dede;
    justify-content: center;
    display: flex;
    margin: 20px auto;
    padding: 10px;
    border: none;
    outline: none;
    border-radius: 5px;
  }
  button{
    width: 60%;
    height: 40px;
    margin: 10px auto;
    justify-content: center;
    display: block;
    color: black;
    background: white;
    font-size: 1em;
    font-weight: bold;
    margin-top: 20px;
    outline: none;
    border: none;
    border-radius: 5px;
    transition: .2s ease-in;
    cursor: pointer;
  }
  button:hover{
    background: red;
  }
  .login{
    height: 460px;
    background: #eee;
    border-radius: 60% / 10%;
    transform: translateY(-180px);
    transition: .8s ease-in-out;z
  }
  .login label{
    color: red;
    transform: scale(.6);
  }
  
  #chk:checked ~ .login{
    transform: translateY(-500px);
  }
  #chk:checked ~ .login label{
    transform: scale(1);  
  }
  #chk:checked ~ .signup label{
    transform: scale(.6);
  }
  `;

  return (

    <>
      <style>{cssStyles}</style>

      <Snackbar 
          
          open={success}
          message={<span style={{ color: 'green' }}>"You Can Now Click On Log In"</span>}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        />



{loading || loadingLogin ? (
  <div>
    <Row className='justify-content-center align-items-center'>

      <Loader/>
      </Row>

  </div>
):  (
  

  <div className="main">
          <Row className='justify-content-center'>

          <Snackbar 
  open={error}
  message={<span style={{ color: '#ff0000' }}>{error}</span>}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
/>
<Snackbar 
  open={errorLogin}
  message={<span style={{ color: '#ff0000' }}>{errorLogin}</span>}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
/>
  </Row>

  <input type="checkbox" id="chk" aria-hidden="true" />

  <div className="signup">
  <form 
onSubmit={submitHandler}

>            <h3 style={{ alignItems:"center", textAlign:"center", color:"white",     fontFamily: "'Georgia', 'Times New Roman', serif", }}>GALLERIA</h3>


<Row className='justify-content-center'>

    <img src='
    https://www.svgrepo.com/show/284958/photo-camera-photograph.svg'
    
    style={{ height:"52px", alignItems:"center" }}
    ></img>
    </Row>
      <label htmlFor="chk" aria-hidden="true"  className='sign'>
        Sign up
      </label>
      <input className="un" type="name" align="center" placeholder="Enter User Name" value={name} onChange={(e) => setName(e.target.value)} />
  <input className="un" type="email" align="center" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />

  <input className="pass" type="password" align="center" placeholder="Password" value={password}  onChange={(e) => setPassword(e.target.value)}/>
  <input className="pass" type="password" align="center" placeholder="Confirm Password" value={confirmPassword}  onChange={(e) => setConfirmPassword(e.target.value)}/>

      <button className="submit" align="center" type='submit'>Sign up</button>
      <div className='googleContainer'>
          <div id="signInDiv" className='gsignIn'></div>
      </div>
    </form>
  </div>



  <div className="login">
  <form className="form1"
onSubmit={LoginHandler}

>            <label htmlFor="chk" aria-hidden="true">
        Login
      </label>
      <input className="un" type="email" align="center" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
  <input className="pass" type="password" align="center" placeholder="Password" value={password}  onChange={(e) => setPassword(e.target.value)}/>
<button className="submit" align="center" type='submit'>Login</button>
<button className="submit" align="center"> <Link to='/forgot-password'>Forgot Password</Link></button>

    </form>
    <div className='googleContainer'>
          <div id="signInDiv" className='gsignIn'></div>
      </div>
  </div>
</div>

) }


    </>
  );
}

export default LoginScreen;
