$(document).ready(function() {
    $("#login").click(function() {
        var loginName = $("#inputName").val();
        var loginPasswd = $("#inputPassword").val();
        $.ajax({
            url: "./server/login.php",
            type: "post",
            datatype: "json",
            data: {
                "loginName": loginName,
                "loginPasswd": loginPasswd
            },
            success: function(data) {
                if ("ok" == data.result) {
                    window.location = "admin.html";
                    setcookie("token",data.token);

                } else {
                    alert("用户名或密码错误！");
                }
            },
            error: function() {
                alert("网络出错，请刷新页面重新登陆！");
            }
        });
    });

    function setcookie(name, value) {
        var hour = 1;   //设定cookie有效时间为1小时
        var exp = new Date();
        exp.setTime(exp.getTime() + hour * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    }
});
