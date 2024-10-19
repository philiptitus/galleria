import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme, Paper, Typography, Box, Button, MobileStepper } from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import AutoPlaySwipeableViews from 'react-swipeable-views';
import { listPostDetails } from '../actions/postActions';

function Carousel({ post }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  // const postDetails = useSelector(state => state.postDetails);
  // const { error, loading, post, success: successPost } = postDetails;

  // useEffect(() => {
  //   if (userInfo) {
  //     dispatch(listPostDetails(id));
  //   }
  // }, [dispatch, id, successPost, userInfo]);

  const images = post && post.albums ? post.albums.map(album => ({
    label: album.id, // Assuming album.album is the label
    imgPath: album.album // Assuming album.album is the image path
  })) : [];

  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = images.length;

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleStepChange = step => {
    setActiveStep(step);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Paper
        square
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          pl: 2,
          bgcolor: 'background.default',
        }}
      >
      </Paper>
      <AutoPlaySwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
        style={{
          height:"fit-content"
        }}
      >
{images.map((step, index) => (
  <div key={index}>
    {Math.abs(activeStep - index) <= 2 ? (
      <Box
        component="img"
        sx={{
          display: 'block',
          overflow: 'hidden',
          width: '100%',
          height: 'fit-content' // Keep the existing styling
        }}
        src={step.imgPath}
        alt={step.label}
        onLoad={(e) => {
          const imgHeight = e.target.clientHeight;
          e.target.parentNode.style.height = `${imgHeight}px`;
        }}
      />
    ) : null}
  </div>
))}

      </AutoPlaySwipeableViews>

      <MobileStepper
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
                {theme.direction === 'rtl' ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === 'rtl' ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
          </Button>
        }
      />
    </Box>
  );
}

export default Carousel;
