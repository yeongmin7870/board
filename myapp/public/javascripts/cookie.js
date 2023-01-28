/**원하는 key로 쿠키 값 가져오기 */
function getCookie(cookieName) {
    let cookie = {};
        document.cookie.split(';').forEach(function(el) {
            let [key,value] = el.split('=');
            cookie[key.trim()] = value;
    })
    return cookie[cookieName];
}    