<?php
  $host_name = 'db5015461613.hosting-data.io';
  $database = 'dbs12640726';
  $user_name = 'dbu140814';
  $password = 'Sc242hdF';

  $link = new mysqli($host_name, $user_name, $password, $database);

  if ($link->connect_error) {
    die('<p>Failed to connect to MySQL: '. $link->connect_error .'</p>');
  } else {
    echo '<p>Connection to MySQL server successfully established.</p>';
  }
?>