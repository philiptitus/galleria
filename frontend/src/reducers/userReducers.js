import {
    USER_LOGIN_FAIL,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,

    
    GOOGLE_LOGIN_FAIL,
    GOOGLE_LOGIN_REQUEST,
    GOOGLE_LOGIN_SUCCESS,

    USER_REGISTER_FAIL,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,

    VERIFY_NUMBER_FAIL,
    VERIFY_NUMBER_REQUEST,
    VERIFY_NUMBER_SUCCESS,

    USER_SEND_FAIL,
    USER_SEND_REQUEST,
    USER_SEND_SUCCESS,
    USER_SEND_RESET,

    USER_FOLLOW_FAIL,
    USER_FOLLOW_REQUEST,
    USER_FOLLOW_SUCCESS,

    PRIVATE_FOLLOW_FAIL,
    PRIVATE_FOLLOW_REQUEST,
    PRIVATE_FOLLOW_SUCCESS,

    GET_REQUESTS_REQUEST,
    GET_REQUESTS_SUCCESS,
    GET_REQUESTS_FAIL,
    GET_REQUESTS_RESET,

    
    USER_DETAILS_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_RESET,

    USER_LIST_FAIL,
    USER_LIST_REQUEST,
    USER_LIST_SUCCESS,
    USER_LIST_RESET,


    USER_UPDATE_PROFILE_FAIL,
    USER_UPDATE_PROFILE_REQUEST,
    USER_UPDATE_PROFILE_SUCCESS,
    USER_UPDATE_PROFILE_RESET,

    USER_LOGOUT,

    USER_DELETE_FAIL,
    USER_DELETE_REQUEST,
    USER_DELETE_SUCCESS,

    ACCOUNT_DELETE_FAIL,
    ACCOUNT_DELETE_REQUEST,
    ACCOUNT_DELETE_SUCCESS,


    PASSWORD_RESET_FAIL,
    PASSWORD_RESET_REQUEST,
    PASSWORD_RESET_SUCCESS,


    
    PASSWORD_RESET_CONFIRM_FAIL,
    PASSWORD_RESET_CONFIRM_REQUEST,
    PASSWORD_RESET_CONFIRM_SUCCESS,

    USER_UPDATE_FAIL,
    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_RESET,



} from '../constants/userConstants'




export const googleLoginReducer = (state = {}, action) =>{
    switch (action.type) {
        case GOOGLE_LOGIN_REQUEST:
            return { loading: true } 
        case GOOGLE_LOGIN_SUCCESS:
            return { loading: false, userInfo: action.payload }     
        case GOOGLE_LOGIN_FAIL:
            return { loading: false, error:action.payload }

            
        default:
            return state
    
        
    }
} 




export const verifyOtpReducer = (state = {}, action) =>{
    switch (action.type) {
        case VERIFY_NUMBER_REQUEST:
            return { loading: true } 
        case VERIFY_NUMBER_SUCCESS:
            return { loading: false, verified_otp: action.payload, success:true }     
        case VERIFY_NUMBER_FAIL:
            return { loading: false, error:action.payload }

            
        default:
            return state
    
        
    }
} 


export const getOtpReducer = (state = {}, action) =>{
    switch (action.type) {
        case USER_SEND_REQUEST:
            return { loading: true } 
        case USER_SEND_SUCCESS:
            return { loading: false, otp: action.payload, success:true }     
        case USER_SEND_FAIL:
            return { loading: false, error:action.payload }

            
        default:
            return state
    
        
    }
} 





export const userLoginReducer = (state = {}, action) =>{
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            return { loading: true } 
        case USER_LOGIN_SUCCESS:
            return { loading: false, userInfo: action.payload }     
        case USER_LOGIN_FAIL:
            return { loading: false, error:action.payload }
        case USER_LOGOUT:
            return {}
            
        default:
            return state
    
        
    }
} 


export const userRegisterReducer = (state = {}, action) =>{
    switch (action.type) {
        case USER_REGISTER_REQUEST:
            return { loading: true } 
        case USER_REGISTER_SUCCESS:
            return { loading: false, userInfo: action.payload, success:true }     
        case USER_REGISTER_FAIL:
            return { loading: false, error:action.payload }
        case USER_LOGOUT:
            return {}
            
        default:
            return state
    
        
    }
} 



export const userDetailsReducer = (state = {user: {followers: [], following: []}}, action) =>{
    switch (action.type) {
        case USER_DETAILS_REQUEST:
            return { ...state, loading: true } 
        case USER_DETAILS_SUCCESS:
            return { loading: false, user: action.payload }     
        case USER_DETAILS_FAIL:
            return { loading: false, error:action.payload }
        case USER_DETAILS_RESET:
            return { user:  {} }
            
        default:
            return state
    
        
    }
} 




export const userUpdateProfileReducer = (state = { }, action) =>{
    switch (action.type) {
        case USER_UPDATE_PROFILE_REQUEST:
            return { loading: true } 
        case USER_UPDATE_PROFILE_SUCCESS:
            return { loading: false, success:true,userInfo: action.payload }     
        case USER_UPDATE_PROFILE_FAIL:
            return { loading: false, error:action.payload }

        case  USER_UPDATE_PROFILE_RESET:
            return {}
      
            
        default:
            return state
    
        
    }
} 



export const userListReducer = (state = {users:[]}, action) =>{
    switch (action.type) {
        case USER_LIST_REQUEST:
            return { loading: true } 
        case USER_LIST_SUCCESS:
            return { loading: false,users: action.payload }     
        case USER_LIST_FAIL:
            return { loading: false, error:action.payload }

        case  USER_LIST_RESET:
            return {users:[]}
      
            
        default:
            return state
    
        
    }
} 



export const requestListReducer = (state = {requests:[]}, action) =>{
    switch (action.type) {
        case GET_REQUESTS_REQUEST:
            return { loading: true } 
        case GET_REQUESTS_SUCCESS:
            return { loading: false,requests: action.payload }     
        case GET_REQUESTS_FAIL:
            return { loading: false, error:action.payload }

        case  GET_REQUESTS_RESET:
            return {requests:[]}
      
            
        default:
            return state
    
        
    }
} 

export const userDeleteReducer = (state = {}, action) =>{
    switch (action.type) {
        case USER_DELETE_REQUEST:
            return { loading: true } 
        case USER_DELETE_SUCCESS:
            return { loading: false, success:true }     
        case USER_DELETE_FAIL:
            return { loading: false, error:action.payload }

      
      
            
        default:
            return state
    
        
    }
} 


export const userFollowReducer = (state = {}, action) =>{
    switch (action.type) {
        case USER_FOLLOW_REQUEST:
            return { loading: true } 
        case USER_FOLLOW_SUCCESS:
            return { loading: false, success:true }     
        case USER_FOLLOW_FAIL:
            return { loading: false, error:action.payload }         
        default:
            return state
    
        
    }
} 



export const privateFollowReducer = (state = {}, action) =>{
    switch (action.type) {
        case PRIVATE_FOLLOW_REQUEST:
            return { loading: true } 
        case PRIVATE_FOLLOW_SUCCESS:
            return { loading: false, success:true }     
        case PRIVATE_FOLLOW_FAIL:
            return { loading: false, error:action.payload }         
        default:
            return state
    
        
    }
} 




export const forgotPasswordReducer = (state = {}, action) =>{
    switch (action.type) {
        case PASSWORD_RESET_REQUEST:
            return { loading: true } 
        case PASSWORD_RESET_SUCCESS:
            return { loading: false, success:true }     
        case PASSWORD_RESET_FAIL:
            return { loading: false, error:action.payload }         
        default:
            return state
    
        
    }
} 


export const resetPasswordReducer = (state = {}, action) =>{
    switch (action.type) {
        case PASSWORD_RESET_CONFIRM_REQUEST:
            return { loading: true } 
        case PASSWORD_RESET_CONFIRM_SUCCESS:
            return { loading: false, success:true }     
        case PASSWORD_RESET_CONFIRM_FAIL:
            return { loading: false, error:action.payload }         
        default:
            return state
    
        
    }
} 

export const accountDeleteReducer = (state = {}, action) =>{
    switch (action.type) {
        case ACCOUNT_DELETE_REQUEST:
            return { loading: true } 
        case ACCOUNT_DELETE_SUCCESS:
            return { loading: false, success:true }     
        case ACCOUNT_DELETE_FAIL:
            return { loading: false, error:action.payload }
        default:
            return state
    
    }
} 



export const userUpdateReducer = (state = {user:{}}, action) =>{
    switch (action.type) {
        case USER_UPDATE_REQUEST:
            return { loading: true } 
        case USER_UPDATE_SUCCESS:
            return { loading: false, success:true }     
        case USER_UPDATE_FAIL:
            return { loading: false, error:action.payload }
        case USER_UPDATE_RESET:
            return { user:{} }
      
      
            
        default:
            return state
    
        
    }
} 









