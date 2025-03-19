import {



    BOOKMARK_CREATE_FAIL,
    BOOKMARK_CREATE_REQUEST,
    BOOKMARK_CREATE_SUCCESS,


    LIKE_CREATE_FAIL,
    LIKE_CREATE_REQUEST,
    LIKE_CREATE_SUCCESS,



    POST_DETAILS_REQUEST,
    POST_DETAILS_SUCCESS,
    POST_DETAILS_FAIL,



    POST_DELETE_REQUEST,
    POST_DELETE_SUCCESS,
    POST_DELETE_FAIL,

    POST_UPDATE_REQUEST,
    POST_UPDATE_SUCCESS,
    POST_UPDATE_FAIL,

    POST_CREATE_REQUEST,
    POST_CREATE_SUCCESS,
    POST_CREATE_FAIL,


    POST_CREATE_COMMENT_REQUEST,
    POST_CREATE_COMMENT_SUCCESS,
    POST_CREATE_COMMENT_FAIL,



} from '../constants/postConstants'
import axios from 'axios'


  
















export const listPostDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: POST_DETAILS_REQUEST })
        const { data } = await axios.get(`/api/posts/${id}/`);

        dispatch({
            type: POST_DETAILS_SUCCESS,
            payload: data,
        })
        
    } catch (error) {
        dispatch({
            type: POST_DETAILS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}






export const deletePost = (postId) => async(dispatch, getState) => {
    try{
        dispatch({
            type: POST_DELETE_REQUEST

        })

        const {

            userLogin: { userInfo },
        } = getState()


        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization : `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.delete(
            `/api/posts/${postId}/delete/`,
            config
        )
        dispatch({
            type: POST_DELETE_SUCCESS,
        })

    } catch (error) {
        dispatch({
            type: POST_DELETE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}



export const deleteComment = (id) => async(dispatch, getState) => {
    try{
        dispatch({
            type: POST_DELETE_REQUEST

        })

        const {

            userLogin: { userInfo },
        } = getState()


        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization : `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.delete(
            `/api/posts/comment/${id}/delete/`,
            config
        )
        dispatch({
            type: POST_DELETE_SUCCESS,
        })

    } catch (error) {
        dispatch({
            type: POST_DELETE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}





export const createPost = () => async(dispatch, getState) => {
    try{
        dispatch({
            type: POST_CREATE_REQUEST

        })

        const {

            userLogin: { userInfo },
        } = getState()


        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization : `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.post(
            `/api/posts/new/`,
            {},
            config
        )
        dispatch({
            type: POST_CREATE_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: POST_CREATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const updatePost = (post) => async(dispatch, getState) => {
    try{
        dispatch({
            type: POST_UPDATE_REQUEST

        })

        const {

            userLogin: { userInfo },
        } = getState()


        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization : `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.put(
            `/api/posts/update/${post.id}/`,
            post,
            config
        )
        dispatch({
            type: POST_UPDATE_SUCCESS,
            payload: data,
        })

        dispatch({
            type: POST_DETAILS_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: POST_UPDATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}





export const createpostComment = (postId, comment) => async (dispatch, getState) => {
    try {
        dispatch({
            type: POST_CREATE_COMMENT_REQUEST,
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        }

        const { data } = await axios.post(
            `/api/posts/${postId}/comment/`,
            comment,
            config
        )

        dispatch({
            type: POST_CREATE_COMMENT_SUCCESS,
            payload: {
                data,
                message:
                    data && data.message
                        ? data.message
                        : 'Comment saved successfully', // Default message if not present
            },
        })
    } catch (error) {
        dispatch({
            type: POST_CREATE_COMMENT_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}





export const createBookmark = (postId) => async(dispatch, getState) => {
    try{
        dispatch({
            type: BOOKMARK_CREATE_REQUEST

        })

        const {

            userLogin: { userInfo },
        } = getState()


        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization : `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.post(
            `/api/posts/${postId}/bookmark/`,
            {},
            config,
        )
        dispatch({
            type: BOOKMARK_CREATE_SUCCESS,
            payload:data
        })
        


    } catch (error) {
        dispatch({
            type: BOOKMARK_CREATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const createLike = (postId) => async(dispatch, getState) => {
    try{
        dispatch({
            type: LIKE_CREATE_REQUEST

        })

        const {

            userLogin: { userInfo },
        } = getState()


        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization : `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.post(
            `/api/posts/${postId}/like/`,
            {},
            config,
        )
        dispatch({
            type: LIKE_CREATE_SUCCESS,
            payload:data
        })
        


    } catch (error) {
        dispatch({
            type: LIKE_CREATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}






