<?php
    $pageWasRefreshed = isset($_SERVER['HTTP_CACHE_CONTROL']) && $_SERVER['HTTP_CACHE_CONTROL'] === 'max-age=0';

    if($pageWasRefreshed ) {
       header("Location: index.php");
       exit();
    }
?>

<!DOCTYPE HTML>
<html>
    <head>
        <?php include($_SERVER['DOCUMENT_ROOT'].'/includes.html'); ?>
    </head>
    <body>
        <?php include($_SERVER['DOCUMENT_ROOT'].'/nav.html'); ?>
        <link rel="stylesheet" type="text/css" href="css/page.css"/>

        <?php
            $name = $_GET['name'];
            $email = $_GET['email'];
            $subject = $_GET['subject'];
            $message = $_GET['message'];
            $headers = 'From: ' . $name . ' <' . $email . '>' . "\r\n" .
                'Reply-To: ' . $email . "\r\n" .
                'Subject: ' . $subject . "\r\n";
            $to = 'devon@devoncrawford.io';

            if($email == '' || $message == '') {
                include('invalid-input.html');
            }
            else if(@mail($to, $subject, $message, $headers)) {
                include('confirm.html');
            }
            else {
                include('error.html');
            }
         ?>
         <?php include($_SERVER['DOCUMENT_ROOT'].'/footer.html'); ?>
         <script src="scripts/mobile.js" type="text/javascript"></script>
    </body>
</html>
