const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const axios = require('axios');
const app = express();
require('dotenv').config();

// middlewares
app.use(cors({
  origin: process.env.FRONTEND_URI,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// dependency for real time chat application
const http = require("http");
const { Server } = require("socket.io");
const { log } = require('console');

// code for real time chat application
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URI,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

app.get('/', (req, res) => {
    res.send('Okay');
});

let UserList = {};
let UserNameList = {};
let SocketMapping = {};
let BindingRoomIdWithData = {};
let BindingRoomIdWithLanguage = {};

io.on('connection', (socket) => {
  console.log(`a user connected with ${socket.id}`);

  socket.on('Update_UserList', ({id,userInfo}) => {
    socket.join(id);
    socket.userInfo = userInfo;

    socket.to(id).emit("New user joined", userInfo);

    if (UserList[id] === undefined) {
      UserList[id] = [];
      UserNameList[id] = [];
    }

    UserList[id].push(socket.id);
    UserNameList[id].push(userInfo);
    SocketMapping[socket.id] = id;

    if(BindingRoomIdWithData[id]) {
      io.to(socket.id).emit('Get code', BindingRoomIdWithData[id]);
    }

    if(BindingRoomIdWithLanguage[id]) {
      io.to(socket.id).emit('Get language', BindingRoomIdWithLanguage[id]);
    }

    io.to(id).emit('User List', UserNameList[id]);

    console.log('UserList connect is here : ');
    console.log(UserList);
    console.log('SocketMapping connect is here : ');
    console.log(SocketMapping);

  });

  socket.on('Updated code' , (value) => {
    BindingRoomIdWithData[SocketMapping[socket.id]] = value;
    socket.to(SocketMapping[socket.id]).emit("Set updated code", BindingRoomIdWithData[SocketMapping[socket.id]]);
  })

  socket.on('Updated language' , (value) => {
    BindingRoomIdWithLanguage[SocketMapping[socket.id]] = value;
    socket.to(SocketMapping[socket.id]).emit("Set updated language", BindingRoomIdWithLanguage[SocketMapping[socket.id]]);
  })

  socket.on('disconnect',async () => {
    console.log(`user disconnected ${socket.id}`);

    socket.to(SocketMapping[socket.id]).emit("User left", socket.userInfo);

    UserList[SocketMapping[socket.id]] = UserList[SocketMapping[socket.id]].filter(item => item !== socket.id);
    UserNameList[SocketMapping[socket.id]] = UserNameList[SocketMapping[socket.id]].filter(item => item !== socket.userInfo);
    delete SocketMapping[socket.id];
    if(Object.keys(SocketMapping).length===0){
      delete BindingRoomIdWithData[SocketMapping[socket.id]];
      delete BindingRoomIdWithLanguage[SocketMapping[socket.id]];
    }

    console.log('UserList disconnect is here : ');
    console.log(UserList);
    console.log('SocketMapping disconnect is here : ');
    console.log(SocketMapping);

  });
});


httpServer.listen(3000, () => {
    console.log('listening on *:3000');
});