<?php
	header("Content-type:application/json;charset=utf-8");
	require_once('db.php');
	
	if($link){
		$newstype=$_GET["newstype"];

		if($newstype == "all"){	
			$sql = "SELECT * FROM news";					
		}else{			
			$sql = "SELECT * FROM `news` WHERE `newstype` = '{$newstype}'";	
		}

		$result = mysql_query($sql,$link);
	
		$senddata = array();

		while($row = mysql_fetch_assoc($result)){
			array_push($senddata,array(
					'id'=>$row['id'],
					'newstype'=>$row['newstype'],
					'newsimg'=>$row['newsimg'],
					'newstime'=>$row['newstime'],
					'newssrc'=>$row['newssrc'],
					'newstitle'=>$row['newstitle']
				));
		}
		echo json_encode($senddata);		
	}

	mysql_close($link);

	// $arr = array(
	// 		"newstype" => "百家",
	// 		"newsimg" => "img/2.jpg",
	// 		"newstime" => "2016-11-21",
	// 		"newssrc" => "来源",
	// 		"newstitle" => "新闻标题"
	// 	);
	// echo json_encode($arr);
	
?>