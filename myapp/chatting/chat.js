module.exports = {
    chat: function (io) {

        /** 소켓 연결되었을때 */
        io.on('connection', (socket) => {
            console.log("서버 연결되었습니다");

            /** 해당방으로 메시지를 보내줌 */
            const chat_message = (msg) => {
                io.to(`${msg.room_name}`).emit('chat message', msg);
            }

            /** 해당 방으로 이동 */
            const enterRoom = (room) => {
                socket.join(`${room.room_name}`);
            }
            
            socket.on("enterRoom", enterRoom);
            socket.on("chat message", chat_message);

            /** 나가기를 눌렀을때 room 도 떠나기 */
            socket.on('disconnect', () => {
                console.log("채팅서버가 끝났습니다.");
            });

        })
    },
}