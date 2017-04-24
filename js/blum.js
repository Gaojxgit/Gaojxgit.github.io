var ul=document.querySelector("ul");
var win=$(window);
var render=function(){
	var temp='';
	var padding=2;
	var w=($(window).width()-padding*5)/4;
	var h=($(window).width()-padding*5)/4;

	for(var i=1;i<=17;i++){
		var p=null;
		if(i%4==0){
			p=0;
		}else{
			p=2;
		}
		temp+='<li class="animated bounceIn" data-id='+i+' style="width:'+w+'px;height:'+h+'px;margin-right:'+p+'px;margin-bottom:2px"'+'><canvas id=data_'+i+'></canvas></li>';
		var img=new Image();
		img.src='img/'+i+'.jpg';
		img.index=i;
		img.onload=function(){
			//jquery获取到的是一组元素，加上后缀就可以转为原生的对象
			var canvas=$('#data_'+this.index)[0];
			canvas.width=this.width;
			canvas.height=this.height;
			var context=canvas.getContext('2d');
			context.drawImage(this,0,0);
		};
	};
	$('#container').html(temp);
}
render();

var img_box=$('#img_box');
var bigImage=$('#bigImg');
var loadBig=function(num,callback){
	
	var img=new Image();
	img.src='img/'+num+'.jpg';
	img.onload=function(){
		img_box.show();
		var w=this.width;
		var h=this.height;

		var paddingTop=(win.height()-h*win.width()/w)/2;
		var paddingLeft=(win.width()-w*win.height()/h)/2; 
		
		bigImage.attr('src','img/'+num+'.jpg');
		
		bigImage.css({
				'width':'auto',
				'height':'auto',
				'padding-left':0,
				'padding-top':0
		});
		
		bigImage.attr('class','animated zoomIn');
		
		
		if(w>1.5*h){
			bigImage.css({
				'width':win.width()+'px',
				'padding-top':paddingTop+'px'
			});
		}else{
			bigImage.css({
				'height':win.height()+'px',
				'padding-left':paddingLeft+'px'
			});
		};
		on2=true;
		callback&&callback();
		
	}
}

var num=null;
var on2=true;
$('#container').on('tap','li',function(){	
	if(!on2){
		return;
	};
	on2=false;
	num=$(this).attr('data-id');
	loadBig(num);
})

var on1=true;
$('#img_box').on('tap',function(){	
	if(!on1){
		return;
	};
	on=false;
	$(this).addClass('animated zoomOut');
	this.addEventListener('webkitAnimationEnd',end,false);
	
	function end(){
		$('#img_box')[0].style.display='none';
		$('#img_box').removeClass('animated zoomOut');
		this.removeEventListener('webkitAnimationEnd',end,false);
		on1=true;
	};	
})


$('#img_box').mousedown(function(e){
	e.preventDefault();
});

$('#img_box').swipeLeft(function(){	
	num++;
	if(num>17){
		num=17;
	}
	loadBig(num,function(){
		bigImage.attr('class','animated bounceInRight');
	});
})

$('#img_box').swipeRight(function(){	
	num--;
	if(num<1){
		num=1;
	}
	loadBig(num,function(){
		bigImage.attr('class','animated bounceInLeft');
	});
});
