


$('#send').click(function(e) {
    console.log("SEND BTN CLICK!!");
    let name = $('#name').val();
    let email = $('#email').val();
    let subject = $('#subject').val();
    let message = $('#message').val();

    $.ajax({
        type:'post',
        url:'/api/email' + name + '/' + email + '/' + subject + '/' + message,
        success: function(data) {
            console.log(data);
        },
        fail: function(data) {
            console.log(data);
        }
    });
    console.log("NAME: " + name);
    console.log("EMAIL: " + email);
    console.log("SUBJECT: " + subject);
    console.log("MESSAGE: " + message);
});