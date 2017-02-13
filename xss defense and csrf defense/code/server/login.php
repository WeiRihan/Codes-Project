<?php
    header('Content-type:application/json; charset=utf-8;');
    error_reporting(0);
    require_once('db.php');
    session_start();
    if($link){
        if ("token" == $_POST['safe']){
            if($_SESSION["token"] == $_POST["token"]){
                $salt = "BAIDUnews*";
                $time = time();
                //token生成
                $token = md5($salt . md5($time . $salt));   
                //token存储在_SESSION中
                $_SESSION["token"] = $token;        
                //发送token至客户端
                echo json_encode(array('result'=>'ok','token'=>$token));
            }
            else{
                echo json_encode(array('result'=>'fail'));
            }
        }else{
            $name = $_POST['loginName'];
            $password = $_POST['loginPasswd'];
            //数据库查询语句
            $sql = "SELECT * FROM `login` WHERE `name` = '{$name}'";
            $result = mysql_query($sql,$link);
            if(!$result){
                echo mysql_error($link);
            }
            //获取数据库查询结果
            $row = mysql_fetch_assoc($result);
             if ($password == $row['password']){
                $salt = "BAIDUnews*";
                $time = time();
                $token = md5($salt . md5($time . $salt));
                $_SESSION["token"] = $token;
                echo json_encode(array('result'=>'ok','token'=>$token));
            }
            else{
                echo json_encode(array('result'=>'fail')); 
            }
        }
    }
         
?>