function getPage(obj,page,str,fn,total){
	
	//下面的判断使用查看请求的数据应该按那种方式生成页码；
	if(page<=total){
		for(var i=1;i<=page;i++){
			if(i<pageNumber){
				str+='<a href="#movie_content">'+i+'</a>'	
			}else if(i==pageNumber){
				str+='<a class="active" href="#movie_content">'+pageNumber+'</a>'
			}else{
				str+='<a href="#movie_content">'+i+'</a>'
			};	
		};
	}else{
		if(pageNumber<=(total+1)/2){
			for(var i=1;i<=total;i++){
				if(i<pageNumber){
					str+='<a href="#movie_content">'+i+'</a>'	
				}else if(i==pageNumber){
					str+='<a class="active" href="#movie_content">'+pageNumber+'</a>'
				}else{
					str+='<a href="#movie_content">'+i+'</a>'
				};	
			};
		}else if(pageNumber>page-(total-1)/2){
			for(var i=page-total+1;i<=page;i++){
				if(i<pageNumber){
					str+='<a href="#movie_content">'+i+'</a>'	
				}else if(i==pageNumber){
					str+='<a class="active" href="#movie_content">'+pageNumber+'</a>'
				}else{
					str+='<a href="#movie_content">'+i+'</a>'
				};	
			};
		}else{
			for(var i=pageNumber-(total-1)/2;i<=pageNumber+(total-1)/2;i++){
				if(i<pageNumber){
					str+='<a href="#movie_content">'+i+'</a>'	
				}else if(i==pageNumber){
					str+='<a class="active" href="#movie_content">'+pageNumber+'</a>'
				}else{
					str+='<a href="#movie_content">'+i+'</a>'
				};
			};
		};
		
	};

	var a=pageNumber==1?'disable':'';
	var b=pageNumber==page?'disable':'';
	str='<span class='+a+'>首页</span><span class='+a+'>上一页</span>'
			+str+'<span class='+b+'>下一页</span><span class='+b+'>尾页</span>'

	obj.innerHTML=str;
	console.log(obj);
	var fPage=obj.querySelectorAll('a');
	var spans=obj.querySelectorAll('span');
	
	//为每一个页码添加点击事件
	for(var i=0;i<fPage.length;i++){
		fPage[i].onclick=function(){
			this.className='active';
			pageNumber=parseInt(this.innerHTML);
			fn();
		};
	};

	//为上一页和首页添加店家事件
	spans[0].onclick=spans[1].onclick=function(){
		if(pageNumber==1){
			return;
		};
		this.innerHTML=='首页'?pageNumber=1:pageNumber--;
		
		fn();
	};
	//为下一页和尾页添加点击事件
	spans[2].onclick=spans[3].onclick=function(){
		if(pageNumber==page){
			return;
		};
		this.innerHTML=='尾页'?pageNumber=page:pageNumber++;
		fn();
	};
};