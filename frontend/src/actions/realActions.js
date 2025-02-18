import secure from './secure';  // Correct import

import { CHAT_CREATE_REQUEST, CHAT_CREATE_SUCCESS, CHAT_CREATE_FAIL } from '../constants/notificationConstants';

// Action Creators
export const connectWebsocket = () => {
    return async (dispatch) => {
        try {
            const tokens = await secure.get('userInfo');
            const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const newSocket = new WebSocket(`${wsProtocol}//127.0.0.1:8000/chat/?token=${tokens.access}`);

            dispatch({ type: 'WEBSOCKET_CONNECT', payload: newSocket });

            // Combined onmessage handler for both chat messages and conversation updates
            newSocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                // Check if a chat message is received
                if (data.hasOwnProperty('message')) {
                    dispatch(receiveChatMessage(data.message));
                }
                // Check if a conversation update is received
                if (data.hasOwnProperty('conversation')) {
                    dispatch({
                        type: 'RECEIVE_CONVERSATION_UPDATE',
                        payload: data.conversation,
                    });
                }
            };

            newSocket.onopen = () => {
                console.log("Socket Opened");
            };

            newSocket.onerror = (error) => {
                dispatch({ type: 'WEBSOCKET_ERROR', payload: error });
                console.log("A Socket Error: " + error.message);
            };

            newSocket.onclose = () => {
                dispatch({ type: 'WEBSOCKET_DISCONNECT' });
                console.log("Socket Disconnected");
            };

        } catch (error) {
            dispatch({ type: 'WEBSOCKET_ERROR', payload: error });
            console.log("Socket error!" + error.message);
        }
    }
};

export const disconnectWebsocket = () => {
    return (dispatch, getState) => {
        const socket = getState().websocket.socket;
        if (socket) {
            socket.close();
        }
        dispatch({ type: 'WEBSOCKET_DISCONNECT' });
    }
};

// Action to send a chat message
export const sendChat = (chat) => {
    return (dispatch, getState) => {
        const socket = getState().websocket.socket;
        dispatch({ type: CHAT_CREATE_REQUEST });

        if (socket && socket.readyState === WebSocket.OPEN) {
            try {
                socket.send(JSON.stringify({ source: 'create_chat', chat }));
                dispatch({ type: CHAT_CREATE_SUCCESS, payload: chat });
            } catch (error) {
                dispatch({ type: CHAT_CREATE_FAIL, payload: error });
            }
        } else {
            dispatch({ type: CHAT_CREATE_FAIL, payload: 'WebSocket not connected' });
            console.error('WebSocket not open. Cannot send chat message.');
        }
    };
};

export const receiveChatMessage = (message) => ({
    type: 'RECEIVE_CHAT_MESSAGE',
    payload: message,
});
