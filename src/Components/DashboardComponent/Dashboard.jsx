import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';

import CodeEditor from './CodeEditorComponent/CodeEditor.jsx';
import SelectLanguage from './SelectLanguageComponent/SelectLanguage.jsx';
import UserAvatar from './UserAvatarComponent/UserAvatar.jsx';

import './Dashboard.css';
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/md-light-deeppurple/theme.css";

import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Toaster, toast } from 'react-hot-toast';
import LogoutIcon from '@mui/icons-material/Logout';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import io from 'socket.io-client';

let socket;

const SocketInfoProvider = createContext();

const Dashboard = () => {
  const [check, setCheck] = useState(false);
  const [socketSetter, setSocketSetter] = useState(undefined);
  const [userList , setUserList] = useState(undefined);
  const [selectedLanguage, setSelectedLanguage] = useState({ name: "HTML" }); 
  const navigate = useNavigate();

  const location = useLocation();
  const id = location.pathname.split('/')[2];

  useEffect(() => {

    const userInfo = localStorage.getItem('name');

    if (id && !check) {
      socket = io(import.meta.env.VITE_BACKEND_URI);
      socket.emit('Update_UserList', { id, userInfo });
      setSocketSetter(socket);
      setCheck(true);
    }

    socket?.on('User List' , (usernames) => {
      setUserList(usernames);
    });

  }, [selectedLanguage]);

  useEffect(()=>{

    socket?.on('New user joined', (user) => {
      toast.success(`${user} joined the room.`);
    });

    socket?.on('User left', (user) => {
      toast.success(`${user} left the room.`);
    });

  },[]);

  const copyRoomId = () => {
    navigator.clipboard.writeText(id);
    toast.success(`ROOM ID copied to clipboard`);
  }

  const logoutUser = () => {
    navigate('/');
    window.location.reload();
  }

  return (
    <>
      <Toaster />
      <Splitter style={{ width: '100vw', height: '100vh', border: '1px solid black' }}>
        <SplitterPanel className="flex align-items-center justify-content-center">
          <SocketInfoProvider.Provider value={socketSetter}>
            <CodeEditor lang={selectedLanguage} id={id} />
          </SocketInfoProvider.Provider>
        </SplitterPanel>
        <SplitterPanel className="flex align-items-center justify-content-center" style={{ backgroundColor: "#242424", maxWidth: '35%', minWidth: '20%' }}>
          <SocketInfoProvider.Provider value={socketSetter}>
            <SelectLanguage selectLanguage={setSelectedLanguage} giveLanguage={selectedLanguage} id={id} style={{width:'100%'}} />
              <div className='onlineSuggest'>
                <div className='onlineName'>Online:</div>
                <ContentCopyIcon className='copyIcon' onClick={copyRoomId}/>
              </div>
              <div className='onlineUsers' >
                {userList?.map((name,key) => {
                  return(
                    <UserAvatar initials={`${name[0]+name[1]}`} key={key}/>
                  )
                })}
              </div>
              <div className='logoutSection'>
                <div className='logoutBackground'>
                  <LogoutIcon className='logoutIcon' onClick={logoutUser}/> 
                </div>
              </div>
          </SocketInfoProvider.Provider>
        </SplitterPanel>
      </Splitter>
    </>
  )
}

export default Dashboard;
export { SocketInfoProvider };