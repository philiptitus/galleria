import { Container } from 'react-bootstrap';
import './App.css';
import { BrowserRouter, HashRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/sidebar';
import { Navigate } from 'react-router-dom'; // Import the Navigate component
import Home from './screens/Home';
import Login from './screens/Login';
import { useDispatch, useSelector } from 'react-redux';
import SearchScreen from './screens/Search';
import { SnackbarProvider } from 'notistack';
import Profile from './screens/Profile';
import ProfileOthers from './screens/ProfileOthers';
import Galleria from './screens/Galleria';
import Empty from './screens/404';
import NewPost from './screens/NewPost';
import PasswordResetRequest from './screens/ForgotPassword';
import ResetPassword from './screens/ResetPassword';
import PostScreen from './screens/PostScreen';
import Test from './screens/Test';
import Chat from './screens/Chat';
import UserChatScreen from './screens/UserChatScreen';
import Footer from './components/Footer';
import Slice from './screens/Slices';
import Landing from './screens/Landing';

import { useEffect } from 'react';
import OTPScreen from './screens/OTPscreen';
import About from './screens/About';
import Callback from './screens/Callback';

function App() {
    const dispatch = useDispatch();


    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;



 

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/auth/callback' element={<Callback />} />
                </Routes>
            </BrowserRouter>
            <HashRouter>
                <SnackbarProvider maxSnack={1}>
                    {userInfo && <Sidebar />}
                    <main className='py-4'>
                        <Container>
                            <Routes>
                                <Route path='/' element={<Home />} />
                                <Route path='/login' element={<Login />} />
                                <Route path='/search' element={<SearchScreen />} />
                                <Route path='/chat' element={<Chat />} />
                                <Route path='/userchat/:id' element={<UserChatScreen />} />
                                <Route path='/profile' element={<Profile />} />
                                <Route path='/user/:id' element={<ProfileOthers />} />
                                <Route path='/galleria' element={<Galleria />} />
                                <Route path='/slices' element={<Slice />} />
                                <Route path='/home' element={<Landing />} />
                                <Route path='/notifications' element={<Test />} />
                                <Route path='/new/:id' element={<NewPost />} />
                                <Route path='/post/:id' element={<PostScreen />} />
                                <Route path='/forgot-password' element={<PasswordResetRequest />} />
                                <Route path='/password-reset-confirm/:uid/:token' element={<ResetPassword />} />
                                <Route path='/404' element={<Empty />} /> {/* Custom 404 route */}
                                <Route path='*' element={<Navigate to="/404" />} /> {/* Catch-all route for 404 */}
                                <Route path='/verify' element={<OTPScreen />} />
                                <Route path='/about' element={<About />} />
                            </Routes>
                        </Container>
                    </main>
                </SnackbarProvider>
            </HashRouter>
        </>
    );
}

export default App;
