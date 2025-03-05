const initialState = {
    socket: null,
    connected: false,
    error: null,
    messages: [], // Stores incoming chat messages
    conversations: [], // Stores conversation update objects
    onlineStatus: { sender_online: false, receiver_online: false }, // Stores online status of users
};

export const websocketReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'WEBSOCKET_CONNECT':
            return { ...state, socket: action.payload, connected: true, error: null, messages: [] };
        case 'WEBSOCKET_DISCONNECT':
            return { ...state, socket: null, connected: false, error: null };
        case 'WEBSOCKET_ERROR':
            return { ...state, error: action.payload };
        case 'RECEIVE_CHAT_MESSAGE':
            return {
                ...state,
                messages: [...state.messages, action.payload],
            };
        case 'RECEIVE_CONVERSATION_UPDATE': {
            const updatedConversation = action.payload;
            // Check if conversation already exists
            const conversationIndex = state.conversations.findIndex(
                conv => conv.user_id === updatedConversation.user_id
            );
            let updatedConversations;
            if (conversationIndex !== -1) {
                // Replace existing conversation with the updated one
                updatedConversations = state.conversations.map((conv, idx) =>
                    idx === conversationIndex ? updatedConversation : conv
                );
            } else {
                // Add new conversation at the beginning
                updatedConversations = [updatedConversation, ...state.conversations];
            }
            // Sort conversations by last_message_timestamp descending
            updatedConversations.sort((a, b) => {
                // Convert timestamps to Date objects (handle null values)
                const timeA = a.last_message_timestamp ? new Date(a.last_message_timestamp) : new Date(0);
                const timeB = b.last_message_timestamp ? new Date(b.last_message_timestamp) : new Date(0);
                return timeB - timeA;
            });
            return {
                ...state,
                conversations: updatedConversations,
            };
        }
        case 'JOIN_CHAT_GROUP':
            // Handle joining a chat group without sending a message
            return state;
        case 'CHECK_USERS_ONLINE':
            // Handle checking users online status
            return {
                ...state,
                onlineStatus: action.payload,
            };
        default:
            return state;
    }
};
