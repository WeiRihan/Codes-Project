$(document).ready(function() {
    refreshNews("精选");
    $("nav a").click(function(e){
        e.preventDefault();
        $("nav a").removeClass("active");
        $(this).addClass("active");
        var type = $(this).text();
        refreshNews(type);
    })
});

function refreshNews(newsType) {
    var $lists = $("article ul");
    $lists.empty();

    $.ajax({
        url: "/news",
        type: "get",
        datatype: "json",
        data:{"newstype":newsType},
        success: function(data) {
            $.each(data, function(index,item) {
                console.log(item);
                var $lists = $("article ul");
                var $list = $("<li></li>").addClass("news-list").prependTo($lists);
                var $newsImg = $("<div></div>").addClass("news-img").appendTo($list);
                console.log(item.newstype);
                var $img = $("<img>").attr("src", item.newsimg).appendTo($newsImg);
                var $newsContent = $("<div></div>").addClass("news-content").appendTo($list);
                var $h1 = $("<h1></h1>").html(item.newstitle).appendTo($newsContent);
                var $p = $("<p></p>").appendTo($newsContent);
                var $newsTime = $("<span></span>").addClass("news-time").html(item.newstime).appendTo($p);
                var $newsSrc = $("<span></span>").addClass("news-src").html(item.newssrc).appendTo($p);
            });

        },
        error: function(){
            console.log('error');
        }
    });

}
