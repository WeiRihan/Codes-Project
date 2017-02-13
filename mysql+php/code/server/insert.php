<?php
	header("Content-type:application/json;charset=utf-8");
	require_once('db.php');

	if($link){
		//插入新闻
		$newstitle = addslashes(htmlspecialchars($_POST["newstitle"]));
		$newstype = $_POST["newstype"];
		$newsimg = $_POST["newsimg"];
		$newstime = $_POST["newstime"];
		$newssrc = $_POST["newssrc"];

		/*检查是否插入重复的新闻标题begin*/
		$sql="select count(0) as count from news where newstitle='".$newstitle."'";
		$re=mysql_query($sql);
		while($row=mysql_fetch_array($re)){
			$count=$row['count'];
		}
		if($count>0){
			echo json_encode(array("success"=>"alreadyhad"));
			mysql_close($link);
			die();
		}
		/*检查是否插入重复的新闻标题end*/

		$sql = "INSERT INTO `news` (`newstitle`,`newstype`,`newsimg`,`newstime`,`newssrc`) VALUES ('{$newstitle}','{$newstype}','{$newsimg}','{$newstime}','{$newssrc}')";
		$result = mysql_query($sql,$link); 

		echo json_encode(array("success"=>"ok"));
	}

	mysql_close($link);
?>