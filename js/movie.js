
var ban=document.querySelector(".banner");
var btns=ban.querySelectorAll(".btn");
var banname=ban.querySelector(".infor h3");
var bancontent=ban.querySelector(".infor h4");
var bandes=ban.querySelector(".infor em");
var banbg=ban.getElementsByTagName("img");
var pots=ban.querySelectorAll('.pot li');
var content=ban.querySelector('.content');
var tags=document.querySelectorAll(".tag_title p");
var arr=[
	{name:'《绑架者》',
		content:'95分钟 - 动作/犯罪 - 北京111家影院上映280场',
		des:'3.31 警察与绑匪共同找寻真相',
		href:'https://movie.douban.com/subject/26602933/',
		src1:'img/banner1.jpg',
		src2:'img/banner1s.jpg'
	},
	{
	name:'《攻壳机动队》',
		content:'107分钟 - 科幻/动作 - 北京134家影院上映1678场',
		des:'4.7 人体合机，未来已到来！',
		href:'https://movie.douban.com/subject/25818101/',
		src1:'img/banner2.jpg',
		src2:'img/banner2s.jpg'
	}
];
//左右按钮的点击事件
var n=0;
btns[0].onclick=function(ev){
	n--;
	if(n<0){
		n=btns.length-1;
	};
	change();
	ev.cancelBubble=true;
	return false;
}
btns[1].onclick=function(ev){
	n++;
	if(n>btns.length-1){
		n=0;
	};
	change();
	ev.cancelBubble=true;
	return false;
}

//中间导航点的点击事件
for(var i=0;i<pots.length;i++){
	(function(i){
		pots[i].onclick=function(){
			n=i;
			change();	
		}
	})(i);	
}

//更新dom的函数
function change(){
	var timer=null;
	for(var i=0;i<pots.length;i++){
		pots[i].className='';
	banbg[i].title=arr[n].name;
}
pots[n].className='active';
	
	banbg[0].src=arr[n].src1;
	banbg[1].src=arr[n].src2;
	banname.innerHTML=arr[n].name;
	bancontent.innerHTML=arr[n].content;
	bandes.innerHTML=arr[n].des;
	banbg[1].dataset.src=arr[n].href;
}

//自动播放
var timer=null;
timer=setInterval(function(){
	n++;
	if(n>pots.length-1){
		n=0;
	}
	change();	
},3000)

//鼠标移入，停止自动播放
ban.onmouseenter=function(){
	clearInterval(timer);
}
ban.onmouseleave=function(){
	timer=setInterval(function(){
		n++;
		if(n>pots.length-1){
			n=0;
		}
		change();	
	},3000);
};

//点击banner区，跳转到指定页面
content.onclick=function(){
	window.open(arr[n].href,'_blank')
}

//获取最近上映	
var tag_arr=['经典','华语','动作','悬疑','科幻']
var hotbroad=document.querySelector(".movie_list");
var tag_active='经典';
var load_gif=document.querySelector(".load_gif");
var pageNumber=1;
//加载默认的数据
function init(){
	load_gif.style.display='block';
jsonp({
	url:'https://api.douban.com/v2/movie/search',
		data:{
			tag:encodeURI(tag_active),
			start:11*(pageNumber-1)
		},
		succ:function(data){
			load(data);
			paper(data);
		}
	});
}
init();

var pagination=document.getElementById("page");
var page_total=0;		//存放页码总数
function paper(data){
	var arr='';
page_total=Math.ceil(data.total/12);					
if(page_total==1){
	page.innerHTML='';
	return;
};
page_total=page_total>101?101:page_total;

//执行页码生成函数
	getPage(pagination,page_total,arr,init,7)
};

var on='default';
var sort_title=document.querySelectorAll(".sort_title input");
for(var i=0;i<sort_title.length;i++){
	sort_title[i].onclick=function(){
		load_gif.style.display='block';
		on=this.value;
		reload();
	}
}

function reload(){
	switch(on){
		case 'rating':
	var lis=hotbroad.getElementsByTagName("li");
	var newLis=Array.prototype.slice.call(lis);
	newLis.sort(function(a,b){
		return b.dataset.rate-a.dataset.rate;
	});

	for(var i=0;i<lis.length;i++){
		hotbroad.appendChild(newLis[i]);
	};
	load_gif.style.display='none';
	break;
	
	case 'default':
	jsonp({
		url:'https://api.douban.com/v2/movie/search',
			data:{
				tag:encodeURI(tag_active),
				start:11*(pageNumber-1)
			},
			succ:function(data){
				load(data);
				paper(data);
			}
		});
		break;
	}
	
};

//点击不同的分类标签，动态获取数据并载入页面	

for(let i=0;i<tags.length;i++){
	tags[i].onclick=function(){
		pageNumber=1;
		page_total=0;
		load_gif.style.display='block';
	for(var j=0;j<tags.length;j++){
		tags[j].className='';
	};
	this.className='active';
	tag_active=tag_arr[i];
	jsonp({
		url:'https://api.douban.com/v2/movie/search',
			data:{
				tag:encodeURI(tag_active),
				start:11*(pageNumber-1)
			},
			succ:function(data){
				load(data);
				paper(data);
			}
		});
	};
};

function load(data){
	if(data.subjects.length==0){
		return;
	};
	load_gif.style.display='none';
var s='';
	var num=data.subjects.length>12?12:data.subjects.length;
	for(var i=0;i<num;i++){
		s+=`<li class="item" data-num=${data.subjects[i].id} data-rate=${data.subjects[i].rating.average}>
			<a  href='/common.html?id=${data.subjects[i].id}' target='_blank'><img src=${data.subjects[i].images.large} title=${data.subjects[i].title}/></a>
			<p>${data.subjects[i].title} <span>${data.subjects[i].rating.average}</span></p></li>`;	
	}
	hotbroad.innerHTML=s;		
	overMess(data);
}


function overMess(data){
	var lis=hotbroad.getElementsByTagName("li");
	
	for(let i=0;i<lis.length;i++){
		lis[i].on=true;
		lis[i].onmouseenter=function(){
			if(!this.on){
				return;
			};
			this.on=false;
			var about=new createObj();
			about.init(this,data.subjects[i]);
		};
	};
	if(on=='rating'){
		reload();
	}
};



var createObj=function(){
	this.setting={};
};
createObj.prototype={
	constructor:createObj,
	init:function(obj,opt){
		this.obj=obj;
		this.setting=opt;
		this.creat();
	},
	creat:function(){
		var This=this;
		var actors='';
		for(var i=0;i<this.setting.casts.length;i++){
			actors+=`<li>${this.setting.casts[i].name}</li>`;
		}
		var genres='';
		for(var i=0;i<this.setting.genres.length;i++){
			genres+=`<li>${this.setting.genres[i]}</li>`;
		};
		
		this.dom=document.createElement('div');
		this.dom.className='mess';
		this.s=`<a href=${this.setting.alt} target="_blank">${this.setting.title}</a><h4><span style="background:url(img/ic_rating_m.png) 0px 0px no-repeat"></span>${this.setting.rating.average}</h4>
				<ul class="tag"><li>${this.setting.year}</li>${genres}<li>${this.setting.directors[0].name}</li>${actors}</ul>
				<p class="comments">
					原名 : ${this.setting['original_title']}
				</p>`;
			
		this.dom.innerHTML=this.s;
		this.obj.appendChild(this.dom);
		
		if(this.obj.offsetLeft>document.documentElement.clientWidth/2){
			this.dom.style.right='210px';
		}

		var p=this.obj.querySelector('.mess p');
		var span=this.obj.querySelector('.mess h4 span');
		var rate=this.setting.rating.average;
		
		switch(Math.round(rate)){
			case 10:
			span.style['background-position']='0px 0px';
			break;
			
			case 9:
			span.style['background-position']='0px -15px';
			break;
			
			case 8:
			span.style['background-position']='0px -30px';
			break;
			
			case 7:
			span.style['background-position']='0px -45px';
			break;
			
			case 6:
			span.style['background-position']='0px -60px';
			break;
			
			case 5:
			span.style['background-position']='0px -75px';
			break;
			
			case 4:
			span.style['background-position']='0px -90px';
			break;
			
			case 3:
			span.style['background-position']='0px -105px';
			break;
			
			case 2:
			span.style['background-position']='0px -120px';
			break;
			
			case 1:
			span.style['background-position']='0px -135px';
			break;
			
			case 0:
			span.style['background-position']='0px -150px';
			break;
		};
		this.obj.onmouseleave=function(){
			This.leave();
		}
	},
	leave:function(){
		this.obj.removeChild(this.dom);
		this.obj.on=true;
	}
};


//滚动条滚动监听，处理顶部到的导航条的定位方式
var nav=document.querySelector("nav");
window.onscroll=function(){
	if(window.pageYOffset>nav.offsetHeight){
		nav.style.position='fixed';
	}else{
		nav.style.position='relative';
	};
	if(document.body.scrollTop>300){
		get_top.style.display='block';
	}else{
		get_top.style.display='none';
	};	
};

//点击回到顶部函数
var get_top=document.querySelector(".get_top");
get_top.onclick=function(){
	window.scrollTo(0,0);
	this.style.display='none';
};

//用canvas绘制一个货到顶部的按钮
var canvas=document.getElementById("canvas");
if(canvas.getContext){
	var context=canvas.getContext('2d');
	context.scale(0.8,0.8);
	context.translate(8,0)
	context.beginPath();
	context.moveTo(30,0);
	context.lineTo(6,25);
	context.lineTo(54,25);
	context.closePath();
	context.fillStyle='#CCCCCC';
	context.fill();
	
	context.beginPath();
	context.moveTo(20,25);
	context.lineTo(20,50);
	context.lineTo(40,50);
	context.lineTo(40,25);
	context.closePath();
	context.fillStyle='#CCCCCC';
	context.fill();	
};



//jsonp封装函数
function jsonp(obj){
	var setting={
		url:'',
		data:{},
		fn:'callback',
		fnname:'jsonp'+new Date().getTime(),
		succ:function(){},
		fail:function(){}
	};
	
	
	for(var arr in obj){
		setting[arr]=obj[arr];
	}
	//拼接字符串
	setting.data[setting.fn]=setting.fnname;
	var s=[];
	for(var arr in setting.data){
		s.push(arr+'='+setting.data[arr]);
	}
	setting.data=s.join('&');
	
	//创建一个script
	var script=document.createElement('script');
	script.className='sc';
	script.src=setting.url+'?'+setting.data;
	
	//将创建的script标签插入到dom中
	var head=document.getElementsByTagName('head')[0];
	head.appendChild(script);
	window[setting.fnname]=function(data){
		var scripts=head.getElementsByTagName('script');
		for(var i=0;i<scripts.length;i++){
			if(scripts[i].className=='sc'){
				head.removeChild(scripts[i]);
			}
		}
		setting.succ(data);	
	};	
};