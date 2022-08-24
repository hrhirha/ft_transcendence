import React, { createContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Login } from 'views/pages/login/login';
import { Routes, Route, unstable_HistoryRouter as Router } from 'react-router-dom'
import { Home } from 'views/pages/home/home';
import { Chat } from 'views/pages/chat/chat';
import { LeaderBoard } from 'views/pages/leader_board/leader_board';
import { Profile } from 'views/pages/profile/profile';
import { NotFound } from 'views/pages/not_found/not_found';
import { Checkpoint } from 'views/pages/checkpoint/checkpoint';
import { GamePlayer } from 'views/pages/game/game_player/game_player';
import { GameWatcher } from 'views/pages/game/game_watcher/game_watcher';
import { createBrowserHistory } from "history";
import { get_me, User } from 'controller/user/user';
import { Notif, useNotif } from 'views/components/notif/notif';
import { Loading } from 'views/components/loading/loading';
import { NavBar } from 'views/components/navbar/navbar';
import { ChatSocket } from "chat_socket";
import "views/style/index.scss";
import { receive_message } from 'chat_socket/interface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { CircleAvatar } from 'views/components/circle_avatar/circle_avatar';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

export const SocketContext = createContext(null); //create socket context
export const history = createBrowserHistory();
const class_socket = new ChatSocket();

export const getIDQuery = () => {
  const searchParams = new URLSearchParams(history.location.search);
  return searchParams.get('id');
}


const PongApp:React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [hideNavBar, setHideNavBar] = useState<boolean>(true);
    const pushNotif = useNotif();

    const authCheck = async (path) => {
      setHideNavBar(false);
      try {
          const me: User = await get_me();
          window.localStorage.setItem("user", JSON.stringify(me));
          if (history.location.pathname === "/login"
            || history.location.pathname === "/checkpoint")
            history.replace("/");
      }
      catch(err: any) {
          if (path !== "/login" && path !== "/checkpoint")
            history.replace("/login");
          setHideNavBar(true);
      }
      setLoading(false);
    }
    
    useEffect(() => {
      authCheck(history.location.pathname);
      history.listen(async ({ action, location }) => {
        await authCheck(location.pathname);
        console.log(action, location.pathname);
      });
      class_socket.socket.on("receive_message", (data : receive_message)=>{
        if (history.location.pathname !== "/chat")
        {
          console.log(data.user.status);
          pushNotif({
            id: data.room.id,
            type: "info",
            icon: data.room.is_channel ? <FontAwesomeIcon icon={faClose}/> : <CircleAvatar avatarURL={data.user.imageUrl} dimensions={15} status={"ONLINE"} />,
            title: (data.room.is_channel ? "Channel" : data.user.fullName),
            description: data.msg,
            actions: [
              {title: "Show Conversation", color: "#6970d4", action: () => history.replace(`/chat?id=${data.room.id}`)},
            ]
        });
        }
      })
    }, []);

    if (loading)
      return <Loading width="100vw" height="100vh"/>;
    return (
      <SocketContext.Provider value={class_socket}>
          <Router history={history}>
              {!hideNavBar && <NavBar/>}
              <Routes>
                  <Route path="/login" element={<Login/>}/>
                  <Route path="/checkpoint" element={<Checkpoint/>} />
                  <Route path="/" element={<Home/>} />
                  <Route path="/leader_board" element={<LeaderBoard/>} />
                  <Route path="/play" element={<GamePlayer ultimateGame={false}/>} />
                  <Route path="/play/ultimate" element={<GamePlayer ultimateGame={true}/>} />
                  <Route path="/watch" element={<GameWatcher />} />
                  <Route path="/chat" element={<Chat/>} />
                  <Route path="/profile" element={<Profile userProfile={true}/>} />
                  <Route path="/u/:username" element={<Profile userProfile={false}/>} />
                  <Route path="*" element={<NotFound/>} />
              </Routes>
          </Router>
      </SocketContext.Provider>
    );
}

root.render(
  <Notif>
    <PongApp />
  </Notif>
);
