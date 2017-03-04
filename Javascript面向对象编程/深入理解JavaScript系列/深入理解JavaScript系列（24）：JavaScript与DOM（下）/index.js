/**************************************************************************
 * 操作元素
 ***************************************************************************/
console.log('------------通过DOM API来改变该元素样式------------');
// document.getElementById('intro').style.color = '#FF0000';

var myDocument = document;
var myIntro = myDocument.getElementById('intro');
var myIntroStyles = myIntro.style;
// 现在，我们可以设置样式了:  
// 唯一区别是CSS属性的名称如果带有-的话，就需要去除，比如用marginTop代替margin-top。
myIntroStyles.color = '#FF0000';
myIntroStyles.padding = '2px 3px 0 3px';
myIntroStyles.backgroundColor = '#FFF';
myIntroStyles.marginTop = '20px';


//通过函数改变样式
function changeStyle(elem, property, val) {
    // 属性可以像数组一样访问，所以利用这个知识我们可以创建一个函数来改变任何给定元素的样式：
    elem.style[property] = val; // 使用[]来访问属性
}

changeStyle(myIntro, 'color', 'blue');  

// 通常DOM操作都是改变原始的内容，这里有几种方式来实现这个，最简单的是使用innerHTML属性，例如：
// 唯一的问题是该方法没在规范里定义，而且在DOM规范里也没有定义，如果你不反感的话请继续使用，因为它比我们下面要讨论其它的方法快多了。

// 替换当前的内容
myIntro.innerHTML = 'New content for the <strong>amazing</strong> paragraph!';  
  
// 添加内容到当前的内容里 
myIntro.innerHTML += '... some more content...';


console.log('-------------------Node节点-----------------------');
// 通过DOM API创建内容的时候需要注意node节点的2种类型，一种是元素节点，一种是text节点，上一章节已经列出了所有的节点类型，这两种需要我们现在特别注意。创建元素可以通过createElement方法，而创建text节点可以使用createTextNode，相应代码如下：
 
// 添加内容
var someText = 'This is the text I want to add';  
var textNode = document.createTextNode(someText);  
myIntro.appendChild(textNode);

// 添加新连接到文本节点
// 首先，创建新连接元素
var myNewLink = document.createElement('a'); // <a/>  
myNewLink.href = 'http://google.com'; // <a href="http://google.com"/>  
myNewLink.appendChild(document.createTextNode('Visit Google')); 
// <a href="http://google.com">Visit Google</a>  
  
// 将内容附件到文本节点
myIntro.appendChild(myNewLink);


// 另外DOM里还有一个insertBefore方法用于再节点前面附件内容，通过insertBefore和appendChild我们可以实现自己的insertAfter函数：

// 'Target'是DOM里已经存在的元素
// 'Bullet'是要插入的新元素
  
function insertAfter(target, bullet) {  
    target.nextSibling ?  
        target.parentNode.insertBefore(bullet, target.nextSibling)  
        : target.parentNode.appendChild(bullet);  
}  

insertAfter(myIntro, textNode);
  
// 使用了3目表达式:  
// 格式：条件?条件为true时的表达式：条件为false时的表达式