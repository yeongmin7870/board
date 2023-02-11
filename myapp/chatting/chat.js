module.exports = {
    chat: function (io) {

        /** 소켓 연결되었을때 */
        io.on('connection', (socket) => {
            console.log("서버 연결되었습니다");

            /** 클라이언트로부터 통신을 기다림 */
            const chat_message = (msg) => {

                /** 해당 방으로 이동 */
                socket.join(`${msg.room}`);

                /** 해당방으로 메시지를 보내줌 */
                io.to(`${msg.room}`).emit('chat message', msg);
            }

            socket.on("chat message", chat_message);

            /** 나가기를 눌렀을때 room 도 떠나기 */
            socket.on('disconnect', () => {
                console.log("채팅서버가 끝났습니다.");
            });

        })
    },
}