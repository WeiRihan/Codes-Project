$(function() {
    //读取本地存储中的皮肤
    var skinNum = Number(localStorage.getItem('skinNum'));
    switch(skinNum){
        case 0: changeskin(false, 0);break;
        case 1: changeskin(true, 1);break;
        case 2: changeskin(true, 2);break;
        default: changeskin(false, 0);console.log("sd");break;
    }

    //模拟新闻服务器
    var dataNews = [{
        "title": "西伯利亚发现3万年前狮子幼崽 科学家想尝试克隆",
        "origin": "中国台湾网",
        "time": "11-05 10:43"
    }, {
        "title": "与127个国家缔结免签协定 中国护照“含金量”提高",
        "origin": "凤凰网",
        "time": "11-05 16:23"
    }, {
        "title": "日媒：韩国将举行数万人大规模集会要求朴槿惠下台",
        "origin": "凤凰网",
        "time": "11-06 13:43"
    }];
    var timeout;
    $('.morebox').css('height', $(window).height());

    $('.right-nav a').each(function(index) {
        $(this).hover(function() {
            switch (index) {
                case 6:
                    $('.userbox').toggle(); //顶部导航用户弹出框
                    break;
                case 7:
                    $('.setbox').toggle(); //顶部导航设置弹出框
                    break;
                case 8:
                    $('.morebox').toggle(); //顶部导航更多产品
                    break;
                default:
                    break;
            }
        });
    });

    $('.header-wrap>div').each(function(index) {
        $(this).hover(function() {
            if (index <= 2) {
                $(this).toggle();
            }
        });
    });

    //换肤
    $('.skin-hide').click(
        function(e) {
            $('.change-skin').slideUp();
            e.stopPropagation();
        }
    );

    $('.skin').click(
        function(e) {
            $('.change-skin').slideDown();
            //点击其他地方收回皮肤下拉框
            $(document).one('click', function() {
                $('.change-skin').slideUp();
            });
            e.stopPropagation();
        });
    //阻止事件冒泡，防止点击皮肤下拉框时也收回
    $('.change-skin').click(function(e) {
        e.stopPropagation();
    });
    //点击图片换肤
    $('.skin-img').click(
        function() {
            changeskin(true, 1);
            //本地存储当前皮肤
            localStorage.setItem("skinNum", 1);
        }
    );
    $('.skin-img2').click(
        function() {
            changeskin(true, 2);
            //本地存储当前皮肤
            localStorage.setItem("skinNum",2);
        }
    );
    //不使用皮肤
    $('.skin-no').click(
        function() {
            changeskin(false, 0);
            //本地存储当前皮肤
            localStorage.setItem("skinNum",0);
        }
    );

    //tab切换
    $('.content-nav li').each(
        function(index) {
            $(this).click(
                function() {
                    $('div.con-active').removeClass('con-active');
                    $('.content-tab').eq(index).addClass('con-active');
                    $('.content-nav .active').removeClass('active');
                    $(this).addClass('active');
                    if (1 == index) {
                        //新闻滚动加载
                        window.onscroll = function() {
                            if (scrollside()) {
                                $.each(dataNews, function(index, value) {
                                    var box = $('<article>').appendTo('.new-left');
                                    var boxH1 = $('<h1>').appendTo(box);
                                    boxH1.html(value.title);
                                    var boxOrigin = $('<span>').addClass('origin').appendTo(box);
                                    boxOrigin.html(value.origin);
                                    var boxTime = $('<time>').appendTo(box);
                                    boxTime.html(value.time);
                                                                                                    })
                            }
                        }
                    }
                });
        }
    );

    $(".content-tab-title").click(function() {
            $(".myNav").toggle();
            $('em').toggleClass('rotate');
        })
        .hover(function() {
            $('.ul-model').toggle();
        });

    $('.love-div').mouseover(
            function() {
                $(this).css('border-color', 'rgba(0,0,0,0.05)');
            })
        .mouseout(
            function() {
                $(this).css('border-color', '#fcfcfc');
            });

});
//换肤
function changeskin(boolean, num) {
    
    if (true == boolean) {
        var background = 'url(image/skin'+num+'.jpg) ' + 'no-repeat';
        $('body').css({ 'background': background, 'background-size': 'cover' });
        $('.img-logo img').attr('src', 'image/logo_white.png');
        $('header').css('background', 'rgba(15,25,50,.3)');
        $('nav a').css('color', '#fff');
    } else {
        $('body').css('background', '#fff');
        $('body').css('background-attachment', 'fixed');
        $('.img-logo img').attr('src', 'image/bd_logo1.png');
        $('header').css('background', '#fff');
        $('nav a').css('color', '#555');
        $('.more').css('color', '#fff');
    }
}

//动态加载
function scrollside() {
    var art = $('.new-left article');
    var lastartHeight = art.last().get(0).offsetTop + Math.floor(art.height() / 2);
    var documentHeight = $(document).width();
    var scrollHeight = $(window).scrollTop();
    return lastartHeight < documentHeight + scrollHeight;
}
