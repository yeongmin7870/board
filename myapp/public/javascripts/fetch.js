
/**
 *  body로 입력받은 데이터를 서버로 보내주고 
 *  서버로부터 응답받음
 * @param {string} url 
 * @param {object} data 
 * @returns 
 *    json 형식의 응답
 */
async function Post_body(url,data) {
    let response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    response = await response.json();
    return response;
}
/**
 *  PathVariable로 받은 데이터를
 *  get 방식으로 서버로부터 응답받음
 * @param {string} url 
 * @returns 
 */
async function Get_pathVar(url) {
    let response = await fetch(url);
    response = await response.json();
    return response;
}

/** url , json 형태 data를 put형태로
 *  입력받으면 서버 응답을 리턴해주는 
 *  함수
 */
async function PUT_BODY(url,data) {
    let response = await fetch(url, {
        method: 'PUT',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    response = await response.json();
    return response;
}
