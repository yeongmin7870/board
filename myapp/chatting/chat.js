module.exports = {
    chat: function (io, room) {
        /** 소켓 연결되었을때 */
        io.on('connection', (socket) => {
            console.log(room);

            /** 해당 방으로 이동 */
            socket.join(`${room}`);

            /** 클라이언트로부터 통신을 기다림 */
            const chat_message = (msg) => {
                console.log(msg);
                /** 해당방으로 메시지를 보내줌 */
                io.to(`${room}`).emit('chat message', msg);
            }

            socket.on("chat message", chat_message);
            socket.off("close_chat_message", chat_message);


            /** 나가기를 눌렀을때 room 도 떠나기 */
            socket.on('disconnect', () => {
                socket.leave(`${room}`);
                console.log("방을 나갔습니다.");
                console.log(socket.rooms);
            });
        })
    },
}