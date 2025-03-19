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
import axios from 'axios'



export const createChat = (chat) => async (dispatch, getState) => {
    try {
        dispatch({
            type: CHAT_CREATE_REQUEST,
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
            `/api/notifications/chat/`,
            chat,
            config
        )

        dispatch({
            type: CHAT_CREATE_SUCCESS,
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
            type: CHAT_CREATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}





export const deleteMessage = (messageId) => async(dispatch, getState) => {
    try{
        dispatch({
            type: MESSSAGE_DELETE_REQUEST

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
            `/api/notifications/${messageId}/delete/`,
            config
        )
        dispatch({
            type: MESSSAGE_DELETE_SUCCESS,
        })

    } catch (error) {
        dispatch({
            type: MESSSAGE_DELETE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}


