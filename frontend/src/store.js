import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { 
    postListReducer, 
    postDetailsReducer, 
    postUpdateReducer,
    postDeleteReducer,
    ComentListReducer,
    postCreateReducer, 
    postCommentCreateReducer, 
    bookmarkCreateReducer, 
    LikeCreateReducer,



} from './reducers/postReducers'
import { notificationListReducer, conversationListReducer,
chatCreateReducer, messageDeleteReducer } from './reducers/notificationReducers'
import { websocketReducer } from './reducers/realtime'
import { composeWithDevTools } from 'redux-devtools-extension'
import { 
    userLoginReducer,
     userRegisterReducer,
      userDetailsReducer, 
      userUpdateProfileReducer,
       userListReducer,
        userDeleteReducer, 
        userUpdateReducer, 
        accountDeleteReducer,
        userFollowReducer,
        resetPasswordReducer,
        forgotPasswordReducer,
        privateFollowReducer,
        requestListReducer,
        getOtpReducer,
        verifyOtpReducer
    } from './reducers/userReducers'


const reducer = combineReducers(
    {
        postList: postListReducer,
        postDetails: postDetailsReducer,
        commentList:ComentListReducer,
        postDelete: postDeleteReducer,
        postCreate: postCreateReducer,
        postUpdate: postUpdateReducer,
        postCommentCreate: postCommentCreateReducer,
        bookmarkCreate: bookmarkCreateReducer,
        likeCreate:LikeCreateReducer,


        
        userLogin: userLoginReducer,
        userRegister: userRegisterReducer,
        userDetails: userDetailsReducer,
        userList: userListReducer,
        userUpdateProfile:userUpdateProfileReducer,
        userDelete: userDeleteReducer,
        userUpdate: userUpdateReducer,
        userFollow:userFollowReducer,
        accountDelete:accountDeleteReducer,
        forgotPassword:forgotPasswordReducer,
        resetPassword:resetPasswordReducer,
        privateFollow:privateFollowReducer,
        requestList:requestListReducer,
        getOtp:getOtpReducer,
        verifyOtp:verifyOtpReducer,


        notificationList:notificationListReducer,
        conversationList:conversationListReducer,
        chatCreate:chatCreateReducer,
        messageDelete:messageDeleteReducer,

        websocket: websocketReducer

    }
)






const userInfoFromStorage = localStorage.getItem('userInfo') ?
    JSON.parse(localStorage.getItem('userInfo')) : null



const initialstate = {

    userLogin: { userInfo: userInfoFromStorage }

}

const middleware = [thunk]
const store = createStore(reducer, initialstate, 
    composeWithDevTools(applyMiddleware(...middleware))
    )

export default store