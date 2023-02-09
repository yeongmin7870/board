const express = require('express');
const router = express.Router();

let chatting =
    function chat(io) {
        io.on('connection', (socket) => {

            console.log(socket.id);

            socket.on('chat message', (msg) => {
                io.emit('chat message', msg);
            });
        });
    }

module.exports = router, chatting