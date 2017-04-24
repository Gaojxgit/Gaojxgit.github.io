//菜单列表，以及输入框组件
(function($,global){
			var Menu=function(){};
			Menu.prototype={
				constructor:Menu,
				createMenu:function(obj){
					this.obj=obj;
					this.menu=$('<ul><li>新建备忘</li><li>删除备忘</li></ul>')
this.obj.append(this.menu);
var This=this;
this.menu.find('li').first().on('click',function(){
	This.createInput();
	return false;
})
this.menu.find('li').last().on('click',function(){
		This.removeLog();
	})
},
createInput:function(){
	var This=this;
	this.menu.remove();
	this.input=$('<div class="put"><input type=text value=""><input type="button" value="确定"><input type="button" value="取消"></div>')
this.obj.append(this.input);
this.input.find('input[type=text]').focus();
this.input.find('input[type=text]').click(function(){
	return false;
});
this.input.find('input[type=button]').eq(0).click(function(){
	This.createLog();
	return false
})
this.input.find('input[type=button]').eq(1).click(function(){
		This.cancelLog();
	})
},
createLog:function(){
	var val=this.input.find('input[type=text]').val();
if(val.length!=0){
	this.obj.data({
		content:val
	});
	this.obj.css('color','red');
	};
	this.input.remove();
},
cancelLog:function(){
	this.input.remove();
},
removeLog:function(){
	this.obj.data({content:''});
this.obj.css('color','');
			this.menu.remove();
		}
	};

	$.fn.extend({
		menu:function(){
			var newMenu=new Menu();
			console.log(this);
			newMenu.createMenu(this);
		}
	})

})(window.$||window.jQuery,undefined)

	$(function(){
		var cookie=document.cookie;
		console.log(cookie);
		if(cookie.length==0){
			$('.mask').css('display','block');
}

$('.tool').tooltip();
$('.mask').width($(window).width())
			.height($(document).height());

$('.mask .btn').eq(0).on('click',function(){
var name=$('.pop input').eq(0).val();
var value=$('.pop input').eq(1).val();
var newDate=new Date();
var overDate=newDate.setDate(newDate.getDate()+10);
cookieUtil.set(name,value,overDate,'/');
$('.mask').css('display','none');
});
$('.mask .btn').eq(1).on('click',function(){
$('.mask').css('display','none');
})

var timer=null;

time();
function time(){
	var newDate=new Date();
	var hour=newDate.getHours();
	var minute=newDate.getMinutes();
	var second=newDate.getSeconds();
	$('.second').css('transform','rotate('+second*6+'deg)');
$('.minute').css('transform','rotate('+(minute*6+second*0.1)+'deg)');
$('.hour').css('transform','rotate('+(hour*30+minute*0.5+second*0.00833)+'deg)');
}
//时钟
timer=setInterval(function(){
	time();
},1000)

/*var selects=document.querySelectorAll("#choose select");
var direct=document.querySelectorAll("#choose a");
var dhb=document.getElementById("content");*/
var timer;
var x=new Date();
var m=x.getMonth();
var y=x.getFullYear();

//取某个月的天数
function endDay(year,month){
	return new Date(year,month,0).getDate();
}

//取某个月的第一天是星期几
function weekDays(year,month){
	return new Date(year,month,1).getDay();
}

//设置年份和月份
var yearArr='';
for(var i=2030;i>=1970;i--){
	var w=i==y?'color:#159cce;font-size: 16px':'';
yearArr='<option style="'+w+'">'+i+'</option>'+yearArr;
                     //给特定元的不确定元素添加样式的方法
}
$('#choose select').eq(0).html(yearArr).val(y);


var monthArr='';
for(var i=1;i<=12;i++){
	var w=i==(m+1)?'color:#159cce;font-size: 16px':'';
monthArr+='<option style="'+w+'">'+i+'</option>';
}
$('#choose select').eq(1).html(monthArr).val(m+1);				

//改变年份和月份，更改日历内容
$('#choose select').eq(0).on('change',function(){
	y=$(this).val();
	change();
});

$('#choose select').eq(1).on('change',function(){
	m=$(this).val()-1;
	change();
})


//判断页面中数据的分布，本月的第一天
change();
function change(){	
var lastMonth=endDay(y,m);
var curMonth=endDay(y,m+1);
var curWeekDay=weekDays(y,m);
var dayStr='';
var next=1;

curWeekDay=curWeekDay==0?7:curWeekDay;
//本月的第一天四星期日，get day()为0，这样的话，if判断句会丢失上个月的数据。若等于0，将其改为7,。
for(var i=0;i<42;i++){
	if(i<curWeekDay){
		dayStr='<span style="color: #aaa">'+(lastMonth--)+'</span>'+dayStr;	
}
else if(i>=curMonth+curWeekDay){			
	dayStr+='<span style="color: #aaa">'+(next++)+'</span>';
}
else{
	if(m==x.getMonth()&&y==x.getFullYear()){
		var f=(i-curWeekDay+1)==x.getDate()?'active1':'';
	}
		var e=i==curWeekDay?'active2':'';
	dayStr+='<span class="'+e+' '+f+'">'+(i-curWeekDay+1)+'</span>'
	}	
}	
$('#content').html(dayStr);
}

//下一个月
$('#choose a').eq(1).on('click',function(){
m++;
if(m>11){
	m=0;
	y++;
	$('#choose select').eq(0).val(y);
};
$('#choose select').eq(1).val(m+1);
	change();
})

//上一个月
$('#choose a').eq(0).on('click',function(){
m--;
if(m<0){
	m=11;
	y--;
	$('#choose select').eq(0).val(y);
};
$('#choose select').eq(1).val(m+1);
	change();
})


//右键行为，生成菜单列表，利用组件
$('#content span').on('contextmenu',function(ev){					
$('#content span p').remove();
$('#content span ul').remove();
	$(this).menu();
	return false;
})

$('#content span').on('click',function(ev){
$('#content span ul').remove();
if(!$(this).data().content){
	return;
};
var log=$('<p>'+$(this).data().content+'</p>');
	$(this).append(log);
	return false;
})


$(document).on('click',function(){
$('#content span p').remove();
$('#content span .put').remove();
$('#content span ul').remove();
})

var cookieUtil={
	get:function(name){
		var cookieValue=null,
			cookieName=encodeURIComponent(name)+'=',
		cookieStart=document.cookie.indexOf(cookieName);
		
	if(cookieStart>-1){
		var cookieEnd=document.cookie.indexOf(';',cookieStart);
		if(cookieEnd>-1){
			cookieEnd=document.cookie.length;
		};
		cookieValue=document.cookie.substring(cookieStart+cookieName.length,cookieEnd);
		return decodeURIComponent(cookieValue);
	}
	return null;
},
set:function(name,value,expires,path,domain,secure){
	var cookieText=encodeURIComponent(name)+'='+encodeURIComponent(value);
	
	if(expires instanceof Date){
		cookieText+='; expires='+expires.toGMTString();
	};
	if(path){
		cookieText+='; path='+path;
	}
	if(domain){
		cookieText+='; domain='+domain;
	}
	if(secure){
		cookieText+='; secure'
	}
	
	document.cookie=cookieText;
},
unset:function(name,path,domain,secure){
	this.set(name,'',new Date(0),path,domain,secure)
		}
	}
	
})