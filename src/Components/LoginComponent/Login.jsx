import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

import { Toaster, toast } from 'react-hot-toast';

import { Button } from '@chakra-ui/react';
import { Spinner } from '@chakra-ui/react';

import { v4 as uuid } from 'uuid';

import '../LoginComponent/Login.css';

const Login = () => {
    const [roomId, setRoomId] = useState('');
    const [Username, setUsername] = useState('');
    const navigate = useNavigate();

    const setUidField = () => {
        setRoomId(uuid());
        toast.success('Created a new room.');
    }

    const checkAllFields = async () => {
        if (Username == '' || roomId == '') {   
            toast.error("None of the field should be empty")
            navigate('/');
        } else if(Username.length<2){
            toast.error("minimum 2 characters required")
            navigate('/');
        } else {
            localStorage.setItem('name', Username);
            navigate(`room/${roomId}`);
        }
    }

    return (
        <>
            <Toaster />
            <div className='LoginForm'>
                <label htmlFor="room_ID" style={{ paddingBottom: '5px' }}>Paste room ID</label>
                <input value={roomId} type="text" placeholder="ROOM ID" id="room_ID" onChange={(e) => setRoomId(e.target.value)} />
                <input value={Username} type="text" placeholder="USERNAME" id="USERNAME" onChange={(e) => setUsername(e.target.value)} />
                <Button colorScheme='facebook' onClick={checkAllFields}>
                    Enter
                </Button>
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    Don't have an invitation?
                    <a onClick={setUidField} style={{ marginLeft: '3px', marginTop: '5px', textDecoration: 'underline', cursor: 'pointer' }}>new-room</a>
                </div>
            </div>
        </>
    )
}

export default Login;