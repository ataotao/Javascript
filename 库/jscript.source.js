/*!
 * jScript
 * Copyright, yellow race<f.v.yuelin@gmail.com>
 * 
 * Date: Wed, 30 Aug 2017 06:44:43 GMT
 */
// JavaScript 库
(function(root, undefined) {
	// "use strict";	// 进入严格模式

/// @part "../../declare.js"
////////////////////////////////////////////////////////////
/**
 * {base}
 * yellow race<f.v.yuelin@gmail.com>
 *
 * depends: null
 */
// 基本

// 声明和定义
// Use the correct document accordingly with window argument (sandbox)
var
NULL = null,
EMPTY = "",
SPACE = " ",
TRUE = true,
FALSE = false,

F = {},		// the framework object
FN = F,

FRAMEWORK = "jScript",	// F
FRAMEWORK_ALIAS = "jS",	// $
VERSION = "0.3.38",
PROTOTYPE = "prototype",

global = root || this,
process = global.process,
console = global.console,

expando = uniqueId(FRAMEWORK),
// A global GUID counter for objects
guid = 1,
log,
info,
warn,
isArray,
isArguments,

isNode = global.GLOBAL === global && global.global === global && global.root === global && process && TRUE,
isDOM = global.document && global.location && TRUE,

jQuery = global.jQuery,

// 备份要覆盖属性
// Map over F in case of overwrite
_F = global[FRAMEWORK],
// Map over the $ in case of overwrite
_$ = global[FRAMEWORK_ALIAS],

// objRefer = {},
// aryRefer = [],
// strRefer = EMPTY,

// Save bytes in the minified (but not gzipped) version:
aryProto = Array[PROTOTYPE],
objProto = Object[PROTOTYPE],
funProto = Function[PROTOTYPE],
strProto = String[PROTOTYPE],
// Save a reference to some core methods
_toString = objProto.toString,
_trim = strProto.trim,
_hasOwnProperty = objProto.hasOwnProperty,
_push = aryProto.push,
_slice = aryProto.slice,
_unshift = aryProto.unshift,
_bind = funProto.bind,

_setTimeout = global.setTimeout,
_setInterval = global.setInterval,
_clearTimeout = global.clearTimeout,
_clearInterval = global.clearInterval,

_parseInt = parseInt,
_parseFloat = parseFloat,

// Check if a string has a non-whitespace character in it
rnotwhite = /\S/,

// Used for trimming whitespace
trimLeft = /^\s+/,
trimRight = /\s+$/,

// Check for digits
// rdigit = /\d/,

// [[Class]] -> type pairs
class2type = {};

// IE doesn't match non-breaking spaces with \s
if (rnotwhite.test("\xA0")) {
	trimLeft = /^[\s\xA0]+/;
	trimRight = /[\s\xA0]+$/;
}

// Has own property?
function hasOwnProperty(obj, key, exists) {
	return obj && (_hasOwnProperty.call(obj, key) || (exists && key in obj)) ? TRUE : FALSE;
}
// Is a given value equal to null?
function isNull(obj) {
	return obj === NULL;
};
// Is a given variable undefined?
function isUndefined(obj) {
	return obj === void 0;
	// return obj === undefined;
	// return typeOf(obj,"undefined");
}
// Is a given value a boolean?
function isBoolean(obj) {
	return obj === TRUE
	 || obj === FALSE
	 || typeOf(obj, "boolean")
	// || toString.call(obj) == '[object Boolean]'
	;
}
// Is a given value a number?
function isNumber(obj) {
	return typeOf(obj, "number");
	// return toString.call(obj) == '[object Number]';
}
function isNumeric(obj) {
	return !isNaN(_parseFloat(obj)) && isFinite(obj);
}
// Is a given value a date?
function isDate(obj) {
	return typename(obj) === "date";
	// return toString.call(obj) == '[object Date]';
}
// Is a given value a string?
function isString(obj) {
	return typeOf(obj, "string");
	// return toString.call(obj) == '[object String]';
}
// Is the given value a regular expression?
function isRegExp(obj) {
	return typename(obj) === "regexp";
	// return toString.call(obj) == '[object RegExp]';
}
// Is a given value a function?
function isFunction(obj) {
	return typeOf(obj, "function");
	// return toString.call(obj) == '[object Function]';
}
// Is a given variable an object?
function isObject(obj) {
	return obj === Object(obj);
	// return obj instanceof Object;
	// return typeOf(obj, "object");
}
// Is a given value an array?
// Delegates to ECMA5's native Array.isArray
isArray = Array.isArray || function (obj) {
	return typename(obj) === "array";
	// return value instanceof Array;
	// return toString.call(obj) == '[object Array]';
};
// Is a given value a DOM element?
function isElement(obj) {
	return obj && obj.nodeType == 1;
}
// Is the given value `NaN`?
function isNaN(obj) {
	// `NaN` is the only value for which `===` is not reflexive.
	return obj !== obj;
	// return obj == NULL || !rdigit.test(obj) || window.isNaN(obj);
}
// Is a given array, string, or object empty?
// An "empty" object has no enumerable own-properties.
function isEmpty(obj) {
	if (obj == NULL) {
		return TRUE;
	}
	if (isArray(obj) || isString(obj)) {
		return obj.length === 0;
	}
	for (var key in obj) {
		if (hasOwnProperty(obj, key)) {
			return FALSE;
		}
	}
	return TRUE;
}

// Is a given variable an arguments object?
isArguments = function (obj) {
	return typename(obj) === "arguments";
	// return toString.call(obj) == '[object Arguments]';
};
if (!isArguments(arguments)) {
	isArguments = function (obj) {
		return obj && hasOwnProperty(obj, 'callee');
	};
}
function isEmptyObject(obj) {
	for (var name in obj) {
		return FALSE;
	}
	return TRUE;
}

// A crude way of determining if an object is a window
function isWindow(obj) {
	return obj && isObject(obj) && "setInterval" in obj;
}

/**
 * 是否为简单对象
 */
function isPlainObject(obj) {
	// Must be an Object.
	// Because of IE, we also have to check the presence of the constructor property.
	// Make sure that DOM nodes and window objects don't pass through, as well
	if (!obj || typename(obj) !== "object" || obj.nodeType || isWindow(obj)) {
		return FALSE;
	}
	
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnProperty(obj, "constructor") && !hasOwnProperty(obj.constructor[PROTOTYPE], "isPrototypeOf")) {
		return FALSE;
	}
	
	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {}
	
	return isUndefined(key) || hasOwnProperty(obj, key);
}

/**
 * 不做任何操作的函数
 */
function noop() {}
/**
 * 获取当前时间值
 * @return 返回一个整型数值，从 Thu, 01 Jan 1970 00:00:00 GMT 起经过的毫秒数。
 */
function now() {
	return (new Date()).getTime();
}
log = console && console.log || noop;
info = console && console.info || noop;
warn = console && console.warn || noop;

function error(message) {
	throw new Error(message);
}

/**
 * 执行指定的函数
 * @param {function} func 被执行的函数；
 * @param {boolean|function} check 检查执行条件是否满足，默认不检查；
 * @param {object} context 用于执行 func 函数的 this 对象；
 * @param ... 用于执行 func 函数的参数，最后两个参数固定为 F, global 对象；
 * @return 返回执行所用的时间（毫秒）或者 func 的结果（不为 undefined）；
 */
function exec(func, check, context) {
	var time = now(), obj = context || this, r;
	// if (isFunction(func) && (isUndefined(check) || (isFunction(check) && check() || check))) {
	if (isFunction(func) && (!check || (isFunction(check) && (r=check.apply(obj, _slice.call(arguments, 3)))))) {
		r = func.apply(obj, _slice.call(arguments, 3).concat(r));	// F, global, r
		if (!isUndefined(r)) {
			return r;
		}
	}
	return now() - time;
}
function typeOf(obj, type) {
	return typeof obj === type;
}
function instanceOf(obj, classF) {
	if (!classF) {
		classF = F;
	}
	return obj instanceof classF;
}
function typename(obj) {
	return obj == NULL ? String(obj) : (class2type[_toString.call(obj)] || "object");
}
// 参数是否无效(null || undefined)
function invalid(value, defaultValue) {
	var bResult = isUndefined(value) || value == NULL;
	return isUndefined(defaultValue) ? bResult : (bResult ? defaultValue : value);
}

// 分隔字符串，连续相同的字符成一组，返回数组格式。
function split(text) {
	var
	tokens = [],
	i = 0,
	j = 0,
	k = 0,
	l = text.length,
	last,
	cur;
	if (l > 0) {
		for (i = 0; i < l; i++) {
			cur = text.charAt(i);
			if (cur != last) {
				if (k > 0) {
					tokens.push(text.substr(j, k));
				}
				last = cur;
				j = i;
				k = 1;
			} else {
				k++;
			}
		}
		tokens.push(text.substr(j));
	}
	return tokens;
}
// 合并数组，将第二个参数合并到第一个。
function merge(first, second) {
	if (second) {
		var
		i = 0,
		j = first.length,
		k = second.length;
		if (isNumber(k)) {
			while (i < k) {
				first[j++] = second[i++];
			}
		} else {
			while (!isUndefined(second[i])) {
				first[j++] = second[i++];
			}
		}
		first.length = j;
	}
	return first;
}
// [makeArray] results is for internal usage only
// 转换成数组，如果第二个参数有效，则合并到第二个参数中并返回。
function array(array, results) {
	var ret = results || [];
	
	if (array != NULL) {
		// The window, strings (and functions) also have 'length'
		// The extra typeof function check is to prevent crashes
		// in Safari 2 (See: #3039)
		// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
		var type = typename(array);
		
		if (array.length == NULL || type === "string" || type === "function" || type === "regexp" || isWindow(array)) {
			_push.call(ret, array);
		} else {
			merge(ret, array);
		}
	}
	
	return ret;
}
// 过滤数组元素。
function grep(elems, callback, invert) {
	var
	i = 0,
	length = elems.length,
	ret = [],
	retVal;
	invert = !!invert;
	
	// Go through the array, only saving the items
	// that pass the validator function
	for (; i < length; i++) {
		retVal = !!callback(elems[i], i);
		if (invert !== retVal) {
			ret.push(elems[i]);
		}
	}
	
	return ret;
}
// 将一个数组中的元素转换到另一个数组中。
function map(elems, callback, arg) {
	if (!elems) {
		return [];
	}
	var
	key,
	value,
	i = 0,
	length = elems.length,
	ret = [],
	// F objects are treated as arrays
	bArray = instanceOf(elems) || !isUndefined(length) && isNumber(length) && ((length > 0 && elems[0] && elems[length - 1]) || length === 0 || isArray(elems));
	
	// Go through the array, translating each of the items to their
	if (bArray) {
		for (; i < length; i++) {
			value = callback(elems[i], i, arg);
			
			if (value != NULL) {
				ret[ret.length] = value;
			}
		}
		
		// Go through every key on the object,
	} else {
		for (key in elems) {
			value = callback(elems[key], key, arg);
			
			if (value != NULL) {
				ret[ret.length] = value;
			}
		}
	}
	// Flatten any nested arrays
	return ret.concat.apply([], ret);
}
function hash(array, defaultValue) {
	var
	i,
	length,
	func = defaultValue,
	ret = {};
	if (isString(array)) {
		array = array.split(/[\s,;]+/);
	}
	if (isArray(array)) {
		if (isUndefined(defaultValue)) {
			defaultValue = TRUE;
		}
		if (!isFunction(func)) {
			func = function () {
				return defaultValue;
			};
		}
		for (i = 0, length = array.length; i < length; i++) {
			ret[array[i]] = func(array[i], i);
		}
	}
	return ret;
}
/**
 * 从对象或数组中选择一个指定条件的数据
 * @param predicate 可以是一个函数，或者是对象的属性名，也可能是数组的一个下标；
 * @return 返回找到的结果。
 */
function find(obj, predicate) { // IE6下效率不高
	var result = NULL,
	bFunc = isFunction(predicate),
	args = arguments;
	if (obj != NULL) {
		if (!invalid(predicate)) {
			if (isArray(obj)) {
				if (bFunc) {
					for (var i = 0; i < obj.length; i++) {
						if (predicate(obj[i], i) === TRUE) {
							result = obj[i];
							break;
						}
					}
				} else {
					result = obj[predicate];
				}
			} else {
				if (bFunc) {
					for (var k in obj) {
						if (predicate(obj[k], k) === TRUE) {
							result = obj[k];
							break;
						}
					}
				} else {
					result = obj[predicate];
				}
			}
		} else {
			result = obj;
		}
		if (args.length > 2) {
			return args.callee.apply(this, [result].concat(_slice.call(args, 2)));
		}
	}
	return result;
}
/**
 * 获取唯一ID（当前是由 Math 对象的随机数生成）
 */
function uniqueId(prefix) {
	// return (prefix || "_") + (EMPTY + Math.random()).replace(/\D/g, EMPTY);
	// return (prefix || "_") + (new Date().getTime() * 1000 + (100 + Math.floor(Math.random() * 900))).toString(36);
	// 7 days (6048e5 = 7 * 24 * 60 * 60 * 1000)
	_uniqueid_counter = (_uniqueid_counter + 1) % 1e4;
	return (prefix || "_") + ((new Date().getTime() % 6048e5) * 1e7 + _uniqueid_counter * 1e4 + (100 + Math.floor(Math.random() * 900))).toString(36);
}
var _uniqueid_counter = 0;
/**
 * 函数绑定代理
 * Bind a function to a context, optionally partially applying any arguments.
 */
function proxy(fn, context) {
	if (isString(context)) {
		var swap = fn[context];
		context = fn;
		fn = swap;
	}
	
	// Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	if (!isFunction(fn)) {
		return undefined;
	}
	
	// Simulated bind
	var args = _slice.call(arguments, 2),
	proxy = function () {
		return fn.apply(context, args.concat(_slice.call(arguments)));
	};
	// Set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid = fn.guid = fn.guid || proxy.guid || guid++;
	
	return proxy;
}

/**
 * 函数去抖
 * 如果用手指一直按住一个弹簧，它将不会弹起直到你松手为止。也就是说当调用动作n毫秒后，才会执行该动作，若在这n毫秒内又调用此动作则将重新计算执行时间。
 * http://www.cnblogs.com/fsjohnhuang/p/4147810.html
 * 
 * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 idle，func 才会执行
 * @param idle {number} 空闲时间，单位毫秒
 * @param func {function} 请求关联函数，实际应用需要调用的函数
 * @return {function} 返回客户调用函数
 */
function debounce(idle, func) {
	var last;
	return function() {
		var obj = this, args = arguments;
		clearTimeout(last);
		last = setTimeout(function() {
			func.apply(obj, args);
		}, idle);
	}
}

/**
 * 函数节流
 * 如果将水龙头拧紧直到水是以水滴的形式流出，那你会发现每隔一段时间，就会有一滴水流出。也就是会说预先设定一个执行周期，当调用动作的时刻大于等于执行周期则执行该动作，然后进入下一个新周期。
 * 
 * 频率控制 返回函数连续调用时，func 执行频率限定为：次/delay
 * @param delay {number} 延迟时间，单位毫秒
 * @param func {function} 请求关联函数，实际应用需要调用的函数
 * @return {function} 返回客户调用函数
 */
function throttle(delay, func) {
	var last = 0;
	return function() {
		var time = +new Date();
		if (time - last > delay) {
			func.apply(this, arguments);
			last = time;
		}
	}
}

/**
 * 将字符串转换成JSON格式
 */
function json(data) {
	if (!isString(data) || !data) {
		return NULL;
	}
	
	// Make sure leading/trailing whitespace is removed (IE can't handle it)
	data = F.trim(data);
	/*
	// Attempt to parse using the native JSON parser first
	if (window.JSON && window.JSON.parse) {
	try {
	return window.JSON.parse(data);
	} catch (e) {}
	}
	Make sure the incoming data is actual JSON
	Logic borrowed from http : //json.org/json2.js
	if (rvalidchars.test(data.replace(rvalidescape, "@").replace(rvalidtokens, "]").replace(rvalidbraces, EMPTY))) {
	 */
	try {
		return (new Function("return " + data))();
		//return window["eval"]("(" + data + ")");
	} catch (e) {}
	/*
	}*/
	error("Invalid JSON: " + data);
}

// args is for internal usage only
function each(object, callback, args) {
	if (!object) return;
	var
	name,
	i = 0,
	length = object.length,
	isObj = isUndefined(length) || isFunction(object);
	
	if (args) {
		if (isObj) {
			for (name in object) {
				if (callback.apply(object[name], args) === FALSE) {
					break;
				}
			}
		} else {
			for (; i < length; i++) {
				if (callback.apply(object[i], args) === FALSE) {
					break;
				}
			}
		}
	} else { // A special, fast, case for the most common use of each
		if (isObj) {
			for (name in object) {
				if (callback.call(object[name], object[name], name) === FALSE) {
					break;
				}
			}
		} else {
			for (; i < length; i++) {
				if (callback.call(object[i], object[i], i) === FALSE) {
					break;
				}
			}
		}
	}
	
	return object;
}

function callnext(funcs, index) {
	if (isUndefined(index)) {
		index = 0;
	}
	if (index < funcs.length) {
		var obj = this,
		args = arguments,
		more = _slice.call(args, 2);
		funcs[index].apply(obj, more.concat(function () {
				args.callee.apply(obj, [funcs, index + 1].concat(more, arguments));
			}));
	}
}
/**
 * 继承。
 * https://zhuanlan.zhihu.com/p/25578222
 */
function inherit(ctor, superCtor) {
	var func, type = superCtor.prototype;
	// ctor.$base = superCtor;	// ctor.$super
	// ctor.$type = type;		// ctor.$
	if (Object.create) {
		type = Object.create(type, {
			constructor : {
				value : ctor,
				enumerable : FALSE,
				writable : TRUE,
				configurable : TRUE
			}
		});
	} else {
		func = function () {};
		func.prototype = type;	// superCtor
		type = new func();
	}
	// ctor.prototype = type;
	F.extend(ctor.prototype, type);
	return ctor;
}

/**
 * 执行正则表达式
 * @param source 字符串数据源；
 * @param regex 正则表达式，必须是全局模式，即查找所有；
 * @param func 找到匹配后的处理函数，第一个参数是匹配的对象，第二个为索引；
 */
function regexec(source, regex, func, args) {
	var list = [], m;
	while ((m = regex.exec(source)) != null) {
		list.push(m);
	}
	if (list.length) {
		each(list, func, args);
	}
}


/// @part "../../class2type.js"
////////////////////////////////////////////////////////////
/**
 * {class2type}
 * yellow race<f.v.yuelin@gmail.com>
 *
 * depends: [declare]
 */
// 类型表
// Populate the class2type map
each("Boolean Number String Function Arguments Array Date RegExp Object".split(SPACE), function (name) {
	class2type["[object " + name + "]"] = name.toLowerCase();
});

/// @part "_declare.source.js"
////////////////////////////////////////////////////////////
var
using = isNode ? require : noop,

// 引用模块
UTIL = using("util"),
VM = using("vm"),
FS = using("fs"),
PATH = using("path"),
URL = using("url"),
HTTP = using("http"),
BUFFER = global.Buffer;


// override
F = function() {};
FN = F[PROTOTYPE];






/// @part "../../string.js"
////////////////////////////////////////////////////////////
/**
 * {string}
 * yellow race<f.v.yuelin@gmail.com>
 *
 * depends: [declare]
 */
// 字符串


/**
 * 字符串参数格式化
 */
function format(str, obj) {
	if (!str) return str;
	var args = _slice.call(arguments, 1);
	return str.replace(/\{(?:(\d+)|([_A-Za-z]\w*))\}/g, function ($0, $1, $2) {
		return $2 ? invalid(obj[$2], EMPTY) : $1 ? invalid(args[$1], EMPTY) : $0;
	});
}
/**
 * 重复指定的字符 N 次。
 */
function repeat(c, n) {
	var ary = [], i = 0;
	while (i < n) {
		ary[i++] = c;
	}
	return ary.join(EMPTY);
}
function reverse(text) {
	return text.split(EMPTY).reverse().join(EMPTY);
}

/**
 * 查找字符串
 * @param text, 被查找的文本；
 * @param begin, 匹配的开始标记；
 * @param ignore, 忽略函数，如果是 HTML 内容，则可以为标签名称，如 div；
 * @param end, 匹配的结束标记；
 * @param count, 匹配次数，小于等于 0 则不限制次数；
 * @param result, 匹配到的结果，以函数调用的方式返回，有 3 个参数，分别为：找到的字符串、开始索引、结束索引；
 * @param inside, 匹配是否不包括查找标记；
 * @param startIndex, 从指定索引位置开始查找；
 */
function findStr(text, begin, ignore, end, count, result, inside, startIndex) {
	if (!isNumber(count)) {
		count = 1;
	}
	if (!text) {
		return count == 1 && !isFunction(result) ? NULL : 0;
	}
	if (!isNumber(startIndex)) {
		startIndex = 0;
	}
	if (ignore && !isFunction(ignore)) {
		ignore = isString(ignore) ? (function (tag) {
				var m,
				re = new RegExp("<(?:(" + tag + "[^<>]*?[^/]?)|(/" + tag + "))>", "gim");
				return function (o) {
					while ((m = re.exec(o.text)) != NULL) {
						if (m[1])
							o.x++;
						if (m[2])
							o.y++;
					}
					return o.x === o.y;
				}
			})(ignore) : FALSE;
	}
	var b = isFunction(result),
	c = 0,
	o,
	i,
	j,
	k,
	x,
	y,
	z;
	while ((x = text.indexOf(begin, startIndex)) != -1) {
		i = k = z = x + begin.length;
		if (ignore) {
			o = {
				x : 0,
				y : 0
			};
			while ((j = text.indexOf(end, z)) != -1) {
				o.text = text.substring(k, j);
				if (ignore(o))
					break;
				z = j + end.length;
				k = j;
			}
		} else {
			j = text.indexOf(end, k);
		}
		if (j == -1) {
			break;
		}
		y = j + end.length;
		if (b) {
			if (!inside) {
				i = x;
				j = y;
			}
			result(text.substring(i, j), i, j);
		}
		if (count > 0 && ++c >= count) {
			break;
		}
		startIndex = y;
	}
	if (count == 1 && !b) {
		if (c > 0) {
			if (!inside) {
				i = x;
				j = y;
			}
			return text.substring(i, j);
		} else {
			return NULL;
		}
	}
	return c;
}
function padLeft(str, num, ch) {
	var s = EMPTY + str,
	pad = ch || SPACE;
	while (s.length < num) {
		s = pad + s;
	}
	return s;
}
function padRight(str, num, ch) {
	var s = EMPTY + str,
	pad = ch || SPACE;
	while (s.length < num) {
		s += pad;
	}
	return s;
}
// 格式化成字符串[toString]
function toString(obj, depth, prefix, indent, func) {
	if (!isNumber(depth)) {
		depth = 1;
	}
	if (isString(obj)) {
		return "\"" + obj.replace(/\\/g, "\\\\").replace(/"/g, "\\\"") + "\"";
	} else if (isDate(obj)) {
		return "new Date(" + obj.getTime() + ")";
	} else if (isFunction(obj)) {
		return (func || getDeclarationHead)(obj);
	} else if (isArray(obj) || isArguments(obj)) {
		if (depth > 0) {
			var t, s = [], count = 0, 
			c = invalid(prefix), // compact
			b = c ? EMPTY : "\n"; // blank
			if (!c && invalid(indent)) {
				indent = "\t";
			}
			for (var i = 0; i < obj.length; i++) {
				t = obj[i];
				t = toString(t, depth - 1, prefix + (c ? EMPTY : indent), indent, func);
				count += t.length;
				s.push(t);
			}
			// reuse
			t = !c && count < 32; // simple
			if (t) {
				b = SPACE;
			}
			t = !c && !t;
			indent = t ? prefix + indent : EMPTY;
			prefix = t ? prefix : EMPTY;
			return "[" + (s.length > 0 ? b + indent + s.join("," + b + indent) : EMPTY) + b + prefix + "]";
		} else {
			return "[...]";
		}
	} else if (isPlainObject(obj)) {
		if (depth > 0) {
			var t, s = [], count = 0, 
			c = invalid(prefix), // compact
			b = c ? EMPTY : "\n"; // blank
			if (!c && invalid(indent)) {
				indent = "\t";
			}
			for (var key in obj) {
				t = obj[key];
				t = key + ":" + (c ? EMPTY : SPACE) + toString(t, depth - 1, prefix + (c ? EMPTY : indent), indent, func);
				count += t.length;
				s.push(t);
			}
			// reuse
			t = !c && count < 32; // simple
			if (t) {
				b = SPACE;
			}
			t = !c && !t;
			indent = t ? prefix + indent : EMPTY;
			prefix = t ? prefix : EMPTY;
			return "{" + (s.length > 0 ? b + indent + s.join("," + b + indent) : EMPTY) + b + prefix + "}";
		} else {
			return "{...}";
		}
	}
	return invalid(obj) ? String(obj) : EMPTY + obj;
}
function getDeclarationHead(fn) {
	var str = EMPTY + fn;
	return isFunction(fn) ? str.substr(0, str.indexOf("{")) : str;
}


/// @part "../../extend.js"
////////////////////////////////////////////////////////////
/**
 * {extend}
 * yellow race<f.v.yuelin@gmail.com>
 *
 * depends: [base]
 */
// 属性扩展
var extend
= F.extend 
// = T.extend 
= function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = FALSE;

	// Handle a deep copy situation
	if (isBoolean(target)) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if (!isObject(target) && !isFunction(target)) {
		target = {};
	}

	// extend F itself if only one argument is passed
	if (length === i) {
		target = this;
		--i;
	}

	for (; i < length; i++) {
		// Only deal with non-null/undefined values
		if ((options = arguments[i]) != NULL) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target === copy) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if (deep && copy && (isPlainObject(copy) || (copyIsArray=isArray(copy)))) {
					if ( copyIsArray ) {
						copyIsArray = FALSE;
						clone = src && isArray(src) ? src : [];

					} else {
						clone = src && isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[name] = extend(deep, clone, copy);

					// Don't bring in undefined values
				} else if ( !isUndefined(copy) ) {
					target[name] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

F.compact = function(obj, fields) {
	if (isString(fields)) {
		fields = fields.split(/\s*,\s*/);
	}
	if (isObject(obj) && isArray(fields)) {
		var data = {};
		each(fields, function(n) {
			if (!isUndefined(obj[n])) {
				data[n] = obj[n];
			}
		});
		return data;
	}
	return obj;
};
/// @part "../../base.js"
////////////////////////////////////////////////////////////
/**
 * {base}
 * yellow race<f.v.yuelin@gmail.com>
 *
 * depends: [declare, string, extend]
 */
// 基本扩展
extend(F, {
	/**
	 * 解决冲突
	 */
	noConflict: function(deep) {
		if (global[FRAMEWORK_ALIAS] === F) {
			global[FRAMEWORK_ALIAS] = _$;
		}

		if (deep && global[FRAMEWORK] === F) {
			global[FRAMEWORK] = _F;
		}

		return F;
	},
	// 内部调用
	internal: function(func) {
		if (isFunction(func)) {
			func.call(FN, F, global);
		}
		return F;
	},
	override: function(name, value) {
		switch (name) {
			case "debug":
				debugMode = value;
				return TRUE;
			case "source":
				sourceFile = value;
				return TRUE;
			case "log":
				F.log = log = value;
				return TRUE;
			case "info":
				F.info = info = value;
				return TRUE;
			case "warn":
				F.warn = warn = value;
				return TRUE;
			case "version":
				fileVersion = value;
				return TRUE;
		}
	},
	fnTrue: function() {
		return TRUE;
	},
	fnFalse: function() {
		return FALSE;
	},
	cbool: function(value, def) {
		if (isString(value)) {
			switch (value.toUpperCase()) {
				case "-1":
				case "1":
				case "Y":
				case "T":
				case "YES":
				case "TRUE":
					value = TRUE;
					break;
				case "0":
				case "N":
				case "F":
				case "NO":
				case "FALSE":
					value = FALSE;
					break;
			}
		}
		if (!isBoolean(value)) {
			value = !!(isUndefined(def) ? value : def);
		}
		return value;
	},
	cint: function(value, def) {
		return isNaN(value = _parseInt(value)) ? (isUndefined(def) ? 0 : def) : value;
	},
	cfloat: function(value, def) {
		return isNaN(value = _parseFloat(value)) ? (isUndefined(def) ? 0 : def) : value;
	},
	decimal: function(value, decimals) {
		decimals = decimals ? Math.pow(10, decimals) : 100;
		return Math.round(value * decimals) / decimals;
	},
	timeout: function(f, n) {
		if (isNumber(n)) {
			return _setTimeout(f, n);
		} else {
			return _clearTimeout(f);
		}
	},
	interval: function(f, n) {
		if (isNumber(n)) {
			return _setInterval(f, n);
		} else {
			return _clearInterval(f);
		}
	},
	slice: function(list, start, end) {
		return _slice.apply(list, _slice.call(arguments, 1));
	},
	set: function(obj, attr, check, convert) {
		return function(value) {
			var r = !check || (isFunction(check) ? check(value) : !invalid(value));
			if (r) {
				obj[attr] = isFunction(convert) ? convert.apply(this, arguments) : value;
			}
			return r;
		};
	},
	/**
	 * 字符串剪切
	 * Use native String.trim function wherever possible
	 */
	trim: (_trim ? function(text) {
		return text == NULL ? EMPTY : _trim.call(text);
	} : function(text) { // Otherwise use our own trimming functionality
		return text == NULL ? EMPTY : text.toString().replace(trimLeft, EMPTY).replace(trimRight, EMPTY);
	}),
	now: now,
	log: log,
	info: info,
	warn: warn,
	noop: noop,
	exec: exec,
	error: error,
	uniqueId: uniqueId,

	type: typename,
	typeOf: typeOf,

	instanceOf: instanceOf,
	isNaN: isNaN,
	isNull: isNull,
	isUndefined: isUndefined,
	isBoolean: isBoolean,
	isNumber: isNumber,
	isNumeric: isNumeric,
	isDate: isDate,
	isString: isString,
	isRegExp: isRegExp,
	isFunction: isFunction,
	isObject: isObject,
	isArray: isArray,
	isArguments: isArguments,
	isPlainObject: isPlainObject,
	isEmptyObject: isEmptyObject,
	isElement: isElement,
	isWindow: isWindow,

	invalid: invalid,
	find: find,
	proxy: proxy,
	debounce: debounce,
	throttle: throttle,
	each: each,
	split: split,
	merge: merge,
	array: array,
	grep: grep,
	map: map,
	hash: hash,
	callnext: callnext,
	inherit: inherit,
	regexec: regexec,
	json: json,

	// {string}
	reverse: reverse,
	repeat: repeat,
	format: format,
	findStr: findStr,
	padLeft: padLeft,
	padRight: padRight,
	string: toString,

	inputfilter: function(source, emoji, html) {
		if (emoji) {
			// 处理 emoji 表情符号（成对的代理项）
			// Unicode range D800–DFFF is used as surrogate pair in UTF-16 (used by Windows) and CESU-8 transformation formats, allowing these encodings to represent the supplementary plane code points, whose values are too large to fit in 16 bits. A pair of 16-bit code points — the first from the high surrogate area (D800–DBFF), and the second from the low surrogate area (DC00–DFFF) — are combined to form a 32-bit code point from the supplementary planes.
			source = source.replace(/[\ud800-\udbff][\udc00-\udfff]/g, function(ch) {
				if (ch.length === 2) {
					var high = ch.charCodeAt(0), low = ch.charCodeAt(1);
					return "&#" + ((high - 0xd800) * 0x400 + 0x10000 + low - 0xdc00) + ";"; // 转换成HTML格式
				}
				return ch;
			});
		}
		if (html) {
			source = source.replace(/</g, "&lt;").replace(/>/g, "&gt;");
		}
		return source;
	},

	version: VERSION,
	license: "(c)" + new Date().getFullYear() + " yellow race<f.v.yuelin@gmail.com>, LGPL3."
});

// F.hasOwnProperty = hasOwnProperty;
F.has = hasOwnProperty;
F.toString = function() {
	return FRAMEWORK + ' library ' + VERSION + '\n' + F.license;
};
// Unique for each copy of F on the page
// Non-digits removed to match rinlineF
// F.expando = uniqueId(FRAMEWORK);


var
	debugMode = FALSE, // 是否为调试模式
	sourceFile = FALSE, // 加载原文件，如 example.source.js
	fileVersion = NULL, // 文件版本，如 example.js?ver=0.1.2
	loadScript = noop;
/// @part "../../array.js"
////////////////////////////////////////////////////////////
/**
 * {array}
 * yellow race<f.v.yuelin@gmail.com>
 *
 * depends: [declare]
 */
// 数组

/**
 * 数组索引
 * @param {boolean function<this>(data, index) | *} search 需要查找的数据（用全等比较），或自定义的查找函数；
 * @param {integer} beginIndex 开始索引，默认为0；
 * @param {boolean} byValue 是否按值查找，即使 search 是查找函数也当作值来作全等比较；
 * @return 找到则返回索引的位置，或则返回 -1。
 */
aryProto.index = function (search, beginIndex, byValue) {
	var self = this, i = beginIndex || 0, j = self.length;
	if (!byValue && isFunction(search)) {
		for (; i < j; i++) {
			if (search.call(self, self[i], i)) {
				return i;
			}
		}
	} else if((byValue || beginIndex) === FALSE) {
		for (; i < j; i++) {
			if (self[i] === search) {
				return i;
			}
		}
	} else {
		for (; i < j; i++) {
			if (self[i] == search) {
				return i;
			}
		}
	}
	return -1;
};
// every
aryProto.each = function (callback, beginIndex, endIndex) {
	var self = this, l = self.length, i, j;
	if (l > 0) {
		i = beginIndex || 0;
		j = endIndex || l - 1;
		while (i <= j) {
			if (FALSE === callback.call(self, self[i], i)) break;	// 如果返回 false 则中断循环
			i++;
		}
	}
	return self;
};
/**
 * 数据是否相等
 * @param {array} list 被比较的数组
 * @param {boolean function<this>(dataA, dataB)} compare 数据比较器函数，或一个布尔值来表示是否使用全等比较；
 * @return 返回布尔值，是否相等。
 */
aryProto.equals = function(list, compare) {
	var self = this, comparer, l = self.length, i;
	if (isArray(list) && list.length == l) {
		if (!isFunction(compare)) {
			comparer = compare ? function(a, b) {
				return a === b;
			} : function(a, b) {
				return a == b;
			};
		}
		for(i = 0; i < l; i++) {
			if (!comparer.call(self, self[i], list[i])) return FALSE;
		}
		return TRUE;
	}
	return FALSE;
};
/**
 * 赋值，将另一个数组的值赋给当前数组
 * @param {array} list 新值数组
 * @param {integer} targetIndex 目标（新）数组索引，默认为0；
 * @param {integer} sourceIndex 源（当前）数组索引，默认为0；
 * @return 返回当前数组。
 */
aryProto.assign = function(list, targetIndex, sourceIndex) {
	var self = this, l, i, j;
	if (isArray(list) || isArguments(list)) {
		for(l = list.length, i = targetIndex || 0, j = (sourceIndex || 0) - i; i < l; i++) {
			self[i + j] = list[i];
		}
	}
	return self;
};
if (!aryProto.reduce) {
	/**
	 * 利用 func 函数对数组中的元素使用递减的方式累积操作，最终执行结果是一个累积运算后的值。
	 * @param {next function<this>(previous, current, index)} func 运算函数；
	 * @param {*} memo 初始的值，当有指定则 func 函数从数组的第 0 个元素开始，否则 memo 初始为数组的第 0 个元素，然后用 func 函数从第 1 个元素开始计算；
	 * @return 返回最终计算后的结果。
	 */
	aryProto.reduce = function (func, memo) {
		var self = this, l = self.length, i = 0;
		if (l > 0) {
			if (isUndefined(memo)) {
				memo = self[i++];
			}
			for (; i < l; i++) {
				memo = func.call(self, memo, self[i], i);
			}
		}
		return memo;
	};
}
if (!aryProto.min) {
	/**
	 * 计算数组中的最小值
	 */
	aryProto.min = function (value) {
		return this.reduce(function (a, b) {
			return a < b ? a : b;
		}, value) || 0;
	};
}
if (!aryProto.max) {
	/**
	 * 计算数组中的最大值
	 */
	aryProto.max = function (value) {
		return this.reduce(function (a, b) {
			return a > b ? a : b;
		}, value) || 0;
	};
}
/**
 * 计算数组中的累加值
 */
aryProto.sum = function (value) {
	return this.reduce(function (a, b) {
		return a + b;
	}, value || 0);
};
/**
 * 计算数组中的平均值
 */
aryProto.avg = function (value) {
	var self = this;
	return self.sum(value) / self.length;
};

/**
 * 获取数组的值
 * @see #index；
 * @return 找到则返回对应索引位置的数据，或则返回 null。
 */
aryProto.get = function (search, beginIndex, byValue) {
	var self = this, i = self.index(search, beginIndex, byValue);
	return -1 != i ? self[i] : NULL;
};
/**
 * 数组是否包含指定的值
 * @see #index；
 * @return 返回布尔值，是否找到（或者包含）。
 */
aryProto.contains = function (search, beginIndex, byValue) {
	return -1 != this.index(search, beginIndex, byValue);
};
if (!aryProto.filter) {
	/**
	 * 数组过滤
	 * @param {bool function<this>(item, i)} func 过滤函数；
	 * @return 返回根据 func 匹配到的新数组，如果 func 不为函数，则返回当前数组。
	 */
	aryProto.filter = function (func) {
		var self = this, items, l, i;
		if (isFunction(func)) {
			items = [];
			for (i = 0, l = self.length; i < l; i++) {
				if (func.call(self, self[i], i)) {
					items.push(self[i]);
				}
			}
			return items;
		}
		return this;
	};
}
/**
 * 数组转换
 * @param {* function<this>(item, i)} func 转换函数；
 * @param {boolean} isNew 是否将转换的值放到一个新的数组中；
 * @return 返回经过转换后的数组。
 */
aryProto.convert = function (func, isNew) {
	var self = this, items = self, fn = isFunction(func) ? func : (isNumber(func) || isString(func)) ? function(it) {
		return it[func];
	} : FALSE, l, i;
	if (fn) {
		if (isNew) {
			items = [];
		}
		for (i = 0, l = self.length; i < l; i++) {
			items[i] = fn.call(self, self[i], i);
		}
	}
	return items;
};
/**
 * 获取数组的第一项
 * @return 如果有数据则返回正确的项，否则返回 null。
 */
aryProto.first = function () {
	var self = this, l = self.length;
	return l > 0 ? self[0] : NULL;
};
/**
 * 获取数组的最后一项
 * @return 如果有数据则返回正确的项，否则返回 null。
 */
aryProto.last = function () {
	var self = this, l = self.length;
	return l > 0 ? self[l - 1] : NULL;
};

/// @part "../../datetime.js"
////////////////////////////////////////////////////////////
/**
 * {date}
 * yellow race<f.v.yuelin@gmail.com>
 *
 * depends: [base]
 */
// 日期
exec(function() {
	var 
	_date = Date,
	_date_ = _date[PROTOTYPE],
	_date2string = _date_.toString,
	fullMonthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	shortMonthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
	fullWeekName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	shortWeekName = ["S", "M", "T", "W", "T", "F", "S"], 
	invalidDate = new _date(NaN);

	// Constants used for time computations
	_date.SECOND = 1000; // milliseconds
	_date.MINUTE = 60 * _date.SECOND;
	_date.HOUR = 60 * _date.MINUTE;
	_date.DAY = 24 * _date.HOUR;
	_date.WEEK = 7 * _date.DAY;	// 7 * 864e5 = 7 * 86400000

	extend(_date_, {
		// Returns the number of day in the year.
		getDayOfYear: function() {
			var 
			dt = this,
			now = new _date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 0, 0, 0),
			then = new _date(dt.getFullYear(), 0, 0, 0, 0, 0),
			time = now - then;
			return Math.floor(time / _date.DAY);
		},
		// Returns the number of the week in year, as defined in ISO 8601.
		getWeekNumber: function(dt) {
			var 
			dt = this,
			d = new _date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 0, 0, 0),
			dayOfWeek = d.getDay(),
			ms;
			d.setDate(d.getDate() - (dayOfWeek + 6) % 7 + 3); // Nearest Thu
			ms = d.valueOf(); // GMT
			d.setMonth(0);
			d.setDate(4); // Thu in Week 1
			return Math.round((ms - d.valueOf()) / _date.WEEK) + 1;
		},
		getWeekOfMonth: function(dt) {
			var dt = this,
			d = dt.getDate(),
			dayOfWeek = dt.getDay();
			if (dayOfWeek > 0) {
				d += 7 - dayOfWeek;
			}
			return Math.ceil(d / 7);
		}
	});
	
	/**
	 * 将字符串按指定格式转换成日期
	 * @param {string} text 日期字符串；
	 * @param {string} format 格式字符串，与C#类似；
	 * @param fMN 长月份名称数组；
	 * @param sMN 短月份名称数组；
	 * @param fWN 长星期名称数组；
	 * @param sWN 短星期名称数组；
	 * @return 返回日期。
	 */
	F.date = function(text, format, fMN, sMN, fWN, sWN) {
		if (!text) {
			return arguments.length>0 ? invalidDate : new _date();
		}
		if (!format) {
			// 2016-05-04T10:43:10.757Z
			// if (typeof(text)==='string' && text.indexOf('T')==-1) text=text.replace(/-/g, '/');
			return text == 'now' ? new _date() 
				: new _date(isString(text) && -1 == text.indexOf('T') ? text.replace(/-/g, '/') : text)
				;
		}
		var 
		dt = new _date(),
		o = {
			y: dt.getFullYear(),
			M: dt.getMonth(),
			d: dt.getDate(),
			H: dt.getHours(),
			m: dt.getMinutes(),
			s: 0,
			f: 0
		},
		tokens = split(format),
		count = 0;

		each(tokens, function(key, i) {
			var 
			ch = key.charAt(0),
			len = key.length;
			if (!isUndefined(o[ch])) {
				count++;
				if (len > 2) {
					if (ch == 'M') {
						return find((len == 3 ? (sMN || shortMonthName) : (fMN || fullMonthName)), function(name, i) {
							if (text.startWith(name)) {
								text = text.substr(name.length);
								o[ch] = i;
								return TRUE;
							}
						});
					} else if (ch == 'd') {
						return;
					}
				}
				if (ch == 'y') {
					if (len != 2) {
						len = 4;
					}
				}
				o[ch] = _parseInt(text.substr(0, len), 10);
				if (ch == 'M') {
					o.M--;
				}
			}
			text = text.substr(len);
		});
		if (count > 0) {
			if (o.y < 100) {
				o.y += (o.y > 29) ? 1900 : 2000;
			}
			return new _date(o.y, o.M, o.d, o.H, o.m, o.s, o.f);
		}
		return dt;
	};
	
	// Prints the date in a string according to the given format.
	_date_.toString = function(format, fMN, sMN, fWN, sWN) {
		var 
		dt = this;
		if (!format) {
			return _date2string.call(dt);
			//format = "yyyy/MM/dd HH:mm:ss";
		}

		var 
		y = dt.getFullYear(),
		M = dt.getMonth() + 1,
		d = dt.getDate(),
		H = dt.getHours(),
		m = dt.getMinutes(),
		s = dt.getSeconds(),
		f = dt.getMilliseconds().toString(),
		pm = (H >= 12),
		ir = (pm) ? (H - 12) : H,
		wi = dt.getDay(),
		w = dt.getWeekNumber(),
		n = dt.getDayOfYear(),
		tokens = split(format),
		symbol = {},
		tmp;
		if (ir == 0) {
			ir = 12;
		}
		symbol = {
			y: y,
			yy: (EMPTY + y).substr(2, 2), // year without the century (range 00 to 99)
			yyy: y,
			yyyy: y, // year with the century
			M: M,
			MM: (M < 10) ? ("0" + M) : M, // month, range 01 to 12
			MMM: (sMN || shortMonthName)[M - 1], // abbreviated month name [FIXME: I18N]
			MMMM: (fMN || fullMonthName)[M - 1], // full month name
			d: d,
			dd: (d < 10) ? ("0" + d) : d, // the day of the month (range 01 to 31)
			ddd: (sWN || shortWeekName)[wi], // abbreviated weekday name [FIXME: I18N]
			dddd: (fWN || fullWeekName)[wi], // full weekday name
			H: H,
			HH: (H < 10) ? ("0" + H) : H, // hour, range 00 to 23 (24h format)
			m: m,
			mm: (m < 10) ? ("0" + m) : m, // minute, range 00 to 59
			s: s,
			ss: (s < 10) ? ("0" + s) : s, // seconds, range 00 to 59
			f: f.substr(0, 1),
			ff: padLeft(f.substr(0, 2), 2, "0"),
			fff: padLeft(f.substr(0, 3), 3, "0"),
			ffff: padLeft(f.substr(0, 4), 4, "0"),
			fffff: padLeft(f, 5, "0"),
			w: w,
			n: n
		};
		symbol.h = symbol.H;
		symbol.hh = symbol.HH;
		each(tokens, function(n, i) {
			tmp = symbol[n];
			if (!invalid(tmp)) {
				tokens[i] = tmp;
			}
		});
		return tokens.join(EMPTY);
	};
});

/// @part "../../encoding.js"
////////////////////////////////////////////////////////////
/**
 * {encoding}
 * yellow race<f.v.yuelin@gmail.com>
 *
 * depends: [base, extend]
 */
// 编码
exec(function() {
	// Unicode和UTF-8之间的转换关系表 UCS-4编码 	UTF-8字节流
	// U+00000000 – U+0000007F 	0xxxxxxx
	// U+00000080 – U+000007FF 	110xxxxx 10xxxxxx
	// U+00000800 – U+0000FFFF 	1110xxxx 10xxxxxx 10xxxxxx
	// U+00010000 – U+001FFFFF 	11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
	// U+00200000 – U+03FFFFFF 	111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
	// U+04000000 – U+7FFFFFFF 	1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
	
	// 我们一般将endian翻译成“字节序”，将big endian和little endian称作“大尾”和“小尾”。
	// UCS-2编码(16进制) 	UTF-8 字节流(二进制/十六进制)
	// 000000 - 00007F 		0zzzzzzz(00-7F)
	// 000080 - 0007FF 		110yyyyy(C0-DF) 10zzzzzz(80-BF)
	// 000800 - 00FFFF 		1110xxxx(E0-EF) 10yyyyyy 10zzzzzz
	// 010000 - 10FFFF		11110www(F0-F7) 10xxxxxx 10yyyyyy 10zzzzzz
	
	var 
	_fromUTF8 = function(buffer, i) {
		var m = buffer[i], n;
		if ((m & 0xF0) == 0xF0) {
			n = (m & 0x07) << 18 | (buffer[i + 1] & 0x3F) << 12 | (buffer[i + 2] & 0x3F) << 6 | buffer[i + 3] & 0x3F;
			// i += 4;
		} else if ((m & 0xE0) == 0xE0) {
			n = (m & 0x0F) << 12 | (buffer[i + 1] & 0x3F) << 6 | buffer[i + 2] & 0x3F;
			// i += 3;
		} else if((m & 0xC0) == 0xC0) {
			n = (m & 0x1F) << 6 | buffer[i + 1] & 0x3F;
			// i += 2;
		} else {
			n = m & 0x7F;
			// i++;
		}
		return n;
	},
	_toUTF8 = function(buffer, n) {
		if (n < 0x80) {
			buffer.push(n);							// 0zzzzzzz
			// return 1;
		} else if(n < 0x800) {
			buffer.push(0xC0 | 0x1F & n >> 6);		// 110yyyyy
			buffer.push(0x80 | 0x3F & n);			// 10zzzzzz
			// return 2;
		} else if(n < 0x10000) {
			buffer.push(0xE0 | 0x0F & n >> 12);		// 1110xxxx
			buffer.push(0x80 | 0x3F & n >> 6);		// 10yyyyyy
			buffer.push(0x80 | 0x3F & n);			// 10zzzzzz
			// return 3;
		} else {
			buffer.push(0xF0 | 0x07 & n >> 18);		// 11110www
			buffer.push(0x80 | 0x3F & n >> 12);		// 10xxxxxx
			buffer.push(0x80 | 0x3F & n >> 6);		// 10yyyyyy
			buffer.push(0x80 | 0x3F & n);			// 10zzzzzz
			// return 4;
		}
	},
	_fromUCS2 = function(buffer, i, endian) {
		if (endian) {
			return (buffer[i] << 8) + buffer[i + 1];
		} else {
			return (buffer[i + 1] << 8) + buffer[i];
		}
	},
	_toUCS2 = function(buffer, n, endian) {
		var a = n & 0xFF, b = n >> 8 & 0xFF;
		if (endian) {
			buffer.push(b, a);
		} else {
			buffer.push(a, b);
		}
		// return 2;
	}
	;


	// function utf16to8(str) {
	// 	var out = [], i, len, c;
	// 	len = str.length;
	// 	for (i = 0; i < len; i++) {
	// 		c = str.charCodeAt(i);
	// 		if ((c >= 0x0001) && (c <= 0x007F)) {
	// 			out.push(str.charAt(i));
	// 		} else if (c > 0x07FF) {
	// 			out.push(String.fromCharCode(0xE0 | ((c >> 12) & 0x0F)));
	// 			out.push(String.fromCharCode(0x80 | ((c >> 6) & 0x3F)));
	// 			out.push(String.fromCharCode(0x80 | ((c >> 0) & 0x3F)));
	// 		} else {
	// 			out.push(String.fromCharCode(0xC0 | ((c >> 6) & 0x1F)));
	// 			out.push(String.fromCharCode(0x80 | ((c >> 0) & 0x3F)));
	// 		}
	// 	}
	// 	return out.join("");
	// }

	// function utf8to16(str) {
	// 	var out = [], i, len, c, c2, c3;
	// 	len = str.length;
	// 	i = 0;
	// 	while (i < len) {
	// 		c = str.charCodeAt(i++);
	// 		switch (c >> 4) {
	// 			case 0:
	// 			case 1:
	// 			case 2:
	// 			case 3:
	// 			case 4:
	// 			case 5:
	// 			case 6:
	// 			case 7:
	// 				// 0xxxxxxx
	// 				out.push(str.charAt(i - 1));
	// 				break;
	// 			case 12:
	// 			case 13:
	// 				// 110x xxxx  10xx xxxx
	// 				c2 = str.charCodeAt(i++);
	// 				out.push(String.fromCharCode(((c & 0x1F) << 6) | (c2 & 0x3F)));
	// 				break;
	// 			case 14:
	// 				// 1110 xxxx  10xx xxxx  10xx xxxx
	// 				c2 = str.charCodeAt(i++);
	// 				c3 = str.charCodeAt(i++);
	// 				out.push(String.fromCharCode(((c & 0x0F) << 12) |
	// 					((c2 & 0x3F) << 6) |
	// 					((c3 & 0x3F) << 0)));
	// 				break;
	// 		}
	// 	}
	// 	return out.join("");
	// }


	var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
		52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
		15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
		41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

	//客户端Base64编码
	// window.btoa(unescape(encodeURIComponent(s)))
	function base64encode(bytes) {
		var out = [], i, len, c1, c2, c3;

		len = bytes.length;
		i = 0;
		while (i < len) {
			c1 = bytes[i++] & 0xff;
			if (i == len) {
				out.push(base64EncodeChars.charAt(c1 >> 2));
				out.push(base64EncodeChars.charAt((c1 & 0x3) << 4));
				out.push("==");
				break;
			}
			c2 = bytes[i++];
			if (i == len) {
				out.push(base64EncodeChars.charAt(c1 >> 2));
				out.push(base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4)));
				out.push(base64EncodeChars.charAt((c2 & 0xF) << 2));
				out.push("=");
				break;
			}
			c3 = bytes[i++];
			out.push(base64EncodeChars.charAt(c1 >> 2));
			out.push(base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4)));
			out.push(base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6)));
			out.push(base64EncodeChars.charAt(c3 & 0x3F));
		}
		return out.join(EMPTY);
	}
	//客户端Base64解码
	function base64decode(str) {
		var c1, c2, c3, c4, i, len, out = [];

		len = str.length;
		i = 0;
		while (i < len) {
			/* c1 */
			do {
				c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
			} while (i < len && c1 == -1);
			if (c1 == -1) {
				break;
			}

			/* c2 */
			do {
				c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
			} while (i < len && c2 == -1);
			if (c2 == -1) {
				break;
			}

			out.push((c1 << 2) | ((c2 & 0x30) >> 4));

			/* c3 */
			do {
				c3 = str.charCodeAt(i++) & 0xff;
				if (c3 == 61) {
					return out;
				}
				c3 = base64DecodeChars[c3];
			} while (i < len && c3 == -1);
			if (c3 == -1) {
				break;
			}

			out.push(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

			/* c4 */
			do {
				c4 = str.charCodeAt(i++) & 0xff;
				if (c4 == 61) {
					return out;
				}
				c4 = base64DecodeChars[c4];
			} while (i < len && c4 == -1);
			if (c4 == -1) {
				break;
			}
			out.push(((c3 & 0x03) << 6) | c4);
		}
		return out;
	}
	
	extend(F, {
		encoding: {
			// [obsolete]
			b2s: function(bytes, endian) {
				var buf = [], len = bytes.length, i = 0;
				for (; i < len; i++) {
					buf.push(String.fromCharCode(bytes[i]));
				}
				return buf.join(EMPTY);
			},
			// [obsolete]
			s2b: function(text) {
				var buf = [], len = text.length, i = 0;
				for (; i < len; i++) {
					buf.push(text.charCodeAt(i));
				}
				return buf;
			},
			ucs2: {
				/**
				 * @param endian true = Big-Endian, false = Little-Endian.
				 */
				utf8: function(bytes, endian) {
					var buf = [], len = bytes.length, i = 0, a = endian ? 0 : 1, b = endian ? 1 : 0, n;
					for (; i < len; i+=2) {
						n = _fromUCS2(bytes, i, endian);
						_toUTF8(buf, n);
					}
					return buf;
				},
				b2s: function(bytes, endian) {
					var buf = [], len = bytes.length, i = 0;
					for (; i < len; i+=2) {
						buf.push(String.fromCharCode(_fromUCS2(bytes, i, endian)));
					}
					return buf.join(EMPTY);
				},
				s2b: function(text, endian) {
					var buf = [], len = text.length, i = 0;
					for (; i < len; i++) {
						_toUCS2(buf, text.charCodeAt(i), endian);
					}
					return buf;
				}
			},
			utf8: {
				/**
				 * @param endian true = Big-Endian, false = Little-Endian.
				 */
				ucs2: function(bytes, endian) {
					var buf = [], len = bytes.length, i = 0, n;
					while (i < len) {
						n = _fromUTF8(bytes, i);
						_toUCS2(buf, n, endian);
						i += n < 0x80 ? 1 : n < 0x800 ? 2 : n < 0x10000 ? 3 : 4;
					}
					return buf;
				},
				b2s: function(bytes) {
					var buf = [], len = bytes.length, i = 0, n;
					while (i < len) {
						n = _fromUTF8(bytes, i);
						buf.push(String.fromCharCode(n));
						i += n < 0x80 ? 1 : n < 0x800 ? 2 : n < 0x10000 ? 3 : 4;
					}
					return buf.join(EMPTY);
				},
				s2b: function(text) {
					var buf = [], len = text.length, i = 0;
					for (; i < len; i++) {
						_toUTF8(buf, text.charCodeAt(i));
					}
					return buf;
				}
			},
			/**
			 * 注意：只支持字节(0~255)数组
			 */
			base64: {
				encode: base64encode,
				decode: base64decode
			}
		},
		// html attribute encode
		// < &lt;
		// & &amp;
		// ' &#39;
		// " &quot;
		// > &gt;	[optional] for html encode
		html: {
			encode: function(str) {
				return String(str)
					.replace(/&/g, '&amp;')
					.replace(/"/g, '&quot;')
					.replace(/'/g, '&#39;')
					.replace(/</g, '&lt;')
					.replace(/>/g, '&gt;');
			},
			decode: function(str) {
				return String(str)
					.replace(/&amp;/g, '&')
					.replace(/&quot;/g, '"')
					.replace(/&#39;/g, '\'')
					.replace(/&lt;/g, '<')
					.replace(/&gt;/g, '>');
			}
		}
	});

	// http://jsperf.com/htmlencoderegex/53
	var browser = F.browser, document = global.document;
	if (browser && document) {
		// var converter = G[name]("<div/>");
		F.html.encode = function(value) {
			// return converter.text(value).html();
			var el = document[CREATEELEMENT]('div');
			el.appendChild(document[CREATETEXTNODE](value));
			return el.innerHTML;
		};
		F.html.decode = function(value) {
			// return converter.html(value).text();
			var el = document[CREATEELEMENT]('div'); 
			el.innerHTML = value;
			return browser.ie 
				? el.innerText 
				: el.textContent;
		};
	}
});

/// @part "../../sbuilder.js"
////////////////////////////////////////////////////////////
/**
 * {sbuilder}
 * yellow race<f.v.yuelin@gmail.com>
 *
 * depends: [base, extend]
 */
// 字符串构造器
function SBuilder() {
	var self = this,
		buffer = [];
	extend(self, {
		length: function() {
			var l = buffer.length,
				i = 0,
				c = 0;
			for (; i < l; i++) {
				c += (EMPTY + buffer[i]).length;
			}
			return c;
		},
		count: function() {
			return buffer.length;
		},
		prepend: function() {
			_unshift.apply(buffer, arguments);
			return self;
		},
		append: function() {
			_push.apply(buffer, arguments);
			return self;
		},
		clear: function() {
			buffer.length = 0;
			return self;
		}
	});
	// 注意：toString 方法不能通过 extend 的方式处理，否则造成不兼容的情况。
	self.toString = function(seperator) {
		return buffer.join(seperator || EMPTY);
	};
}

var sbuilder = F.sbuilder = function() {
	return new SBuilder();
};
/// @part "../../namespace.js"
////////////////////////////////////////////////////////////
/**
 * {namespace}
 * yellow race<f.v.yuelin@gmail.com>
 *
 * depends: [base, extend, array]
 */
// 命名空间
// https://github.com/searls/extend.js
var 
namespace, 
extender;
exec(function () {
	
	/**
	 * 能否扩展（target 存在，target 不为 {} 对象，value 为简单对象，value 不为函数, target 不为函数）
	 */
	function canExtensible(existing, value, checkMore) {
		return existing 
			&& !isEmptyObject(existing) && isPlainObject(value)
			&& (!checkMore || (!isFunction(value) && !isFunction(existing)));
	}
	/**
	 * 根据指定的命名空间数组解决扩展
	 */
	function resolve(namespaces, root) {
		return namespaces.reduce(function (ancestor, child) {
			return ancestor[child] = ancestor[child] || {};
		}, root);
	}
	/**
	 * 验证 existing 是否为函数，并且 value !== existing，则抛出异常。
	 */
	function verify(name, value, existing) {
		if (isFunction(existing) && value && existing !== value) {
			error('Cannot define a new function "' + name + '", because one is already defined.');
		}
	}
	
	/**
	 * 根据指定的根节点进行扩展
	 * @param {object} root 根对象；
	 * @param {boolean} allowEx 是否允许使用 extend 进行简单扩展，默认不允许；
	 * @param {boolean} deepEx 是否深度扩展，默认不是；
	 * @return 返回一个扩展器。
	 */
	F.extender = extender = function (root, allowEx, deepEx) {
		/**
		 * 扩展命名空间
		 * @param {string|array} namespace 命名空间字符串，多层之间有`.`分隔，或者是字符串数组；
		 * @param value 可选值，如果指定则为赋值；
		 * @param {boolean} 检测命名空间的数据是否存在，存在则直接返回，否则赋值后再返回；
		 * @return 返回命名空间指定的目标。
		 */
		return function (namespace, value, exists) {
			var
			namespaces = isArray(namespace) ? namespace.slice() : namespace.split('.'),
			leaf = namespaces.pop(),
			parent = resolve(namespaces, root || global),
			target = parent[leaf];
			
			if (arguments.length > 1 && !isUndefined(value)) {
				verify(namespace, value, target);
				if (allowEx && canExtensible(target, value, exists)) {
					extend(!!deepEx, target, value);
				} else {
					if (exists && !isUndefined(target)) {
						return target;
					}
					parent[leaf] = target = value;
				}
			}
			return target;
		};
	};
	
	F.namespace = namespace = extender(global);
});

/// @part "../../async.js"
////////////////////////////////////////////////////////////
/**
 * {async}
 * yellow race<f.v.yuelin@gmail.com>
 *
 * depends: [base, extend]
 */
// 异步
function Async() {
	var
	self = this,
	id,					// TimeoutId
	result,				// 最后一次运行的结果
	queue = [],			// 队列
	idle = TRUE,		// 空闲状态
	ready = TRUE,		// 就绪状态
	/**
	 * 运行
	 */
	run = function() {
		if (id) {
			_clearTimeout(id);
			id = NULL;
		}
		while (queue.length > 0) {
			if (!ready) {
				break;
			}
			
			var
			obj = queue[0],
			delay = obj.delay;
			
			if (isFunction(obj.ready)) {
				if (!obj.ready(F, global)) {
					if (isNumber(obj.count) && obj.count > 0 && --obj.count <= 0) {
						if (isFunction(obj.skip) && obj.skip(F, global)) {
							queue.shift();
							continue;
						}
					} else {
						exec(delay);
						return;
					}
				}
			} else if (delay > 0) {
				obj.delay = 0;
				exec(delay);
				return;
			}
			
			if (queue.shift()) {
				var callback = obj.callback;
				if (isFunction(callback)) {
					result = callback.call(global, result, isNumber(obj.count) ? obj.count : 0);
				}
			}
		}
		idle = TRUE;
	},
	/**
	 * 执行当前队列
	 */
	exec = function (delay) {
		if (idle || delay) {
			idle = FALSE;
			if (delay && delay > 0) {
				id = _setTimeout(run, delay);
			} else if (delay < 0 && process) {
				process.nextTick(run);
			} else {
				run();
			}
		}
	},
	/**
	 * 自动执行
	 */
	autoexec = function () {
		if (idle && ready && queue.length > 0) {
			exec(queue[0].delay);
		}
		return self;
	};
	extend(self, {
		/**
		 * 是否在忙？
		 */
		busy: function() {
			return !idle;
		},
		/**
		 * 队列数量
		 */
		count: function() {
			return queue.length;
		},
		/**
		 * 清除队列
		 */
		clear : function () {
			if (id) {
				_clearTimeout(id);
				idle = TRUE;
				id = NULL;
			}
			queue.length = 0;
			return self;
		},
		/**
		 * 中断
		 */
		abort : function () {
			self.clear();
			result = undefined;
			return self;
		},
		/**
		 * 暂停
		 */
		pause : function () {
			ready = FALSE;
			return self;
		},
		/**
		 * 继续
		 */
		resume : function () {
			ready = TRUE;
			return autoexec();
		},
		/**
		 * 锁定执行
		 * @param {void function(unlock)} func 要执行的函数
		 * @param {function} callback 回调函数，在 unlock 函数后调用；
		 * @param {boolean} reusable 可重复使用的？
		 */
		lock : function (func, callback, reusable) {
			if (isFunction(func)) {
				if (isFunction(callback)) {
					self.next(function() {
						self.pause();
						var i = 0;
						func(function() {
							if (0 == i++ || reusable) {
								callback.apply(this, _slice.call(arguments));
								self.resume();
							}
						});
					});
				} else {
					self.next(func);
				}
			}
			return self;
		},
		/**
		 * 间隔 delay 毫秒执行一次，直到 func 返回 false 才能转到下一步。
		 * @param {bool function(result, counter)} func 调用函数；
		 * @param {integer} delay 延迟时间（毫秒）；
		 * @param {boolean} immediately 是否立即执行；
		 */
		interval : function (func, delay, immediately) {
			if (isFunction(func)) {
				var 
				counter = 0,
				fn = function (r) {
					r = func(r, ++counter);
					if (r !== FALSE) {
						self.next(fn, delay);
					}
					return r;
				};
				self.next(fn, immediately ? 0 : delay);
			}
			return autoexec();
		},
		/**
		 * 直到 ready 函数返回 true 才执行 callback 函数，否则执行 loop 函数后再次检查。
		 * @param {function(ready.result, counter)} callback 回调函数；
		 * @param {function(next, counter)} loop 循环函数，需要手动调用 next 才会再次去检查；
		 * @param {function<next.sender>(...)} ready 就绪检测函数；
		 * @param {integer} delay 延迟时间（毫秒）；
		 * @param {boolean} immediately 是否立即执行，默认为false；
		 * @param {boolean} loopPriority 是否循环优先，默认为false；
		 */
		until: function(callback, loop, ready, delay, immediately, loopPriority) {
			if (isFunction(loop) && isFunction(ready)) {
				var r,
				counter = 0,
				next = function() {
					if (!(r = ready.apply(this, arguments))) {
						self.next(fn, delay);
					} else if(isFunction(callback)) {
						callback(r, counter);
					}
				},
				fn = function() {
					loop(next, ++counter);
				};
				self.next(loopPriority ? fn : next, immediately ? 0 : delay);
			}
			return self;
		},
		/**
		 * 检查 check 函数执行结果为 true 时再调用 callback 函数。
		 * @param {function} check 检测函数；
		 * @param {function} callback 回调函数，当 skip 函数返回 true 时不执行该函数；
		 * @param {integer} delay 延迟时间（毫秒）；
		 * @param {integer} count 限制次数，当 count 大于 0 时，并且检查失败超过 count 次时则继续回调函数 callback 的执行；
		 * @param {function} skip 检测失败并且超过指定次数后，由该函数决定是否跳过 callback 的执行，默认不跳过 callback 的执行；
		 */
		ready : function (check, callback, delay, count, skip) {
			if (isFunction(check)) {
				queue.push({
					ready : check,
					callback : callback,
					delay : (isNaN(delay) ? 0 : delay),
					count : count,
					skip : skip
				});
			}
			return autoexec();
		},
		/**
		 * 隔 delay 毫秒后执行 callback 函数。
		 * @param {function} callback 回调函数；
		 * @param {integer} delay 延迟时间（毫秒）；
		 */
		next : function (callback, delay) {
			if (isFunction(callback)) {
				queue.push({
					callback : callback,
					delay : delay || 0
				});
			}
			return autoexec();
		}
	});
}
var async = F.async = function () {
	return new Async();
};

/// @part "../../sync.js"
////////////////////////////////////////////////////////////
/**
 * {sync}
 * yellow race<f.v.yuelin@gmail.com>
 *
 * depends: [base, extend, async]
 */
// 同步
exec(function() {
	var expando = uniqueId("SYNC");
	extend(F, {
		sync : function (obj, func, callback, reusable) {
			var as = obj[expando];
			if (!as) {
				obj[expando] = as = async();
			}
			
			return as.lock(func, callback, reusable);
			
			// if (isFunction(callback)) {
				// as.next(function() {
					// as.pause();
					// func(function() {
						// callback.apply(this, _slice.call(arguments));
						// as.resume();
					// });
				// });
			// } else {
				// as.next(func);
			// }
		}
	});
});
/// @part "../../defer.js"
////////////////////////////////////////////////////////////
/**
 * {defer}
 * yellow race<f.v.yuelin@gmail.com>
 *
 * depends: [base, extend]
 */
// 延缓执行
extend(F, {
	/**
	 * 延缓执行 callback 函数，直到 defer`count == 0 时才执行回调。
	 * @param {function<context>([...])} callback 回调函数；
	 * @param {integer} number 初始化基本需要调用的次数，默认为1次；
	 * @param {object} context 回调的 this 对象；
	 * @param {boolean} keep 是否保留参数给回调函数使用，默认不保留；
	 * @param {function(counter, set_counter)} release 当 ready`func 函数返回 false 时的取消函数，默认为中断回调；
	 */
	defer : function (callback, number, context, keep, release) {
		if (!isNumber(number) || number < 0) {
			number = 1;
		}
		var
		obj = context || this,
		childs = NULL,
		set_counter = 0,
		counter = 0,
		count = number,
		abort = FALSE,
		args = [],
		pars = [],
		last = NULL,
		readyStatus = function() {
			return abort === FALSE;
		},
		defer = function () {
			if (count > 0) {
				var self = this, params = arguments, byReadyIndex = self && isNumber(self.index);
				if (keep) {
					params = params.length <= 1 ? params[0] : _slice.call(params);
					if (byReadyIndex) {
						// console.log(expando, self.index, "End.");	// for Test
						args[self.index] = params;
					} else {
						pars.push(params);
					}
				} else {
					if (!byReadyIndex) {
						pars = _slice.call(params);
					}
				}
				
				if (--count == 0) {
					if (isFunction(callback)) {
						callback.apply(obj, args.concat(pars));
					}
					if (isFunction(defer.more)) {
						process.nextTick(defer.more);
					}
					if (defer.previous) {
						delete defer.previous;
					}
					if (defer.parent) {
						if (defer.id) {
							delete defer.parent[defer.id];
						}
						delete defer.parent;
					}
					args = [];
					pars = [];
					set_counter = counter = 0;	// 重置计数器
					childs = NULL;
				}
			} else if(count == -1) {
				count--;
				if (isFunction(abort)) {
					abort.call(callback, counter, set_counter);
				}
			}
			return defer;
		};
		// 获取回调的参数
		defer.get = function(index) {
			if (keep) return args[index];
		};
		defer.status = function() {
			return count;
		};
		/**
		 * 获取更多就绪函数
		 * @param {function} func 调用函数；
		 * @param {integer} index 索引，默认自动编号；
		 * @return 返回一个函数。
		 */
		defer.ready = function (func, index, isset) {
			if (!readyStatus()) {
				return noop;
			}
			
			if (!isNumber(index)) {
				index = isNumber(func) ? func : counter;
			}
			// console.log(expando, index, "Start.");	// for Test
			counter++;
			count++;
			var fn = function () {
				var params = _slice.call(arguments), result;
				if (readyStatus()) {
					if (isFunction(func)) {
						result = func.apply(this, params);
						if (result === FALSE) {
							if (!release) {
								return;	// exit defer
							}
							defer.abort(release);
						} else if(isset) {
							set_counter--;
						}
					}
				} else {
					if (func && isFunction(func = func.release)) {
						func.apply(this, params);
					}
				}
				defer.apply({index:index}, params);
			};
			fn.isReady = readyStatus;
			return fn;
		};
		defer.set = function(obj, attr, check, convert) {
			if (!readyStatus()) {
				return noop;
			}
			set_counter++;
			return defer.ready(F.set(obj, attr, check, convert), NULL, TRUE);
		};
		defer.wrap = function(func, index, isset) {
			var fn = defer.ready(func, index, isset);
			fn.defer = defer;
			return fn;
		};
		defer.next = function(callback, number, context, keep, release) {
			if (readyStatus()) {
				var i = uniqueId("DEFER"), d = F.defer(defer.ready(callback), number, context, keep, release);
				if (!childs) {
					childs = {};
				}
				if (number === 0 && context === FALSE) {
					d.id = i;
					d.parent = childs;
				}
				d.previous = last;
				last = d;
				childs[i] = d;
				return d;
			}
			return NULL;
		};
		defer.fornext = function(func, callback, number, context, keep, release) {
			if (readyStatus()) {
				var d = defer.next(callback, number, context, keep, release), p = d.previous, fn = function() {
					if (p && p.more === fn) {
						p.more = NULL;
						delete p.more;
					}
					if (isFunction(func)) {
						func(d);
					}
					d();
				};
				if (p && p.status() != 0) {
					p.more = fn;	
				} else {
					fn();
				}
				return d;
			}
			return NULL;
		};
		/**
		 * 取消延缓
		 * @param {function} dispose 释放资源函数；
		 */
		defer.abort = function(dispose) {
			if (readyStatus()) {
				abort = isFunction(dispose) ? dispose : noop;

				count = -1;
				if (defer.previous) {
					delete defer.previous;
				}
				if (defer.parent) {
					if (defer.id) {
						delete defer.parent[defer.id];
					}
					delete defer.parent;
				}
				if (childs) {
					each(childs, function(it, id) {
						it.abort();
					});
					childs = NULL;
				}
				defer();	// 主动终止
				return TRUE;
			}
		};
		return defer;
	}, 
	call: defer_callback
});

function defer_callback(d, c, r) {
	if (d) {
		// d is defer object
		if (d.defer) {
			d = d.defer;
		}
		if (d.ready) {
			if (isFunction(r)) {
				c.release = r;
			}
			c = d.ready(c);
		}
	}
	return c;
}
/// @part "../../callbacks.js"
////////////////////////////////////////////////////////////
/**
 * {callbacks}
 * yellow race<f.v.yuelin@gmail.com>
 *
 * depends: [base]
 */
// 回调列表
var callbacks;
exec(function () {
	// String to Object flags format cache
	var flagsCache = {};
	
	// Convert String-formatted flags into Object-formatted ones and store in cache
	function createFlags(flags) {
		return flagsCache[flags] = hash(flags);
	}
	
	/*
	 * Create a callback list using the following parameters:
	 *
	 *	flags:	an optional list of space-separated flags that will change how
	 *			the callback list behaves
	 *
	 * By default a callback list will act like an event callback list and can be
	 * "fired" multiple times.
	 *
	 * Possible flags:
	 *
	 *	once:			will ensure the callback list can only be fired once (like a Deferred)
	 *
	 *	memory:			will keep track of previous values and will call any callback added
	 *					after the list has been fired right away with the latest "memorized"
	 *					values (like a Deferred)
	 *
	 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
	 *
	 *	stopOnFalse:	interrupt callings when a callback returns false
	 *
	 */
	F.callbacks = callbacks = function (flags) {
		// Convert flags from String-formatted to Object-formatted
		// (we check in cache first)
		flags = flags ? (flagsCache[flags] || createFlags(flags)) : {};
		
		var // Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = [],
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Add one or several callbacks to the list
		add = function (args) {
			var i,
			length,
			elem,
			type,
			actual;
			for (i = 0, length = args.length; i < length; i++) {
				elem = args[i];
				type = typename(elem);
				if (type === "array") {
					// Inspect recursively
					add(elem);
				} else if (type === "function") {
					// Add if not in unique mode and callback is not in
					if (!flags.unique || !self.has(elem)) {
						list.push(elem);
					}
				}
			}
		},
		// Fire callbacks
		fire = function (context, args) {
			args = args || [];
			memory = !flags.memory || [context, args];
			fired = TRUE;
			firing = TRUE;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			for (; list && firingIndex < firingLength; firingIndex++) {
				if (list[firingIndex].apply(context, args) === FALSE && flags.stopOnFalse) {
					memory = TRUE; // Mark as halted
					break;
				}
			}
			firing = FALSE;
			if (list) {
				if (!flags.once) {
					if (stack && stack.length) {
						memory = stack.shift();
						self.fireWith(memory[0], memory[1]);
					}
				} else if (memory === TRUE) {
					self.disable();
				} else {
					list = [];
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add : function () {
				if (list) {
					var length = list.length;
					add(arguments);
					// Do we need to add the callbacks to the
					// current firing batch?
					if (firing) {
						firingLength = list.length;
						// With memory, if we're not firing then
						// we should call right away, unless previous
						// firing was halted (stopOnFalse)
					} else if (memory && memory !== TRUE) {
						firingStart = length;
						fire(memory[0], memory[1]);
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove : function () {
				if (list) {
					var args = arguments,
					argIndex = 0,
					argLength = args.length;
					for (; argIndex < argLength; argIndex++) {
						for (var i = 0; i < list.length; i++) {
							if (args[argIndex] === list[i]) {
								// Handle firingIndex and firingLength
								if (firing) {
									if (i <= firingLength) {
										firingLength--;
										if (i <= firingIndex) {
											firingIndex--;
										}
									}
								}
								// Remove the element
								list.splice(i--, 1);
								// If we have some unicity property then
								// we only need to do this once
								if (flags.unique) {
									break;
								}
							}
						}
					}
				}
				return this;
			},
			// Control if a given callback is in the list
			has : function (fn) {
				if (list) {
					var i = 0,
					length = list.length;
					for (; i < length; i++) {
						if (fn === list[i]) {
							return TRUE;
						}
					}
				}
				return FALSE;
			},
			// Remove all callbacks from the list
			empty : function () {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable : function () {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled : function () {
				return !list;
			},
			// Lock the list in its current state
			lock : function () {
				stack = undefined;
				if (!memory || memory === TRUE) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked : function () {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith : function (context, args) {
				if (stack) {
					if (firing) {
						if (!flags.once) {
							stack.push([context, args]);
						}
					} else if (!(flags.once && memory)) {
						fire(context, args);
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire : function () {
				self.fireWith(this, arguments);
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired : function () {
				return !!fired;
			}
		};
		
		return self;
	};
});

/// @part "../../deferred.js"
////////////////////////////////////////////////////////////
/**
 * {deferred}
 * yellow race<f.v.yuelin@gmail.com>
 *
 * depends: [base, extend, callbacks]
 */
// 递延、延迟、异步队列
extend(F, {
	deferred : function (func) {
		var
		once = "once",
		memory = "memory",
		doneList = callbacks(once + SPACE + memory),
		failList = callbacks(once + SPACE + memory),
		progressList = callbacks(memory),
		state = "pending",
		lists = {
			resolve : doneList,
			reject : failList,
			notify : progressList
		},
		promise = {
			done : doneList.add,
			fail : failList.add,
			progress : progressList.add,
			
			state : function () {
				return state;
			},
			
			// Deprecated
			isResolved : doneList.fired,
			isRejected : failList.fired,
			
			then : function (doneCallbacks, failCallbacks, progressCallbacks) {
				deferred.done(doneCallbacks).fail(failCallbacks).progress(progressCallbacks);
				return this;
			},
			always : function () {
				deferred.done.apply(deferred, arguments).fail.apply(deferred, arguments);
				return this;
			},
			pipe : function (fnDone, fnFail, fnProgress) {
				return F.deferred(function (newDefer) {
					each({
						done : [fnDone, "resolve"],
						fail : [fnFail, "reject"],
						progress : [fnProgress, "notify"]
					}, function (handler, data) {
						var fn = data[0],
						action = data[1],
						returned;
						if (isFunction(fn)) {
							deferred[handler](function () {
								returned = fn.apply(this, arguments);
								if (returned && isFunction(returned.promise)) {
									returned.promise().then(newDefer.resolve, newDefer.reject, newDefer.notify);
								} else {
									newDefer[action + "With"](this === deferred ? newDefer : this, [returned]);
								}
							});
						} else {
							deferred[handler](newDefer[action]);
						}
					});
				}).promise();
			},
			// Get a promise for this deferred
			// If obj is provided, the promise aspect is added to the object
			promise : function (obj) {
				if (obj == NULL) {
					obj = promise;
				} else {
					for (var key in promise) {
						obj[key] = promise[key];
					}
				}
				return obj;
			}
		},
		deferred = promise.promise({}),
		key;
		
		for (key in lists) {
			deferred[key] = lists[key].fire;
			deferred[key + "With"] = lists[key].fireWith;
		}
		
		// Handle state
		deferred.done(function () {
			state = "resolved";
		}, failList.disable, progressList.lock).fail(function () {
			state = "rejected";
		}, doneList.disable, progressList.lock);
		
		// Call given func if any
		if (func) {
			func.call(deferred, deferred);
		}
		
		// All done!
		return deferred;
	},
	// Deferred helper
	when : function (firstParam) {
		var args = _slice.call(arguments),
		i = 0,
		length = args.length,
		pValues = new Array(length),
		count = length,
		pCount = length,
		deferred = length <= 1 && firstParam && isFunction(firstParam.promise) ?
			firstParam :
			F.deferred(),
		promise = deferred.promise();
		function resolveFunc(i) {
			return function (value) {
				args[i] = arguments.length > 1 ? _slice.call(arguments) : value;
				if (!(--count)) {
					deferred.resolveWith(deferred, args);
				}
			};
		}
		function progressFunc(i) {
			return function (value) {
				pValues[i] = arguments.length > 1 ? _slice.call(arguments) : value;
				deferred.notifyWith(promise, pValues);
			};
		}
		if (length > 1) {
			for (; i < length; i++) {
				if (args[i] && args[i].promise && isFunction(args[i].promise)) {
					args[i].promise().then(resolveFunc(i), deferred.reject, progressFunc(i));
				} else {
					--count;
				}
			}
			if (!count) {
				deferred.resolveWith(deferred, args);
			}
		} else if (deferred !== firstParam) {
			deferred.resolveWith(deferred, length ? [firstParam] : []);
		}
		return promise;
	}
});

/// @part "utils.source.js"
////////////////////////////////////////////////////////////
/**
 * {utils}
 * yellow race<f.v.yuelin@gmail.com>
 *
 * depends: [base, extend]
 */
// 辅助
exec(function() {

	function sureDirectoryExists(spec) {
		var path = PATH.dirname(PATH.normalize(spec)), i = path.length, l = [];
		while(i > 0 && !FS.existsSync(path.substring(0, i))) {
			l.push(i);
			i = path.lastIndexOf(PATH.sep, i - 1);
		}
		while(l.length > 0) {
			FS.mkdirSync(path.substring(0, l.pop()));
		}
	}
	function isExists(spec, message) {
		var r = FS.existsSync(spec);
		if (!r && message != NULL) {
			error(message || "The path does not exist: " + spec);
		}
		return r;
	}
	function isFile(spec, message) {
		var r = isExists(spec, message) && FS.statSync(spec).isFile();
		if (!r && message != NULL) {
			error(message || "Is not a valid file: " + spec);
		}
		return r;
	}
	function isDirectory(spec, message) {
		var r = isExists(spec, message) && FS.statSync(spec).isDirectory();
		if (!r && message != NULL) {
			error(message || "Is not a valid directory: " + spec);
		}
		return r;
	}
	function loadFile(filename, encoding) {
		var spec = PATH.resolve(filename);
		if (isFile(spec, NULL)) {
			return FS.readFileSync(spec, {encoding:encoding || "utf8"});
		}
		return NULL;
	}
	function saveFile(filename, data, encoding, sure) {
		var spec = PATH.resolve(filename);
		if (sure) {
			sureDirectoryExists(spec);
		}
		return FS.writeFileSync(spec, data, {encoding:encoding});
	}
	function appendFile(filename, data, encoding, sure) {
		var spec = PATH.resolve(filename);
		if (sure) {
			sureDirectoryExists(spec);
		}
		return FS.appendFileSync(spec, data, {encoding:encoding});
	}

	extend(F, {
		inspect : UTIL.inspect,
		inherits: UTIL.inherits,
		// resolve : PATH.resolve,
		isExists : isExists,
		isFile : isFile,
		isDirectory : isDirectory,
		sureDirectoryExists: sureDirectoryExists,
		loadFile : loadFile,
		saveFile : saveFile,
		appendFile : appendFile,
		deleteFile : function(filename) {
			if (isFile(filename, NULL)) {
				FS.unlinkSync(filename);
			}
		}
	});
	
}, !(isNode && UTIL && PATH && FS));

/// @part "http.source.js"
////////////////////////////////////////////////////////////
/**
 * {http}
 * yellow race<f.v.yuelin@gmail.com>
 *
 * depends: [base, defer, utils]
 */
// HTTP请求
exec(function() {

	// F.buffer = function(limit) {
	// 	var counter = 0, cache = [];
	// 	return {
	// 		get: function(limitSize) {
	// 			if (counter < limit) {
	// 				for(var i=0, j=Math.max(limit,cache.length), buf; i<j; i++) {
	// 					buf = cache[i];
	// 					if (!buf) {
	// 						cache[i] = buf = new Buffer(limitSize);
	// 					}
	// 					if (!isNumber(buf.index)) {
	// 						buf.index = i;
	// 						counter++;
	// 						return buf;
	// 					}
	// 				}
	// 			}
	// 			return NULL;
	// 		}, 
	// 		set: function(buf, force) {
	// 			if (isNumber(buf.index)) {
	// 				if (force) {
	// 					cache[buf.index] = NULL;
	// 				}
	// 				buf.index = undefined;
	// 				delete buf.index;
	// 				buf = NULL;
	// 				counter--;
	// 			}
	// 		}
	// 	};
	// };
	/**
	 * 创建 HTTP 对象
	 * @param {integer} limit 可选，HTTP 请求个数限制，默认为100个；
	 * @param {boolean} debugMode 可选，是否为调试模式；
	 * @param {string} defaultCharset 默认字符集；
	 */
	F.http = function (name, limit, debugMode, defaultCharset, defaultAgent) {

		var
		counter = 0, 					// 下载计数
		maxlimit = limit || 100, 		// 同时下载线程的限制个数
		// buffers = F.buffer(maxlimit),	// 全局缓冲
		cache = {},						// 异步请求头缓存，用来中止请求
		stack = [],						// 下载堆栈
		T = {
			debugMode: debugMode || FALSE,
			get : T_get,
			post : T_post,
			submit : T_submit,
			download : T_download,
			// request : T_request,
			// result : T_result,
			// ready : T_ready,
			// info : function() {
			// 	return "counter:" + counter + ", stack:" + stack.length + ", " + toString(cache);
			// },
			abort : function() {
				if (T.debugMode) {
					log(" >> [ABORT] counter:" + counter + ", stack:" + stack.length + ", " + toString(cache));
				}
				each(cache, function(token,id) {
					if (token) {
						token.req.abort();
						token.req = NULL;
						if (token.res) {
							token.res = NULL;
							// counter--;
						}
					}
					cache[id] = token = NULL;
					delete cache[id];
				});
				// 重置
				// cache = {};
				stack = [];
				counter = 0;
			},
			idle : T_idle
		};

		/**
		 * GET 方式请求数据；
		 * @param url, 请求的路径；
		 * @param success, 成功回调函数，有一个数据参数；
		 * @param fail, 失败回调函数，有一个错误描述参数；
		 * @param charset, 请求的字符集名称，默认为 utf8；
		 */
		function T_get(url, success, fail, charset) {
			T_request("GET", url, NULL, NULL, defer_callback(success, function (token) {
				T_result(token, success, fail, charset);
			}, complete), charset);
		}
		/**
		 * POST 方式请求数据；
		 * @param url, 请求的路径；
		 * @param data, 请求的数据；
		 * @param success, 成功回调函数，有一个数据参数；
		 * @param fail, 失败回调函数，有一个错误描述参数；
		 * @param charset, 请求的字符集名称，默认为 utf8；
		 */
		function T_post(url, data, success, fail, charset) {
			T_request("POST", url, data, NULL, defer_callback(success, function (token) {
				T_result(token, success, fail, charset);
			}, complete), charset);
		}
		function T_submit(url, data, file, success, fail, charset, mime) {
			if (!file) {
				return T_post(url, data, success, fail, charset);
			}
			
			var boundary = uniqueId("BOUNDARY"),
			formitem = function (k, v) {
				var item = "--" + boundary + "\r\nContent-Disposition: form-data; name=\"" + k + "\"\r\n\r\n" + v + "\r\n";
				length += BUFFER.byteLength(item, charset);
				return function (r, next) {
					r.write(item, charset);
					next();
				};
			},
			fileitem = function (k, v) {
				var stats = FS.statSync(v);
				if (!stats.isFile()) {
					return noop;
				}
				var start = "--" + boundary + "\r\nContent-Disposition: form-data; name=\"" + k + "\"; filename=\"" + v + "\"\r\nContent-Type: " + mime.lookup(v) + "\r\n\r\n",
				end = "\r\n";
				length += BUFFER.byteLength(start, charset) + stats.size + BUFFER.byteLength(end, charset);
				return function (r, next) {
					r.write(start, charset);
					FS.createReadStream(v).on("data", function (chunk) {
						r.write(chunk);
					}).on("end", function () {
						r.write(end, charset);
						next();
					});
				};
			},
			buildrequest = function (obj, method) {
				for (var k in obj) {
					var v = obj[k];
					if (isArray(v)) {
						v.forEach(function (t) {
							list.push(method(k, t));
						});
					} else {
						list.push(method(k, v));
					}
				}
			},
			EOS = "--" + boundary + "--",
			length = EOS.length,
			list = [];
			buildrequest(data, formitem);
			buildrequest(file, fileitem);
			T_request("POST", url, function (req) {
				callnext(list.concat(function () {
						req.end();
					}), 0, req);
			}, function (r) {
				r.headers["content-type"] = "multipart/form-data";
				r.headers["content-length"] = length;
			}, defer_callback(success, function (token) {
				T_result(token, success, fail, charset);
			}, complete), charset);
		}
		/**
		 * 用 GET 方式下载 URL 的数据并保存到指定的文件。
		 * @param url, 请求的路径；
		 * @param file, 保存文件路径名称，可以为相对路径；
		 * @param checkexists, 是否检查文件已经存在，只有不存在文件才进行下载；
		 * @param success, 成功回调函数，有一个数据长度参数；
		 * @param fail, 失败回调函数，有一个错误描述参数；
		 */
		function T_download(url, file, checkexists, success, fail) {
			if (!url) {
				return 0;
			}
			if (!file) {
				file = "." + URL.parse(url).pathname;
			} else if (/[\\\/]$/.test(file)) {
				file += PATH.basename(URL.parse(url).pathname);
			}
			if (checkexists) {
				file = PATH.resolve(file);
				if (F.isFile(file)) {
					if (success) {
						success(FS.statSync(file).size);
					}
					return -1;
				}
			} 
			T_request("GET", url, NULL, NULL, defer_callback(success, function (token) {
				T_result(token, function (buffer) {
					if (!invalid(buffer)) {
						F.saveFile(file, buffer, undefined, TRUE);
						if (success) {
							success(buffer.length);
						}
					} else {
						if (success) {
							success(0);
						}
					}
				}, fail, NULL);
			}, complete));
			return 1;
		}
		/**
		 * 自定义请求。
		 * @param method, 请求方式；
		 * @param url, 请求路径；
		 * @param data, 请求的数据，或一个自定义的数据提交头，有一个 HttpRequest 参数；
		 * @param header, 请求头数据处理函数，有一个字典对象参数。
		 * @param callback, 请求成功后的回调函数，有一个 HttpResponse 参数，失败则有一个 FALSE 参数，跳过则有一个 NULL 参数；
		 * @param charset, 请求的字符集名称，默认为 utf8；
		 */
		function T_request(method, url, data, header, callback, charset) {
			if (method && url) {
				T_ready(function () {
					var req, h, r = callback.isReady;
					if (isFunction(r) && !r()) {
						callback(NULL);
						return;
					}

					counter++;

					h = build(method, url, data);
					if (isFunction(header) && (r = header(h)) && h != r) {
						h = r;
					}
					req = send(h, function(res, ex) {
						var id, token = ex;
						if (res) {
							id = uniqueId("R");
							token = {
								id: id,
								req: req,
								res: res
							};
							cache[id] = token;
							res.on("end", function() {
								delete cache[id];
								process.nextTick(T_idle); // T_idle();
							});
						}
						callback(token);
						counter--;
					});
					if (data != NULL) {
						if (isFunction(data)) {
							data(req);
						} else {
							req.end(data, charset || "utf8");
						}
					} else {
						req.end();
					}
					if (T.debugMode) {
						log(" >> " + url);
					}
				});
			}
		}
		/**
		 * 处理返回结果。
		 * @param {id:"R....", req:{...}, res:{...}} token, HttpResponse 对象；
		 * @param success, 成功回调函数，有一个数据参数；
		 * @param fail, 失败回调函数，有一个错误描述参数；
		 * @param charset, 请求的字符集名称，如果不指定则返回一个缓冲，否则返回字符串结果给 success 回调函数；
		 */
		function T_result(token, success, fail, charset) {
			if (!isObject(token) || !token.res) {
				var r = NULL;
				if (fail) {
					r = fail(token);
				}
				if (success) {
					success(r);
				}
				return;
			}
			if (!fail && !success) {
				return complete(token);
			}

			var 
			ex = NULL,
			len = 0,
			res = token.res,
			limitSize = _parseInt(res.headers["content-length"]) || 102400, // default is 100 KB
			buffer;
			token.res = NULL;	// set null
			if (fail) {
				res.on("close", function (err) {
					ex = err || TRUE;
					fail(err || FALSE);
					complete(token);
				});
			}
			if (success) {
				if (isUndefined(charset) && isString(defaultCharset)) {
					charset = defaultCharset;
				}
				if (charset) {
					buffer = [];
					res.setEncoding(charset);
					res.on("data", function (chunk) {
						buffer.push(chunk);
					}).on("end", function () {
						// 过滤掉BOM字符
						var i = 0, s = buffer.join("");
						while(i < s.length) {
							if(s.charCodeAt(i) !== 0xFEFF) {
								break;
							}
							i++;
						}
						success(i > 0 ? s.substr(i) : s);
						buffer = NULL;
						if (!ex) {
							complete(token);
						}
					});
				} else {
					// buffer = buffers.get(limitSize);
					buffer = new Buffer(limitSize);
					res.on("data", function (chunk) {
						if (len < limitSize) {
							chunk.copy(buffer, len);
							len += chunk.length;
						}
					}).on("end", function () {
						if (len < limitSize) {
							buffer = buffer.slice(0, len);
						}
						success(isFunction(defaultCharset) ? defaultCharset(buffer) : buffer);
						// buffers.set(buffer);
						buffer = NULL;
						if (!ex) {
							complete(token);
						}
					});
				}
			}
		}
		/**
		 * 当下载器就绪后，执行回调函数。
		 */
		function T_ready(callback) {
			if (counter >= maxlimit) {
				stack.push(callback);
			} else {
				callback();
			}
		}
		/**
		 * 闲置，检测下载队列中是否有未执行的请求，并作相应处理。
		 */
		function T_idle() {
			while (counter < maxlimit && stack.length > 0) {
				stack.pop()();
			}
			if (counter < Math.min(10, maxlimit / 10)) {
				if (T.debugMode) {
					log(" >> Idle(" + name + ", "+ counter + ").");
				}
			}
		}

		/**
		 * 构建一个请求头
		 * @param {string} method 请求方法，默认为 GET 方式；
		 * @param {string} url HTTP 完整路径；
		 * @param {string} data 请求数据，可以为空；
		 */
		function build(method, url, data) {
			var 
			u = URL.parse(url),
			h = {
				// "user-agent": "Mozilla/5.0 (Windows NT 5.2; rv:15.0) Gecko/20100101 Firefox/15.0"	// 模拟 Firefox 浏览器
			},
			r = {
				headers : h,
				host : u.host.split(":", 1)[0],
				port : u.port || 80,
				method : method || "GET",
				path : u.path
			};
			if (isFunction(defaultAgent)) {
				defaultAgent(r, u);
			}
			if (method == "POST") {
				h["content-type"] = "application/x-www-form-urlencoded; charset=utf-8";
				if (isString(data)) {
					h["content-length"] = data.length;
				}
			}
			return r;
		}
		function send(options, callback) {
			return HTTP.request(options, callback)
			.on("continue", function () {
				if (T.debugMode) {
					log(" >>> [ERR] 101-continue.", arguments);
				}
				callback(FALSE);
				complete();
			})
			.on("error", function (e) {
				if (T.debugMode) {
					log(" >>> [ERR] " + e.message + ", " + options.method + " " + options.path);
				}
				callback(FALSE, e);
				complete();
			});
		}
		function complete(token) {
			// if (!isNull(token)) {	// NULL is skip
			// 	counter--;
			// }
		}
		return T;
	};
}, !(isNode && URL && HTTP && PATH && FS && BUFFER));

/// @part "load.source.js"
////////////////////////////////////////////////////////////
/**
 * {load}
 * yellow race<f.v.yuelin@gmail.com>
 *
 * depends: [base, array, extend, utils, http]
 */
// 动态加载
exec(function () {
	var 
	http = F.http(),
	cache = {},
	basePath = PATH.resolve(__dirname, "../../"),
	directory = [basePath];
	
	/**
	 * 装载 JavaScript 代码
	 * @param {string} code JavaScript 代码；
	 * @param {object} sandbox 沙箱，沙盒；
	 * @param {string} filename 可选，用于跟踪调试；
	 */
	function load(code, sandbox, filename) {
		var result, id = uniqueId("LOAD"), allowCache = !isUndefined(filename);
		if (!filename) {
			filename = id + ".vm";
		}
		if (isObject(sandbox)) {
			var dirname = PATH.dirname(filename), mod, box = sandbox;
			if (allowCache) {
				mod = {
					id : id,
					filename : filename,
					parent : module,
					exports : {}
				};
				extend(box, {
					__dirname : dirname,
					__filename : filename,
					process : process,
					console : console,
					require : require,
					exports : mod.exports,
					module : mod
				});
				box[FRAMEWORK_ALIAS] = box[FRAMEWORK] = F;
				box.root = box.global = box.GLOBAL = box;
			}
			
			//log('[LOAD]: ' + filename + ' (' + (new Date().toString('MM/dd HH:mm:ss')) + ')');
			directory.push(dirname);
			try {
				result = VM.runInNewContext(code, box, filename);
			} catch(ex) {
				log(" >>> [ERR] load:", ex, F.trim(code.substr(0, 60)));
				throw ex;
			}
			directory.pop();
			
			if (allowCache) {
				cache[filename] = mod.exports;
			}
		} else {
			if (!sandbox) {
				code = "(function(){" + code + "})();";
			}
			try {
				result = VM.runInThisContext(code, filename);
			} catch(ex) {
				log(" >>> [ERR] load:", ex, F.trim(code.substr(0, 100)));
				throw ex;
			}
			if (allowCache) {
				cache[filename] = now();
			}
		}
		code = NULL;
		return result;
	}
	
	function loadScript2(path, callback, sandbox, charset) {
		// var first = path.charAt(0);
		// if (first != '.' && first != '/') {
		// 	return require(path);
		// }
		
		// if (first == '.') {
		// 	path = PATH.resolve(directory.last(), path);
		// }
		
		var
		key, 
		filename, 
		isRemote = path.indexOf('://') != -1, 
		bind = function(code) {
			if (code) {
				load(code, sandbox, filename);
			}
			exec(callback,FALSE,FALSE,cache[key]);
		};
		if (isRemote) {
			key = path;
		} else {
			filename = findModule(path);
			if (!filename) {
				log(' >>> [ERR] Cannot find the module: ' + path);
				return;
			}
			key = filename;
		}

		if (!(key in cache)) {
			if (!charset) {
				charset = "utf8";
			}
			if (isRemote) {
				http.get(path, bind, function(e) {
					// 加载远程脚本失败！
					log(' >>> [ERR] Load a remote script to fail!', e);
				}, charset);
			} else {
				FS.readFile(filename, charset, function(e,d) {
					if (e) {
						// 加载文件失败！
						log(' >>> [ERR] Failed to load the file!', e);
					} else {
						// // 监视文件是否改动
						// FS.unwatchFile(filename);
						// FS.watchFile(filename, function (curr, prev) {
						// 	//log('[REQUIRE]Remove cache: ' + mod.id);
						// 	delete cache[key];
						// });
						bind(d);
					}
				});
			}		
		} else {
			bind();
		}
	}
	loadScript2.paths = [];

	loadScript = function(path, callback) {
		return loadScript2(path, callback, TRUE);
	};
	extend(F, {
		resolve: function() {
			return PATH.resolve.apply(this, [basePath].concat(_slice.call(arguments)));
		},
		loadCode: load,
		loadScript: loadScript2,
		require: require
	});

	
	function findModule(spec) {
		var 
		defExt = ".js",
		path = spec.toLowerCase(),
		dir = PATH.dirname(spec), last,
		ext = PATH.extname(path),
		name = PATH.basename(path, defExt),
		files = (ext == defExt) ? [name + ext] : [name, name + defExt].concat(name != "index" ? [name + "/index.js", name + "/package.json"] : []),
		//files = (ext=="js" || ext=="node") ? [name+"."+ext] : [name, name+".js", name+".node"],
		dirs = [dir].concat(loadScript2.paths),
		i, j, k, l;

		while(dir && dir != last) {
			last = dir;
			dirs.push(PATH.resolve(dir, "node_modules"));
			dir = PATH.dirname(dir);
		}
		for (i = 0, j = dirs.length; i < j; i++) {
			for (k = 0, l = files.length; k < l; k++) {
				spec = PATH.resolve(dirs[i], files[k]);
				if (F.isFile(spec)) {
					return spec;
				}
			}
		}
	}
}, !(isNode && PATH && FS && VM));

/// @part "../../plugin.js"
////////////////////////////////////////////////////////////
/**
 * {plugin}
 * yellow race<f.v.yuelin@gmail.com>
 *
 * depends: [base, namespace, async, defer, deferred, load*]
 */
// 插件
var register;
exec(function () {
	var
	uninitialized = 0,
	initialize = 2,
	loading = 1,
	loaded = 3,
	plugins = {},
	defaultRule = {
		"$" : "plugins",
		"~" : "index"
	},
	resolve = F.resolve,
	basePath = (isFunction(resolve) ? resolve() : EMPTY) + "/",
	re_addons_prefix = /@/,
	re_addons = /@([^@]+)/g, 	// 注意：这里必须使用全局匹配
	sep = isNode ? "|" : " | ";

	function Plugin(id, ns, names) {
		var self = this;
		self.id = id;
		self.ns = ns;
		self.names = names;
		self.script = {
			// module : NULL,
			// namespace : NULL,
			status : uninitialized,
			deferred : callbacks("once memory")
		};
	}


	function relative2absolute(link, refer) {
        var iStart;
        if (!refer || ((iStart = refer.indexOf("://", 1)) == -1)) error("refer");
        if (!link) return refer;
        if (link.indexOf("://") != -1) return link;
        iStart += 3;

        var result, firstChar = link.charAt(0), iLast, iSymbol, iQuery;
        if (firstChar == '/' || firstChar == '?') {
            iLast = refer.indexOf(firstChar, iStart);
            result = iLast == -1 ? refer + link : refer.substring(0, iLast) + link;
        } else {
            iSymbol = link.indexOf(':');
            if (iSymbol != -1) {
                if (iSymbol + 1 == link.length || link.charAt(iSymbol + 1) != '/') return null;
            }
            iQuery = refer.indexOf('?', iStart);
            iLast = iQuery != -1 ? refer.lastIndexOf('/', iQuery) : refer.lastIndexOf('/');
            result = iLast <= iStart ? refer + '/' + link : refer.substring(0, iLast + 1) + link;
        }

        var x, y = iStart;
        result = result.replace(/\/\.\//g, "/");
        while ((x = result.indexOf("/../", y)) != -1) {
            y = result.lastIndexOf('/', x - 1);
            if (y <= iStart || y > x) return null;
            result = result.substring(0, y + 1) + result.substring(x + 4);
        }
        return result;
    }



	var fn = Plugin[PROTOTYPE];
	fn.bind = function(func, basic, parameters) {
		var self = this, script = self.script, ns = self.ns, names = self.names, deferred = script.deferred, ext = script.status === initialize, pars = [F, global], mod, namespace;
		// if (debugMode) {
		// 	log(" >> [M]bind: ", ns, sep, script.status, sep, loaded);
		// }
		if (isArray(parameters)) {
			pars = pars.concat(parameters);
		}
		script.status = loaded;
		script.module = mod = ext && isFunction(func) ? func.apply({
			fn:FN,
			id:self.id,
			ns:ns,
			resolve:ns2url
		}, pars) : func;
		if (ext) {
			if (!basic) {
				if (isNode && module) {
					basic = module;
					names = ["exports"].concat(names);
				} else {
					basic = global;
				}
			}
			script.namespace = namespace = extender(basic, TRUE, TRUE);
			namespace(names, mod);
		}
		// if (debugMode) {
		// 	info(" >> [M]ready: ", ns, sep, toString(mod));
		// }
		deferred.fire(mod || ns);
	};

	function ns2arr(namespace, rule) {
		var namespaces = namespace.split(".");
		if (!rule) {
			rule = {
				"$" : FRAMEWORK,
				"~" : "index"
			};
		}		
		each(namespaces, function (n, i) {
			if (rule[n]) {
				namespaces[i] = rule[n];
			}
		});
		return namespaces;
	}
	function ns2url(namespace, name, ext, rule) {
		var 
		arr = ns2arr(namespace, rule || defaultRule), 
		url = basePath + arr.join("/").replace(/\/$/g, '.source'),
		len = arr.length;
		if (sourceFile && len > 0 && arr[len - 1].length > 0) {
			url += '.source';
		}
		if (name) {
			url += name.replace(re_addons_prefix, '.');
		}
		if (ext) {
			url += (ext.charAt(0) != '.' ? '.' : EMPTY) + ext + (fileVersion ? "?ver=" + fileVersion : EMPTY);
		}
		return url;
	}
	function ns2scripturl(namespace, name) {
		// return ns2url(namespace) 
		// 	+ (name ? name.replace(re_addons_prefix, '.') : EMPTY) 
		// 	+ ".js" + (fileVersion ? "?ver=" + fileVersion : EMPTY);
		return ns2url(namespace, name, 'js', NULL);
	}
	// function ns2styleurl(namespace){
	// return ns2url(namespace) + ".css";
	// }
	
	function getPlugin(namespace, checkonly) {
		var 
		names = ns2arr(namespace), 
		id = names.join(".").replace(/\.$/g, ''), 
		plugin = plugins[id];
		if (!plugin && !checkonly) {
			plugins[id] = plugin = new Plugin(id, namespace, names);
		}
		return plugin;
	}
	
	/**
	 * 指定的命名空间模块就绪后调用 callback 函数
	 * @param {string|array} namespaces 命名空间数组；
	 * @param {function(...)} callback 回调函数，其中的参数按顺序对应每个命名空间的模块；
	 * @param {bool} beforeReady 表示就绪检查是否按顺序来，必须前面的就绪后才能检查当前的；
	 */
	function readyFor(namespaces, callback, beforeRely) {
		var defer = F.defer(callback, 1, FN, TRUE);
		each(array(namespaces), function(namespace, index) {
			var ready = defer.ready(), fnReady = ready, interval = 25, plugin, script, deferred, check, addons;
			if (isString(namespace)) {
				addons = namespace.match(re_addons);
				if (addons != NULL) {
					namespace = namespace.replace(re_addons, EMPTY);
					ready = function(mod) {
						if (mod && mod.addons) {
							each(addons, function(name) {
								var p = getPlugin(namespace + name.replace(re_addons_prefix, '.')), s = p.script, d = s.deferred, src;
								d.add(defer.ready());
								if (s.status === uninitialized) {
									// if (debugMode) {
									// 	log(" >> [M]load: ", namespace + name, sep, s.status, sep, loading);
									// }
									s.status = loading;
									if (isFunction(mod.addons.resolve)) {
										src = mod.addons.resolve(name.replace(re_addons_prefix, EMPTY));
									}
									if (!src) {
										src = ns2scripturl(namespace, name);
									}
									async().ready(F.loadReady(src, mod.addons[name]), function(m) {
										p.bind(m, FALSE);
									}, interval);
								}
							});
						}
						fnReady();
					};
				}
				plugin = getPlugin(namespace);
				script = plugin.script;
				deferred = script.deferred;
				deferred.add(ready);
				if (script.status === uninitialized) {
					// if (debugMode) {
					// 	log(" >> [M]load: ", namespace, sep, script.status, sep, loading);
					// }
					script.status = loading;
					loadScript(ns2scripturl(namespace), function(m) {
						if (isNode && script.status === loading) {
							// 如果是客户端运行（如：IE浏览器），则需要延迟调用，否则加载的代码还没有运行完成就返回了！
							plugin.bind(m, FALSE);
						}
					});
				}
			} else if (isFunction(namespace)) {
				check = beforeRely ? function() {
					for(var i=0;i<index;i++) {
						if (isUndefined(defer.get(i))) {
							return FALSE;
						}
					}
					return namespace(F, global);
				} : namespace;
				async().ready(check, ready, interval);
			} else {
				ready();
			}
		});
		defer();
	}
	
	/**
	 * 注册模块
	 * @param namespace, 命名空间字符串；
	 * @param {object function(F, global, ...)|object} module, 模块，对象或者是一个返回对象的函数；
	 * @param requires, 需求列表，其中包含命名空间或检测函数；
	 * @param basic, 被扩展的对象，如：module.exports；
	 */
	register = function (namespace, module, requires, basic) {
		var plugin = getPlugin(namespace), script = plugin.script;
		if (script.status !== loaded) {
			// if (debugMode) {
			// 	log(" >> [M]register: ", namespace, sep, script.status, sep, initialize);
			// }
			// if (script.status === uninitialized || script.status === loading) {
				script.status = initialize;
			// }
			readyFor(requires, function () {
				// if (debugMode) {
				// 	log(" >> [M]required: ", namespace, sep, toString(requires));
				// }
				plugin.bind(module, basic, _slice.call(arguments));
			}, TRUE);
		}
	};
	
	extend(F, {
		link2url : relative2absolute,
		plugin : readyFor,
		loadReady: function(url, ready, loader, callback, context) {
			var status = -1, args = _slice.call(arguments, 5);
			return function(jS, G, force, uri) {
				if (TRUE !== force && status && (isFunction(ready) ? ready(jS, G) : status === 1)) {
					return TRUE;
				}
				if (status === -1 || force === TRUE) {
					status = 0;
					(loader || loadScript)(uri || url, function() {
						if (isFunction(callback)) {
							callback.apply(context, args.concat(_slice.call(arguments)));
						}
						if (isNumber(ready)) {
							_setTimeout(function() {
								status = 1;
							}, ready);
						} else {
							status = 1;
						}
					});
				}
			};
		},
		register : register,
		unregister : function(namespace) {
			var plugin = getPlugin(namespace, TRUE);
			if (plugin) {
				plugins[plugin.id] = NULL;
				delete plugins[plugin.id];
			}
		}
	});
});



/// @part "step.source.js"
////////////////////////////////////////////////////////////
/**
 * {step}
 * yellow race<f.v.yuelin@gmail.com>
 *
 * depends: null
 */
/*
A simple control-flow library for node.JS that makes parallel execution, serial execution, and error handling painless.
Copyright (c) 2011 Tim Caswell <tim@creationix.com>
https://github.com/creationix/step/
*/
exec(function () {
	function step() {
		var 
		steps = _slice.call(arguments),
		results,
		pending,
		counter,
		lock;
		
		// Define the main callback that's given as `this` to the steps.
		function next() {
			counter = pending = 0;
			
			// Check if there are no steps left
			if (steps.length === 0) {
				// Throw uncaught errors
				if (arguments[0]) {
					throw arguments[0];
				}
				return;
			}
			
			// Get the next step to execute
			var fn = steps.shift(), result;
			results = [];
			
			// Run the step in a try..catch block so exceptions don't get out of hand.
			try {
				lock = TRUE;
				result = fn.apply(next, arguments);
			} catch (e) {
				// Pass any exceptions on through the next callback
				next(e);
			}
			
			if (counter > 0 && pending == 0) {
				// If parallel() was called, and all parallel branches executed
				// synchronously, go on to the next step immediately.
				next.apply(NULL, results);
			} else if (result !== undefined) {
				// If a synchronous return is used, pass it to the callback
				next(undefined, result);
			}
			lock = FALSE;
		}
		
		// Add a special callback generator `this.parallel()` that groups stuff.
		next.parallel = function () {
			var index = ++counter;
			pending++;
			
			return function () {
				pending--;
				// Compress the error from any result to the first argument
				if (arguments[0]) {
					results[0] = arguments[0];
				}
				// Send the other results as arguments
				results[index] = arguments[1];
				if (!lock && pending === 0) {
					// When all parallel branches done, call the callback
					next.apply(NULL, results);
				}
			};
		};
		
		// Generates a callback generator for grouped results
		next.group = function () {
			var 
			localCallback = next.parallel(),
			counter = 0,
			pending = 0,
			result = [],
			error;
			
			function check() {
				if (pending === 0) {
					// When group is done, call the callback
					localCallback(error, result);
				}
			}
			process.nextTick(check); // Ensures that check is called at least once
			
			// Generates a callback for the group
			return function () {
				var index = counter++;
				pending++;
				return function () {
					pending--;
					// Compress the error from any result to the first argument
					if (arguments[0]) {
						error = arguments[0];
					}
					// Send the other results as arguments
					result[index] = arguments[1];
					if (!lock) {
						check();
					}
				};
			};
		};
		
		// Start the engine an pass nothing to the first step.
		next();
	}
	
	// Tack on leading and tailing steps for input and output and return the whole thing as a function. Basically turns step calls into function factories.
	step.fn = function stepFn() {
		var steps = _slice.call(arguments);
		return function () {
			var args = _slice.call(arguments),
			
			// Insert a first step that primes the data stream
			toRun = [function () {
					this.apply(NULL, args);
				}].concat(steps);
			
			// If the last arg is a function add it as a last step
			if (isFunction(args[args.length - 1])) {
				toRun.push(args.pop());
			}
			
			step.apply(NULL, toRun);
		}
	};
	
	F.step = step;
});

/// @part "../../_end.js"
////////////////////////////////////////////////////////////
		
	
	// Export the Underscore object for **Node.js**, with
	// backwards-compatibility for the old `require()` API. If we're in
	// the browser, add `F` as a global object via a string identifier,
	// for Closure Compiler "advanced" mode.
	if (isNode) {
		module.exports = exports = F;
	}

	// Expose F to the global object
	global[FRAMEWORK_ALIAS] = global[FRAMEWORK] = F;

	// F.$ = global;	// Reference global object

	return F;
})(this.window || global);
