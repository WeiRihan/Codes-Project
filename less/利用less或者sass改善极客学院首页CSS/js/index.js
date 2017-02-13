$(function(){
    $("#gototop .top").stop().hide();
    /*top事件*/
    $(window).scroll(function() {
        if ($(window).scrollTop() > 50) {
            $("#gototop .top").stop().fadeIn(1000);
        } else {
            $("#gototop .top").stop().fadeOut(1000);
        }
    });

    $("#gototop .top").click(function() {
        if ($("html").scrollTop()) {
            $("html").animate({ scrollTop: 0 }, 500);
            return false;
        }
        $("body").animate({ scrollTop: 0 }, 500);
        return false;
    });

    $("#gototop .jk-app").hover(function(){
        $("#gototop .jk-app .appewm").stop().show();
    },function(){
        $("#gototop .jk-app .appewm").stop().hide();
    });

    $("#engineerHover a").each(function(){
        $(this).hover(function(){
            $(this).addClass("web-hover");
        },function(){
            $(this).removeClass("web-hover");
        });
    });
});
