
//------------------- receive_message -------------------
interface user_info {
    id:  string,
    username : string,
    fullName : string,
    imageUrl :string,
}
interface room {
    id:  string,
}

export interface receive_message {
    id:  string,
    msg : string,
    timestamp : string,
    user : user_info,
    room : room,
}
//------------------------------------------------------
//------------------- join_invite -------------------

export interface join_invite {
    id:  string,
    name : string,
    type : string,
}
//-----------------------------------------------------
//------------------- leave_call -------------------

export interface leave_call {
    id:  string,
}
//-----------------------------------------------------