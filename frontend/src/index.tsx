import React from 'react';
import ReactDOM from 'react-dom/client';
import "./views/style/index.scss";
import { Login } from './views/pages/login/login';
import { NavBar } from './views/components/navbar/navbar';
import { Card } from './views/components/card/card';
import { faPuzzlePiece } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";


library.add(faPuzzlePiece);


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    {/* <NavBar />
    <div className='container'>
      <div className='row center' >
        <div className='col col-md-6 col-lg-4'>
          <Card cardTitle='Play default game with your friend' icon="faPuzzlePiece" btnTitle='Play' background='https://i.pinimg.com/originals/d4/1a/3e/d41a3e3cce22dbc082a46c607a013c24.jpg'/>
        </div>
        <div className='col col-md-6 col-lg-4'>
          <Card cardTitle='Play default game with your friend' icon="faPuzzlePiece" btnTitle='Play' background='https://i.pinimg.com/originals/d4/1a/3e/d41a3e3cce22dbc082a46c607a013c24.jpg'/>
        </div>
      </div>
    </div> */}
    <Login/>
  </React.StrictMode>
);
