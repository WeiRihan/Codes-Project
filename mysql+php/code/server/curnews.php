<?php
	header("Content-type:application/json;charset=utf-8");
	require_once('db.php');

	if($link){
		$newsid = $_GET["newsid"];
		//$newsid = 2;
		$sql = "SELECT * FROM `news` WHERE `id`={$newsid}";
		
		$result = mysql_query($sql,$link);
		
		$senddata = array();

		while($row = mysql_fetch_assoc($result)){
			array_push($senddata,array(
					'id'=>$row['id'],
					'newstype'=>$row['newstype'],
					'newsimg'=>$row['newsimg'],
					'newstime'=>$row['newstime'],
					'newssrc'=>$row['newssrc'],
					'newstitle'=>htmlspecialchars_decode($row['newstitle'])
				));
		}
		echo json_encode($senddata);

	}

	mysql_close($link);
?>