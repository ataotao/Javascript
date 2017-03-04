/**************************************************************************
 * DOM正文
 ***************************************************************************/
console.log('------------访问DOM节点------------');
// 我们来个例子，一个HTML里包含一段文本和一个无序的列表。

var introParagraph = document.getElementById('intro');
console.log(introParagraph);

var allUnorderedLists = document.getElementsByTagName('ul');
console.log(allUnorderedLists);


// 访问无序列表: [0]索引
var unorderedList = document.getElementsByTagName('ul')[0];
console.log(unorderedList);
// 获取所有的li集合:  
var allListItems = unorderedList.getElementsByTagName('li');
console.log(allListItems);
// 循环遍历
for (var i = 0, length = allListItems.length; i < length; i++) {
    // 弹出该节点的text内容
    console.log(allListItems[i].firstChild.data);
}

console.log('------------DOM穿梭------------');
/**
 * “穿梭”这个词主要是用来描述通过DOM查找节点，DOM API提供了大量的节点属性让我们来往上或者往下查询节点。
 * 所有的节点都有这些属性，都是可以用于访问相关的node节点：
 * 
 * Node.childNodes: 访问一个单元素下所有的直接子节点元素，可以是一个可循环的类数组对象。该节点集合可以保护不同的类型的子节点（比如text节点或其他元素节点）。
 * Node.firstChild: 与‘childNodes’数组的第一个项(‘Element.childNodes[0]‘)是同样的效果，仅仅是快捷方式。
 * Node.lastChild: 与‘childNodes’数组的最后一个项(‘Element.childNodes[Element.childNodes.length-1]‘)是同样的效果，仅仅是快捷方式。shortcut.
 * Node.parentNode: 访问当前节点的父节点，父节点只能有一个，祖节点可以用‘Node.parentNode.parentNode’的形式来访问。
 * Node.nextSibling: 访问DOM树上与当前节点同级别的下一个节点。
 * Node.previousSibling: 访问DOM树上与当前节点同级别的上一个节点。
 * 
 */

var theDiv = document.getElementsByTagName('div')[0];
var p = theDiv.firstChild;
var ul = p.nextSibling;
console.log(p);
console.log(ul);
for (var j = 0, len = ul.childNodes.length; j < len; j++) {
    // 弹出该节点的text内容
    console.log(ul.childNodes[j]);
}

/*
但有个非常重要的知识点：那就是元素之间不能有空格，如果ul和li之间有空格的话，就会被认为是内容为空的text node节点，这样ul.childNodes[0]就不是第一个li元素了。相应地，<p>的下一个节点也不是<ul>，因为<p>和<ul>之间有一个空行的节点，一般遇到这种情况需要遍历所有的子节点然后判断nodeType类型，1是元素，2是属性，3是text节点，详细的type类型可以通过此地址 https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType：

    Node.ELEMENT_NODE == 1
    Node.ATTRIBUTE_NODE == 2
    Node.TEXT_NODE == 3
    Node.CDATA_SECTION_NODE == 4
    Node.ENTITY_REFERENCE_NODE == 5
    Node.ENTITY_NODE == 6
    Node.PROCESSING_INSTRUCTION_NODE == 7
    Node.COMMENT_NODE == 8
    Node.DOCUMENT_NODE == 9
    Node.DOCUMENT_TYPE_NODE == 10
    Node.DOCUMENT_FRAGMENT_NODE == 11
    Node.NOTATION_NODE == 12
*/