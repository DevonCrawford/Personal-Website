$(window).resize(landShift);
$(document).ready(landShift);

function landShift() {

    if($(window).width() < 363) {
        document.getElementById('srcCode').innerHTML = "source code";
    }
    else {
        document.getElementById('srcCode').innerHTML = "View source code";
    }
}
