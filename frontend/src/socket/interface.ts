
interface user_info {
    id:  string,
    username : string,
    fullName : string,
    imageUrl :string,
}
interface room {
    id:  string,
    is_channel:  boolean,
}

//------------------- receive_message -------------------

export interface receive_message {
    id:  string,
    msg : string,
    timestamp : string,
    user : user_info,
    room : room,
}
//------------------------------------------------------
//------------------- leave_call -------------------

export interface leave_call {
    id:  string,
}
//-----------------------------------------------------
//------------------- dm_started ---------------

export interface dm_started {
    room : room,
    user : user_info,
}
//-----------------------------------------------------

//------------------- room_created ---------------

export interface room_created {
    id: string,
    name: string,
    owner: string,
    type: string,
}
//-----------------------------------------------------

//--------------------- chats -------------------------

interface lst_msg {
    msg:  string,
    timestamp:  boolean,
}

interface room_dm {
    id:  string,
}

interface dms {
    lst_msg: lst_msg,
    room : room_dm,
    user : user_info,
}

interface others {
    id: string,
    name : string,
    type : string,
}

interface info_room {
    id:  string,
    name:  string,
    type : string,
    unread : number,

}

export interface chats {
    dms: dms[],
    others: others[],
    rooms: info_room[],
}
//-----------------------------------------------------

