$(function(){
	var viewWidth = window.screen.availWidth;
	var maxWidth = 640;
	var touchstart = "touchstart";
	var touchend = "touchend";
	var touchmove = "touchmove";
	var music_on = true;
	var audio = $('#audio')[0];
	$box = $('.box');
	$songList = $('.songList');
	var timer1 = null;
	var index = 0;//歌曲列表索引
	var songs = $('.songList').find('li');
	var arr2 = [];//歌词存放数组
	var indx = 0;//歌词索引
	var play = false;//是否播放过歌曲

	function device(){
		//pc,移动设备兼容适配
		var isMobile = /mobile/i.test(navigator.userAgent);
		if(!isMobile){
			//让页面在pc端也能用
			 touchend = 'mouseup';
			 touchstart = 'mousedown';
			 touchmove = 'mousemove';
		}
		if(viewWidth > maxWidth){
			$box.css('width','640px');
			$('.music-details').css('width','640px');
		}
	}
	
	var mainPage = (function(){
		// console.log("hello");
		var downY = 0;
		var onoff3 = true;
		//导入歌曲列表
		function init(){
			importSong();
			scroll();
			bind();
		}
		function importSong(){
			$.ajax({
				url:"php/music.php",
				type:"GET",
				dataType:"json",
				success:function(data){
					var addDiv = "";
					for(var i = 0;i < data.length;i++){
						addDiv += "<li><h4>"+ data[i].song_name +"</h4><span>"+ data[i].singer_name +"</span></li>";
					}
					// data.each(function(index,data0){
					// 	addDiv += "<li><h4>"+ data0.song_name +"</h4><span>"+ data0.singer_name +"</span></li>";
					// })
					$songList.append(addDiv);
				}
			});
		};
		function showSong(data){
			$('#img').find('img').attr('src','img/'+data.img);
			$('#footer').find('h3').html(data.song_name);
			$('#footer').find('p').html(data.singer_name);
		}
		function bind(){
			$songList.delegate('li',touchend,function(){
				if(onoff3){
					// $(this).addClass('active');
					// $(this).siblings('li').removeClass('active');
					// var id = $(this).index()+1;
					play = true;
					index = $(this).index();
					playSong(index);
				}
			})

			$('.play-btn').add('#s-play').on(touchstart,function(){
				if(!play){
					play = true;
					playSong(0);
				}else{
					if(music_on){
						music_play.play();
						detailsPage.setTime($('.time-end'),audio.duration);
					}else{
						music_play.pause();
					}
				}
				return false;
			})
		}
		$('.footer').on(touchstart,function(){
			$('.music-details').addClass('details-display');//向上展开
		})
		function scroll(){
			//防止父级默认行为
			// $(document).on(touchmove,function(e){
			// 	e.preventDefault();
			// });
			//列表移动
			$songList.on(touchstart,function(e){
				var touch = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e;
				// console.log(touch);
				downY = touch.pageY;
				var dTop = $(this).position().top;//鼠标按下时songList顶部位置
				var parentH = $('.main').height();
				var childH = $songList.height();
				var onoff1 = true;
				var onoff2 = true;
				var speed = 0;
				var timer = null;
				var prevY = downY;
				onoff3 = true;

				// console.log("dTop:"+dTop);
				_this = this;
				clearInterval(timer);
				
				$(document).on(touchmove+'.move',function(e){
					onoff3 = false;
					if(childH <= parentH){
						return false;
					}	
					var mTop = $(_this).position().top; 
					var touch = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e;
					var moveY = touch.pageY;

					speed = touch.pageY - prevY;
					prevY = touch.pageY;
					// console.log("childH-parentH:"+(parentH - childH));
					// console.log("mTop:"+mTop);
					if(mTop >= 0 ){
						// if(onoff1){
						// 	onoff1 = false;
						// 	downY = touch.pageY;
						// }
						// console.log("moveY:"+(moveY));
						// console.log("downY:"+(downY));
						if(moveY - downY <= 60){
							$(_this).css('transform','translateY('+(moveY-downY)/3 +'px)');				
						}else{
							$(_this).css('transform','translateY('+60/3 +'px)');				
						}
					}else if(mTop <= parentH - childH){
							if(onoff2){
								onoff2 = false;
								downY = touch.pageY;
							}
							if(moveY - downY >= -60){
								$(_this).css('transform','translateY('+((moveY-downY)/3.0+parentH-childH) +'px)');
							}else{
								$(_this).css('transform','translateY('+((-60/3.0)+parentH-childH) +'px)');
							}
					}else{
							if(moveY-downY+mTop > 0){
								$(_this).css('transform','translateY(0)');
							}else if(moveY-downY+mTop < parentH - childH){
								$(_this).css('transform','translateY('+(parentH - childH) +'px)');
							}else{
								$(_this).css('transform','translateY('+ (moveY-downY+mTop) +'px)');	
							}
					}
				});
				$(document).on(touchend+'.move',function(e){
					$(this).off('.move');
					if(childH <= parentH){
						return false;
					}
					// console.log("mTop1:"+eTop);
					if(!onoff3){
						// console.log("end:"+onoff3);
						clearInterval(timer);
						var eTop = $(_this).position().top;
						timer = setInterval(function(){
						if(speed < 1 || eTop > 60 || eTop < -60 + parentH - childH){
							clearInterval(timer);
							if(eTop > 0){
								$(_this).css('transition','.2s');
								$(_this).css('transform','translateY(0)');
							}else if(eTop < parentH - childH){
								$(_this).css('transition','.2s');
								$(_this).css('transform','translateY('+(parentH - childH) +'px)');
							}
						}else{
							speed *= .9;
							$(_this).css('transform','translateY('+(eTop + speed) +'px)');
						}
					},13);
					}
				})
				return false;
			});
			$('songList').on('transitionend',function(){
				$(this).css('transition','');	
			})
		}
		//音乐列表初始化
		return {
			init:init,
			showSong:showSong
		};
	})();
	// 音乐详情页操作
	var detailsPage = (function(){
		var timer2 = null;
		function showSong(data){
			$('.d-navbar').find('div').html(data.song_name);
			$('.d-navbar').find('span').html(data.singer_name);
			// $('.d-lyric').html(data.lyric);
		}
		function setTime(div,time){
			var min,s;
			min = Math.floor(time%3600/60);
			s = Math.floor(time%60);
			if(min <10 ){
				min = '0'+min;
			}
			if(s < 10){
				s = '0'+s;
			}
			div.html(min+':'+s);
		}
		function lyric_process(data){
			// console.log("data:"+data);
			$('.lyric-content').empty();
			var reg = /\[[^[]+/g;
			var arr = data.match(reg);
			var arr1 = [];
			arr2 = [];
			var temp = [];
			// console.log(typeof(arr[1]));
			for(var i = 0;i < arr.length;i++){
				arr1[i] = [arr[i].substring(0,11),arr[i].substring(11,arr[i].length)];
				// console.log(arr1[i]);
			}
			for(i = 0;i < arr1.length;i++){
				$('.lyric-content').append("<li>"+arr1[i][1]+"</li>");
			}
			// console.log("active");
			for( i = 0;i < arr1.length;i++){
				temp[i] = arr1[i][0].substring(1,arr1[i][0].length-1);
				arr2[i] = temp[i].split(':');
			}
		}
		function lyricActive(data){
			
			// console.log(arr);
			indx = -1;
			for( i = 0;i < arr2.length;i++){
				if(timeFormat(arr2[i]) < data){
					indx++;
				}else{
					break;
				}
			}
			if(indx < arr2.length && indx >= 0){
				// console.log(reg+" "+data);
				$('.lyric-content').find('li').eq(indx).addClass('lyric-active').siblings('li').removeClass('lyric-active');
				if(indx > 3){
						$('.lyric-content').css('transition','.1s');
						$('.lyric-content').css('transform','translateY(-'+(indx-3)*40+'px)');
					}else if(indx <= 3){
						// console.log("hi");
						$('.lyric-content').css('transform','translateY(0px)');
					}
			}
			// for(i = 0;i < arr.length;i++){
			// 	if(i > 0&&timeFormat(arr[i]) > data){
					
			// 		// console.log($('.lyric-content').find('li').eq(i).html());
			// 		// console.log(timeFormat(arr[i])+" "+data);
					
			// 		break;
			// 	}
			// }
		}
		function timeFormat(data){
			// console.log(typeof(parseFloat(data[0]))+" "+typeof(parseFloat(data[1]).toFixed(2)));
			return (parseInt(data[0])*60) + parseFloat(data[1]);
		}
		
		function bind(){
			$('.d-navbar').on(touchstart,function(){
				$('.music-details').removeClass('details-display');//向下收缩
				$('.d-message').css('transform','translateX(100%)');
				$('.d-lyric').add('.d-footer').css('transform','translateX(0)');
				$('.s-slide').find('li').eq(0).addClass('s-active').siblings().removeClass('s-active');
			})
			$('.timeBar').on(touchstart,function(e){
				// var touch = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e;
				if(!play){
					return false;
				}
				var divX = $(this).position().left;
				var _this = this;
				$(document).on(touchmove+'.move',function(e){
					clearInterval(timer1);
					music_play.pause();
					var touch = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e;
					// console.log("pageX:"+touch.pageX);
					var len = touch.pageX - divX;
					var scale = len / parseInt($(_this).css('width'));
					// console.log("len:"+len);
					// console.log("scale:"+scale);
					if(len > parseInt($(_this).css('width'))){
						scale = 1;
					}else if(len < 0 ){
						scale = 0;
					}
					$('.timeBar1').css('width',(scale*100)+'%');
					$('.ball').css('left',(scale*100)+'%');
					audio.currentTime = Math.floor(audio.duration * scale);
					// console.log(audio.currentTime);
				})
				$(document).on(touchend+'.move',function(){
					$(this).off('.move');
					// timer1 = null;
					// timer1 = null;
					music_play.play();
					timer1 = setInterval(function(){
						music_play.playing();
					},100)
				})
				return false;
			})
			$('#s-prev').on(touchstart,function(){
				music_play.prev_song();
			})
			$('#s-next').on(touchstart,function(){
				music_play.next_song();
			})
			$('.music-details').on(touchstart,function(e){
				// $(document).on(touchmove,function(e){
				// 	e.preventDefault();
				// });
				var touch = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e;
				var startX = touch.pageX;
				$(document).on(touchend+'.move',function(e){
					$(this).off('.move');
					var touch = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e;
					var endX = touch.pageX;
					if(endX - startX > 20){
						$('.d-message').css('transform','translateX(100%)');
						$('.d-lyric').add('.d-footer').css('transform','translateX(0)');
						$('.s-slide').find('li').eq(0).addClass('s-active').siblings().removeClass('s-active');
						clearInterval(timer2);
						
					}else if(endX - startX < -20){
						clearInterval(timer2);
						timer2 =  null;
						timer2 = setInterval(function(){
							messagePage.scrollMessage();
						},3000)
						$('.d-message').css('transform','translateX(0)');
						$('.d-lyric').add('.d-footer').css('transform','translateX(-100%)');
						$('.s-slide').find('li').eq(1).addClass('s-active').siblings().removeClass('s-active');
					}
				})
			})
		}
		function init(){
			bind();
		}
		return {
			init:init,
			showSong:showSong,
			setTime:setTime,
			lyric_process:lyric_process,
			lyricActive:lyricActive
			// loadMessage:loadMessage,
			// scrollMessage:scrollMessage
		};
	})();
	//音乐播放
	var messagePage = (function(){
		function bind(){
			$('#m-submit').on(touchstart,function(){//发送留言
				var text = $('#message-area').val();
				$('#message-area').val("");
				// console.log(text);
				if(text!==""&&text!==undefined){
					// console.log("hi");
					addMessage(text);	
				}
			})
		}
		function loadMessage(id){
			$('.message-list').empty();
			$.ajax({
				url:'php/message.php',
				type:'GET',
				dataType:'json',
				data:{id:id},
				success:function(data){
					var addDiv = "";
					for(var i = 0;i < data.length;i++){
						addDiv += "<li>"+ data[i].text +"</li>";
					}
					$('.message-list').append(addDiv);
				}
			})
		}
		function addMessage(text){
			$.ajax({
				url:'php/addMessage.php',
				type:"POST",
				datType:'json',
				data:{mid:index,text:text},
				success:function(data){
					data1 = JSON.parse(data); 
					// console.log(data1.message);
					if(data1.code === 1){
						$('.message-list').prepend("<li>"+ data1.message +"</li>");
					}
				}
			})
		}
		function scrollMessage(){
			var mes = $('.message-list').find('li').last();
			mes.css('opacity',0);
			$('.message-list').prepend(mes);
			setTimeout(function(){
				mes.css('opacity',1)
			},200);
		}
		function init(){
			bind();
		}
		return {
			init:init,
			loadMessage:loadMessage,
			scrollMessage:scrollMessage
		}
	})();
	var playSong =function(index){
		var id = index + 1;
		$box.find('li').eq(index).addClass('active');
		$box.find('li').eq(index).siblings('li').removeClass('active');
		music_play.loadAudio(id);
		messagePage.loadMessage(id);
		music_play.play();
		setTimeout(function(){
				detailsPage.setTime($('.time-end'),audio.duration);
		},200);
	}
	var music_play = (function(){
		function loadAudio(id){
			indx = 0;
			$('.lyric-content').css('transform','translateY(0)');
			$.ajax({
				url:'php/audio.php',
				type:'GET',
				data:{id:id},
				async:false,//iphone适配，解决无法播放问题
				dataType:'json',
				success:function(data){
					// console.log(data);
					mainPage.showSong(data);
					detailsPage.showSong(data);
					audio.src='img/'+data.audio;
					detailsPage.lyric_process(data.lyric);
				}
			})
		}
		function play(){
			music_on = false;
			clearInterval(timer1);
			$('.play-btn').css('background','url(img/list_audioPause.png) 0 0 /cover no-repeat');
			$('#s-play').css('background','url(img/list_audioPause.png) 0 0 /cover no-repeat');
			$('#img img').addClass('roll');
			setTimeout(function(){
				audio.play();
			},100);	
			// timer1 = null;
			timer1 = setInterval(function(){
				// console.log("hello1");
				playing();
			},100)
			$(audio).one('ended',function(){
				next_song();
			})
			// console.log(audio.duration);
		}
		function pause(){
			clearInterval(timer1);
			// timer1 = null;
			music_on = true;
			$('.play-btn').css('background','url(img/details_play.png) 0 0 /cover no-repeat');
			$('#s-play').css('background','url(img/details_play.png) 0 0 /cover no-repeat');
			$('#img img').removeClass('roll');
			audio.pause();
		}
		function timeCount(){
			var divX = $('.timeBar').position().left;
			var scale = audio.currentTime / audio.duration;
			//更新进度条
			$('.timeBar1').css('width',(scale*100)+'%');
			$('.ball').css('left',(scale*100)+'%');
			//歌词滚动
			detailsPage.lyricActive(audio.currentTime);
		}
		function playing(){
			// console.log("playing");
			//播放时间
			detailsPage.setTime($('.time-start'),audio.currentTime);
			timeCount();
		}
		function next_song(){
			songs = $songList.find('li');
			index++;
			if(index > songs.length - 1){
				index = 1
			}
			// console.log("index:"+index);
			// console.log("songs:"+songs.length);
			playSong(index);
		}
		function prev_song(){
			songs = $songList.find('li');
			index--;
			if(index < 0){
				index = songs.length;
			}
			playSong(index);
		}
		return {
			loadAudio:loadAudio,
			play:play,
			pause:pause,
			playing:playing,
			timeCount:timeCount,
			prev_song:prev_song,
			next_song:next_song
		};
	})();
		//页面初始化
	function init(){
		device();
		mainPage.init();
		detailsPage.init();
		messagePage.init();
	}
	init();
});