export const websocketReducer = (
    state = { socket: null, connected: false, error: null },
    action
) => {
    switch (action.type) {
        case 'WEBSOCKET_CONNECT':
            return { ...state, socket: action.payload, connected: true, error: null };
        case 'WEBSOCKET_DISCONNECT':
            return { ...state, socket: null, connected: false };
        case 'WEBSOCKET_ERROR':
            return { ...state, error: action.payload };
        default:
            return state;
    }
};
