// frontend/src/reducers/realtime.js

const initialState = {
    socket: null,
    connected: false,
    error: null,
    messages: [], // Add messages array to store incoming messages
};

export const websocketReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'WEBSOCKET_CONNECT':
            return { ...state, socket: action.payload, connected: true, error: null, messages: [] }; // Reset messages on connect
        case 'WEBSOCKET_DISCONNECT':
            return { ...state, socket: null, connected: false, error: null };
        case 'WEBSOCKET_ERROR':
            return { ...state, error: action.payload };
        case 'RECEIVE_CHAT_MESSAGE': // Handle the received message action
            return {
                ...state,
                messages: [...state.messages, action.payload], // Add the message to the array
            };
        default:
            return state;
    }
};
