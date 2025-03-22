import React, { useState } from "react";
import { Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from 'notistack';

const Landing = () => {


    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar(); // useSnackbar hook
  
  const googleLogin = useSelector((state) => state.googleLogin);
  const {  userInfo: googleInfo } = googleLogin;


  React.useEffect(() => {
    if (googleInfo) {


      enqueueSnackbar("You have successfully signed in. ", { variant: 'success' })


      window.location.reload();
    }


  }, [googleInfo,  enqueueSnackbar]);


  return (

<div>

      <style>
        {`


html{
    font-size: 62.5%;
    width: 100%;
 }
  
  body {
    marginbottom: 0px;
    padding: 0;
    height: 130vh;
    font-size: 1.4rem;
  }
  
  h1 {
    font-size: 2.4rem;
  }
  
  .container__item {
    margin: 0 auto 0;
  }
  
  .landing-page-container {
    width: 100%;
    min-height: 100%;
    height: 130vh;
    background: black; /* url("https://c1.staticflickr.com/8/7223/7350752026_f0edac67e6_b.jpg"); */
    background-position: bottom;
    background-repeat: no-repeat;
    background-size: cover;
    overflow: hidden;
    display: table;
    font-family: "Montserrat", sans-serif;
    color: white;
  }
  
  .content-wrapper {
    max-width: 1600px;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    position: relative;
  }
  
  .header {
    width: 100%;
    height: 2rem;
    padding: 3rem 0;
    display: block;
  }
  
  .menu-icon {
    width: 2.5rem;
    height: 1.5rem;
    display: inline.block;
    cursor: pointer;
  }
  
  .header__item {
    display: inline-block;
    float: left;
    padding-left: 10px;
  }
  
  .menu-icon__line {
    width: 2rem;
    height: .2rem;
    background: white;
    display: block;
  }
  
  .menu-icon__line:before, .menu-icon__line:after {
    content: '';
    width: 2rem;
    height: .2rem;
    background: white;
    display: inline-block;
    position: relative;
  }
  
  .menu-icon__line:before {
    left: 0.5rem;
    top: -0.6rem;
  }
  
  .menu-icon__line:after {
    top: -1.8rem;
  }
  
  .heading {
    width: 90%;
    font-size: 2rem;
    font-weight: bold;
    line-height: 1.7rem;
    margin: 0 20px;
    text-align: center;
  }
  
  .social-container {
    width: 7.25rem;
    list-style: none;
    overflow: hiden;
    padding: 0;
    margin: 0;
    float: right;
  }
  
  .social-container .social__icon.social__icon--dr {
    margin-left: 1.25rem;
  }
  .social-container .social__icon.social__icon--in {
    margin-left: 1-5rem;
  }
  .social-container .social__icon.social__icon--fb img {
    margin: 0 0.25rem;
  }
  
  .coords {
    font-size: 1.2rem;
    display: inline-block;
    float: left;
    position: absolute;
    top: 40%;
    font-weight: bold;
    color: white !important;
    letter-spacing: .2rem;
    left: -11.5rem;
    margin: 0;
    transform: rotate(-90deg) translateY(50%);
  }
  
  .ellipse-container {
    width: 50rem;
    height: 50rem;
    border-radius: 50%;
    margin: 0 auto;
    position: relative;
    top: 7rem;
  }

  @media only screen and (max-width: 768px) {
    .ellipse-container {
      width: 35rem;
      height: 35rem;

    }
  }
  
  
  .ellipse-container .greeting {
    position: relative;
    top: 18rem;
    right: 0;
    margin: 0 auto;
    text-transform: uppercase;
    letter-spacing: 4rem;
    font-size: 5rem;
    font-weight: bold;
    opacity: 1;
  }

  @media only screen and (max-width: 768px) {
    .ellipse-container .greeting {
      letter-spacing: 2rem;
      font-size: 4rem;
      top: 15rem;


    }
  }
  
  
  .ellipse {
    border-radius: 50%;
    position: absolute;
    box-sizing: border-box;
    top: 0;
    border-style: solid;
  }
  
  .ellipse__outer--thin {
    width: 100%;
    height: 100%;
    border-width: 1px;
    border-color: rgba(255,255,255,.5);
    animation: ellipseOrbit 5s linear infinite;
  }
  
  .ellipse__outer--thick {
    width: 100%;
    height: 100%;
    border-color: white transparent;
    border-width: 3px;
    transform: rotate(-45deg);
    animation: ellipseRotate 5s linear infinite;
  }
  
  .ellipse__orbit {
    width: 1.5rem;
    height: 1.5rem;
    border-width: 2px;
    border-color: white;
    top: 6rem;
    right: 7.75rem;
  }

  @media only screen and (max-width: 768px) {
    .ellipse__orbit {
      right: 5.75rem;
      top: 3rem;


    }
  }
  
  
  .ellipse__orbit:before {
    content: '';
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    position: absolute;
    display: inline-block;
    background-color: white;
    margin: 0 auto;
    left: 0;
    right: 0;
    top:50%;
    transform: translateY(-50%);
  }
  
  @keyframes ellipseRotate {
    0% {
      transform: rotate(-45deg);
    }
    100% {
      transform: rotate(-405deg);
    }
  }
  
  @keyframes ellipseOrbit {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

        `}
      </style>

      <div style={{
  margin: 0,
  padding: 0,
  width: '90vw', // 100% of viewport width
  height: '100vh', // 100% of viewport height
  backgroundColor: '#f0f0f0', // Example background color
  justifyContent: 'center',
  alignItems: 'center'
}}>        
      <div className="container_item landing-page-container">

        <div className="content-wrapper">
          <header className="header">
            <div className="menu-icon header__item">
              <span className="menu-icon__line"></span>
            </div>
            <Row style={{
                textAlign:"center",
                width:"80px"
            }}>
              <Link 
              to='/about'>
            <img 
            style={{
              textAlign:"center",
              width:"80px"
          }}
            src='https://www.svgrepo.com/show/284958/photo-camera-photograph.svg' width='8px'/>
            </Link>
            </Row>
          </header>


          <div className="ellipse-container">
            <h2 className="greeting">eXplore <i
            style={{
                fontSize:"19px",
                marginLeft:"15px"
            }}
            >Galleria</i></h2>


<h4>Interact with: </h4>
            <h6
            style={{
                margin:"auto"
            }}
            >YOUr friends</h6>
            <h6
            style={{
                textAlign:"right",
                margin:"auto"
            }}
            > YOUr world!</h6>
            <h6>YOUr family</h6>
            <br/>


            <div className="ellipse ellipse__outer--thin">
              <div className="ellipse ellipse__orbit"></div>
            </div>
            <div className="ellipse ellipse__outer--thick"></div>

          </div>


      <br/>
    <br/>
    <br/>
    <br/>
    <br/>
    <Row
style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
<button
  style={{
    background: 'linear-gradient(to bottom, #ff4d4d, #ff3333)', // Brighter red gradient
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    maxWidth: "100px",
    textShadow: '0 0 2px rgba(255, 255, 255, 0.5)',
    ':hover': {
      background: 'linear-gradient(to bottom, #ff4d4d, #ff1a1a)', // Brighter red on hover
      transform: 'scale(1.01)',
      transition: 'all 0.2s ease-in-out',
    },
    ':active': {
      transform: 'scale(0.98)',
      transition: 'transform 0.1s ease-in-out',
    },
  }}
>
  <Link to='/login' style={{ textDecoration: 'none', color: 'white' }}>Join The Community</Link>
</button>


      </Row>

    <br/>
    <br/>

        </div>


        <h4
    style={{
        textAlign:"center"
    }}
    >
        
        &copy; 2023 <a
        style={{
            color:"blue"
        }}
        href="https://mrphilip.pythonanywhere.com/">Philip Titus.</a> All rights reserved. 
</h4>
      </div>
      </div>



    </div>





  );
};

export default Landing;
