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
import { Notif } from 'views/components/notif/notif';
import { Loading } from 'views/components/loading/loading';
import { NavBar } from 'views/components/navbar/navbar';
import { Socket } from "socket";
import "views/style/index.scss";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

export const SocketContext = createContext(null); //create socket context
const class_socket = new Socket();  //create object in socket class

export const history = createBrowserHistory();

const PongApp:React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<any>(null);
    const [hideNavBar, setHideNavBar] = useState<boolean>(true);

    const authCheck = async (path) => {
      setHideNavBar(false);
      try {
          const me: User = await get_me();
          setUser(me);
          if (history.location.pathname === "/login"
            || history.location.pathname === "/checkpoint")
            history.replace("/");
          }
      catch(err: any) {
          if (path !== "/login" && path !== "/checkpoint")
            window.open("/login", '_self');
          setHideNavBar(true);
      }
      setLoading(false);
    }
    
    useEffect(() => {
      history.listen(async ({ action, location }) => {
        await authCheck(location.pathname);
        console.log(action, location.pathname);
      });
      authCheck(history.location.pathname);
    }, []);

    if (loading)
      return <Loading width="100vw" height="100vh"/>;
    return (
      <SocketContext.Provider value={class_socket}>
        <Notif>
          <Router history={history}>
              {!hideNavBar && <NavBar user={user}/>}
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
        </Notif>
      </SocketContext.Provider>
    );
}

root.render(
  <PongApp />
);
