// npm install -g mocha
// npm install power-assert --save-dev
// 执行 mocha basic-test.js

var assert = require('power-assert');
describe('Basic Test', function () {
    context('When Callback(high-order function)', function () {
        it('should use `done` for test', function (done) {
            setTimeout(function () {
                assert(true);
                done();
            }, 0);
        });
    });
    context('When promise object', function () {
        it('should use `done` for test?', function (done) {
            var promise = Promise.resolve(1);
            promise.then(function (value) {
                assert(value === 1);
                done();
            });
        });
    });
    context('测试正常失败的示例', function () {
        it("should use `done` for test?", function (done) {
            var promise = Promise.resolve();
            promise.then(function (value) {
                    assert(false);
                })
                // .then(done, done); 也可以这样
                .then(done)
                .catch(done);
        });
    });

});


/*
这段代码将前面 前面使用 done 的例子 按照Mocha的Promise测试方式进行了重写。修改的地方主要在以下两点：
• 删除了 done
• 返回结果为promise对象
采用这种写法的话，当 assert 失败的时候，测试本身自然也会失败。
it("should be fail", function () {
    return Promise.resolve().then(function () {
        assert(false);// => 测试失败
    });
});
采用这种方法，就能从根本上省略诸如 .then(done, done); 这样本质上跟测试逻辑并无直接关系的代码
*/
describe('Promise Test', function () {
    it('should return a promise object', function () {
        var promise = Promise.resolve(1);
        return promise.then(function (value) {
            assert(value === 1);
        });
    });
});

// 意料之外（失败的）的测试结果
function mayBeRejected() {
    return Promise.reject(new Error("woo"));
}
it("is bad pattern", function () {
    return mayBeRejected()
        .catch(function (error) {
            assert(error.message === "woo");
        });
});


// 这个函数用来对返回的promise对象进行测试
// 这个测试的目的包括以下两点：
// mayBeRejected() 返回的promise对象如果变为FulFilled状态的话
// 测试将会失败
// mayBeRejected() 返回的promise对象如果变为Rejected状态的话
// 在 assert 中对Error对象进行检查
// 为了解决这个问题，我们可以在 .catch 的前面加入一个 .then 调用，可以理解为如果调用了 .then 的话，那么测试就需要失败。
function failTest() {
    throw new Error("Expected promise to be rejected but it was fulfilled");
}

function mayBeRejected() {
    return Promise.resolve();
}
it("should bad pattern", function () {
    return mayBeRejected()
        .then(failTest)
        .catch(function (error) {
            assert(error.message === "Expected promise to be rejected but it was fulfilled");
        });
});


// 像这样就能在promise变为FulFilled的时候编写出失败用的测试代码了。
function mayBeRejected() {
    return Promise.resolve();
    // return Promise.reject(new Error("woo"));
}
it("catch -> then", function () {
    // 变为FulFilled的时候测试失败
    return mayBeRejected()
        .then(function () {
            throw new Error("Expected promise to be rejected but it was fulfilled");
        })
        .catch(function (error) {
            assert(error.message === "woo");
        });
});