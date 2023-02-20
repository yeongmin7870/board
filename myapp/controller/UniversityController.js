const university = require('../models/university');

module.exports = {
    findUniversity: async (req, res) => {
        let page = 1;
        let perPage = 1;
        /** 전체 페이지 개수 */
        let totalPageCount = 0;
        /**현재 api 전체 개수 */
        let university_array = [];
        let university_dict = {};
        /** 전공명 */
        let data = "";
        /** 현재 공공 api count 개수 가져오기 */
        const response = await university.getUniversityApi(page, perPage);
        perPage = 4000;
        /** 4000개 정보를 몇번 걸쳐서 찍을지 */
        totalPageCount = Math.ceil(response.totalCount / perPage);

        /** 페이지 수 만큼 반복문 */
        for (let i = 0; i < totalPageCount; i++) {
            page = i + 1;
            /** 전국 대학 api page에 맞춰서 정보 가저오기*/
            let response2 = await university.getUniversityApi(page, perPage); data = response2.data;

            /** 데이터 배열에 저장 반복문 */
            for (let j = 0; j < response2.data.length; j++)
                /** 학교명이 대학원이 아닐때만 값을 넣기 */
                if ((data[j]["학교명"]).includes("대학원") != true && (data[j]["학과상태"] != "변경[폐지]" && data[j]["학과상태"] != "폐지") && data[j]["주야구분"] != "야간") {
                    university_dict = { "대학명": data[j]["학교명"], "학과": data[j]["학부_과(전공)명"]};
                    university_array.push(university_dict);
                }
        }
        res.send(university_array);
    }

}
