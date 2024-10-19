import {
    NOTIFICATION_LIST_REQUEST,
    NOTIFICATION_LIST_SUCCESS,
    NOTIFICATION_LIST_FAIL,

    CONVERSATION_LIST_REQUEST,
    CONVERSATION_LIST_SUCCESS,
    CONVERSATION_LIST_FAIL,
    
    MESSSAGE_DELETE_FAIL,
    MESSSAGE_DELETE_REQUEST,
    MESSSAGE_DELETE_SUCCESS,


    CHAT_CREATE_REQUEST,
    CHAT_CREATE_SUCCESS,
    CHAT_CREATE_FAIL,
    CHAT_CREATE_RESET,


} from '../constants/notificationConstants'





export const notificationListReducer = (state = {notifications:[]}, action) =>{
    switch (action.type) {
        case NOTIFICATION_LIST_REQUEST:
            return { loading: true, notifications: [] } 
        case NOTIFICATION_LIST_SUCCESS:
            return { loading: false, notifications: action.payload }     
        case NOTIFICATION_LIST_FAIL:
            return { loading: false, error:action.payload }
            
        default:
            return state
    
        
    }
} 




export const conversationListReducer = (state = {conversations:[]}, action) =>{
    switch (action.type) {
        case CONVERSATION_LIST_REQUEST:
            return { loading: true, conversations: [] } 
        case CONVERSATION_LIST_SUCCESS:
            return { loading: false, conversations: action.payload }     
        case CONVERSATION_LIST_FAIL:
            return { loading: false, error:action.payload }
            
        default:
            return state
    
        
    }
} 






export const chatCreateReducer = (state = {}, action) =>{
    switch (action.type) {
        case CHAT_CREATE_REQUEST:
            return { loading: true }
        case CHAT_CREATE_SUCCESS:
            return { loading: false,success:true, chat: action.payload}     
        case CHAT_CREATE_FAIL:
            return { loading: false, error:action.payload }
        case CHAT_CREATE_RESET:
            return {}
            
        default:
            return state
    
        
    }
} 




export const messageDeleteReducer = (state = {}, action) =>{
    switch (action.type) {
        case MESSSAGE_DELETE_REQUEST:
            return { loading: true }
        case MESSSAGE_DELETE_SUCCESS:
            return { loading: false, success:true }     
        case MESSSAGE_DELETE_FAIL:
            return { loading: false, error:action.payload }
            
        default:
            return state
    
        
    }
} 
