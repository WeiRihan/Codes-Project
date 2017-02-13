$(function(){
	$("article ul li span").each(function(){		
		var wordNum = $(this).html().length;
		$(this).css("line-height",5/wordNum);
	});	
});