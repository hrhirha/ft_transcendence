import io from "socket.io-client";

interface info_create_room {
    name:  string,
    is_private? : boolean,
    password?: string,
    uids: string[],
}

interface info_management_room {
    id:  string,
    password? : string,
}

interface info_management_member {
    uid:  string,
    rid : string,
}

interface info_send_msg {
    rid:  string,
    msg : string,
}

interface info_mute_user {
    uid:  string,
    rid : string,
    mute_period: string,
}

interface info_delete_msg {
    id:  string,
    rid : string,
}


export class Socket {
    socket :any;
    constructor() {
        this.socket = io("ws://127.0.0.1:3001/chat",{
            withCredentials: true
        });
    }

    get_chats() {
        this.socket.emit("get_chats");
    }

    create_room(info_room : info_create_room) {
        if(info_room.name.length == 0)
            return new Error("error : name must not be empty");
        if(info_room.uids.length == 0)
            return new Error("error : number of users must be greater than 0");
        this.socket.emit("create_room", info_room);
    }

    delete_room(info_room : info_management_room) {
        if(info_room.id.length == 0)
            return new Error("error : id must not be empty");
        this.socket.emit("delete_room", info_room);
    }

    start_dm(id: string) {
        this.socket.emit("start_dm", {id});
    }

    join_room(info_room : info_management_room) {
        if(info_room.id.length == 0)
            return new Error("error : id must not be empty");
        this.socket.emit("join_room", info_room);
    }

    leave_room(info_room : info_management_room) {
        if(info_room.id.length == 0)
            return new Error("error : id must not be empty");
        this.socket.emit("leave_room", info_room);
    }

    add_member(member :info_management_member) {
        if(member.rid.length == 0)
            return new Error("error : rid must not be empty");
        if(member.uid.length == 0)
            return new Error("error : uid must not be empty");
        this.socket.emit("add_member", member);
    }

    remove_member(member :info_management_member) {
        if(member.rid.length == 0)
            return new Error("error : rid must not be empty");
        if(member.uid.length == 0)
            return new Error("error : uid must not be empty");
        this.socket.emit("remove_member", member);
    }

    ban_user(member :info_management_member) {
        if(member.rid.length == 0)
            return new Error("error : rid must not be empty");
        if(member.uid.length == 0)
            return new Error("error : uid must not be empty");
        this.socket.emit("ban_user", member);
    }

    unban_user(member :info_management_member) {
        if(member.rid.length == 0)
            return new Error("error : rid must not be empty");
        if(member.uid.length == 0)
            return new Error("error : uid must not be empty");
        this.socket.emit("unban_user", member);
    }

    mute_user(member : info_mute_user) {
        if(member.rid.length == 0)
            return new Error("error : rid must not be empty");
        if(member.uid.length == 0)
            return new Error("error : uid must not be empty");
        if(member.mute_period != "15M" && member.mute_period  != "1H" &&
           member.mute_period != "24H" && member.mute_period  != "3H" &&
           member.mute_period != "inf" && member.mute_period  != "8H")
            return new Error("error : mute_period inco");
        this.socket.emit("mute_user", member);
    }

    unmute_user(member :info_management_member) {
        if(member.rid.length == 0)
            return new Error("error : rid must not be empty");
        if(member.uid.length == 0)
            return new Error("error : uid must not be empty");
        this.socket.emit("unmute_user", member);
    }

    send_message(msg :info_send_msg) {
        if(msg.rid.length == 0)
            return new Error("error : rid must not be empty");
        this.socket.emit("send_message", msg);
    }

    delete_message(info_msg : info_delete_msg) {
        if(info_msg.id.length == 0)
            return new Error("error : id must not be empty");
        if(info_msg.rid.length == 0)
            return new Error("error : rid must not be empty");
        this.socket.emit("delete_message", info_msg);
    }

    join(info_room : info_management_room) {
        if(info_room.id.length == 0)
            return new Error("error : id must not be empty");
        this.socket.emit("join", info_room);
    }

    leave(info_room : info_management_room) {
        if(info_room.id.length == 0)
            return new Error("error : id must not be empty");
        this.socket.emit("leave", info_room);
    }

    get_members(info_room : info_management_room) {
        if(info_room.id.length == 0)
            return new Error("error : id must not be empty");
        this.socket.emit("get_members", info_room);
        
    }

    get_messages(info_room : info_management_room) {
        if(info_room.id.length == 0)
            return new Error("error : id must not be empty");
        this.socket.emit("get_messages");
    }

  }