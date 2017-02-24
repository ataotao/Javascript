/**************************************************************************
 * 深入理解JavaScript系列（7）：S.O.L.I.D五大原则之开闭原则OCP
 ***************************************************************************/

/**
 * open for extension（对扩展开放）的意思是说当新需求出现的时候，可以通过扩展现有模型达到目的。而Close for modification（对修改关闭）的意思是说不允许对该实体做任何修改，说白了，就是这些需要执行多样行为的实体应该设计成不需要修改就可以实现各种的变化，坚持开闭原则有利于用最少的代码进行项目维护。
 */

// 创建一个通用的questionCreator函数：
// 该代码的作用组合要是render一个问题，同时提供一个未实现的renderInput方法以便其他function可以覆盖，以使用不同的问题类型
function questionCreator(spec, my) {
    var that = {};

    my = my || {};
    my.label = spec.label;

    my.renderInput = function () {
        throw 'not implemented';
    };

    that.render = function (target) {
        var questionWrapper = document.createElement('div');
        questionWrapper.className = 'question';

        var questionLabel = document.createElement('div');
        questionLabel.className = 'question-label';
        var label = document.createTextNode(spec.label);
        questionLabel.appendChild(label);

        var answer = my.renderInput();

        questionWrapper.appendChild(questionLabel);
        questionWrapper.appendChild(answer);
        return questionWrapper;
    };

    return that;
}

//我们继续看一下每个问题类型的实现代码：
// choiceQuestionCreator函数和inputQuestionCreator函数分别对应下拉菜单和input输入框的renderInput实现，通过内部调用统一的questionCreator(spec, my)然后返回that对象（同一类型哦）。

function choiceQuestionCreator(spec) {

    var my = {},
        that = questionCreator(spec, my);

    // input类型的renderInput实现
    my.renderInput = function () {
        var input = document.createElement('select');
        var len = spec.choices.length;
        for (var i = 0; i < len; i++) {
            var option = document.createElement('option');
            option.text = spec.choices[i];
            option.value = spec.choices[i];
            input.appendChild(option);
        }

        return input;
    };

    return that;
}

function inputQuestionCreator(spec) {

    var my = {},
        that = questionCreator(spec, my);

    my.renderInput = function () {
        var input = document.createElement('input');
        input.type = 'text';
        return input;
    };

    return that;
}

// view对象的代码就很固定了
var view = {
    render: function (target, questions) {
        for (var i = 0; i < questions.length; i++) {
            target.appendChild(questions[i].render());
        }
    }
};

// 所以我们声明问题的时候只需要这样做，就OK了：
var questions = [
    choiceQuestionCreator({
        label: 'Have you used tobacco products within the last 30 days?',
        choices: ['Yes', 'No']
    }),
    inputQuestionCreator({
        label: 'What medications are you currently using?'
    })
];

// 最终的使用代码，我们可以这样来用：
var questionRegion = document.getElementById('questions');

view.render(questionRegion, questions);

// 重构以后的版本的view对象可以很清晰地进行新的扩展了，为不同的问题类型扩展新的对象，然后声明questions集合的时候再里面指定类型就行了，view对象本身不再修改任何改变，从而达到了开闭原则的要求。