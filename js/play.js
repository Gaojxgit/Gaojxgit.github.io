
var playarea=document.querySelector(".playarea");
		pot=document.querySelector(".pot");
		snake=document.querySelector(".snake");
		lis=snake.getElementsByTagName('li');
		head=lis[0];
		score=document.querySelector(".v_score");
		over=document.querySelector(".v_over");
		update=document.querySelector(".v_update");
		mode=document.querySelectorAll(".mode button");
		btns=document.querySelectorAll(".control button");
		span=document.querySelector(".message span");
		control={
			37:false,
			38:false,
			39:false,
			40:false
		};
		color=['#69D2E7','#A7DBD8','#E0E4CC','#F38630','#FA6900','#FF4E50','#F9D423']

	//重新载入游戏初始化的信息
	var timer=null;
	function load(){
		//载入的时候将所有控制值设为false
		for(var arr in control){
			control[arr]=false;
		};
		//将得分设为0
		span.innerHTML=0;
		
		//清除按钮样式
		for(let i=0;i<btns.length;i++){
			btns[i].className='';
		};
		//修改初始的值，分别是模式按钮是可否点击，总得分为0，模式为初级，当前碰撞的个数为0
		run=false;
		total_score=0;
		rank_num=0;
		total_number=0;
		
		//清除模式的样式
		for(let i=0;i<mode.length;i++){
			mode[i].className='';
		};
		mode[rank_num].className='active';
		
		//游戏结束，清除多余的小球
		while(--lis.length){
			snake.removeChild(lis[lis.length-1]);
		}
		
		//初始化小球和方块的位置，随机出现
		head.style.left='400px';
		head.style.top='260px';
		pot.style.left=Math.floor(Math.random()*40)*20+'px';
		pot.style.top=Math.floor(Math.random()*25)*20+'px';
		control[Math.floor(Math.random()*4)+37]=true;
		
	};
	load();
	
	//设置不同等级以及对应的分值
	var rank=[{
			speed:400,
			num:1
		},{
			speed:300,
			num:2
		},{
			speed:200,
			num:3
		},{
			speed:100,
			num:4
		},{
			speed:50,
			num:5
		}
		];
	var rank_num=0;
	var run=false;
	var total_score=0;
	var total_number=0
	
	//开始游戏
	btns[0].onclick=function(){
		run=true;
		this.className='active';
		this.nextElementSibling.className='';
		clearInterval(timer);
		timer=setInterval(move,rank[rank_num].speed);
	};
	
	//暂停游戏
	btns[1].onclick=function(){
		this.className='active';
		this.previousElementSibling.className='';
		clearInterval(timer);
	}
	
	//设置不同的级数。最大为4级
	for(let i=0;i<mode.length;i++){
		mode[i].onclick=function(){
			//如果游戏正在运行，阻止按钮点击
			if(run){
				return;
			};
			rank_num=i;
			for(let i=0;i<mode.length;i++){
				mode[i].className='';
			}
			this.className='active';
		}
	}
	
	
	//位置更新
	function move(){
		//每次循环将所有方块的位置更新
		for(var i=lis.length-1;i>0;i--){
			lis[i].style.display='block';
			lis[i].style.left=lis[i-1].offsetLeft+'px';
			lis[i].style.top=lis[i-1].offsetTop+'px';
		}
		
		//判断当前的运动方向
		if(control[37]){
			head.style.left=head.offsetLeft-20+'px';
		}else if(control[38]){
			head.style.top=head.offsetTop-20+'px';
		}else if(control[39]){
			head.style.left=head.offsetLeft+20+'px';
		}else{
			head.style.top=head.offsetTop+20+'px';
		};
		
		//如果碰上要吃的方块，要处理的事件
		if(!(getPos(head).right<=getPos(pot).left||getPos(head).left>=getPos(pot).right||getPos(head).bottom<=getPos(pot).top||getPos(head).top>=getPos(pot).bottom)){
			score.pause();	
			score.play();
			total_number++;
			total_score+=rank[rank_num].num;
			span.innerHTML=total_score;
			
			//撞碎的感觉
			bomb.creat(pot);
			pot.style.left=Math.floor(Math.random()*40)*20+'px';
			pot.style.top=Math.floor(Math.random()*25)*20+'px';
			
			//创建一个新的小球，加到小球的列队中
			var li=document.createElement('li');
			li.className='append_li';
			li.style.display='none';
			li.style.background=color[parseInt(Math.random()*color.length)];
			snake.appendChild(li);
			
			//验证是否具备升级条件，当碰数为10的整数倍，就要升级
			verify(total_number);
		}
		
		//如果碰到墙，结束游戏
		if(head.offsetLeft<0||head.offsetLeft>780||head.offsetTop<0||head.offsetTop>480){
			game_over();
		}
		
		//碰到自己，结束游戏
		for(var i=1;i<lis.length;i++){
			if(!(getPos(head).right<=getPos(lis[i]).left||getPos(head).left>=getPos(lis[i]).right||getPos(head).bottom<=getPos(lis[i]).top||getPos(head).top>=getPos(lis[i]).bottom)){
				game_over();
			}
		}	
	};
	
	function verify(total_number){
		var verfy=total_number.toString();
		if(!(total_number>0&&verfy.charAt(verfy.length-1)=='0')){
			return;
		}
		update.play()
		rank_num++;
		clearInterval(timer);
		timer=setInterval(move,rank[rank_num].speed);
		
		for(let i=0;i<mode.length;i++){
			mode[i].className='';
		};
		mode[rank_num].className='active';
	};	

	
	function game_over(){
		console.log(1);
		over.play();
		clearInterval(timer);
		var obj=new Pop();
		obj.init(
			{
				num:total_score,
				parent:playarea,
				fn:load
			}
		);	
	};
	
	
	
	//失败弹窗
	var Pop=function(){
		this.setting={
			num:null,
			parent:null,
			fn:function(){}
		};
	}
	Pop.prototype={
		constructor:Pop,
		init:function(opt){
			for(var arr in opt){
				this.setting[arr]=opt[arr];
			};
			this.createDom();
		},
		createDom:function(){
			this.dom=document.createElement('div');
			this.dom.className='pop';
			this.dom.innerHTML=`<div class="alert">
							<p>本次得分:<span>${this.setting.num}</span></p>
							<p>
								<button style="padding:0px 10px">重新开始</button>
							</p>
						</div>`;
			this.setting.parent.appendChild(this.dom);
			this.btn=this.setting.parent.querySelector('.pop button');
			this.alert=this.setting.parent.querySelector('.pop');
			this.down();
		},
		down:function(){
			var This=this;
			this.btn.onclick=function(){
				This.setting.fn();
				This.setting.parent.removeChild(This.alert);						
			};
		}
	};
	
	
	
	var bomb={
		creat:function(obj){
			this.obj=document.createElement('div');
			this.obj.style.position='absolute';
			this.obj.style.left=obj.offsetLeft+'px';
			this.obj.style.top=obj.offsetTop+'px';
			this.obj.style.width=obj.offsetWidth+'px';
			this.obj.style.height=obj.offsetHeight+'px';
			this.obj.style['transform-style']='preserve-3d';
			this.obj.style.perspective='800px';
			var x=5;
				y=5;
				s='';
				w=obj.offsetWidth/x;
				h=obj.offsetHeight/y;
			for(var i=0;i<5;i++){
				for(var j=0;j<5;j++){
					s+=`<div style=width:${w}px;height:${h}px;left:${w*j}px;top:${h*i}px;background:red;position:absolute;></div>`
				}
			};
			this.obj.innerHTML=s;
			playarea.appendChild(this.obj);
			this.move();
		},
		move:function(){
			var divs=this.obj.querySelectorAll('div');
			var j=0;
			var This=this;
			for(let i=0;i<divs.length;i++){
				setTimeout(function(){
					var opa=100;
					var timer=null;
					var z=Math.random()*100+300;
					timer=setInterval(function(){
						opa-=5;
						z+=20;
						if(opa<0){
							j++;
							clearInterval(timer);
							This.obj.removeChild(divs[i]);
							if(j==25){
								playarea.removeChild(This.obj);
							}
							return;
						}
						divs[i].style.transform='translateZ('+z+'px)';
						divs[i].style.opacity=opa/100;
					},10);
				},Math.random()*10)		
			};
		}
	};
	
	//按键修改运动方向
	document.onkeydown=function(ev){
		//判断按下当前按键的时候，原来的哪个按键值处于true
		var key=null;
		for(var arr in control){
			if(control[arr]==true){
				key=arr;
			}
		};
		if(ev.keyCode==37||ev.keyCode==38||ev.keyCode==39||ev.keyCode==40){
			//如果按键值的差的绝对值是2，说明他们在做同一个方向的返回运动，游戏直接结束
			if(Math.abs(ev.keyCode-parseInt(key))==2){
				game_over()
			}
			//如果不是，那么就更新运动的方向
			for(var arr in control){
				control[arr]=false;
			};
			control[ev.keyCode]=true;	
		};	
		return false;
	}
	
	function getPos(obj){
		return obj.getBoundingClientRect();
	}
