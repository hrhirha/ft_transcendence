export const HOST = process.env.HOST || '127.0.0.1';
export const PORT = Number(process.env.PORT) || 3001;

export const room_type = {
    PUBLIC: 'PUBLIC',
    PRIVATE: 'PRIVATE',
    PROTECTED: 'PROTECTED'
};

export const user_status = {
    ONLINE: 'ONLINE',
    OFFLINE: 'OFFLINE',
    INGAME: 'INGAME'
};

export const friend_status = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    BLOCKED: 'BLOCKED'
};

export const msg_type = {
    TXT: "TEXT",
    NOTIF: "NOTIFICATION",
    DEL: "MSG_DELETED"
};

export const relation_status = {
    NONE: "none",           // no relation
    NULL: null,             // profile
    FRIEND: "friend",       // is friend
    REQUESTED: 'request',   // request recieved
    BLOCKED: 'blocked',     // blocked relation
    PENDING: 'pending',     // pending request
}
