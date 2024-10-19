import React from 'react';
import { Typography, Card, CardContent, Grid, Grow, Slide, Zoom } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import { PlayCircleOutline as PlayCircleOutlineIcon, CloudUploadOutlined as CloudUploadOutlinedIcon, NotificationsActiveOutlined as NotificationsActiveOutlinedIcon, VerifiedUserOutlined as VerifiedUserOutlinedIcon, SupervisorAccountOutlined as SupervisorAccountOutlinedIcon } from '@mui/icons-material';
const useStyles = makeStyles((theme) => ({
    card: {
      maxWidth: 800,
      margin: 'auto',
      marginTop: theme.spacing(8),
      padding: theme.spacing(4),
      borderRadius: theme.spacing(2),
      boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
      background: 'linear-gradient(to right, #64b5f6, #1976d2)',
      color: '#fff',
    },
    featureItem: {
      padding: theme.spacing(3),
      borderRadius: theme.spacing(1),
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    //   background: 'rgba(255, 255, 255, 0.9)',
      transition: 'transform 0.3s ease-in-out',
      '&:hover': {
        transform: 'scale(1.03)',
      },
    },
  }));
  
  const About = () => {
    const classes = useStyles();
  
    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center">
            Welcome to Galleria V 2.2
          </Typography>
          <Typography variant="body1" paragraph align="center">
            Introducing the latest release of our Social Media Clone, Version 2.2, now available as of April 10th! We're thrilled to unveil a plethora of exciting new features and enhancements, taking your social media experience to new heights.
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <Zoom in style={{ transitionDelay: '100ms' }}>
                <div className={classes.featureItem}>
                  <Typography variant="h6" align="center" style={{ color: '#1976d2' }}>
                    Reel/Videos Support
                  </Typography>
                  <Typography variant="body1" align="center">
                    Get ready to unleash your creativity with our new Reel and Video support! Share your life's moments, stories, and adventures in stunning motion.
                  </Typography>
                </div>
              </Zoom>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Zoom in style={{ transitionDelay: '200ms' }}>
                <div className={classes.featureItem}>
                  <Typography variant="h6" align="center" style={{ color: '#1976d2' }}>
                    Multiple Image Upload
                  </Typography>
                  <Typography variant="body1" align="center">
                    We understand the importance of storytelling through visuals. With our enhanced multiple image upload feature, you can now share even more of your cherished memories with ease.
                  </Typography>
                </div>
              </Zoom>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Zoom in style={{ transitionDelay: '300ms' }}>
                <div className={classes.featureItem}>
                  <Typography variant="h6" align="center" style={{ color: '#1976d2' }}>
                    Google Authentication Support
                  </Typography>
                  <Typography variant="body1" align="center">
                    Seamlessly log in to your account with the convenience of Google Authentication. Say goodbye to remembering complex passwords and hello to hassle-free access.
                  </Typography>
                </div>
              </Zoom>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Zoom in style={{ transitionDelay: '400ms' }}>
                <div className={classes.featureItem}>
                  <Typography variant="h6" align="center" style={{ color: '#1976d2' }}>
                    Improved Notifications System
                  </Typography>
                  <Typography variant="body1" align="center">
                    Stay in the loop with our refined notifications system. Never miss a like, comment, or follow again as we keep you updated on all the latest interactions and activities.
                  </Typography>
                </div>
              </Zoom>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Zoom in style={{ transitionDelay: '500ms' }}>
                <div className={classes.featureItem}>
                  <Typography variant="h6" align="center" style={{ color: '#1976d2' }}>
                    Enhanced User Interactions
                  </Typography>
                  <Typography variant="body1" align="center">
                    Take control of your social experience with our expanded set of user interaction tools. From muting and blocking to reporting, you have the power to curate your online community like never before.
                  </Typography>
                </div>
              </Zoom>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Zoom in style={{ transitionDelay: '600ms' }}>
                <div className={classes.featureItem}>
                  <Typography variant="h6" align="center" style={{ color: '#1976d2' }}>
                    Improved UI
                  </Typography>
                  <Typography variant="body1" align="center">
                    We've listened to your feedback and invested in enhancing the user interface to provide a more intuitive and visually appealing platform. Navigate effortlessly and enjoy a seamless browsing experience.
                  </Typography>
                </div>
              </Zoom>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };
  
  export default About;