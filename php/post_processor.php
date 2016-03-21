<?php
  $rawInput = file_get_contents('php://input');
  $input = json_decode($rawInput, true);
  
  require_once('request_processor.php')
?>
