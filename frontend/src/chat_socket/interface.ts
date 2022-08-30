
export interface user_info {
    id:  string,
    username : string,
    fullName : string,
    imageUrl :string,
    status: string, // 'ONLINE', 'OFFLINE', 'INGAME'
    is_admin?: boolean,
    is_owner?: boolean,
    is_banned?: boolean,
    is_muted?: boolean,
}
interface room {
    id:  string,
    name?:  string,
    is_channel:  boolean,
}

//------------------- receive_message -------------------

export interface receive_message {
    id:  string,
    name?: string,
    msg : string,
    timestamp : string,
    type: string,
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
    is_blocked : boolean,
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

interface room_id {
    id:  string,
    lst_msg: string,
    lst_msg_ts: Date,
    unread: number,
}

export interface dms {
    room : room_id,
    user : user_info,
    is_blocked : boolean,
}

export interface others {
    id: string,
    name : string,
    type : string,
}

export interface info_room {
    id:  string,
    name:  string,
    type : string,
    owner: string,
    unread : number,
    is_banned: false,
    is_muted: false,
    lst_msg: string,
    lst_msg_ts: Date,
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

export interface msgs {
    id : string,
    msg : string,
    timestamp : string,
    type : string,
    user : user_info,
}

export interface room_msgs {
    id : string,
    is_channel : boolean,
    name : string,
    type : string,
    is_banned: boolean,
    is_muted: boolean,
    user : user_info,
}

export interface messages {
    msgs : msgs[],
    room : room_msgs,
}
//-----------------------------------------------------


type data = {
    rid: string;
    msg: string;  
  }
  

export interface function_send_msg {
    send_message : (param : data) => void;
}