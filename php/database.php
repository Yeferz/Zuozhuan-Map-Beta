
'''
This does not need to be used at the moment, it is for later when I use the mySQL database.

  $host_name = 'db5015500727.hosting-data.io';
  $database = 'dbs12662105';
  $user_name = 'dbu2718871';
  $password = '<Enter your password here.>';

  $link = new mysqli($host_name, $user_name, $password, $database);
'''
<?php
try
{
  $con = new PDO('/home/yefren/github/Zuozhuan-Map-Beta/Database.sqlite')
  $con->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
  //echo 'connected';
  catch(PDOException $e)
{
	echo '<br>'.$e->getMessage();
}
}
?>
<?php
include 'connect_test_db.php';
$searchErr='';
$result='';
if(isset($_POST['save']))
{
	if(!empty($_POST['search']))
	{
  $search = $_POST['txtName'];
  $stmt = $con->prepare("SELECT * FROM `locales_corrected` WHERE name LIKE '%$search%' or polity LIKE '%$search%' or location LIKE '%$search'");
  $stmt->execute();
  $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
  }
  else {
    $searchErr = 'Please enter your search'
  }
}
?> 

