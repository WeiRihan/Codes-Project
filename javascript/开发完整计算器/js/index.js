var intResult = document.getElementById("result");
var operation = ""; //操作符
var end = false; //检测数字是否输入结束
var initNum = 0,
    endNum = 0, // 第一个数字 和 第二个数字初始化
    operTimes = 0;//操作符次数，实现连续计算功能
intResult.innerHTML = initNum;
/* 数字键函数 */
function num(number) {

    var result = 0;
    if (false == end) {
        result = intResult.innerHTML;
    }
    end = false;
    if ('+/-' == number) //判断是否正负数按键
    {
        if (Number(result) > 0) {
            result = '-' + result; //正数则添加'-'号
        } else {
            result = -Number(result); //负数取反
        }
    } else if ('.' == number) //添加小数点
    {
        result += number;
    } else //添加数字
    {
        result += number;
        result = Number(result); //转换成数字类型，避免出现'01'  
    }

    intResult.innerHTML = result;
}
/* 加减乘除百分数函数 */
function handle(oper) {

    /* 判断是否百分数键*/
    if ("%" == oper) {
        intResult.innerHTML = Number(intResult.innerHTML);
        intResult.innerHTML /= 100;
        operation = "%";
    }
    /*若操作次数不为0，则执行连续计算功能*/
    else if(0 != operTimes)
    {
        equal();
        operation = oper;
        end = true;
    }
    else {
        operation = oper;
        end = true;
        operTimes ++;   //增加操作次数
    }
    initNum = Number(intResult.innerHTML);
}
/* 等于 函数*/
function equal() {

    endNum = Number(intResult.innerHTML);
    switch (operation) {
        case "+":
            endNum += initNum;
            break;
        case "-":
            endNum = initNum - endNum;
            break;
        case "×":
            endNum *= initNum;
            break;
        case "÷":
            {
                if (0 == endNum) //除数为0，显示NaN
                {
                    alert("除数不能为0！");
                    intResult.innerHTML = "NaN";
                    end = true;
                    return;
                }
                endNum = initNum / endNum;
                break;
            }
        default:
            break;
    }
    initNum = 0;
    intResult.innerHTML = parseFloat(endNum.toFixed(6)); //先四舍五入到6位小数，然后转换到浮点数
}
/* 重置数字为0 */
function clean() {
    intResult.innerHTML = 0;
    endNum = 0;
    initNum = 0;
    operTimes = 0;
}

/*sin函数*/
function getSin(){
    initNum = Number(intResult.innerHTML);
    endNum = Math.sin(initNum*Math.PI/180);
    initNum = 0;
    intResult.innerHTML = parseFloat(endNum.toFixed(6)); //先四舍五入到6位小数，然后转换到浮点数
}

/*cos函数*/
function getCos(){
    initNum = Number(intResult.innerHTML);
    endNum = Math.cos(initNum*Math.PI/180);
    initNum = 0;
    intResult.innerHTML = parseFloat(endNum.toFixed(6)); //先四舍五入到6位小数，然后转换到浮点数
}