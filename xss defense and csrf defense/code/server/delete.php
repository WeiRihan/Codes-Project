<?php
	header("Content-type:application/json;charset=utf-8");
	require_once('db.php');
	session_start();
	if($link){
		if($_SESSION["token"] == $_POST["token"]){
                $salt = "BAIDUnews*";
                $time = time();
                $token = md5($salt . md5($time . $salt));
                $_SESSION["token"] = $token;
        }
        else{
            echo json_encode(array('result'=>'fail'));
        }
		$newsid = $_POST["newsid"];
		
		$sql = "DELETE FROM `news` WHERE `news`.`id`={$newsid}";
		$result = mysql_query($sql,$link);

		echo json_encode(array('delete'=>'success','token'=>$token));
	}

	mysql_close($link);
?>