const express = require('express');
const chatController = require('../controller/chatController');
const router = express.Router();
const chatContoller = require('../controller/chatController');

router.post('/chat/room', chatContoller.makeRoom) /**채팅 방 추가 */
    .put('/chat/room', chatContoller.changeState) /** 채팅방 상태 0:활성화 1:비활성화*/
    .get('/chat/room', chatContoller.myRoomList) /**자신의 채팅 방 리스트 가져오기 */

router.post('/chat',chatContoller.writeChat)
.get('/chat', chatController.getChat)

module.exports = router;