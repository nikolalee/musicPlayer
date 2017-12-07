<?php
	header("Content-type: text/html;charset=utf-8");
	// 连接服务器
	$con = mysqli_connect("localhost","root","","reg1");
	// 选择数据库
	mysqli_query($con,'set names utf8');
	$mid = $_POST['mid'];
	$text = htmlspecialchars($_POST['text']);//防止代码注入
	$sql = "insert into message(mid,text) values($mid,'$text')";
	$query = mysqli_query($con,$sql);
	if($query){
		echo '{"code":1,"message":"'.$text.'"}';
	}else{
		echo '{"code":0,"message":"fail"}';
	}

?>