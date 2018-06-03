let channel = null;

$(document).ready(function() {
    $.ajax({
        type: 'GET',
        url: '/api/yt-desc/channel',
        success: function(data) {
            let json = JSON.parse(data.body);
            channel = (json.items)[0];
            let stats = channel.statistics;
            var user = upper(channel.snippet.title);

            $('#userTitle').html(user);
            $('#videoCount').html(fn(stats.videoCount) + " Uploads");
            $('#subCount').html(fn(stats.subscriberCount) + " Subscribers");
            $('#viewCount').html(fn(stats.viewCount) + " Views");
        },
        error: function(data) {
            console.log(data);
            window.location.replace(data.responseText);
        }
    });
});

function upper(str) {
    let newStr = "";
    for(let i = 0; i < str.length; i++) {
        let code = str.charCodeAt(i);
        if(code >= 97 && code <= 122) {
            code = code - 32;
        }
        newStr += String.fromCharCode(code);
    }
    return newStr;
}

function fn(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

$('#uploadsBtn').click(function() {
    let sel = $('#searchSelect').find(":selected").text();
    if(sel === "Range of Uploads") {
        let start = $('#startRange').val();
        let end = $('#endRange').val();
        if(start === "" ) {
            start = "empty";
        }
        if(end === "") {
            end = "empty";
        }

        $.ajax({
            type: 'GET',
            url: '/api/yt-desc/uploadRange/' + start + '/' + end + '/first',
            success: function(data) {
                console.log(data);
                updateTable("searchTable", data);
            },
            error : function(data) {
                console.log(data);
            }
        });
    }
    else {
        let range = $("#range").val();
        if(range === "") {
            range = 5;
        }
        let all = range;
        if(range > 50) {
            range = 50;
        }

        $.ajax({
            type: 'GET',
            url: '/api/yt-desc/uploads/' + range + '/first/' + all,
            success: function(data) {
                console.log(data);
                updateTable("searchTable", data);
            },
            fail : function(data) {
                console.log(data);
            }
        });
    }
});

// param table: document.getElementById('table')
function updateTable(tableId, data) {
    let table = document.getElementById(tableId);
    clearTable($('#' + tableId));
    for(var i = 0; i < data.length; i++) {
        let vid = data[i];
        var row = table.insertRow(table.rows.length);
        let thumb = vid.snippet.thumbnails.default.url;
        row.insertCell(0).innerHTML = "<img src=" + thumb + ">";
        row.insertCell(1).innerHTML = vid.snippet.title;
        row.insertCell(2).innerHTML = vid.snippet.resourceId.videoId;
    }
}

function clearTable(table) {
    table.find("tr:gt(0)").remove();
}

$('#searchSelect').change(function() {
    let sel = $(this).find(":selected").text();
    $('#startRange').val('');
    $('#endRange').val('');

    if(sel === "Range of Uploads") {
        $('.inputOP').prop('hidden', false);
    }
    else {
        $('.inputOP').prop('hidden', true);
    }
})
