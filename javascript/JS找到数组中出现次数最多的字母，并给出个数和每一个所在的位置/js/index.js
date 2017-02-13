var strElement = document.getElementById("strElement");
var intCount = document.getElementById("intCount");
var intPosition = document.getElementById("intPosition");
var arrays = document.getElementById("arrays");

function eleCount() {
    var reg = /^[0-9a-zA-Z,]+$/; //只能输入字母数字，且必须有逗号
    if (false == reg.test(arrays.value)) {
        alert("请输入正确的数组，并以逗号(英文)隔开");
        return;
    }
    //var arrTitle = ["a", "x", "b", "d", "m", "a", "k", "m", "p", "j", "a"];
    var arrTitle = arrays.value.split(","); //获取输入框字符串并转为数组    
    var newTitle = arrTitle.concat(); //复制数组
    var elementCount = []; //存储每个元素出现的次数
    var maxPosition = ""; //存储次数最多的元素的位置
    var maxSub = []; //存储出现最多的次数
    var setElement = []; //存储出现次数最多的元素

    for (var temp in newTitle) {
        //将temp转为整数类型，方便计算
        temp = parseInt(temp);
        //数组中每个元素的初始个数为1个
        var count = 1;
        for (var i = temp + 1; i < newTitle.length; i++) {
            //查找数组中相同元素，并增加该个数
            if (newTitle[temp] == newTitle[i]) {
                count++;
                newTitle.splice(i, 1); //相同的元素删除
                i--; //删除元素后数组计数-1
            }
            elementCount[temp] = count;
        }
    }
    //记录出现元素的次数
    var maxCount = Math.max.apply(Math, elementCount);
    for (var temp1 in elementCount) {
        if (maxCount == elementCount[temp1]) {
            maxSub.push(temp1);
        }
    }
    //记录出现最多的元素
    for (var i = 0; i < maxSub.length; i++) {
        setElement.push(newTitle[maxSub[i]]);
    }

    //查找元素在数组中的位置并添加到新数组maxPosition
    for (var i = 0; i < setElement.length; i++) {
        maxPosition += setElement[i] + ":";
        for (var temp2 in arrTitle) {
            if (setElement[i] == arrTitle[temp2]) {
                maxPosition += temp2 + ",";
            }
        }
        //删掉字符串最后一个逗号，并添加一个空格
        maxPosition = maxPosition.substring(0, maxPosition.length - 1);
        maxPosition += " ";
    }

    intCount.innerHTML = maxCount;
    strElement.innerHTML = setElement;
    intPosition.innerHTML = maxPosition;
}
