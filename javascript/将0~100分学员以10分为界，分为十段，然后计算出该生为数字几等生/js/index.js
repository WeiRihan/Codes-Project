function getRank(){
    var intScore = document.getElementById("userScore").value;
    var strName = document.getElementById("userName").value; 
    intScore = Number(intScore);    //将字符串转换成数字类型

    if((intScore>100) || (intScore<0) || (isNaN(intScore)))
    {
        alert("请输入正确的分数（0-100）！");
    }
    else
    {   
        var rank = 0;
        if (100 == intScore)
        {
            rank = 1;   //100分为1段
        }
        else{
            rank = 10-parseInt(intScore/10);
        }
        document.getElementById("intScore").innerHTML = rank;
        document.getElementById("strStudent").innerHTML = strName;  
    }  
}
