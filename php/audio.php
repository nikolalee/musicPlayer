<?php
	header("Content-type: text/html;charset=utf-8");
	// 连接服务器
	$con = mysqli_connect("localhost","root","","reg1");
	// 选择数据库
	mysqli_query($con,'set names utf8');
	$id = $_GET['id'];
	$sql = "select * from songlist where id='$id'";
	$query = mysqli_query($con,$sql);
	if($query&&$query->num_rows){
		echo json_encode(mysqli_fetch_assoc($query));
	}

?>