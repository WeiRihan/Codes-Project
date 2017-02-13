//打开页面的时候，发送请求，刷新新闻列表
$(document).ready(function() {
    var $newsTbody = $(".panel-body>table>tbody");
    refreshNews();
    var repeatFlag = 0;

    //添加新闻
    $("#btnsubmit").click(function(e) {
        e.preventDefault();
        //checkrepeat();
        //输入检查
        if ($("#newsTitle").val() === "" ||
            $("#newsImg").val() === "" ||
            $("#newsTime").val() === "" ||
            $("#newsSrc").val() === "") {
            if ($("#newsTitle").val() === "") {
                $("#newsTitle").parent().addClass("has-error");
            } else {
                $("#newsTitle").parent().removeClass("has-error");
            }
            if ($("#newsImg").val() === "") {
                $("#newsImg").parent().addClass("has-error");
            } else {
                $("#newsImg").parent().removeClass("has-error");
            }
            if ($("#newsTime").val() === "") {
                $("#newsTime").parent().addClass("has-error");
            } else {
                $("#newsTime").parent().removeClass("has-error");
            }
            if ($("#newsSrc").val() === "") {
                $("#newsSrc").parent().addClass("has-error");
            } else {
                $("#newsSrc").parent().removeClass("has-error");
            }
        }
        // else if(repeatFlag){
        //     console.log(repeatFlag);
        //     alert("这条新闻已存在！");
        //     repeatFlag = 0;
        // }
        else {
            $("#newsTitle").parent().removeClass("has-error");
            $("#newsImg").parent().removeClass("has-error");
            $("#newsTime").parent().removeClass("has-error");
            $("#newsSrc").parent().removeClass("has-error");
            //提交添加
            var jsonNews = {
                "newstitle": $("#newsTitle").val(),
                "newstype": $("#newsType").val(),
                "newsimg": $("#newsImg").val(),
                "newstime": $("#newsTime").val(),
                "newssrc": $("#newsSrc").val()
            }
            $.ajax({
                url: "/admin/insert",
                type: "post",
                data: jsonNews,
                datatype: "json",
                success: function(data) {
                    console.log(data);
                    if (data.success == "alreadyhad") {
                        alert("该条新闻重复，请检查！");
                    }
                    refreshNews();
                },
                error: function(XHR, textStatus, errorThrown) {
                    console.log(textStatus + "ready:" + XHR.readyState);
                }
            })
        }
    });

    //删除新闻
    var deleteId = null;
    $newsTbody.on("click", ".btn-danger", function(e) {
        $("#deleteModal").modal("show");
        deleteId = $(this).parent().prevAll().eq(4).html();
        //console.log(deleteId);
    })
    $("#deleteModal #confirmDelete").click(function(e) {
        if (deleteId) {
            console.log("this"+deleteId);
            $.ajax({
                url: "/admin/delete",
                type: "post",
                data: { "newsid": deleteId },
                success: function() {
                    console.log("delete success");
                    $("#deleteModal").modal("hide");
                    refreshNews();
                },
                error:function(xhr,status){
                    console.log(status);
                }
            })
        }
    });

    //修改新闻
    var updateId = null;
    $newsTbody.on("click", ".btn-primary", function(e) {
        $("#updateModal").modal("show");
        updateId = $(this).parent().prevAll().eq(4).html();

        $.ajax({
            url: "/admin/curnews",
            type: "get",
            datatype: "json",
            data: { "newsid": updateId },
            success: function(data) {
                $.each(data, function(index,item) {
                    $("#unewsTitle").val(item.newstitle);
                    $("#unewsType").val(item.newstype);
                    $("#unewsImg").val(item.newsimg);
                    $("#unewsSrc").val(item.newssrc);
                    var utime = item.newstime.split('T')[0];
                    $("#unewsTime").val(utime);
                });

            }

        })
    })
    $("#updateModal #confirmUpdate").click(function(e) {
        $.ajax({
            url: "/admin/update",
            type: "post",
            data: {
                "newstitle": $("#unewsTitle").val(),
                "newstype": $("#unewsType").val(),
                "newsimg": $("#unewsImg").val(),
                "newstime": $("#unewsTime").val(),
                "newssrc": $("#unewsSrc").val(),
                "id": updateId
            },
            success: function(data) {
                if (data.success == "alreadyhad") {
                    alert("该条新闻重复，请检查！");
                }
                $("#updateModal").modal("hide");
                refreshNews();
            }

        })

    });

    function refreshNews() {
        $newsTbody.empty();
        $.ajax({
            type: "get",
            url: "/admin/getnews",
            datatype: "json",
            data: { "newstype": "all" },
            success: function(data) {
                $.each(data, function(index, item) {
                    var $tdid = $("<td></td>").html(item.id);
                    var $tdtype = $("<td></td>").html(item.newstype);
                    var $tdtitle = $("<td></td>").html(item.newstitle);
                    var $tdimg = $("<td></td>").html(item.newsimg);
                    var $tdsrc = $("<td></td>").html(item.newssrc);
                    var $tdtime = $("<td></td>").html(item.newstime);
                    var $tdctrl = $("<td></td>");
                    var $btnupdate = $("<button></button>").addClass("btn btn-primary btn-xs").html("修改");
                    var $btndelete = $("<button></button>").addClass("btn btn-danger btn-xs").html("删除");
                    $tdctrl.append($btnupdate, $btndelete);
                    var $tRow = $("<tr></tr>");
                    $tRow.append($tdid, $tdtype, $tdtitle, $tdimg, $tdsrc, $tdctrl);
                    $newsTbody.append($tRow);
                });
            }
        });
    }

    // function checkrepeat(){
    //     //检查新闻是否重复
    //     console.log("here is 164");
    //     $.ajax({
    //         type: "get",
    //         url: "server/getnews.php",
    //         datatype: "json",
    //         async: false,   //ajax设置为同步
    //         data:{"newstype":"all"},
    //         success: function(data) {

    //             $.each(data, function(index, item) {
    //                 if($("#newsTitle").val() === item.newstitle)
    //                 {
    //                     repeatFlag = 1;
    //                     return false;//跳出each循环，相当于break
    //                 }

    //             });
    //         }
    //     });
    // }

});
