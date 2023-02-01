const express = require('express');
const Book = require('../models/books');
const jwt = require('../modules/jwt');
const fs = require('fs');
const Comment = require('../models/comments');
const { logger } = require('../modules/logger');
const Page = require('../modules/page');
const Users = require('../models/Users');
const mysql = require('mysql2');
const { count } = require('console');

module.exports = {

    // 게시판 글 작성
    doWriteBoard: async function (req, res) {
        try {
            req.body.board_image = req.file.filename; // multer middleware에서 확장자가 이미지가 아니면 파일이 생성되지 않기 때문에 req에 file 존재가 없음 따라서 catch에 걸리게 됨
            const decode = await jwt.verify(req.body.token); //토큰 해독
            req.body.user_id = decode.user_id; // 토큰 오브젝트에서 고객 아이디만 꺼내기

            Book.setBoard(req.body).then((result) => {
                logger.info(`'${req.body.user_id}' 님이 '${result}' 번 게시글을 작성했습니다.`)
                res.status(200).send(
                    `
                    <script>
                        alert("게시글이 올라갔어요!");
                        location.href="/v2/home/0";
                    </script>
                    `
                );
            });
        } catch (e) {
            res.status(404).send(`<script>
            location.href='/v2/home/0';
            alert('이미지 파일이 아닙니다 🐱');
            </script>`);
        }
    },
    /**
     * 메인홈 게시판 목록 출력
     *   current_page , board_state, select_option
     *   알맞은 페이지 내용을 출력함
     */
    getAllBoard: async function (req, res) {
        /** 게시판 상태 변수 */
        let board_state = "";
        let select_option = "";
        let search = "";

        /** 게시판 상태 변수가 쿼리로 넘어오지 않았다면 */
        if (req.query.board_state == undefined) {
            /** 게시판 상태 변수가 쿼리, body 둘다 넘어오지 않았다면 */
            if (req.body.board_state == "" || req.body.board_state == undefined) {
                board_state = "전체";
            } else {
                board_state = req.body.board_state;
            }
        } else {
            board_state = req.query.board_state;
        }

        /** 옵션 선택 변수가 쿼리로 넘어오지 않았다면 */
        if (req.query.select_option == undefined) {
            /** 옵션 선택 변수가 쿼리, body 둘다 넘어오지 않았다면 */
            if (req.body.select_option == "" || req.body.select_option == undefined) {
                select_option = "제목";
            } else {
                select_option = req.body.select_option;
            }
        } else {
            select_option = req.query.select_option;
        }

        /** 검색 변수가 쿼리로 넘어오지 않았다면 */
        if (req.query.search == undefined) {
            /** 검색 변수가 쿼리, body 둘다 넘어오지 않았다면 */
            if (req.body.search == "" || req.body.search == undefined) {
                search = "";
            } else {
                search = req.body.search;
            }
        } else {
            search = req.query.search;
        }
        /** 검색 결과를 가공한 변수 */
        let manufacture_search = "";
        for (m of search.split(" ")) manufacture_search += m;

        const board = {
            board_state: board_state,
            search: manufacture_search,
            select_option: select_option,
        }

        /** 현재페이지 */
        let current_page = req.params.page
        /**전체 컬럼 개수  */
        let count_column = await Book.getCntFindAll(board);

        /** 페이지 처리함수 */
        let showPage = await Page.showPage(current_page, 4, count_column);
        /**전체 페이지 개수 */
        let total_page = showPage.total_page;
        /**시작하는 컬럼 순서 */
        let startColumn = showPage.startColumn;
        /**컬럼 사이즈 */
        let columnSize = showPage.columnSize;
        current_page = showPage.current_page;
        /** 현재 페이지 컬럼 내용들 */
        let result = await Book.getAllBoard(startColumn, columnSize, board);

        /** pagination 처리 함수 */
        let Pagination = await Page.Pagination(current_page, 5, total_page);
        /** 시작 페이지 인덱스 */
        let start_page = Pagination.start_page;
        /** 끝페이지 인덱스 */
        let end_page = Pagination.end_page;
        /** 이전버튼여부 */
        let prevPage = Pagination.prevPage;
        /** 다음버튼 여부 */
        let nexPage = Pagination.nexPage;
        /** 페이지 사이즈 */
        let page_size = Pagination.page_size;
         if (search != "") {
            logger.info(`'${board_state}', '${select_option}', "${search}" 을(를) 검색했습니다.`);
        }
        res.render('home', { board: { result }, page: { prevPage, nexPage, total_page, start_page, end_page, current_page, page_size }, board_state: board_state, search: search, select_option: select_option });
    },
    /**
     * 게시판 댓글 페이지처리
     * @params 현재 댓글페이지 입력받으면
     *   알맞은 페이지 내용을 출력함
     */
    getAllComment: async function (req, res) {
        /** 현재페이지 */
        let current_page = req.params.page
        /**전체 컬럼 개수  */
        let count_column = await Comment.getCountComment(req.params.board_id);

        /** 페이지 처리함수 */
        let showPage = await Page.showPage(current_page, 4, count_column);
        /**전체 페이지 개수 */
        let total_page = showPage.total_page;
        /**시작하는 컬럼 순서 */
        let startColumn = showPage.startColumn;
        /**컬럼 사이즈 */
        let columnSize = showPage.columnSize;
        current_page = showPage.current_page;
        /** 현재 페이지 컬럼 내용들 */
        let result = await Comment.getByboardComment(req.params.board_id, columnSize, startColumn);

        /** pagination 처리 함수 */
        let Pagination = await Page.Pagination(current_page, 5, total_page);
        /** 시작 페이지 인덱스 */
        let start_page = Pagination.start_page;
        /** 끝페이지 인덱스 */
        let end_page = Pagination.end_page;
        /** 이전버튼여부 */
        let prevPage = Pagination.prevPage;
        /** 다음버튼 여부 */
        let nexPage = Pagination.nexPage;
        /** 페이지 사이즈 */
        let page_size = Pagination.page_size;

        res.send({ comment: { result }, page: { prevPage, nexPage, total_page, start_page, end_page, current_page, page_size } });
    },
    /** 마이페이지 
     *    닉네임을 입력 받으면 
     *    유저 정보만 리턴 
     */
    FindByAllBoard: async function (req, res) {

        const nickname = req.params.nickname;

        Users.getUser(nickname).then((result) => {
            return res.status(200).render('mylist', { board: { result } });
        });

    },

    /** 마이페이지 
     *      user_id와 게시판 상태 를 입력받으면 
     *      해당 상태의 게시판을 리턴
     */
    FindByBoardContent: async function (req, res) {
        const nickname = req.params.nickname; // 토큰 오브젝트에서 고객 아이디만 꺼내기
        const board_state = req.query.board_state; // 게시판 상태
        /** 현재페이지 */
        let current_page = Number(req.query.current_page);

        const mypage = {
            nickname: nickname,
            board_state: board_state,
            current_page: current_page,
        }

        /**전체 컬럼 개수  */
        let count_column = await Book.getCntFindStateBoard(mypage);
        count_column = count_column[0].cnt;
        /** 페이지 처리함수 */
        let showPage = await Page.showPage(current_page, 6, count_column);
        /**전체 페이지 개수 */
        let total_page = showPage.total_page;
        /**시작하는 컬럼 순서 */
        let startColumn = showPage.startColumn;
        /**컬럼 사이즈 */
        let columnSize = showPage.columnSize;
        current_page = showPage.current_page;

        /** 현재 페이지 컬럼 내용들 */
        const result = await Book.FindByAllBoard(mypage, startColumn, columnSize)
        /** 숫자및 화살표 정보  */
        const Pagination = await Page.Pagination(current_page, 4, total_page);
        return res.send({ board: { result }, numberbar_arrow: Pagination });

    },


    // 책 카테고리 
    findBybookClassification: async function (req, res) {
        Book.getBookClassifications().then((result) => {
            res.status(200).render('writeboard', { book: { result } });
        });
    },
    // 해당 게시글 한 개 찾기
    FindByBoard: async function (req, res) {
        try {
            await Book.view_count(req.params.board_id); // 조회수 +1
            const result = await Book.FindByBoard(req.params.board_id);
            res.status(200).render('board', { myboard: { result } });
        } catch (err) {
            console.log(err);
        }
    },
    /**
     * 게시글 삭제
     * 
     *   게시글 아이디를 입력받고
     *  
     */
    doRmByBoard: async function (req, res) {

        const user = await jwt.verify(req.body.token); // 토큰 해독

        const user_id = user.user_id;

        // 해당 이미지 파일 이름 찾고 삭제하기
        Book.FindByBoard(req.params.board_id).then((result) => {

            if (user_id != result[0].user_id) { //현재 아이디와 토큰 아이디가 일치하지 않으면
                res.send(`<script>
                            alert('자신의 게시물이 아니기 때문에 삭제 할 수 없습니다.');
                            window.history.back();
                          </script>
            `);
                return;
            } else {

                const image_name = result[0].board_image;
                let file_path = './public/images/board/' + image_name;

                if (fs.existsSync(file_path)) {
                    try {
                        fs.unlinkSync(file_path);
                        logger.info(`'${user_id}' 님이 '${req.params.board_id}' 게시물 삭제 수행중에 '${image_name}' 이미지를 삭제했습니다.`);
                    } catch (e) {
                        logger.error(e);
                        res.send({ msg: '서버 이미지 삭제 실패했습니다.' });
                    }
                } else {
                    let m = `${file_path} 삭제하려는 서버 이미지 경로가 올바르지 않습니다.`;
                    logger.error(m);
                }

                // 디비 게시글 데이터 삭제 
                Book.doRmByBoard(req.params.board_id).then((result) => {
                    logger.info(`'${user_id}' 님이 '${req.params.board_id}' 게시물을 성공적으로 삭제했습니다.`);
                    res.status(201).send(`
                        <script>
                            alert("게시글이 삭제되었습니다.");
                            location.href="/v2/home/0";
                        </script>
                    `);
                }).catch((err) => console.log(err));

            }
        });

    },
    /**댓글 작성
     * 
     * @body Comment object 입력받음
     *  입력받은 것을 디비에 넣고
     * @response 
     *  결과를 응답에 보내주는 함수
    */
    setToBoardComment: async function (req, res) {
        const user = await jwt.verify(req.body.token); // 토큰 해독
        /** request user_id가 현재 null 이므로  */
        req.body.user_id = user.user_id;

        Comment.setToBoardComment(req.body).then((result) => {

            /** 누가 어디에 댓글 달았는지 로그 */
            logger.info(`'${req.body.user_id}' 님이 '${req.body.board_id}' 게시판에서 "${req.body.comment_content}" 댓글 작성을 했습니다.`);

            res.send(result);
        })
            .catch((err) => {
                logger.error(`'${req.body.user_id}' 님이 '${req.body.board_id}' 게시판에서 "${req.body.comment_content}" 댓글 작성을 실패했습니다.`);
                res.send(err);
            })
    },
    //해당 게시글 댓글 보여주기
    getByboardComment: async (req, res) => {
        try {
            let result = await Comment.getByboardComment(req.params.board_id);
            res.send({ msg: result });
        } catch (err) {
            res.send({ msg: err });
        }
    },
    /**
     * 게시물 댓글 삭제
     * 
     * @params comment_id
     * @body token
     * 
     *  결과에 따른 응답을 리턴
     */
    removeComment: async (req, res) => {
        const user = await jwt.verify(req.body.token); // 토큰 해독

        const user_id = user.user_id;

        /** 해당 댓글에 관한 정보들 */
        let comment_result = await Comment.getOneComment(req.params.comment_id);
        if (user_id != comment_result[0].user_id) { // 댓글 주인과 이용자가 일치하지 않으면
            res.send(`<script>
                            alert('자신의 댓글이 아니기 때문에 삭제 할 수 없습니다.');
                            location.href = document.referrer;
                        </script>
                `);
        } else {
            let result = await Comment.removeComment(req.params.comment_id);
            logger.info(`'${user_id}' 님이 '${comment_result[0].board_id}' 게시물의 "${comment_result[0].comment_content}" 댓글을 성공적으로 삭제했습니다.`);
            res.send(`<script>
                alert('댓글이 삭제 되었습니다.');
                location.href = document.referrer;
            </script>
            `);
        }
    },
    /** 게시판 상태를 입력 받고
     * 
     *  현재 게시판 상태를 수정하는 함수
     */
    changeBoardState: async (req, res) => {
        let board = {
            board_state: req.body.board_state,
            board_id: req.params.board_id
        }
        const decode = await jwt.verify(req.query.token);
        const user_id = decode.user_id;
        await Book.changeBoardState(board);
        logger.info(`'${user_id}' 님이 '${req.params.board_id}' 게시물의 상태를 "${req.body.board_state}" 로(으로) 변경했습니다.`);
        res.send(`
        <script>
            alert("게시물 상태를 성공적으로 수정했어요!");
            opener.parent.location.reload();
            window.close();
        </script>
        `);
    },
}