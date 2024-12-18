import secure from './secure';  // Correct import

import { CHAT_CREATE_REQUEST, CHAT_CREATE_SUCCESS, CHAT_CREATE_FAIL } from '../constants/notificationConstants'; // Import your constants

// Action Creators
export const connectWebsocket = () => {
    return async (dispatch) => {
        try {
            const tokens = await secure.get('userInfo');
            const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const newSocket = new WebSocket(`${wsProtocol}//127.0.0.1:8000/chat/?token=${tokens.access}`);

            dispatch({ type: 'WEBSOCKET_CONNECT', payload: newSocket });  // Use constant

            // Event listeners on the socket
            newSocket.onmessage = (event) => {
                // dispatch an action to handle incoming messages
                const message = JSON.parse(event.data); // if expecting JSON messages
                // ... further processing of the message (dispatch an action)
            };

            newSocket.onopen = () => {
                console.log("Socket Opened")
            };


            newSocket.onerror = (error) => {
                dispatch({ type: 'WEBSOCKET_ERROR', payload: error });
                console.log("A Socket Error: " + error.message)

            };

            newSocket.onclose = () => {
                dispatch({ type: 'WEBSOCKET_DISCONNECT' });
                console.log("Socket Disconnected")

            };

            newSocket.onmessage = (event) => {
                const message = JSON.parse(event.data);
                dispatch(receiveChatMessage(message.message)); // Dispatch the new action
            };


        } catch (error) {
            dispatch({ type: 'WEBSOCKET_ERROR', payload: error });

            console.log("Socket error!" + error.message)

        }
    }
}


export const disconnectWebsocket = () => {
    return (dispatch, getState) => {  // Access the current state
        const socket = getState().websocket.socket;
        if (socket) {
            socket.close();
        }
        dispatch({ type: 'WEBSOCKET_DISCONNECT' }); // Dispatch to update state even if socket didn't exist
    }
};



// // If you'll send messages
// export const sendMessage = (message) => {
//   return (dispatch, getState) => {
//     const socket = getState().websocket.socket;
//     if (socket && socket.readyState === WebSocket.OPEN) {
//       socket.send(JSON.stringify(message)); // send the message. Assumed JSON in this example
//     }
//   };
// };



// If you'll send messages


export const sendChat = (chat) => {
    return (dispatch, getState) => {
        const socket = getState().websocket.socket; // Get the socket from the Redux store
        dispatch({ type: CHAT_CREATE_REQUEST }); // Dispatch request action

        if (socket && socket.readyState === WebSocket.OPEN) {
            try {
                socket.send(JSON.stringify({ source: 'create_chat', chat })); // Send the chat data with a type identifier
                dispatch({ type: CHAT_CREATE_SUCCESS, payload: chat }); //Dispatch success action
            } catch (error) {
                dispatch({ type: CHAT_CREATE_FAIL, payload: error }); //Dispatch fail action
            }
        } else {
            dispatch({ type: CHAT_CREATE_FAIL, payload: 'WebSocket not connected' }); // Dispatch fail if socket is not open
            console.error('WebSocket not open. Cannot send chat message.');
        }
    };
};



export const receiveChatMessage = (message) => ({
    type: 'RECEIVE_CHAT_MESSAGE',
    payload: message,
  });