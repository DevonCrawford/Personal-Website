$(window).resize(shiftCols);
$(document).ready(shiftCols);

function shiftCols() {
    if(document.getElementById("message") != null) {
        var width = $(window).width();
        var height = $(window).height();
        var rows = parseInt((height -390) /29);

        if( width < 992 && rows <= 20) {
            document.getElementById("message").setAttribute("rows", rows);
        }
        else if (width >= 992) {
            document.getElementById("message").setAttribute("rows", 10);
            if(height < 885) {
                $(".titleMain").css({
                    "padding-bottom":"20px"
                });
            }
            else {
                $(".titleMain").css({
                    "padding-bottom":"100px"
                });
            }
            if(height < 785) {
                rows = parseInt((height -500) /28);
                document.getElementById("message").setAttribute("rows", rows);
            }
        }

        if(width < 1278) {
            $(".rp").html("Email");
        }
        else {
            $(".rp").html("Email address");
        }

        if(width < 500) {
            $("col-form-label").removeClass("col-2");
            $("col-form-label").addClass("col-4");

            var e = $(".col-10");
            e.removeClass("col-10");
            e.addClass("col-8");
        }
        else {
            $("col-form-label").removeClass("col-4");
            $("col-form-label").addClass("col-2");

            var e = $(".col-8");
            e.removeClass("col-8");
            e.addClass("col-10");
        }
    }
}
