// 将用户输入转义为正则表达式中的一个字面字符串, 可以通过简单的替换来实现： 
function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|[\]\/\\<>])/g, "\\$&");
    //$&表示整个被匹配的字符串
}
console.log('---------将用户输入转义为正则表达式中的一个字面字符串, 可以通过简单的替换来实现： -----------------');
console.log(escapeRegExp('<html><body><div>123</div></body></html>'));

// 获取html标签内容
/**
 * <
 * [^>!]* 匹配不包含>和-的所有字符  -- 主要是获取这种情况<!-- <script src="../jquery-3.2.1.js"></script> -->
 */
var tags = document.body.innerHTML.match(/<[^>!]*>.*<[^>]*>/gi);
console.log('----------- 获取html标签内容 -----------');
console.log(tags);

//去掉所有的html标记和空格
function delHtmlTag(str) {
    return str.replace(/<[^>-]*>|\s/gi, '');//去掉所有的html标记
}
console.log('----------- 去掉所有的html标记和空格 -----------');
console.log(delHtmlTag(document.body.innerHTML));

//匹配邮箱地址
console.log('----------- 匹配邮箱地址 -----------');
var str = 'tzv-uf@163.com';
var regex = /^([a-z\d-])+@([a-z\d])+(.[a-z\d]+)$/;
// /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/
// /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/
console.log(str.match(regex));


/**
 * 改变输入字符串的顺序
 * 以下例子解释了正值表达式的构成和string.split() 以及 string.replace()的用途。它会整理一个只有粗略格式的含有全名（名字首先出现）的输入字符串，这个字符串被空格、换行符和一个分号分隔。最终，它会颠倒名字顺序（姓氏首先出现）和list的类型。
 */

console.log('----------- 改变输入字符串的顺序 -----------');

// The name string contains multiple spaces and tabs,
// and may have multiple spaces between first and last names.
var names = "Harry Trump ;Fred Barney; Helen Rigby   ; Bill Abel ; Chris Hand ";
var output = ["---------- Original String\n", names + "\n"];
/**
 * 分割names 
 * \s*  0个空格或多个
 * ;
 * \s*  0个空格或多个
 */
var pattern = /\s*;\s*/;
var nameList = names.split(pattern);

/**
 * \w+  一个字符或多个
 * \s+  一个空格或多个
 * \s*  一个字符或多个
 */
pattern = /(\w+)\s+(\w+)/;

var bySurnameList = [];
output.push("---------- After Split by Regular Expression");

var i, len;
for (i = 0, len = nameList.length; i < len; i++) {
    output.push(nameList[i]);
    // 姓氏和名字位置对换
    bySurnameList[i] = nameList[i].replace(pattern, "$2, $1");
}

output.push("---------- Names Reversed");
for (i = 0, len = bySurnameList.length; i < len; i++) {
    output.push(bySurnameList[i]);
}

bySurnameList.sort();
output.push("---------- Sorted");
for (i = 0, len = bySurnameList.length; i < len; i++) {
    output.push(bySurnameList[i]);
}

output.push("---------- End");

console.log(output.join("\n"));

/**
 * 特殊字符检验输入
 * 在以下例子中，我们期望用户输入一个电话号码。当用户点击“Check”按钮，我们的脚本开始检查这些数字是否合法。如果数字合法（匹配正值表达式所规定的字符序列），脚本显示一条感谢用户的信息并确认该数字。如果这串数字不合法，脚本提示用户电话号码不合法。.
 * (?:\d{3}|\(\d{3}\))  包含非捕获括号 (?: 这个正值表达式寻找三个数字字符\d{3} 或者 | 一个左半括号\(跟着三位数字\d{3}, 跟着一个封闭括号 \), (结束非捕获括号 ))， 
 * ([-\/\.])后跟着一个短破折号或左斜杠或小数点，\d{3}随后跟随三个数字字符，当记忆字符 ([-\/\.])捕获并记住，后面跟着三位小数 \d{3}，再后面跟随记住的左斜杠、右斜杠或小数点 \1，  \1 等同于 [-\/\.]
 * d{4} 最后跟着四位小数 \d{4}。
 * 当用户按下Enter设置RegExp.input，这些变化也能被激活。
 */


var re = /(?:\d{3}|\(\d{3}\))([-\/\.])\d{3}\1\d{4}/;
function testInfo(phoneInput) {
    var OK = re.exec(phoneInput.value);
    console.log(OK);
    if (!OK) { 
        console.log(phoneInput.value + ' isn\'t a phone number with area code!'); 
    }
    else { 
        console.log('Thanks, your phone number is ' + OK[0]); 
    }
}
