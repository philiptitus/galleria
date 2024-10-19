import store from "../store"
import {
    POST_LIST_REQUEST,
    POST_LIST_SUCCESS,
    POST_LIST_FAIL,

    COMMENT_LIST_REQUEST,
    COMMENT_LIST_SUCCESS,
    COMMENT_LIST_FAIL,

    CATEGORY_LIST_REQUEST,
    CATEGORY_LIST_SUCCESS,
    CATEGORY_LIST_FAIL,

    BRAND_LIST_REQUEST,
    BRAND_LIST_SUCCESS,
    BRAND_LIST_FAIL,

    POST_DETAILS_REQUEST,
    POST_DETAILS_SUCCESS,
    POST_DETAILS_FAIL,

    CATEGORYSPECIFIC_DETAILS_REQUEST,
    CATEGORYSPECIFIC_DETAILS_SUCCESS,
    CATEGORYSPECIFIC_DETAILS_FAIL,

    CATEGORY_DETAILS_REQUEST,
    CATEGORY_DETAILS_SUCCESS,
    CATEGORY_DETAILS_FAIL,

    BRAND_DETAILS_REQUEST,
    BRAND_DETAILS_SUCCESS,
    BRAND_DETAILS_FAIL,


    BRANDSPECIFIC_DETAILS_REQUEST,
    BRANDSPECIFIC_DETAILS_SUCCESS,
    BRANDSPECIFIC_DETAILS_FAIL,


    POST_DELETE_REQUEST,
    POST_DELETE_SUCCESS,
    POST_DELETE_FAIL,

    POST_CREATE_REQUEST,
    POST_CREATE_SUCCESS,
    POST_CREATE_FAIL,
    POST_CREATE_RESET,

    POST_CREATE_COMMENT_REQUEST,
    POST_CREATE_COMMENT_SUCCESS,
    POST_CREATE_COMMENT_FAIL,
    POST_CREATE_COMMENT_RESET,

    POST_UPDATE_REQUEST,
    POST_UPDATE_SUCCESS,
    POST_UPDATE_FAIL,
    POST_UPDATE_RESET,


    BOOKMARK_CREATE_FAIL,
    BOOKMARK_CREATE_REQUEST,
    BOOKMARK_CREATE_SUCCESS,

    LIKE_CREATE_FAIL,
    LIKE_CREATE_REQUEST,
    LIKE_CREATE_SUCCESS,

    BOOKMARK_LIST_MY_FAIL,
    BOOKMARK_LIST_MY_REQUEST,
    BOOKMARK_LIST_MY_SUCCESS,
    BOOKMARK_LIST_MY_RESET,


    BOOKMARK_DELETE_FAIL,
    BOOKMARK_DELETE_REQUEST,
    BOOKMARK_DELETE_SUCCESS,
    BOOKMARK_DELETE_RESET,


    DBCART_CREATE_FAIL,
    DBCART_CREATE_REQUEST,
    DBCART_CREATE_SUCCESS,
    DBCART_CREATE_RESET,

    DBCART_LIST_MY_FAIL,
    DBCART_LIST_MY_REQUEST,
    DBCART_LIST_MY_SUCCESS,
    DBCART_LIST_MY_RESET,


    DBCART_DELETE_FAIL,
    DBCART_DELETE_REQUEST,
    DBCART_DELETE_SUCCESS,



    DBCART_EDIT_FAIL,
    DBCART_EDIT_REQUEST,
    DBCART_EDIT_SUCCESS,
    DBCART_EDIT_RESET,


    DBCART_DETAILS_REQUEST,
    DBCART_DETAILS_SUCCESS,
    DBCART_DETAILS_FAIL,


    DBCART_CLEAR_FAIL,
    DBCART_CLEAR_REQUEST,
    DBCART_CLEAR_SUCCESS,
    DBCART_CLEAR_RESET,



} from '../constants/postConstants'

export const postListReducer = (state = {posts:[]}, action) =>{
    switch (action.type) {
        case POST_LIST_REQUEST:
            return { loading: true, posts: [] } 
        case POST_LIST_SUCCESS:
            return { loading: false, posts: action.payload }     
        case POST_LIST_FAIL:
            return { loading: false, error:action.payload }
            
        default:
            return state
    
        
    }
} 




export const ComentListReducer = (state = {comments:[]}, action) =>{
    switch (action.type) {
        case COMMENT_LIST_REQUEST:
            return { loading: true, comments: [] } 
        case COMMENT_LIST_SUCCESS:
            return { loading: false, comments: action.payload }     
        case COMMENT_LIST_FAIL:
            return { loading: false, error:action.payload }
            
        default:
            return state
    
        
    }
} 






const initialStater = {
    loading: false,
    brands: [],
    error: null,
  };
  








export const postDetailsReducer = (state = { post: {likers: [], bookers: [], comments:[]}   }, action) =>{
    switch (action.type) {
        case POST_DETAILS_REQUEST:
            return { loading: true, ...state }
        case POST_DETAILS_SUCCESS:
            return { loading: false, post: action.payload, success:true }     
        case POST_DETAILS_FAIL:
            return { loading: false, error:action.payload }
            
        default:
            return state
    
        
    }
} 




export const postDeleteReducer = (state = {}, action) =>{
    switch (action.type) {
        case POST_DELETE_REQUEST:
            return { loading: true }
        case POST_DELETE_SUCCESS:
            return { loading: false, success:true }     
        case POST_DELETE_FAIL:
            return { loading: false, error:action.payload }
            
        default:
            return state
    
        
    }
} 


export const postCreateReducer = (state = {}, action) =>{
    switch (action.type) {
        case POST_CREATE_REQUEST:
            return { loading: true }
        case POST_CREATE_SUCCESS:
            return { loading: false,success:true, post: action.payload}     
        case POST_CREATE_FAIL:
            return { loading: false, error:action.payload }
        case POST_CREATE_RESET:
            return {}
            
        default:
            return state
    
        
    }
} 

export const postUpdateReducer = (state = {post:{}}, action) =>{
    switch (action.type) {
        case POST_UPDATE_REQUEST:
            return { loading: true }
        case POST_UPDATE_SUCCESS:
            return { loading: false,success:true, post: action.payload}     
        case POST_UPDATE_FAIL:
            return { loading: false, error:action.payload }
        case POST_UPDATE_RESET:
            return {post:{}}

            
        default:
            return state
    
        
    }
} 



export const postCommentCreateReducer = (state = {}, action) =>{
    switch (action.type) {
        case POST_CREATE_COMMENT_REQUEST:
            return { loading: true }
        case POST_CREATE_COMMENT_SUCCESS:
            return { loading: false,success:true, message:action.payload}     
        case POST_CREATE_COMMENT_FAIL:
            return { loading: false, error:action.payload }
        case POST_CREATE_COMMENT_RESET:
            return {}

            
        default:
            return state
    
        
    }
} 









  export const bookmarkCreateReducer = (state = {}, action) =>{
    switch (action.type) {
        case BOOKMARK_CREATE_REQUEST:
            return { loading: true } 
        case BOOKMARK_CREATE_SUCCESS:
            return { 
            loading: false,
            success: true,
             }     
        case BOOKMARK_CREATE_FAIL:
            return { 
                loading: false,
                 error:action.payload,
                 }
         
        default:
            return state
    
        
    }
} 


export const LikeCreateReducer = (state = {}, action) =>{
    switch (action.type) {
        case LIKE_CREATE_REQUEST:
            return { loading: true } 
        case LIKE_CREATE_SUCCESS:
            return { 
            loading: false,
            success: true,
            detail: action.payload
             }     
        case LIKE_CREATE_FAIL:
            return { 
                loading: false,
                 error:action.payload,
                 }
         
        default:
            return state
    
        
    }
} 


export const bookmarkListReducer = (state = { bookmarks:[]}, action) => {
    switch (action.type) {
      case BOOKMARK_LIST_MY_REQUEST:
        return { 
          loading: true 
           
          };
      case BOOKMARK_LIST_MY_SUCCESS:
        return {
          loading: false,
          bookmarks: action.payload
        };
      case BOOKMARK_LIST_MY_FAIL:
        return {
          loading: false,
          error: action.payload,
        };
        case BOOKMARK_LIST_MY_RESET:
        return {
          bookmarks:[]
        }

      default:
        return state;
    }
  };








