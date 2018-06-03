$(window).resize(footerShift);
$(document).ready(footerShift);

function footerShift() {
    if($(window).width() < 767) {
        $('.bottomLinksDiv .rm').hide();
    }
    else {
        $('.bottomLinksDiv .rm').show();
    }
}
