/*
* postil plugin (for jQuery)
* Version: 1.0
* @requires jQuery v1.2 or later
* Created by Gallen Chu ( http://hi.baidu.com/zhuguoneng )
* 缺陷:不能传入options只能内部指定
*/

;(function($) {

    $.fn.postil = function(options) {

        // build main options before element iteration
        var opts = $.extend({}, $.fn.postil.defaults, options);
		// 是否处于可编辑状态 
		var flagEditable = false;
		//显示的容器
		var tipContainer = $("#"+opts.name);
		//用来聚焦光标到文本末尾
		function focusEnd(obj){
			obj.focus();
			try{
				var rng = obj.createTextRange();
				rng.moveEnd("character",obj.value.length);
				rng.moveStart("character",obj.value.length);
				rng.collapse(true);
				rng.select();
			}
			catch(e){
				var tmp=obj.innerHTML;
				obj.innerHTML="";
				obj.focus();
				obj.innerHTML=tmp;
				tmp=null;
			}
		};

		if(tipContainer.length == 0) {
			$("body").append("<div class='gallenTooltipShowder'></div><div class='gallenTooltipWrapper'><div id='"+opts.name+"'></div></div>");
			tipContainer = $("#"+opts.name);
		};
		tipContainer.addClass("gallenTooltip");

		tipContainer.bind("keydown",function(event){
			//Ctrl+Enter进行相关操作
			if (event.ctrlKey && event.keyCode == 13){
				alert("进行相关操作");
				//......
			}
			//回车加入<P>的bug
			if(event.keyCode==13){   
				var textRange=document.selection.createRange();   
				textRange.text="\r\n";   
				textRange.select();   
				return false;     
			} 
			
		});

		tipContainer.css("width",opts.width);
		tipContainer.parent().prev("div").css("width",opts.width+8);

		tipContainer.css("height",opts.height);
		tipContainer.parent().prev("div").css("height",opts.height+8);
	 

		$("body").bind("keydown",function(event){
			if (event.keyCode == 27)
			{
				$(this).focus();
				tipContainer.parent().css("display","none");
				tipContainer.parent().prev("div").css("display","none");
				flagEditable = false;
			}
		});

 
        return this.each(function() {

            var target = $(this);
 
            function mouseover() {
				if (!flagEditable){
					var offset = target.offset(); 
					tipContainer.attr("contentEditable",false);

					tipContainer.parent().css("left",offset.left+target.width());
					tipContainer.parent().css("top",offset.top-16);
					tipContainer.parent().prev("div").css("left",offset.left+target.width()+opts.shawderX+16);
					tipContainer.parent().prev("div").css("top",offset.top+opts.shawderY-16);

					tipContainer.html(target.attr("tiptitle"));
					tipContainer.parent().css("display","block");
					tipContainer.parent().prev("div").css("display","block");
				}	
            };
 
            function mouseout() {
				if (!flagEditable){
					tipContainer.html("");
					tipContainer.parent().css("display","none");
					tipContainer.parent().prev("div").css("display","none");
				}
            };

			function dblclick()
			{
				flagEditable = false;
				mouseover();
				target.unbind("mouseout",mouseout);
				tipContainer.attr("contentEditable",true);
				flagEditable = true;
				focusEnd(tipContainer.get(0));
			};
			

			var sTitle = target.attr("title");
			if (sTitle){

				target.attr("tiptitle", sTitle);
				target.removeAttr("title");
				target.css("background", "#FFFFFF url(./images/postil.gif) no-repeat scroll right top");

				// Bind the related event handlers
				target.bind("mouseover",mouseover);
				target.bind("mouseout",mouseout);
				target.bind("dblclick",dblclick);
			};
            
        });
    };


	// plugin defaults settings
	// put it at last
    $.fn.postil.defaults = {
		name:		'gallenPostil',
		width:		250,
		height:		60,
        shawderX:	6,
        shawderY:	6
    };
 
    
})(jQuery);