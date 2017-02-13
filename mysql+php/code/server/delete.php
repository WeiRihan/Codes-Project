<?php
	header("Content-type:application/json;charset=utf-8");
	require_once('db.php');
	
	if($link){
		$newsid = $_POST["newsid"];
		
		$sql = "DELETE FROM `news` WHERE `news`.`id`={$newsid}";
		$result = mysql_query($sql,$link);

		echo json_encode(array("delete"=>"success"));
	}

	mysql_close($link);
?>