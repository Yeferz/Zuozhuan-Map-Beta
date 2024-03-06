<?php
  $host_name = 'db5015500727.hosting-data.io';
  $database = 'dbs12662105';
  $user_name = 'dbu2718871';
  $password = '<Enter your password here.>';

  $link = new mysqli($host_name, $user_name, $password, $database);

  if ($link->connect_error) {
    die('<p>Failed to connect to MySQL: '. $link->connect_error .'</p>');
  } else {
    echo '<p>Connection to MySQL server successfully established.</p>';
  }
  $con = mysqli_connect('localhost', 'root', '',’db_contact’);
  The “db_contact” is our database name that we created before.
  After connection database you need to take post variable from the form. See the below code
  $txtName = $_POST['txtName'];
  $txtLocation = $_POST['txtLocation'];
  $txtYear = $_POST['txtYear'];
  $txtEntry = $_POST['txtEntry'];

  $sql = "SELECT * FROM `locales_corrected` WHERE name LIKE '$txtName';
  SELECT * FROM `locales_corrected` WHERE location LIKE '$txtLocation';
  SELECT * FROM `locales_corrected` WHERE year LIKE '$txtYear';
  SELECT * FROM `locales_corrected` WHERE entry LIKE '$txtEntry';"
?> 

/*
<?php
// database connection code
// $con = mysqli_connect('localhost', 'database_user', 'database_password','database');

$con = mysqli_connect('localhost', 'root', '','db_contact');

// get the post records
$txtName = $_POST['txtName'];
$txtEmail = $_POST['txtEmail'];
$txtPhone = $_POST['txtPhone'];
$txtMessage = $_POST['txtMessage'];

// database insert SQL code
$sql = "INSERT INTO `tbl_contact` (`Id`, `fldName`, `fldEmail`, `fldPhone`, `fldMessage`) VALUES ('0', '$txtName', '$txtEmail', '$txtPhone', '$txtMessage')";

// insert in database 
$rs = mysqli_query($con, $sql);

if($rs)
{
	echo "Contact Records Inserted";
}

?>
*/