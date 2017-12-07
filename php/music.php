<?php
	header("Content-type: text/html;charset=utf-8");
	// 连接服务器
	$con = mysqli_connect("localhost","root","","reg1");
	// 选择数据库
	mysqli_query($con,'set names utf8');

	$sql = "select singer_name,song_name from songlist ";
	$query = mysqli_query($con,$sql);
	if($query&&$query->num_rows){
		while($row=mysqli_fetch_assoc($query)){
			$data[]=$row;
		}
		echo json_encode($data);
	}

?>