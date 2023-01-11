function chat(app) {
    try {
        const io = app.get('io'); // 전역변수
        const chat = io.of('/a');
        chat.on('connection', (socket) => {
            console.log(socket.id);
            console.log('연결이 되었습니다.');
            socket.on('chat message', msg => {
                chat.emit('chat message', msg);
            });
            socket.on('disconnect', () => {
                console.log('연결이 끊어졌습니다.')
            });
        });
    } catch (e) {
        console.log(e);
    }
};

module.exports = chat;