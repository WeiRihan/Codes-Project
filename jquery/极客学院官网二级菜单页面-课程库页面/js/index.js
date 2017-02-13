$(function() {
    var ulModel = 0;
    /*导航条hover事件*/
    $(".header_wrap nav li").hover(function() {
        $(this).find(".submenu").stop().toggle();
    });

    /*导航条下拉框内容hover事件*/
    $("header nav .vip-lesson a").hover(function(event) {
        $(this).css("color", "#35b558");
    }, function(event) {
        $(this).css("color", "#666");
    });

    /*搜索点击事件*/
    $("header .icon-box .search-icon").click(function() {
        $("header .searchbox").show().animate({ width: "850px" }, 1000);
        $("header nav").stop().hide();
        $("header .icon-box").stop().hide();
    });

    $("header .searchbox .close-icon").click(function() {
        $("header .searchbox").stop().hide();
        $("header .searchbox").css("width", "0");
        $("header nav").stop().show();
        $("header .icon-box").stop().show();
    });

    /*login hover事件*/
    $(".header_wrap .icon-box span").hover(function() {
        $(this).find(".submenu").stop().toggle();
    });

    /*login下拉框内容hover事件*/
    $(".loginlist .submenu dd").hover(function() {
        $(this).css("background", "#f5f5f5");
        $(this).find("a").css("color", "#35b558");
    }, function() {
        $(this).css("background", "#fff");
        $(this).find("a").css("color", "#666");
    });

    /*左侧栏hover事件*/
    $(".left .bd ul li div").hover(function() {
        $(this).find(".list-show").stop().show();
        $(this).addClass("hover");
    }, function() {
        $(this).find(".list-show").stop().hide();
        $(this).removeClass("hover");
    });

    /*主体导航栏hover事件*/
    $(".wrap .sortMode dl").hover(function() {
        $(this).find("dd").stop().toggle();
        $(this).find("dt i").stop().toggle();
    });

    /*课程列表样式切换*/
    $("article .main .sort .previewMode .kuai-icon").click(function() {
        $("article .main #changelist").removeClass("lesson-list");
        $("article .main #changelist").addClass("lesson-block");
        // $("article .main #changelist").attr('class', 'lesson-block');
        ulModel = 0;
    });

    $("article .main .sort .previewMode .list-icon").click(function() {
        $("article .main #changelist").removeClass("lesson-block");
        $("article .main #changelist").addClass("lesson-list");
        $("article .main #changelist .lesson-infor p").removeAttr("style");
        $("article .main #changelist .learn-number").removeAttr("style");
        $("article .main #changelist .lesson-infor").removeAttr("style");
        $("article .main #changelist .zhongji").removeAttr("style");
        // $("article .main #changelist").attr('class', 'lesson-list');
        ulModel = 1;
    });


    /*课程hover事件*/
    /***********************************************************
     **    问题：                                              **
     **    列式布局和块式需要的hover事件是不一样的。           **                                      
     **    切换成列表样式后，会使用块式布局的动画。            **
     **    使用  .live("hover",function(){})   也无法生效 。   **
     解答：解除DOM事件绑定
     ***********************************************************/
    // /*块式布局*/
    // $(".lesson-block>ul>li").hover(function() {
    //     $(this).find(".lessonplay").css("opacity", "1");
    //     $(this).find("div p").css({
    //         "opacity": "1",
    //         "height": "auto"
    //     });
    //     $(this).find("div p").stop().slideDown();
    //     $(this).find(".learn-number").stop().show();
    //     $(this).find(".lesson-infor").css("height", "auto");
    //     $(this).find(".zhongji").stop().slideDown();
    // }, function() {
    //     $(this).find(".lessonplay").css("opacity", "0");
    //     $(this).find("div p").css({
    //         "opacity": "0",
    //         "height": "0"
    //     });
    //     $(this).find("div p").stop().slideUp();
    //     $(this).find(".learn-number").stop().hide();
    //     $(this).find(".lesson-infor").css("height", "88px");
    //     $(this).find(".zhongji").stop().hide();
    // });
    // /*列式布局*/
    // $(".lesson-list>ul>li").live("hover", function() {
    //     $(this).find(".lessonplay").css("opacity", "1");
    // }, function() {
    //     $(this).find(".lessonplay").css("opacity", "0");
    // });

    $(".lesson-block>ul>li").hover(function() {
        if (0 == ulModel) { /*块式*/
            $(this).find(".lessonplay").css("opacity", "1");
            $(this).find("div p").css({
                "opacity": "1",
                "height": "auto"
            });
            $(this).find("div p").stop().slideDown();
            $(this).find(".learn-number").stop().show();
            $(this).find(".lesson-infor").css("height", "auto");
            $(this).find(".zhongji").stop().slideDown();
        } else { /*列式*/
            $(this).find('.lessonplay').css('opacity', '1');
        }
    }, function() {
        if (0 == ulModel) {
            $(this).find(".lessonplay").css("opacity", "0");
            $(this).find("div p").css({
                "opacity": "0",
                "height": "0"
            });
            $(this).find("div p").stop().slideUp();
            $(this).find(".learn-number").stop().hide();
            $(this).find(".lesson-infor").css("height", "88px");
            $(this).find(".zhongji").stop().hide();
        } else {
            $(this).find(".lessonplay").css("opacity", "0");
        }
    });

    /*底部app下载二维码*/
    $("footer .jkinfor .jk-down .downCon").hover(function() {
        $(this).find("img").stop().toggle();
    });

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



});
