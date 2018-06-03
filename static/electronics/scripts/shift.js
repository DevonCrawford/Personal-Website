$(".homeSouth").click(function() {
    var offset = 60;
    if($(window).width() < 992) {
        offset = 54;
    }
    offset = offset + 75;
    $('html,body').animate({
        scrollTop: $(".homeSouth").offset().top - offset},'slow');
});

// function titleShift() {
//     if($(window).width() < 500) {
//         $(".homeDiv .subTitle").html("JAVA | C | ARDUINO | ASSEMBLY | WEB");
//     }
// }
