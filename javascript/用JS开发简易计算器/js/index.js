var intResult = document.getElementById("result");
var operation = ""; //操作符
var end = false; //检测数字是否输入结束
var initNum = 0,
    endNum = 0; // 第一个数字 和 第二个数字初始化
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
    } else {
        operation = oper;
        end = true;
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
    intResult.innerHTML = parseFloat(endNum.toFixed(4)); //先四舍五入到4位小数，然后转换到浮点数
}
/* 重置数字为0 */
function clean() {
    intResult.innerHTML = 0;
    if (0 != endNum) {
        endNum = 0;
    } else {
        initNum = 0;
    }
}
