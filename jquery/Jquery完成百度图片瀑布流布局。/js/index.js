$(document).ready(function() { //加载文档
    $(window).on("load", function() { //监听window的加载事件
        imgLocation();
        var dataImg = { "data": [{ "src": "0.jpg" }, { "src": "9.jpg" }, { "src": "3.jpg" }, { "src": "4.jpg" }, { "src": "5.jpg" }, { "src": "6.jpg" }, { "src": "7.jpg" }] }
            /*鼠标滚动时：*/
        window.onscroll = function() {
                if (scrollside()) {
                    $.each(dataImg.data, function(index, value) {
                        //jQuery动态创建div和img
                        var box = $("<div>").addClass("box").appendTo($("#container")); //创建一个div，添加class，加载到容器中
                        var content = $("<div>").addClass("content").appendTo(box); //创建内容div加载到box中
                        $("<img>").attr("src", "./img/" + $(value).attr("src")).appendTo(content); //创建图片加载到内容中
                        imgLocation(); //新加入的图片遵循瀑布流布局的规则
                    });
                }
            }
            /*窗口大小变化时：*/
        window.onresize = function() {
            imgLocation();
        }
    });

   
});

/*动态加载*/
function scrollside() {
    var box = $(".box");
    var lastboxHeight = box.last().get(0).offsetTop + Math.floor(box.last().height() / 2); //最后一张图片距离顶端的距离加上最后一张图片高度的一半
    var documentHeight = $(document).height(); //当前容器的高度
    var scrollHeight = $(window).scrollTop(); //鼠标滚动的高度
    return (lastboxHeight < scrollHeight + documentHeight) ? true : false;
}

/*瀑布流布局实现*/
function imgLocation() { //确定图片加载的位置
    var box = $(".box"); //创建盒子对象
    var boxWidth = box.eq(0).width(); //获取盒子宽度
    var num = Math.floor($(window).width() / boxWidth); //计算一排可以摆放几个
    var boxArr = []; //获取这一排盒子的高度，好找到最短的一个
    box.each(function(index, value) { //each遍历
        //index是图片位置，value是相对应的元素。
        var boxHeight = box.eq(index).height();

        if (index < num) {
            boxArr[index] = boxHeight;
            /*重新设置第一行的元素位置，避免窗口由小拉大时出错：*/
            $(value).css({
                "position": "absolute",
                "top": 0,
                "left": boxWidth * index
            });
        } else {
            var minboxHeight = Math.min.apply(null, boxArr); //获取最小高度
            //console.log(minboxHeight);
            var minboxIndex = $.inArray(minboxHeight, boxArr); //获取最小高度图片的位置
            // console.log("minboxIndex:"+minboxIndex);
            $(value).css({
                "position": "absolute",
                "top": minboxHeight,
                "left": box.eq(minboxIndex).position().left
            }); //下一张图片摆放在最短图片的下面
            boxArr[minboxIndex] += box.eq(index).height(); //重新计算最短图片的高度
        }
    });
}
