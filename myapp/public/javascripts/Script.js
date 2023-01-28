// form 태그 delte 수행 
$(document).ready(function () {
    $('.delete-form').on("click", function (e) {
        e.preventDefault();
        var board_id = $('#board_id').val();
        $.ajax({
            type: 'DELETE',
            url: '/v3/board/dormboard/'+board_id,
            success: (data) => {
                console.log(data);
            },
            error: (err) => {
                console.log(err);
            }
        });
    });
});