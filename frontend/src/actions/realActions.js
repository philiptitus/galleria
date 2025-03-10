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
                // Check if users online status is received
                if (data.hasOwnProperty('sender_online') && data.hasOwnProperty('receiver_online')) {
                    dispatch({
                        type: 'CHECK_USERS_ONLINE',
                        payload: {
                            sender_online: data.sender_online,
                            receiver_online: data.receiver_online,
                        },
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

// Action to join a chat group without sending a message
export const joinChatGroup = (otherUserId) => {
    return (dispatch, getState) => {
        const socket = getState().websocket.socket;
        console.log(`Attempting to join chat group with user ${otherUserId}`);

        const sendJoinRequest = () => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                try {
                    console.log(`Attempting to join chat group with user ${otherUserId}`);
                    socket.send(JSON.stringify({ source: 'join_chat_group', chat: { other_user_id: otherUserId } }));
                    dispatch({ type: 'JOIN_CHAT_GROUP' });
                    console.log(`Successfully sent join chat group request for user ${otherUserId}`);
                } catch (error) {
                    console.error('Error joining chat group:', error);
                }
            } else {
                console.error('WebSocket not open. Cannot join chat group.');
            }
        };

        // Retry mechanism to wait for WebSocket to be open
        const retryInterval = setInterval(() => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                clearInterval(retryInterval);
                sendJoinRequest();
            }
        }, 100); // Retry every 100ms
    };
};

// Action to check if users are online
export const checkUsersOnline = (senderId, receiverId) => {
    return (dispatch, getState) => {
        const socket = getState().websocket.socket;

        const sendCheckRequest = () => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            try {
                console.log(`Checking if users ${senderId} and ${receiverId} are online`);
                socket.send(JSON.stringify({
                    source: 'check_users_online',
                    chat: { sender_id: senderId, receiver_id: receiverId }
                }));

                // Add an event listener to capture the response from the server
                socket.addEventListener('message', function(event) {
                    const data = JSON.parse(event.data);
                    console.log('Server response:', data);

                    // Check if users online status is received
                    if (data.hasOwnProperty('sender_online') && data.hasOwnProperty('receiver_online')) {
                        console.log(`Sender online: ${data.sender_online}, Receiver online: ${data.receiver_online}`);
                        dispatch({
                            type: 'CHECK_USERS_ONLINE',
                            payload: {
                                sender_online: data.sender_online,
                                receiver_online: data.receiver_online,
                            },
                        });
                    }
                });

            } catch (error) {
                console.error('Error checking users online:', error);
            }
        } else {
            console.error('WebSocket not open. Cannot check users online.');
        }

    }
        // Retry mechanism to wait for WebSocket to be open
        const retryInterval = setInterval(() => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                clearInterval(retryInterval);
                sendCheckRequest();
            }
        }, 100); // Retry every 100ms

    };
};