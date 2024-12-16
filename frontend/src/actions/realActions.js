import secure from './secure';  // Correct import


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

