import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAccount } from '../actions/userAction';
import { logout } from '../actions/userAction';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Row, Col } from 'react-bootstrap'

function Delete() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const accountDelete = useSelector((state) => state.accountDelete);
    const { success: successDelete } = accountDelete;


    useEffect(() => {
        // Redirect to another page after successful account deletion
        if (successDelete) {
          dispatch(logout())
          navigate('/login');
          window.location.reload();



        }
      }, [dispatch,  successDelete]);


      const deleteHandler = () => {
        dispatch(deleteAccount());
      };
  return (
    <div>
        <h5 style={{ color:"black" }}> You Are About To delete Your Acoount We Hate To see You Go So Soon..</h5>
        <h6 style={{ color:"black" }}>Are You Sure You Wish To Proceed ? </h6>
        <Row>
        <Link to='/'>
            <Col><CloseIcon/> </Col>
            </Link>
            <Col onClick={deleteHandler}> <CheckIcon/> </Col>
        
        </Row>

    </div>
  )
}

export default Delete