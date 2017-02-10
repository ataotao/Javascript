//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2017 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  // 创建一个root对象，在浏览器中表示为window（self）对象，在Node.js中表示global对象，
  // 之所以用用self代替window是为了支持Web Worker
  var root = typeof self == 'object' && self.self === self && self ||
            typeof global == 'object' && global.global === global && global ||
            this ||
            {};

  // Save the previous value of the `_` variable.
  // 保存"_"(下划线变量)被覆盖之前的值 undefined 用于_.noConflict() 放弃Underscore 的控制变量"_"。返回Underscore 对象的引用
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  // 原型赋值，便于压缩
  var ArrayProto = Array.prototype, ObjProto = Object.prototype;
  var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

  // Create quick reference variables for speed access to core prototypes.
  // 将内置对象原型中的常用方法赋值给引用变量，以便更方便的引用
  var push = ArrayProto.push,
      slice = ArrayProto.slice,
      toString = ObjProto.toString,
      hasOwnProperty = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  // 定义了一些ECMAScript 5方法
  var nativeIsArray = Array.isArray,
      nativeKeys = Object.keys,
      nativeCreate = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  //建立一个空函数，用于后面baseCreate内构造函数使用
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  // 创建一个下划线对象
  var _ = function(obj) {
    // 如果在"_"的原型链上(即_的prototype所指向的对象是否跟obj是同一个对象，要满足"==="的关系)
    console.log(this, 'var _ = function(obj)');
    if (obj instanceof _) return obj;
    // 如果不是，则构造一个
    if (!(this instanceof _)) return new _(obj);
    // 将underscore对象存放在_.wrapped属性中
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for their old module API. If we're in
  // the browser, add `_` as a global object.
  // (`nodeType` is checked to ensure that `module`
  // and `exports` are not HTML elements.)
  // 针对不同的宿主环境, 将Undersocre的命名变量存放到不同的对象中
  if (typeof exports != 'undefined' && !exports.nodeType) {
    if (typeof module != 'undefined' && !module.nodeType && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    //浏览器
    root._ = _;
  }

  // Current version.
  //版本号
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  // optimizeCb的总体思路就是，传入待优化的回调函数func， 以及迭代回调需要的参数个数argCount，根据参数个数分情况进行优化：
  /** 优化回调(特指函数中传入的回调)
   *
   * @param func 待优化回调函数
   * @param context 执行上下文
   * @param argCount 参数个数
   * @returns {function}
   */
  var optimizeCb = function(func, context, argCount) {
    /**
     * void 运算符通常只用于获取 undefined 的原始值，一般使用 void(0)（等同于 void 0）。
     * 也可以使用全局变量undefined 来代替（假定其仍是默认值）。 undefined === void 0 // true
     * 在ES5之前，window下的undefined是可以被重写的，于是导致了某些极端情况下使用undefined会出现一定的差错。
     * 所以，用void 0是为了防止undefined被重写而出现判断不准确的情况。
     */
    if (context === void 0) return func;
    //argCount为函数参数的个数，针对不同参数个数进行不同的处理
    switch (argCount) {
      //回调函数为单值的情况，例如times函数(times必须传入context才能进入这个步骤)
      case 1: return function(value) {
        return func.call(context, value);
      };
      // The 2-parameter case has been omitted only because no current consumers
      // made use of it.
      //因为2个参数的情况没用被用到，所以在新版中被删除了
      case null:
      //3个参数用于一些迭代器函数，例如map函数
      //这三个参数通常是：
      //value：当前迭代元素的值
      //index：迭代索引
      //collection：被迭代集合
      case 3: return function(value, index, collection) {
        console.log('optimizeCb参数为3');
        return func.call(context, value, index, collection);
      };
      // 4个参数用于reduce和reduceRight函数
      // 这4个参数分别是:
      // accumulator：累加器
      // value：迭代元素
      // index：迭代索引
      // collection：当前迭代集合 那么这个累加器是什么意思呢？在underscore中的内部函数createReducer中，就涉及到了4个参数的情况。该函数用来生成reduce函数的工厂，underscore中的_.reduce及_.reduceRight都是由它创建的：
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    //未设定argCount参数个数的情况，默认
    return function() {
      return func.apply(context, arguments);
    };
  };

  // 针对集合迭代的回调处理
  var builtinIteratee;

  // An internal function to generate callbacks that can be applied to each
  // element in a collection, returning the desired result — either `identity`,
  // an arbitrary callback, a property matcher, or a property accessor.
  // 设置变量保存内置迭代 
  var cb = function(value, context, argCount) {
    // 如果用户修改了迭代器，则使用新的迭代器 
    //自定义iteratee
    //在cb函数的代码中，我们也发现了underscore支持通过覆盖其提供的_.iteratee函数来自定义iteratee，更确切的说，来自己决定如何产生一个iteratee：
    /**
     * 
     * _.iteratee = function(value, context) {
     * // 现在，value为对象时，也是返回自身  
     * if (value == null || _.isObject(value)) return _.identity;
     * if (_.isFunction(value)) return optimizeCb(value, context, argCount);
     * return _.property(value);
     * }
     * 
     */
    if (_.iteratee !== builtinIteratee) return _.iteratee(value, context);
    //// 如果不传value，表示返回等价的自身  如果为空，则返回value本身（identity函数就是一个返回本身的函数 ）
    //如果传入的value为null，亦即没有传入iteratee，则iteratee的行为只是返回当前迭代元素自身，比如
    //var results = _.map([1,2,3]); // => results：[1,2,3]
    if (value == null) return _.identity;
    //如果传入函数，返回该函数的回调 如果为函数，则改变所执行函数的作用域
    //如果传入value是一个function，那么通过内置函数optimizeCb对其进行优化 绑定上下文
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    //如果传入对象，寻找匹配的属性值  如果是对象，判断是否匹配（matcher是一个用来判断是否匹配的）
    // 如果value传入的是一个对象，那么返回的iteratee（_.matcher）的目的是想要知道当前被迭代元素是否匹配给定的这个对象：
    //var results = _.map([{name:'atao'},{name: 'chen',age:33}], {name: 'chen'});
    // => results: [false,true]
    if (_.isObject(value) && !_.isArray(value)) return _.matcher(value);
    // 如果都不是，返回相应的属性访问器 
    // 如果以上情况都不是， 那么传入的value会是一个字面量（直接量），他指示了一个对象的属性key，返回的iteratee（_.property）将用来获得该属性对应的值：
    //var results = _.map([{name:'atao'},{name:'chen'}],'name');
    // => results: ['atao', 'chen'];
    return _.property(value);
  };

  // External wrapper for our callback generator. Users may customize
  // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
  // This abstraction hides the internal-only argCount argument.
  // 通过调用cb函数，生成每个元素的回调
  // 默认的迭代器，是以无穷argCount为参数调用cb函数。用户可以自行修改。
  _.iteratee = builtinIteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // Similar to ES6's rest param (http://ariya.ofilabs.com/2013/03/es6-and-rest-parameter.html)
  // This accumulates the arguments passed into an array, after a given index.
  // 剩余参数（rest parameter）允许长度不确定的实参表示为一个数组
  var restArgs = function(func, startIndex) {
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
    return function() {
      var length = Math.max(arguments.length - startIndex, 0),
          rest = Array(length),
          index = 0;
      for (; index < length; index++) {
        rest[index] = arguments[index + startIndex];
      }
      switch (startIndex) {
        case 0: return func.call(this, rest);
        case 1: return func.call(this, arguments[0], rest);
        case 2: return func.call(this, arguments[0], arguments[1], rest);
      }
      var args = Array(startIndex + 1);
      for (index = 0; index < startIndex; index++) {
        args[index] = arguments[index];
      }
      args[startIndex] = rest;
      return func.apply(this, args);
    };
  };

  // An internal function for creating a new object that inherits from another.
  //内部函数,用于创建一个新的对象，继承自另一个
  var baseCreate = function(prototype) {
    //判断参数是否是对象
    if (!_.isObject(prototype)) return {};
    //如果有原生的就调用原生的
    if (nativeCreate) return nativeCreate(prototype);
    //继承原型
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var shallowProperty = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  var deepGet = function(obj, path) {
    var length = path.length;
    for (var i = 0; i < length; i++) {
      if (obj == null) return void 0;
      obj = obj[path[i]];
    }
    return length ? obj : void 0;
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object.
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  //_.each结构很清晰，如果是数组，就遍历数组调用相应的处理方法，如果是对象的话，就遍历对象调用相应的处理方法。
  //其中判断是否为数组的代码如下：
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  //获取"length"属性
  var getLength = shallowProperty('length');
  //判断是否是数组
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    //optimizeCb( )是underscore内部用来执行函数的很重要的方法
    //改变所执行函数的作用域上下文关系。
    iteratee = optimizeCb(iteratee, context, 3);
    var i, length;
    if (isArrayLike(obj)) {
      //数组处理
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      //对象处理，_.keys(obj)检索object拥有的所有可枚举属性的名称为数组。
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        //根据keys的索引返回重新组装的数据
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  // map和each的区别就是map是将最后的结果以数组的形式返回
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    //判断是否是数组，是的话就将里面的属性取出
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  var createReduce = function(dir) {
    // Wrap code that reassigns argument variables in a separate function than
    // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
    var reducer = function(obj, iteratee, memo, initial) {
      //判断是否是数组
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          //判断迭代方向，dir为1是从左向右迭代，dir为-1是从右向左迭代（从_.reduce和_.reduceRight里就可以清晰的看出来）
          index = dir > 0 ? 0 : length - 1;
      //判断是否存在初始值
      if (!initial) {
        //如果没有初始值，则将第一个设置为初始值，前面判断了是否是数组，是数组返回数组否则返回对象
        memo = obj[keys ? keys[index] : index];
        //根据方向将初始位置赋给index，为了下边遍历使用
        index += dir;
      }
      //进行遍历
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        //进行迭代运算
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    };

    return function(obj, iteratee, memo, context) {
      //通过参数数量判断是否有初始值
      var initial = arguments.length >= 3;
      //调用reducer()
      return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
    };
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  //_.reduce 方法对累加器和数组的每个值应用一个函数 (从左到右)，以将其减少为单个值。
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  // _.reduceRight 方法接受一个函数作为累加器（accumulator），让每个值（从右到左，亦即从尾到头）缩减为一个值。（与 reduce() 的执行方向相反）
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var keyFinder = isArrayLike(obj) ? _.findIndex : _.findKey;
    var key = keyFinder(obj, predicate, context);
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    //遍历数据，将符合条件的存入results数组当中，并返回
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  //_.reject调用了filter，只是做了一个判断条件的取反操作，说明_.reject就是将不符合条件的存入数组并返回
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  //_.every就是判断是否所有的数据都满足条件
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    //判断数组还是对象
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      //数组获取索引，对象获取属性
      var currentKey = keys ? keys[index] : index;
      //如果有不满足条件的就返回false
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  //跟every的判断结构差不多，只不过最后的判断条件不同，some是判断时候有满足条件的，有的话就返回true
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  //判断是否包含对应的值
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    //如果是对象，则将obj的所有值拷贝到数组当中
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    //查找是否存在这个值，如果存在，indexOf 返回相应的索引，则为true，如果不存在，indexOf 返回-1，则为false
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  //对每一个元素都执行一次方法，最后把结果存入数组返回
  _.invoke = restArgs(function(obj, path, args) {
    var contextPath, func;
    if (_.isFunction(path)) {
      func = path;
    } else if (_.isArray(path)) {
      contextPath = path.slice(0, -1);
      path = path[path.length - 1];
    }
    //如果是函数则每个元素都执行一遍方法，如果不是，则返回所有的值，最后结果以数组的形式返回
    return _.map(obj, function(context) {
      var method = func;
      if (!method) {
        if (contextPath && contextPath.length) {
          context = deepGet(context, contextPath);
        }
        if (context == null) return void 0;
        method = context[path];
      }
      return method == null ? method : method.apply(context, args);
    });
  });

  // Convenience version of a common use case of `map`: fetching a property.
  //_.pluck的作用就是获取数据对象中的相应属性，然后存在数组当中返回
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  //_.where就是遍历数据，然后返回所有满足条件的键值对，存在数组当中
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  //_.findWhere和where不同的是只返回第一个满足条件的
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  //获取obj中的最大值
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    //如果没有iteratee
    if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object') && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      //循环遍历求出最大值
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value > result) {
          result = value;
        }
      }
    } else {
      //有iteratte的情况
      iteratee = cb(iteratee, context);
      _.each(obj, function(v, index, list) {
        //迭代出的最大值结果
        computed = iteratee(v, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  //获取最小值，跟max差不多
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    //如果没有iteratee
    if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object') && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      //循环遍历求出最小值
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value < result) {
          result = value;
        }
      }
    } else {
      //有iteratte的情况
      iteratee = cb(iteratee, context);
      _.each(obj, function(v, index, list) {
        //迭代出的最小值结果
        computed = iteratee(v, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection.
  // _.shuffle调用_.sample函数，并且出入infinity参数，来实现返回一个乱序的数组
  _.shuffle = function(obj) {
    return _.sample(obj, Infinity);
  };

  // Sample **n** random values from a collection using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  //从数组中取出随意样本，如果有n则从被打乱的数组中返回前n个数据，如果没有则返回一个随机样本
  _.sample = function(obj, n, guard) {
    //判断是否有n这个参数，如果没有
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      //随机取一个随机样本
      return obj[_.random(obj.length - 1)];
    }
    var sample = isArrayLike(obj) ? _.clone(obj) : _.values(obj);
    var length = getLength(sample);
    n = Math.max(Math.min(n, length), 0);
    var last = length - 1;
    //下面就是一个打乱数组顺序的过程
    for (var index = 0; index < n; index++) {
      //生成一个随机的索引
      var rand = _.random(index, last);
      var temp = sample[index];
      sample[index] = sample[rand];
      sample[rand] = temp;
    }
    //最后返回前n个
    return sample.slice(0, n);
  };

  // Sort the object's values by a criterion produced by an iteratee.
  //_.sortBy 就是一个返回按需排序后的数组，这个函数结构看上去挺复杂，其实拆分来看，就是调用_.pluck获取对象的属性值，然后里面是_.map.sort()来做一个排序，最后返回一个数组，这样拆分完是不是清晰了不少。
  //不理解sort的可以点击这里：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  _.sortBy = function(obj, iteratee, context) {
    var index = 0;
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, key, list) {
      return {
        value: value,
        index: index++,
        criteria: iteratee(value, key, list)
      };
    }).sort(function(left, right) {
      //先用criteria比较
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      //如果相等再用index来排序
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  /**
   * group第一眼一看也是有点复杂，函数里面返回函数，然后behavior参数还是个函数
   * 结构简化之后其实就是下面这样：
   * function A(B){
   *      return function(){
   *          B(); 
   *      }
   * }
   * 从return的函数里面来看就是遍历obj取出相应的key，然后把它传给behavior中，具体behavior这里怎么理解，放到下面groupBy一起说，容易理解一些
   */
  var group = function(behavior, partition) {
    return function(obj, iteratee, context) {
      //判断是否需要拆分为两个数组，这个在下面介绍_.partition的时候具体解释
      var result = partition ? [[], []] : {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  //_.groupBy的作用就是根据相应的参数将集合进行分组
  //_.groupBy就是调用了group函数，把group融合到其中更容易理解一些
  /**
   * 这样看group的结构彻底清晰了
   * _.groupBy = function(obj, iteratee, context) {
   *       var result = partition ? [[], []] : {};
   *       iteratee = cb(iteratee, context);
   *       _.each(obj, function(value, index) {
   *         var key = iteratee(value, index, obj);
   *         if (_.has(result, key)) result[key].push(value); else result[key] = [value];
   *       });
   *       return result;
   *  };
   */
  _.groupBy = group(function(result, value, key) {
    //判断result中是否有key值，如果有则加入value，如果没有将把value放入数组当中
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  //返回每一项索引的对象
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  // 这个就是返回符合条件的对象数量
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    //如果为空，返回空数组
    if (!obj) return [];
    //如果是数组，拷贝数组
    if (_.isArray(obj)) return slice.call(obj);
    if (_.isString(obj)) {
      // Keep surrogate pair characters together
      // 如果是字符串，则利用正则表达式提取匹配项
      return obj.match(reStrSymbol);
    }
    //如果类数组，通过map方法转化数组
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    //对象，取出属性值存入数组
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    //判断是否为空
    if (obj == null) return 0;
    //如果是数组则返回数组长度，如果是对象返回属性的数量
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  //这就是一个按要求把一个数组拆分成两个的函数，调用group函数，遍历数组，将符合条件的放在第一个数组当中，不符合的放在第二个函数当中
  _.partition = group(function(result, value, pass) {
    result[pass ? 0 : 1].push(value);
  }, true);

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  //first就是取前几个元素的作用，调用了initial函数
  _.first = _.head = _.take = function(array, n, guard) {
    //参数判空处理
    if (array == null || array.length < 1) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  //返回筛选后的数组，n是第几个开始，如果n不存在那么就是array.length-1，也就是数组全拷贝一遍，Math.max是为了规避负数的情况
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  //返回最后n个元素，结构跟first差不多
  _.last = function(array, n, guard) {
    if (array == null || array.length < 1) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  //_.rest是获取第n个元素之后的元素
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, Boolean);
  };

  // Internal implementation of a recursive `flatten` function.
  //flatten作用就是将多维数组合并成一维数组，如果参数shallow为true的话，就只合并一次
  var flatten = function(input, shallow, strict, output) {
    //output是存放结果的数组
    output = output || [];
    var idx = output.length;
    //遍历input，input是要处理的数组
    for (var i = 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      //判断是不是数组或者arguments对象
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        // 是否只合并一次
        // Flatten current level of array or arguments object.
        if (shallow) {
          var j = 0, len = value.length;
          while (j < len) output[idx++] = value[j++];
        } else {
          //如果不是，则递归调用flatten
          flatten(value, shallow, strict, output);
          idx = output.length;
        }
        //如果不是数组，并且是非严格的
      } else if (!strict) {
        //直接将value拷贝到output数组当中
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = restArgs(function(array, otherArrays) {
    return _.difference(array, otherArrays);
  });

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  //就是一个去重的函数，分别对有序的，对象和普通三种情况分别进行处理
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    //如果没有isSorted参数则对参数进行调整
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    //参数不为空，生成回调函数
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];//缓存数据用的
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      //如果是排序好的
      if (isSorted) {
        //因为是排序好的，按顺序比较就好了
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        //处理对象，computed是上面回调函数返回的结果，然后比较，没有就添加
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
        //判断result里是否有value，如果没有就添加
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = restArgs(function(arrays) {
    return _.uniq(flatten(arrays, true, true));
  });

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  //作用就是去数组的交集，就是拿第一个数组中每一个元素跟后面的数组作比较
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    //遍历第一个数组
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      //判断result中是否有
      if (_.contains(result, item)) continue;
      var j;
      //遍历其他数组
      for (j = 1; j < argsLength; j++) {
        //如果其他数组中，存在没有的情况就结束循环
        if (!_.contains(arguments[j], item)) break;
      }
      //如果循环完，说明每个里面都有，那么就是我们想要的交集结果
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  //作用是剔除第一数组中其他数组也有的元素，它是先调用flatten将其合并，再调用filter选出符合条件的，里面的条件是!_.cotains，也就是不存在的，所以最后取出的就是剔除完之后的元素数组了
  _.difference = restArgs(function(array, rest) {
    rest = flatten(rest, true, true);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  });

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices.
  _.unzip = function(array) {
    //取出一个最大长度值
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);
    //循环取出每个数组中相同位置的元素，最后组成一个新的二维数组
    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = restArgs(_.unzip);

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values. Passing by pairs is the reverse of _.pairs.
  //将数组转换为对象。传递任何一个单独[key, value]对的列表，或者一个键的列表和一个值的列表。 如果存在重复键，最后一个值将被返回。
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions.
  //创建findIndex和findLastIndex功能
  var createPredicateIndexFinder = function(dir) {
    return function(array, predicate, context) {
      //迭代函数
      predicate = cb(predicate, context);
      var length = getLength(array);
      //判断遍历方向，dir为1是从左向右，dir为-1是从右向左
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        //遍历返回符合条件的是第几个
        if (predicate(array[index], index, array)) return index;
      }
      //否则返回-1
      return -1;
    };
  };

  // Returns the first index on an array-like that passes a predicate test.
  //调用上面的createPredicateIndexFinder内部函数，两者只是遍历的方向不同，最终返回相应的索引
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  //_.sortedIndex看过源码就可以看出是二分法查找
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions.
  var createIndexFinder = function(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        //判断方向，1是从前到后，-1则为从后到前
        if (dir > 0) {
          i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        //如果是排序好的就使用二分法
        idx = sortedIndex(array, item);
        //判断找出的值是否一样，是就返回这个值，否则返回-1
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        //对item为NaN的处理
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        //通过遍历的方法找出item对应的索引
        if (array[idx] === item) return idx;
      }
      //找不到则返回-1
      return -1;
    };
  };

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  //作用是按需生成一个整数数组
  _.range = function(start, stop, step) {
    //判断是否有stop参数
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    //step参数不存在的时候赋予默认值
    if (!step) {
      step = stop < start ? -1 : 1;
    }
    //获取数组长度
    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      //数组赋值
      range[idx] = start;
    }

    return range;
  };

  // Split an **array** into several arrays containing **count** or less elements
  // of initial array.
  _.chunk = function(array, count) {
    //如果count为空或小于1，则返回空
    if (count == null || count < 1) return [];

    var result = [];
    var i = 0, length = array.length;
    while (i < length) {
      //进行拆分
      result.push(slice.call(array, i, i += count));
    }
    return result;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments.
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    //判断boundFunc 是否在callingContext 的原型链上
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    //创建实例
    var self = baseCreate(sourceFunc.prototype);
    //对实例进行apply操作
    var result = sourceFunc.apply(self, args);
    //如果是对象则返回对象
    if (_.isObject(result)) return result;
    //否则返回实例本身
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = restArgs(function(func, context, args) {
    //如果不是函数抛异常
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var bound = restArgs(function(callArgs) {
      //调用executeBound方法，具体解释见下方
      return executeBound(func, bound, context, this, args.concat(callArgs));
    });
    return bound;
  });

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder by default, allowing any combination of arguments to be
  // pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
  _.partial = restArgs(function(func, boundArgs) {
    //占位符
    var placeholder = _.partial.placeholder;
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      //循环遍历boundArgs
      for (var i = 0; i < length; i++) {
        //判断是否是占位符，如果是就把arguments里的第一个放进去（按顺序以此类推），
        //如果不是占位符就正常把boundArgs里的数据再拷贝一份到args中
        args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
      }
      //循环遍历完boundArgs，就是把剩下的数据放入到args当中，这里调用executeBound，executeBound的分析可以看上面
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  });

  _.partial.placeholder = _;

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  // 多个方法绑定到对象上
  _.bindAll = restArgs(function(obj, keys) {
    keys = flatten(keys, false, false);
    var index = keys.length;
    //如果没有 function names抛异常
    if (index < 1) throw new Error('bindAll must be passed function names');
    while (index--) {
      var key = keys[index];
      //调用bind方法进行绑定
      obj[key] = _.bind(obj[key], obj);
    }
  });

  // Memoize an expensive function by storing its results.
  //作用是缓存函数的计算结果，再做里面有重复运算的情况优化效果比较明显
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      //缓存值
      var cache = memoize.cache;
      //是否使用hashFunction，如果使用就把hashFunction的返回值作为缓存的key值
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      //如果没有就做一个缓存的操作
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      //最后返回缓存值
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  //就是对setTimeout的封装，一目了然就不做过多解释了
  _.delay = restArgs(function(func, wait, args) {
    return setTimeout(function() {
      return func.apply(null, args);
    }, wait);
  });

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  // 就是让这段程序最后执行，也是调用setTimeout来实现的，这里“_”是函数参数的占位，1是时间1毫秒。不懂的可以去看看setTimeout的机制，如果这里再展开的话篇幅过长，有时间也可以写一篇setTimeout的文章
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  // _.throttle的作用是控制函数的执行频率，第一次执行的时候previous默认为零，那么remaining就是负数，没有定时器，之后当remaining大于0时，启动定时器，
  // 当定时器的时间到的时候，执行定时器里面的函数，并且会请一次timeout，remaining此时大于零并且timeout为空，则进入else if再次生成一个setTimeout。
  // remaining > wait也就意味着now < previous，这是为了规避用户改变系统是简单的情况，这时候需要清除timeout的操作。
  _.throttle = function(func, wait, options) {
    var timeout, context, args, result;
    //previous是缓存的上一次执行的时间点，默认为0
    var previous = 0;
    //判断是否有配置参数
    if (!options) options = {};

    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      //清除timeout
      timeout = null;
      //储存函数执行的结果
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };

    var throttled = function() {
      //当前时间
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      //wait是setTimeout延迟的时间
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        //缓存当前时间
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        //生成定时器
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
    //清除操作
    throttled.cancel = function() {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    };

    return throttled;
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  //_.debounce也是函数节流，但是与throttle不同的是debounce中两个函数的时间间隔不能小于wait，这样的话定时器就会被重新创建
  _.debounce = function(func, wait, immediate) {
    var timeout, result;

    var later = function(context, args) {
      timeout = null;
      if (args) result = func.apply(context, args);
    };

    var debounced = restArgs(function(args) {
      //判断是否立即调用
      if (timeout) clearTimeout(timeout);
      if (immediate) {
        //如果立即调用则，立即执行函数
        var callNow = !timeout;
        timeout = setTimeout(later, wait);
        if (callNow) result = func.apply(this, args);
      } else {
        //如果本次调用时，上一个定时器没有执行完，将再生成一个定时器
        timeout = _.delay(later, wait, this, args);
      }

      return result;
    });

    debounced.cancel = function() {
      clearTimeout(timeout);
      timeout = null;
    };

    return debounced;
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  // 作用就是把func当做参数传给wrapper执行，_.partial前文介绍过，就是给函数设置一些默认的参数
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  //_.negate就是一个取反的函数
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  //_.compose的作用就是组合复合函数，结构就是从最后一个函数开始执行，然后返回结果给前一个函数调用，直到第一个。
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      //从后往前调用
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  //原理很简单，就是只有调用到最后一次的时候才开始执行里面的函数
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  // _.before的作用是限制函数的调用次数，最后一次调用清空fun，返回上一次调用的结果
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        //正常调用，记录返回值
        memo = func.apply(this, arguments);
      }
      //最后一次调用时，清空fun
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  // _.once调用了_.before并且times参数为2，说明无论调用几次，只返回第一次的调用结果
  _.once = _.partial(_.before, 2);

  _.restArgs = restArgs;

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  //其中IE9以下枚举bug兼容处理源码如下：
  //判断是否存在枚举bug
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  //不可枚举的属性如下
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  var collectNonEnumProps = function(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = _.isFunction(constructor) && constructor.prototype || ObjProto;

    // Constructor is a special case.
    // Constructor单独处理部分.
    var prop = 'constructor';
    //如果对象和keys都存在constructor属性，则把他存入keys数组当中
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      //如果obj对象存在上面数组里那些不可枚举的属性但是不在原型中，并且keys数组里面也没有的话
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        //将其添加进来
        keys.push(prop);
      }
    }
  };

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`.
  _.keys = function(obj) {
    //如果不是对象，返回空数组
    if (!_.isObject(obj)) return [];
    //如果支持原生的方法，就调用原生的keys方法
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    //记录所有属性名
    //这里的in操作符不仅在对象本身里查找，还会在原型链中查找。
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    // IE9以下枚举bug的兼容处理
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  //其实keys和allKeys代码对比就少了if (_.has(obj, key))，allKeys是获取所有的，包括继承的
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    //获取所有的key
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    // 依然是IE9以下枚举bug的兼容处理
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  // _.values就是讲obj的所有值拷贝到数组当中
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object.
  // In contrast to _.map it returns an object.
  // _.mapObject跟map类似，只不过它最后返回的是对象
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = _.keys(obj),
        length = keys.length,
        results = {};
    for (var index = 0; index < length; index++) {
      var currentKey = keys[index];
      results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  // The opposite of _.object.
  // _.pairs的结构也很简单，就是把对象转化为数组
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  // 结构也是很清晰，就是一个翻转对象的过程，将对象的键和值互换位置
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`.
  // 就是获取对象的所有方法名，然后存在数组当中
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, defaults) {
    return function(obj) {
      var length = arguments.length;
      //判断是否是对象
      if (defaults) obj = Object(obj);
      //如果一个参数或者对象为空，则返回这个对象
      if (length < 2 || obj == null) return obj;
      //从第二个参数开始
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            //获取对应的keys
            //keysFunc只有keys和allKeys两种，在下面_.extend和_.extendOwn中可以看到
            keys = keysFunc(source),
            l = keys.length;
        //进行拷贝处理
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          //defaults是为了对defaults做单独处理而添加的参数，具体的解释_.defaults里做详细分析
          //在_.extend和_.extendOwn中default没有传值所以是underfinded，所以下面判断条件横为true，正常进行拷贝处理
          if (!defaults || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // Extend a given object with all the properties in passed-in object(s).
  //把后面的source拷贝到第一个对象
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s).
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  //把后面的source拷贝到第一个对象
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test.
  //返回满足条件的属性
  _.findKey = function(obj, predicate, context) {
    //迭代函数
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      //获取对象属性
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Internal pick helper function to determine if `obj` has key `key`.
  var keyInObj = function(value, key, obj) {
    return key in obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  // 作用是过滤出所需的键值对，对参数是属性的和函数的情况分别处理
  _.pick = restArgs(function(obj, keys) {
    var result = {}, iteratee = keys[0];
    //如果没有传入obj，则返回空
    if (obj == null) return result;
    //判断keys参数里是否传的是函数
    if (_.isFunction(iteratee)) {
      // 如果是函数，则调用函数进行上下文this的绑定
      if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
      keys = _.allKeys(obj);
    } else {
      //如果不是函数，则为所需的属性
      iteratee = keyInObj;
      keys = flatten(keys, false, false);
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  });

  // Return a copy of the object without the blacklisted properties.
  // _.omit相比较_.pick是一种相反的操作，作用是保留标记以外的对象
  _.omit = restArgs(function(obj, keys) {
    var iteratee = keys[0], context;
    if (_.isFunction(iteratee)) {
      //这里一个取反的操作
      iteratee = _.negate(iteratee);
      if (keys.length > 1) context = keys[1];
    } else {
      keys = _.map(flatten(keys, false, false), String);
      iteratee = function(value, key) {
        //不存在的情况返回true
        return !_.contains(keys, key);
      };
    }
    //最后调用pick()
    return _.pick(obj, iteratee, context);
  });

  // Fill in a given object with default properties.
  //对象中属性值为underfined的属性进行拷贝填充
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  // 模拟Object.create方法
  _.create = function(prototype, props) {
    //继承原型
    var result = baseCreate(prototype);
    //属性拷贝的操作
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  // 对象浅拷贝，如果是数组就调用slice，不是数组就调用_.extend
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  // 用来判断该属性是否在对象中 （包括原型链）
  // 判断后者的对象属性是否全在前者的对象当中
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    //判断对象是否为空
    if (object == null) return !length;
    //判断是否是对象 防止不是对象
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      //如果两者值不等或者不在属性不在对象当中则返回false
      //如果对象属性不在obj中或者不在obj中
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq, deepEq;
  eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    // 虽然0 === -0成立，但是1 / 0 == 1 / -0 是不成立的，因为1 / 0值为Infinity, 1 / -0值为-Infinity, 而Infinity不等于-Infinity
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // `null` or `undefined` only equal to itself (strict comparison).
    if (a == null || b == null) return false;
    // `NaN`s are equivalent, but non-reflexive.
    // 对NaN情况的判断，因为NaN!=NaN,所以a !== a说明a是NaN，如果b !== b为true，那么说明b是NaN，a和b相等，b !== b为false，说明b不是NaN，那么a和b不等
    if (a !== a) return b !== b;
    // Exhaust primitive checks
    var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
    return deepEq(a, b, aStack, bStack);
  };

  // Internal recursive comparison function for `isEqual`.
  deepEq = function(a, b, aStack, bStack) {
    // Unwrap any wrapped objects.
    // 如果是underscore封装的对象，则通过_.wrapped中获取本身数据再进行对比
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    // 对两者的数据类型进行比较
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        // 正则转化字符串
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN.
        // 对NaN情况的判断，跟eq里的判断一样，只不过多了转化数字这一步
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        // 如果不是NaN，那就要判断0的情况了，也是跟eq里面的判断同理
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        //日期和布尔值转化为数字来比较，日期转化为数字是毫秒数
        return +a === +b;
      case '[object Symbol]':
        return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      //如果不是数组，只要有一个不是object类型就不等
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      //不同的构造函数是不等的，不同frames的object和Array是相等的
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      // 对嵌套结构的做判断
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    // 将a和b放入栈中
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    // 对数组的判断处理
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      //如果长度不等，那么肯定不等
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      // 递归比较每一个元素
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      // 如果是对象
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      // 相比较亮两个对象的属性数量是否相等
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        //递归比较每个属性是否相等
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    // 移除栈里的元素
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  // 就是一个判断为空的函数，结构很简单
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  // 判断是都是DOM元素
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError, isMap, isWeakMap, isSet, isWeakSet.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
  var nodelist = root.document && root.document.childNodes;
  if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return !_.isSymbol(obj) && isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`?
  _.isNaN = function(obj) {
    return _.isNumber(obj) && isNaN(obj);
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, path) {
    if (!_.isArray(path)) {
      return obj != null && hasOwnProperty.call(obj, path);
    }
    var length = path.length;
    for (var i = 0; i < length; i++) {
      var key = path[i];
      if (obj == null || !hasOwnProperty.call(obj, key)) {
        return false;
      }
      obj = obj[key];
    }
    return !!length;
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  //放弃Underscore 的控制变量"_"。返回Underscore 对象的引用 // var underscore = _.noConflict();
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = function(path) {
    if (!_.isArray(path)) {
      return shallowProperty(path);
    }
    return function(obj) {
      return deepGet(obj, path);
    };
  };

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    if (obj == null) {
      return function(){};
    }
    return function(path) {
      return !_.isArray(path) ? obj[path] : deepGet(obj, path);
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  // 判断对象是否匹配attrs的属性
  _.matcher = _.matches = function(attrs) {
    //进行拷贝
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      //用来判断该属性是否在对象中，上文有提及
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  // 调用迭代函数n次，最后结果返回一个数组
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

  // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped.
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // Traverses the children of `obj` along `path`. If a child is a function, it
  // is invoked with its parent as context. Returns the value of the final
  // child, or `fallback` if any child is undefined.
  _.result = function(obj, path, fallback) {
    if (!_.isArray(path)) path = [path];
    var length = path.length;
    if (!length) {
      return _.isFunction(fallback) ? fallback.call(obj) : fallback;
    }
    for (var i = 0; i < length; i++) {
      var prop = obj == null ? void 0 : obj[path[i]];
      if (prop === void 0) {
        prop = fallback;
        i = length; // Ensure we don't continue iterating.
      }
      obj = _.isFunction(prop) ? prop.call(obj) : prop;
    }
    return obj;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  /**
   * _.template就是一个模板函数，核心的部分还是前半段字符串拼接的过程（17-38行）。
   * 首先先解释一下参数text是模板字符串，settings是正则匹配的规则，escape、interpolate、evaluate和variable
   * 
   *    _.templateSettings = {
   *      evaluate: /<%([\s\S]+?)%>/g,
   *      interpolate: /<%=([\s\S]+?)%>/g,
   *      escape: /<%-([\s\S]+?)%>/g
   *    };
   * 
   * evaluate是用来执行任意的JavaScript代码，interpolate是用来插入变量的，escape是HTML转义的
   * 里面有个noMatch，他是为了避免settings中缺少属性的情况
   *  var noMatch = /(.)^/;
   * 17行里offset是用来记录匹配当前位置的，剩下的主要就是走21-27行了，插入值就走23-24行判断，如果遇到一些需要js判断转换的数据就走25-26行判断，最后匹配$也是为了再执行一遍将最后面的html拼接进字符串。
   * 其中18行中的escapeRegExp和escapeChar就是用来转化一些特殊字符的
   * 
   * 
   */
  _.template = function(text, settings, oldSettings) {
    //如果没有第二个参数，就将第三个参数赋值给第二个
    if (!settings && oldSettings) settings = oldSettings;
    //这里_.default函数前面介绍过填充属性为undefined的属性
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    // 定义正则表达式，将settings里面的三个正则组合在一起，这里'|$'是为了让replace里面的函数多执行一遍
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    //拼接字符串
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
      index = offset + match.length;
      //针对不同的情况进行拼接
      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offset.
      return match;
    });
    //下面是一个模板预编译的处理，主要用于调试
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    var render;
    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }
    //创建templete函数
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    //设置source属性
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  // 创建一个chain函数，用来支持链式调用
  _.chain = function(obj) {
    var instance = _(obj);
    //是否使用链式操作
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  // 返回_.chain里是否调用的结果, 如果为true, 则返回一个被包装的Underscore对象, 否则返回对象本身
  var chainResult = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  // 用于扩展underscore自身的接口函数
  _.mixin = function(obj) {
    //通过循环遍历对象来浅拷贝对象属性
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return chainResult(this, func.apply(_, args));
      };
    });
    return _;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  // 将Array.prototype中的相关方法添加到Underscore对象中, 这样Underscore对象也可以直接调用Array.prototype中的方法
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    //方法引用
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      // 赋给obj引用变量方便调用
      var obj = this._wrapped;
      // 调用Array对应的方法
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      //支持链式操作
      return chainResult(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  // 同上，并且支持链式操作
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      //返回Array对象或者封装后的Array
      return chainResult(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  //返回存放在_wrapped属性中的underscore对象
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  // 提供一些方法方便其他情况使用
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return String(this._wrapped);
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  // 对AMD支持的一些处理
  if (typeof define == 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}());
