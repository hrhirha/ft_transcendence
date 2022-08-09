import React from 'react';
import ReactDOM from 'react-dom/client';
import { Login } from 'views/pages/login/login';
import { faPuzzlePiece } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from 'views/pages/home/home';
import { Chat } from 'views/pages/chat/chat';
import { LeaderBoard } from 'views/pages/leader_board/leader_board';
import { Profile } from 'views/pages/profile/profile';
import { NotFound } from 'views/pages/not_found/not_found';
import { AuthChecker } from 'views/components/check_auth/auth_checker';
import "views/style/index.scss";
import { Checkpoint } from 'views/pages/checkpoint/checkpoint';
import { GamePlayer } from 'views/pages/game/game_player/game_player';
import { GameWatcher } from 'views/pages/game/game_watcher/game_watcher';


library.add(faPuzzlePiece);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
  <BrowserRouter>
      <Routes>
          <Route path="/login" element={<AuthChecker redirect="/" wrappedContent={<Login/>}/>}/>
          <Route path="/" element={<AuthChecker redirect="/" wrappedContent={<Home/>} />} />
          <Route path="/leader_board" element={<AuthChecker redirect="/leader_board" wrappedContent={<LeaderBoard/>} />} />
          <Route path="/play" element={<AuthChecker redirect="/play" wrappedContent={<GamePlayer ultimateGame={false}/>} />} />
          <Route path="/play/ultimate" element={<AuthChecker redirect="/play/ultimate" wrappedContent={<GamePlayer ultimateGame={true}/>} />} />
          <Route path="/watch" element={<AuthChecker redirect="/watch" wrappedContent={<GameWatcher />}/>} />
          <Route path="/chat" element={<AuthChecker redirect="/chat" wrappedContent={<Chat/>}/>} />
          <Route path="/profile" element={<AuthChecker redirect="/profile" wrappedContent={<Profile userProfile={true}/>}/>} />
          <Route path="/u/:username" element={<AuthChecker redirect="/u" wrappedContent={<Profile userProfile={false}/>}/>} />
          <Route path="/checkpoint" element={<AuthChecker redirect="/" wrappedContent={<Checkpoint/>}/>} />
          <Route path="*" element={<AuthChecker redirect="/noftound" wrappedContent={<NotFound/>}/>} />
      </Routes>
  </BrowserRouter>
  // </React.StrictMode>
);
