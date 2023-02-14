const chat = require('../models/chat');
const user = require('../models/Users');
const jwt = require('../modules/jwt');

module.exports = {
    /** token, receiver_name 입력받으면
     *  디비에 room을 생성해주고
     *  Good 성공 or Bad 실패 를 리턴해주는 함수
     */
    makeRoom: async (req, res) => {
        const today = new Date();
        const token = await jwt.verify(req.body.token);
        /** 로그인이 필요할때 */
        if (token.user_id == undefined) return res.send({ msg: "need login" });
        /** 자신의 게시물에서 채팅하기를 눌렀을 때 */
        if (token.user_nickname == req.body.receiver_name) return res.send({ msg: "same user" });
        /** 수신자 아이디 가져오기 */
        const receiver = await user.findId(req.body.receiver_name);
        /** 송신자와 수신자 둘이 채팅방 개설 여부 확인 */
        const checkedRoom = await chat.checkedOneByRoom(token.user_id, receiver.user_id);
        /** 채팅방 개설한적이 없을 때 */
        if (checkedRoom[0] == undefined) {
            const room = { sender_id: token.user_id, receiver_id: receiver.user_id, chat_room_name: `${token.user_nickname}+${req.body.receiver_name}+${today}` }
            /** 채팅방 개설 */
            const response = await chat.makeRoom(room);
            /** 디비에 정상적으로 값이들어가서 컬럼 하나가 생성되었다면 */
            if (response.affectedRows == 1) res.send({ msg: "Good" })
            else res.send({ msg: "Bad" });
        } else return res.send({ msg: "exist room" });
    },
    /** 채팅방 이름을 
     *  받으면 해당 채팅방을 비활성화 해주는
     *  함수
     */
    changeState: async (req, res) => {
        const response = await chat.changeState(req.body);
        if (response.affectedRows != 0) res.send({ msg: "Good" })
        else res.send({ msg: "Bad" });
    },
    /** 토큰을 받으면
     *  현재 내방 리스트를 리턴
     *  상대방 닉네임으로 누구 채팅인지 표시
     */
    myRoomList: async (req, res) => {
        const token = await jwt.verify(req.body.token);
        if (token.user_id == undefined) return res.send({ msg: "need login" });
        /** 리스트 가져오기 */
        const response = await chat.myRoomList(token.user_id);

        /** 현재 채팅방 목록 object , 담는 변수 */
        let otherName = [];
        for (i of response) otherName.push(i.chat_room_name.split('+'));

        /** 상대방 닉네임만 저장하는 변수 */
        let otherNickname = [];
        /** 채팅방목록 object 에서 상대방 닉네임만 뽑아서 저장 */
        for (let i = 0; i < otherName.length; i++)
            for (let j = 0; j < 2; j++)
                if (token.user_nickname != otherName[i][j]) otherNickname.push(otherName[i][j]);
        if (otherNickname[0] != undefined) res.send({ otherNickname: otherNickname, room_name: response });
        else res.send({ msg: "Bad" });
    },

    writeChat: async (req, res) => {
        const response = await chat.writeChat();
        res.send(response);
    },
    
    getChat: async (req, res) => {
        const response = await chat.getChat();
        if(response == null) res.send("not exist key");
        else res.send(response);
    },
}