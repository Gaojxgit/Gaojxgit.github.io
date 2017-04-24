var audio=document.getElementById("music");
	play=document.querySelector('.btns .play')
	fnimgs=document.querySelectorAll('.btns img')
	times=document.querySelectorAll('.pro span');
 	slide=document.querySelector('.bar .slide');
	overslide=document.querySelector('.bar .overslide');
	moveimg=document.querySelectorAll('.moveplay img');
	loop=document.querySelector('.loop span');
	musicbox=document.querySelector(".musicbox");
	musiclist=musicbox.querySelector("ol");
	musics=musiclist.querySelectorAll('li');
	bar=document.querySelector(".scroll");
	scrollbar=document.querySelector(".scrollbar");
	canvas=document.getElementById("canvas");
	volslide=document.querySelector(".volslide");
var arr=[
	"http://m2.music.126.net/2uk3geKVMPirG3t4xuxRfw==/1267736906842385.mp3",
	"http://m2.music.126.net/q7pELlD2GvJapqFrAV37NQ==/1365593456543358.mp3",
	'http://m2.music.126.net/Bard4XiB24xfCTKLZboS3A==/5986840813655679.mp3',
	'http://m2.music.126.net/IA6rwJazx8UB3KDplWCj5Q==/1272134953352149.mp3',
	'http://m2.music.126.net/y85TygvAcfardUZT0c6Zvw==/1095113581278116.mp3',
	'http://m2.music.126.net/GJwb6kG3rOJqfjTnLcwN-A==/1295224697536044.mp3',
	'http://m2.music.126.net/5HMfCB-9og-HXgcWWLelXQ==/2029698464875129.mp3',
	'http://m2.music.126.net/hmEOMnBgRLi_57RZcPseSw==/1293025674280502.mp3',
	'http://m2.music.126.net/e2SmBDNgcPO_-VlK7v9CTQ==/6672936069508064.mp3',
	'http://m2.music.126.net/k62ix7vQacoWWjmiUNeVOA==/2016504325358409.mp3',
	'http://m2.music.126.net/X6eIXS-KEvPn4zeD7VkDOA==/18565253836633865.mp3',
	'http://m2.music.126.net/u3aLckG9AP58CDPrkbeWlg==/6639950720695018.mp3',
	'http://m2.music.126.net/2wgIIvipr8-BlX8gRwS0yQ==/1980220441644038.mp3',
	'http://m2.music.126.net/ZLn4bgi7pH_uSTWFsHtwUA==/3141304720605922.mp3',
	'http://m2.music.126.net/lUS3xx6fx3X14mwsqBuSRQ==/18494885091760342.mp3',
	'http://m2.music.126.net/X6eIXS-KEvPn4zeD7VkDOA==/18565253836633865.mp3',
	'http://m2.music.126.net/u3aLckG9AP58CDPrkbeWlg==/6639950720695018.mp3',
	'http://m2.music.126.net/2wgIIvipr8-BlX8gRwS0yQ==/1980220441644038.mp3',
	'http://m2.music.126.net/ZLn4bgi7pH_uSTWFsHtwUA==/3141304720605922.mp3',
	'http://m2.music.126.net/lUS3xx6fx3X14mwsqBuSRQ==/18494885091760342.mp3'
];

var posX=0;
audio.volume=0.5;
//根据列表的内容多少来判断滚动条的长度和显示与否
if(musicbox.offsetHeight>musiclist.offsetHeight){
	bar.style.display='none';
}else{
	bar.style.display='block';
	scrollbar.style.height=(musicbox.offsetHeight/musiclist.offsetHeight)*bar.offsetHeight*0.2+'px';
}

//歌曲列表上滚动
musicbox.onmousewheel=function(ev){		
	
	if(ev.wheelDelta>0){
		posX+=5;
	}else{
		posX-=5;
	};
	scroll();
}
//拖动列表滚动条
scrollbar.onmousedown=function(ev){			
	var posY=ev.clientY-this.offsetTop;
	var This=this;
	var scale=null;
	document.onmousemove=function(ev){
		var l=ev.clientY-posY;
		if(l<0){
			l=0;
		}else if(l>This.parentNode.offsetHeight-This.offsetHeight){
			l=This.parentNode.offsetHeight-This.offsetHeight;
		}
		scale=l/(This.parentNode.offsetHeight-This.offsetHeight);
		posX=-scale*(musiclist.offsetHeight-musicbox.offsetHeight);
		scroll();
	};
	
	document.onmouseup=function(){					
		document.onmousemove=null;
		document.onmouseup=null;
	};
	return false;
}
//滚动函数
function scroll(){						
	var totalH=musiclist.offsetHeight-musicbox.offsetHeight;
	if(posX<-totalH){
		posX=-totalH
	}else if(posX>0){
		posX=0
	}
	var scale=posX/totalH;
	musiclist.style.top=posX+'px';
	scrollbar.style.top=-scale*(bar.offsetHeight-scrollbar.offsetHeight)+'px';
}

//为播放列表的歌曲添加点击事件
for(let i=0;i<musics.length;i++){			
	musics[i].onclick=function(){
		for(let i=0;i<musics.length;i++){
			musics[i].className='';
		};
		musics[i].className='active';
		n=i;
		audio.src=arr[i];
		audio.oncanplaythrough=function(){
			broad();
		}
	}
}

var context=canvas.getContext('2d');

//播放暂停按钮
play.onclick=function(){					
	if(audio.paused){
		broad();
	}else{
		stop()
	}
	
};

//播放主函数
var balls=[];
var rotate=0;
var timer;
var colors=['#69D2E7','#A7DBD8','#E0E4CC','#F38630','#FA6900','#FF4E50','#F9D423'];
function broad(){							
	clearInterval(timer);
	fnimgs[1].src="img/pause.gif";
	audio.play();
	var totaltime=audio.duration;
	
	var curtime=audio.currentTime;
	times[1].innerHTML=formatTime(parseInt(totaltime/60))+' : '+formatTime(parseInt(totaltime%60));
	times[0].innerHTML=formatTime(parseInt(curtime/60))+' : '+formatTime(parseInt(curtime%60));
	var scale=null;
	moveimg[1].style.transform='rotate(15deg)';				
	
	timer=setInterval(function(){
		times[0].innerHTML=formatTime(parseInt(this.currentTime/60))+' : '+formatTime(parseInt(this.currentTime%60));
		rotate+=0.1;
		moveimg[0].style.transform=`rotate(${rotate+'deg'})`
		
		scale=this.currentTime/totaltime;
		
		slide.style.left=scale*100+'%';
		overslide.style.width=scale*100+'%';
		
		//生成小球的各项数据
		var ball={
			x:Math.random()*6+12,
			y:26,
			r:Math.random()*2+4,
			vx:Math.random()*2-1,
			vy:-Math.random()*2,
			color: colors[Math.floor(Math.random()*colors.length)]
		}
		
		balls.push(ball);
		if(balls.length>10){
			balls.shift();
		}
		
		//新一次画小球的时候,改变晓求得大小和位置
		for(let i=0;i<balls.length;i++){
			balls[i].x=balls[i].x+balls[i].vx;
			balls[i].y=balls[i].y+balls[i].vy;
			balls[i].opacity-=10,
			balls[i].r-=0.5;
			
			if(balls[i].r<1){
				balls.splice(i,1);
			}
		}
		draw()
	}.bind(audio),16);
};

//绘画函数
function draw(){
	context.clearRect(0,0,30,30);
	for(let i=0;i<balls.length;i++){
		context.beginPath();
		context.arc(balls[i].x,balls[i].y,balls[i].r,0,Math.PI*2);
		context.fillStyle=balls[i].color;
		context.globalCompositeOperation='lighter';
		context.fill();
	}
}

//暂停函数
function stop(){	
	audio.pause();
	fnimgs[1].src="img/play.gif";
	clearInterval(timer);
	fnimgs[1].src="img/play.gif";
	moveimg[1].style.transform='rotate(0deg)';
	context.clearRect(0,0,30,30);
}


//在歌曲播放完成后，判断是单曲虫币还是重复播放
var n=0;
audio.onended=function(){					
	if(!audio.loop){
		n++;
		if(n>arr.length-1){
			n=0;
		};
		for(let i=0;i<musics.length;i++){
			musics[i].className='';
		};
		musics[n].className='active';
		audio.src=arr[n];
	}
	audio.oncanplaythrough=function(){
		broad();
	}
}


//如果是单曲循环，就直接从头开始播放，直接跳出函数
var prev=document.querySelector(".prev");
var next=document.querySelector(".next");
prev.onclick=next.onclick=function(){
	if(audio.loop){
		audio.currentTime=0;			
		broad();
		return;
	}

	if(this.className=='prev'){		//判断点击的是上一曲还是下一曲	
		n--;
		n=n<0?arr.length-1:n;
	}else{
		n++;
		n=n>arr.length-1?0:n;
	}
	
	for(let i=0;i<musics.length;i++){	//同时更新播放列表
		musics[i].className='';
	}
	musics[n].className='active';
	
	if(audio.paused){					////判断在点击上一曲或者下一曲是否处于播放状态
		audio.src=arr[n];
		return;
	}
	audio.src=arr[n];
	audio.oncanplaythrough=function(){
		broad();
	}
};

//更改循环模式，单曲循环或者重复循环
loop.onclick=function(ev){				
	audio.loop=!audio.loop;
	console.log(audio.loop);
	if(this.className=='norepeat'){
		this.className='repeat';
	}else{
		this.className='norepeat';
	};
	return false;
	ev.cancelBubble=true;
}

//拖拽组件
function Drag(){
	this.setting={
		play:false,
		vol:false
	}
};

//拖拽原型对象
Drag.prototype={
	constructor:Drag,
	init:function(obj,opt){
		this.obj=obj;
		for(var arr in opt){
			if(this.setting.hasOwnProperty(arr)){
				this.setting[arr]=opt[arr];
			};
		};
		console.log(this.setting.play)
		this.scale=null;
		this.down();
	},
	down:function(){
		var This=this;
		this.obj.onmousedown=function(ev){
			console.log(1);
			This.posX=ev.clientX-this.offsetLeft;
			document.onmousemove=function(ev){
				This.move(ev);
			}
			document.onmouseup=function(){
				This.up();
			}
		};
		
	},
	move:function(ev){
		
		this.l=ev.clientX-this.posX;
		if(this.l<0){
			this.l=0;
		}else if(this.l>this.obj.parentNode.offsetWidth){
			this.l=this.obj.parentNode.offsetWidth;
		}
		
		this.scale=this.l/this.obj.parentNode.offsetWidth;
		this.obj.style.left=this.l+'px';
		this.obj.nextElementSibling.style.width=this.l+'px';
		if(this.setting.play){
			this.play();
		};
		if(this.setting.vol){
			this.vol();
		}
	},
	play:function(){
		context.clearRect(0,0,30,30);
		clearInterval(timer);
		times[0].innerHTML=formatTime(parseInt(audio.duration*this.scale/60))+' : '+formatTime(parseInt(audio.duration*this.scale%60));	
	},
	vol:function(){
		audio.volume=this.scale;
	},
	up:function(){
		if(this.setting.play){
			audio.currentTime=audio.duration*this.scale;
			if(!audio.paused){
				broad();
			}
		}
		
		document.onmousemove=null;
		document.onmouseup=null;
	}
	
};

//生成实例
var playDrag=new Drag();
playDrag.init(slide,{
	play:true
});

//生成实例
var volDrag=new Drag();
volDrag.init(volslide,{
	vol:true
})

function formatTime(v){
	return v<10?'0'+v:v;
}
