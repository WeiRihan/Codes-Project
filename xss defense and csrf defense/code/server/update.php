<?php
	header("Content-type:application/json;charset=utf-8");
	error_reporting(0);
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
		//插入新闻
		$newstitle = addslashes(htmlspecialchars($_POST["newstitle"]));
		$newstype = $_POST["newstype"];
		$newsimg = addslashes(htmlspecialchars($_POST["newsimg"]));
		$newstime = $_POST["newstime"];
		$newssrc = addslashes(htmlspecialchars($_POST["newssrc"]));
		$newsid = $_POST['id'];
		
		/*检查是否修改为重复的新闻标题begin*/
		$sql = "SELECT * FROM `news` WHERE `id`={$newsid}";		
		$result = mysql_query($sql,$link);
		while($row = mysql_fetch_assoc($result)){
			$thistitle=$row['newstitle'];
		}

		$sql="select count(0) as count from news where newstitle='".$newstitle."'";
		$re=mysql_query($sql);
		while($row=mysql_fetch_array($re)){
			$count=$row['count'];
		}
		if(($count>0)&&($newstitle!=$thistitle)){/*有重复且不是本身*/
			echo json_encode(array("success"=>"alreadyhad"));
			mysql_close($link);
			die();
		}
		/*检查是否修改为重复的新闻标题end*/

		$sql = "UPDATE `news` SET `newstitle`='{$newstitle}',`newstype`='{$newstype}',`newsimg`='{$newsimg}',`newstime`='{$newstime}',`newssrc`='{$newssrc}' WHERE `id`={$newsid}";

		$result = mysql_query($sql,$link); 

		echo json_encode(array('update'=>'success','token'=>$token));
	}
	mysql_close($link);
?>