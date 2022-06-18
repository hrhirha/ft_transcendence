
export interface user_info {
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
//------------------- user_joined -------------------

interface room_uj {
    id:  string,
    is_channel:  boolean,
    name: string,
    type: string,
}

export interface user_joined {
    room : room_uj,
    user : user_info,
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

interface room_id {
    id:  string,
}

interface dms {
    lst_msg: lst_msg,
    room : room_id,
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
//----------------------- user_left -------------------

export interface user_left {
    room : room,
    user : user_info,
}
//-----------------------------------------------------
//----------password_removed - password_set -----------

export interface management_password {
    id : string,
    type : string,
}
//-----------------------------------------------------

//------user_banned - admin_added - admin_removed - unmute_user -----

export interface management_memeber {
    uid : string,
    rid : string,
}
//-----------------------------------------------------
//----------------------- user_unbanned ------------

export interface user_unbanned {
    room : room_uj,
    user : user_info,
}
//-----------------------------------------------------

//----------------------- user_muted ------------

export interface user_muted {
    uid : string,
    rid : string,
    mute_period : string,
}
//----------------------------------------------------- 

//----------------------- message_deleted ------------

export interface message_deleted {
    id : string,
    rid : string,
}
//----------------------------------------------------- 

//----------------------- messages ------------

export interface messages {
    id : string,
    msg : string,
    timestamp : string,
    user : user_info,
}
//-----------------------------------------------------


