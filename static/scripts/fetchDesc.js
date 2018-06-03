var dir = window.location.pathname;

$(".desc").each(function() {
    let desc = $(this);
    let project = dir + desc.attr('data-desc');

    $.ajax({
        type: 'get',
        url: '/api/fetchDesc' + project,
        success: function(data) {
            desc.html(data);
        },
        fail: function(data) {
            console.log(data);
        }
    });
});