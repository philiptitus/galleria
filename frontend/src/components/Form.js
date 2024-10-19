import React, { useState, useEffect, Component } from 'react';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import { useDispatch, useSelector } from 'react-redux';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'
import { useSnackbar } from 'notistack';
import Loader from './Loader2';
import { createpostComment } from '../actions/postActions';



import { useNavigate } from 'react-router-dom';

export default function FormProp({ postID }) {
    const { enqueueSnackbar } = useSnackbar(); // useSnackbar hook
  
   
    const [message, setMessage] = useState('') ;

  
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const navigate = useNavigate()
    const dispatch = useDispatch()
  

    const postCommentCreate = useSelector((state) => state.postCommentCreate);
    const {
      loading,
      error,
      success,
      message: successMessage
  } = postCommentCreate
  
  
  const submitHandler =  () => {   

  
        dispatch(createpostComment(
            postID,{
                message
            }

        ))

      }
  
      useEffect(() => {
        if (!userInfo) {
          ;
        } else {
          if (success) {
            dispatch({ type: USER_UPDATE_PROFILE_RESET });
          }
          // Additional logic...
        }
        {success && enqueueSnackbar("Comment Added", { variant: 'success' }); }      
        {error && enqueueSnackbar(error, { variant: 'error' }); }   
      }, [dispatch, navigate, userInfo, success, error]);
      
  
  
   return (

    <div>
      {loading ? 
      (
        <Loader/>
      ):(

        
<Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 3, width: '20ch' },
          
        }}
        noValidate
        autoComplete="on"
        onSubmit={submitHandler}
      >
  
        <div>
    
  <TextField
            required
            multiline
            placeholder='Type Comment Here'
            onChange={(e) => setMessage(e.target.value)}
            variant="filled"
            type="text"
          />

  
          <Button type="submit" variant="outlined" style={{ color: 'blue' }}>
            Post <i className="far fa-save"></i>
          </Button>
        </div>
      </Box>


      )}


    </div>

    );
  }