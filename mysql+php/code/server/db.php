<?php
	header("Content-type:application/json;charset=utf-8");
	//error_reporting(0);
	$link = mysql_connect('localhost','baidunews-php','123456');
	if(!$link){
		echo json_encode(array('linkmsg'=>'false'));
	}else{
		mysql_select_db("baidunews_wrh");
		mysql_query("SET NAMES utf8");
	}
?>