const express = require('express');
const router = express.Router();
const http = require('http');
const server = http.createServer(router);
const { Server } = require('socket.io');
const io = new Server(server,{
    path:"http://localhost:3000/v4/chat"
});

// 채팅 페이지
router.get('/chat', (req, res) => {
    res.render('chat');
});

io.on('connection', (socket) => {
    console.log('a user connected');
});

module.exports = router;