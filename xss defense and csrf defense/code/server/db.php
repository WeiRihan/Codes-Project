<?php
	header("Content-type:application/json;charset=utf-8");
	//error_reporting(0);
	$link = mysql_connect('localhost','billy','123qwe');
	if(!$link){
		echo json_encode(array('linkmsg'=>'false'));
	}else{
		mysql_select_db("billy");
		mysql_query("SET NAMES utf8");
	}
?>