import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../actions/userAction';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUserDetails } from '../actions/userAction';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { POST_CREATE_RESET } from '../constants/postConstants';
import { createPost } from '../actions/postActions';

const Sidebar = () => {
  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);
  const sidebarRef = useRef(null);

  const postCreate = useSelector((state) => state.postCreate);
  const { success, loading, error, post } = postCreate;

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
    window.location.reload();
  };

  const submitHandler = () => {
    dispatch(createPost());
    handleClickAway();
  };

  const handleCloseSidebar = () => {
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        const closeButton = document.querySelector('#menuToggle input');
        if (closeButton) {
          closeButton.click();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    dispatch({ type: POST_CREATE_RESET });

    if (success) {
      navigate(`/new/${post.id}`);
    }
  }, [dispatch, navigate, userInfo, success, post]);

  useEffect(() => {
    dispatch(getUserDetails('profile'));
  }, [dispatch, navigate, userInfo]);

  return (
    <nav role="navigation">
      <style>
        {`
/*
* Made by Erik Terwan
* 24th of November 2015
* MIT License
*
*
* If you are thinking of using this in
* production code, beware of the browser
* prefixes.
*/

#menuToggle
{
  display: block;
  position: relative;
  backgroundColor:"black";

  top: 30px;
  left: 50px;

  z-index: 1;

  -webkit-user-select: none;
  user-select: none;
}

#menuToggle a
{
  text-decoration: none;
  color: white;

  transition: color 0.3s ease;
}

#menuToggle a:hover
{
  color: tomato;
}

#menuToggle input
{
  display: block;
  width: 40px;
  height: 32px;
  position: absolute;
  top: -7px;
  left: -5px;

  cursor: pointer;

  opacity: 0; /* hide this */
  z-index: 2; /* and place it over the hamburger */

  -webkit-touch-callout: none;
}

/*
 * Just a quick hamburger
 */
#menuToggle span
{
  display: block;
  width: 33px;
  height: 4px;
  margin-bottom: 5px;
  position: relative;

  background: white;
  border-radius: 3px;

  z-index: 1;

  transform-origin: 4px 0px;

  transition: transform 0.5s cubic-bezier(0.77,0.2,0.05,1.0),
              background 0.5s cubic-bezier(0.77,0.2,0.05,1.0),
              opacity 0.55s ease;
}

#menuToggle span:first-child
{
  transform-origin: 0% 0%;
}

#menuToggle span:nth-last-child(2)
{
  transform-origin: 0% 100%;
}

/*
 * Transform all the slices of hamburger
 * into a crossmark.
 */
#menuToggle input:checked ~ span
{
  opacity: 1;
  transform: rotate(45deg) translate(-2px, -1px);
  background: red;
}

/*
 * But let's hide the middle one.
 */
#menuToggle input:checked ~ span:nth-last-child(3)
{
  opacity: 0;
  transform: rotate(0deg) scale(0.2, 0.2);
}

/*
 * Ohyeah and the last one should go the other direction
 */
#menuToggle input:checked ~ span:nth-last-child(2)
{
  transform: rotate(-45deg) translate(0, -1px);
}

/*
 * Make this absolute positioned
 * at the top left of the screen
 */
#menu
{
  position: absolute;
  width: 300px;
  margin: -100px 0 0 -50px;
  padding: 50px;
  padding-top: 125px;

  background: #ededed;
  list-style-type: none;
  -webkit-font-smoothing: antialiased;
  /* to stop flickering of text in safari */

  transform-origin: 0% 0%;
  transform: translate(-100%, 0);

  transition: transform 0.5s cubic-bezier(0.77,0.2,0.05,1.0);
}

#menu li
{
  padding: 10px 0;
  font-size: 13.2px; /* 40% smaller */
}

/*
 * And let's slide it in from the left
 */
#menuToggle input:checked ~ ul
{
  transform: none;
}
        `}
      </style>

      <ClickAwayListener onClickAway={handleClickAway}>
        <div id="menuToggle" style={{ position: "fixed" }}>
          <input type="checkbox" checked={open} onChange={() => setOpen(!open)} />
          <span></span>
          <span></span>
          <span></span>
          {userInfo && (
            <ul id="menu" style={{ backgroundColor: "black" }}>
              <a>
                <li onClick={submitHandler}><i className="fas fa-plus"></i>New Post</li>
              </a>
              <Link onClick={handleClickAway} to='/profile'><a><li><i className="fas fa-user"></i>My Profile</li></a></Link>
              <a onClick={handleClickAway} href="#"><li><i className="fas fa-camera"></i>My Feed</li></a>
              <Link onClick={handleClickAway} to='/galleria'><a><li><i className="fas fa-photo"></i>Gallery</li></a></Link>
              <Link onClick={handleClickAway} to='/slices'><a><li><i className="fas fa-film"></i>Slices</li></a></Link>
              <Link onClick={handleClickAway} to='/search'><a><li><i className="fas fa-search"></i>Search</li></a></Link>
              <Link onClick={handleClickAway} to='/chat'><a><li><i className="fas fa-envelope"></i>Chat</li></a></Link>
              <Link onClick={handleClickAway} to='/notifications'><a href="#"><li><i className="fas fa-heart"></i>Notifications</li></a></Link>
              <Link onClick={handleClickAway} to='/about'><a href="#"><li><i className="fas fa-info"></i>About</li></a></Link>
              <a><li onClick={logoutHandler}><i className="fas fa-sign-out-alt"></i>Log Out</li></a>
              <a href="https://mrphilip.pythonanywhere.com/portfolio/gallleria-mobile-version-beta" target="_blank" rel="noopener noreferrer"><li><i className="fas fa-mobile-alt"></i>Download Mobile App</li></a>
            </ul>
          )}
        </div>
      </ClickAwayListener>
    </nav>
  );
};

export default Sidebar;
