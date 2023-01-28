module.exports = {
    /** 
     * @param current_page
     * @param columnSize
     * @param count_column
     * 
     * @return 
     *  total_page, startColumn, columnSize
     * 
     *  전체페이지수, 시작할 컬럼 인덱스, 컬럼사이즈 
     */
    showPage: async function (cur_page, columnSize, count_column) {
        /**전체 페이지 개수 */
        let total_page = 0;
        /**시작하는 컬럼 순서 */
        let startColumn = 0;
        let current_page = cur_page;
        total_page = Math.ceil(count_column / columnSize);

        if (current_page < 0 || current_page >= total_page) {
            current_page = 0; // 만약 현재 페이지 범위가 벗어나면 현재페이지를 0으로 고정
        }

        startColumn = (current_page * columnSize);

        return { "total_page": total_page, "startColumn": startColumn, "columnSize": columnSize, "current_page": current_page }
    },
    /**
     * 
     * @param {int} current_page 
     * @param {int} page_size 
     * @param {int} total_page 
     * @returns 
     *  start_page, end_page, prevPage, nexPage
     * 
     *  시작페이지 인덱스 , 끝페이지 인덱스, 이전페이지버튼 여부, 다음페이지 버튼 여부
     */
    Pagination: async function (current_page, page_size, total_page) {
        /**시작페이지 인덱스 */
        let start_page = (current_page - Math.floor(page_size / 2));
        /**끝페이지 인덱스*/
        let end_page = start_page + page_size;
        /** 시작페이지 and  마지막페이지 격차  */
        let end_start_minus = 0;
        /**이전 페이지 유무 */
        let prevPage = true;
        /**다음 페이지 유무  */
        let nexPage = true;

        if (start_page <= 0) {      // 시작페이지가 0이거나 작을때
            start_page = 0;
            if (start_page <= - Math.floor(page_size / 2))   //  현재페이지 - 절반페이지까지 이전 페이지 버튼이 보이게 하기
                prevPage = false;
        }

        if (end_page >= total_page) {   // 끝페이지가 전체페이지랑 같거나 클때
            end_page = total_page;
            if (end_page >= total_page + Math.floor(page_size / 2))  //  전체페이지 + 절반페이지까지 다음 페이지 버튼이 보이게 하기
                nexPage = false;
        }

        /** 마지막 페이지와 시작페이지 격차를 구하기 위해서는 먼저 두 변수
         *  0 ~ total_page 범위에 벗어나는지 확인이 필요  
         */
        end_start_minus = end_page - start_page;

        /** 시작페이지가 0보다 크다면  */
        if (start_page > 0) {
            /** 만약 마지막 페이지와 시작페이지 차가
             *  보여줄 페이지 사이즈와 같지 않다면 
             *  격차만큼 시작페이지를 뺴주기 
             */
            if (end_start_minus != page_size) {
                start_page = start_page - (page_size - (end_start_minus));
            }
        }
        /** 마지막페이지가 전체페이지 수 보다 작다면 */
        if (end_page < total_page) {
            /** 만약 마지막 페이지와 시작페이지 차가
             *  보여줄 페이지 사이즈와 같지 않다면 
             *  격차만큼 시작페이지를 뺴주기 
             */
            if (end_start_minus != page_size) {
                end_page = end_page + (page_size - (end_start_minus));
            }
        }
        return { "start_page": start_page, "end_page": end_page, "prevPage": prevPage, "nexPage": nexPage, "page_size": page_size }
    },
}