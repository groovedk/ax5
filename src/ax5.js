/*!
 * AX5 JavaScript UI Library v0.0.1
 * www.axisj.com
 *
 * Copyright 2013, 2015 AXISJ.com and other contributors
 * Released under the MIT license
 * www.axisj.com/ax5/license
 */

/*
argument
 - O : Object 전달받은 오브젝트 인자
 - _fn : 사용자정의 함수 인자
 - msg : 메세지
 */

// 필수 Ployfill 확장 구문
(function(){

	var root = this;

	// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
	if (!Object.keys) {
		Object.keys = (function() {
			'use strict';
			var hasOwnProperty = Object.prototype.hasOwnProperty,
				hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
				dontEnums = [
					'toString',
					'toLocaleString',
					'valueOf',
					'hasOwnProperty',
					'isPrototypeOf',
					'propertyIsEnumerable',
					'constructor'
				],
				dontEnumsLength = dontEnums.length;

			return function(obj) {
				if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
					throw new TypeError('Object.keys called on non-object');
				}

				var result = [], prop, i;

				for (prop in obj) {
					if (hasOwnProperty.call(obj, prop)) {
						result.push(prop);
					}
				}

				if (hasDontEnumBug) {
					for (i = 0; i < dontEnumsLength; i++) {
						if (hasOwnProperty.call(obj, dontEnums[i])) {
							result.push(dontEnums[i]);
						}
					}
				}
				return result;
			};
		}());
	}

	// ES5 15.4.4.18 Array.prototype.forEach ( callbackfn [ , thisArg ] )
	// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
	if (!Array.prototype.forEach) {
		Array.prototype.forEach = function (fun /*, thisp */) {
			if (this === void 0 || this === null) { throw TypeError(); }

			var t = Object(this);
			var len = t.length >>> 0;
			if (typeof fun !== "function") { throw TypeError(); }

			var thisp = arguments[1], i;
			for (i = 0; i < len; i++) {
				if (i in t) {
					fun.call(thisp, t[i], i, t);
				}
			}
		};
	}

	// Document.querySelectorAll method
	// http://ajaxian.com/archives/creating-a-queryselector-for-ie-that-runs-at-native-speed
	// Needed for: IE7-
	if (!document.querySelectorAll) {
		document.querySelectorAll = function(selectors) {
			var style = document.createElement('style'), elements = [], element;
			document.documentElement.firstChild.appendChild(style);
			document._qsa = [];

			style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
			window.scrollBy(0, 0);
			style.parentNode.removeChild(style);

			while (document._qsa.length) {
				element = document._qsa.shift();
				element.style.removeAttribute('x-qsa');
				elements.push(element);
			}
			document._qsa = null;
			return elements;
		};
	}

	// Document.querySelector method
	// Needed for: IE7-
	if (!document.querySelector) {
		document.querySelector = function(selectors) {
			var elements = document.querySelectorAll(selectors);
			return (elements.length) ? elements[0] : null;
		};
	}

	// Document.getElementsByClassName method
	// Needed for: IE8-
	if (!document.getElementsByClassName) {
		document.getElementsByClassName = function(classNames) {
			classNames = String(classNames).replace(/^|\s+/g, '.');
			return document.querySelectorAll(classNames);
		};
	}

	// Console-polyfill. MIT license. https://github.com/paulmillr/console-polyfill
	// Make it safe to do console.log() always.
	(function(con) {
		'use strict';
		var prop, method;
		var empty = {};
		var dummy = function() {};
		var properties = 'memory'.split(',');
		var methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,' +
			'groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,' +
			'show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn').split(',');
		while (prop = properties.pop()) con[prop] = con[prop] || empty;
		while (method = methods.pop()) con[method] = con[method] || dummy;
	})(root.console = root.console || {}); // Using `this` for web workers.

}.call(this));

// ax5 선언
(function() {
	'use strict';

	// root of function
	var root = this;

	/** @namespace {Object} ax5 */
	var ax5 = {};

	/**
	 * 상수모음
	 * @namespace ax5.info
	 */
	ax5.info = {
		version: "0.0.1",
/**
 * event keyCodes
 * @member {Object} ax5.info.event_keys
 * @example
 ```
 {
	KEY_BACKSPACE: 8,
	KEY_TAB: 9,
	KEY_RETURN: 13, KEY_ESC: 27, KEY_LEFT: 37, KEY_UP: 38, KEY_RIGHT: 39, KEY_DOWN: 40, KEY_DELETE: 46,
	KEY_HOME: 36, KEY_END: 35, KEY_PAGEUP: 33, KEY_PAGEDOWN: 34, KEY_INSERT: 45, KEY_SPACE: 32
 }
 ```
 */
		event_keys: {
			KEY_BACKSPACE: 8,
			KEY_TAB: 9,
			KEY_RETURN: 13, KEY_ESC: 27, KEY_LEFT: 37, KEY_UP: 38, KEY_RIGHT: 39, KEY_DOWN: 40, KEY_DELETE: 46,
			KEY_HOME: 36, KEY_END: 35, KEY_PAGEUP: 33, KEY_PAGEDOWN: 34, KEY_INSERT: 45, KEY_SPACE: 32
		},
/**
 * 사용자 브라우저 식별용 오브젝트
 * @member {Object} ax5.info.browser
 * @example
 ```
 console.log( ax5.info.browser );
 //Object {name: "chrome", version: "39.0.2171.71", mobile: false}
 ```
 */
		browser  : (function () {
			var ua = navigator.userAgent.toLowerCase();
			var mobile = (ua.search(/mobile/g) != -1);
			if (ua.search(/iphone/g) != -1) {
				return { name: "iphone", version: 0, mobile: true }
			} else if (ua.search(/ipad/g) != -1) {
				return { name: "ipad", version: 0, mobile: true }
			} else if (ua.search(/android/g) != -1) {
				var match = /(android)[ \/]([\w.]+)/.exec(ua) || [];
				var browserVersion = (match[2] || "0");
				return { name: "android", version: browserVersion, mobile: mobile }
			} else {
				var browserName = "";
				var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
					/(webkit)[ \/]([\w.]+)/.exec(ua) ||
					/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
					/(msie) ([\w.]+)/.exec(ua) ||
					ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
					[];

				var browser = (match[1] || "");
				var browserVersion = (match[2] || "0");

				if (browser == "msie") browser = "ie";
				return {
					name: browser,
					version: browserVersion,
					mobile: mobile
				}
			}
		})(),
/**
 * 브라우저에 따른 마우스 휠 이벤트이름
 * @member {Object} ax5.info.mousewheelevt
 */
		mousewheelevt: ((/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel")
	};

/**
 * Refer to this by {@link ax5}.
 * @namespace ax5.util
 */
	ax5['util'] = (function(){
		var _toString = Object.prototype.toString;
/**
 * Object나 Array의 아이템으로 사용자 함수를 호출합니다.
 * @method ax5.util.each
 * @param {Object|Array} O
 * @param {Function} _fn
 * @example
```js
 var axf = ax5.util;
 axf.each([0,1,2], function(){
	// with this
 });
 axf.each({a:1, b:2}, function(){
	// with this
 });
```
 */
		function each(O, _fn){
			if (O == null || typeof O === "undeinfed"){
				console.error("argument error : ax5.util.each");
				return O;
			}
			var key, i = 0, length = O.length,
				isObj = length === undefined || typeof O === "function";
			if(isObj){
				for(key in O){
					if(typeof O[key] != "undefined")
					if(_fn.call(O[key], key, O[key]) === false) break;
				}
			}else{
				for( ; i < length; ){
					if( typeof O[ i ] != "undefined" )
					if (_fn.call(O[ i ], i, O[ i++ ]) === false) break;
				}
			}
			return O;
		}
		// In addition to using the http://underscorejs.org : map, reduce, reduce_right, find
		// todo : map, reduce 등등 구현
/**
 * 원본 아이템들을 이용하여 사용자 함수의 리턴값으로 이루어진 새로운 배열을 만듭니다.
 * @method ax5.util.map
 * @param {Object|Array} O
 * @param {Function} _fn
 * @returns {Array}
 * @example
```js
 var myArray = [0,1,2,3,4];
 var myObject = {a:1, b:"2", c:{axj:"what", arrs:[0,2,"3"]},
    fn: function(abcdd){
        return abcdd;
    }
 };

 var _arr = ax5.util.map( myArray,  function(index, I){
    return index+1;
 });
 console.log(_arr);
 // [1, 2, 3, 4, 5]

 var _arr = ax5.util.map( myObject,  function(k, v){
    return v * 2;
 });
 console.log(_arr);
 // [2, 4, NaN, NaN]
```
 */
		function map(O, _fn){
			if (O == null || typeof O === "undeinfed"){
				console.error("argument error : ax5.util.map");
				return [];
			}
			var key, i = 0, length = O.length, isObj = length === undefined || typeof O === "function", results = [], fn_result;
			if (isObj){
				for (key in O) {
					if(typeof O[key] != "undefined"){
						fn_result = undefined;
						if ( (fn_result = _fn.call(O[key], key, O[key])) === false ) break;
						else results.push( fn_result );
					}
				}
			} else {
				for ( ; i < length; ) {
					if(typeof O[i] != "undefined") {
						fn_result = undefined;
						if ( (fn_result = _fn.call(O[ i ], i, O[ i++ ])) === false ) break;
						else results.push( fn_result );
					}
				}
			}
			return results;
		}
/**
 * 배열의 왼쪽에서 오른쪽으로 연산을 진행하는데 수행한 결과가 왼쪽 값으로 반영되어 최종 왼쪽 값을 반환합니다.
 * @method ax5.util.reduce
 * @param {Array} O
 * @param {Function} _fn
 * @returns {Alltypes}
 * @example
```js
 var aarray = [5,4,3,2,1];
 result = ax5.util.reduce( aarray, function(p, n){
       return p * n;
    });
 console.log(result, aarray);
 // 120 [5, 4, 3, 2, 1]
```
 */
		function reduce(O, _fn){
			if (O == null || typeof O === "undeinfed"){
				console.error("argument error : ax5.util.map - use Array");
				return [];
			}
			if (!is_array(O)){
				console.error("argument error : ax5.util.map - use Array");
				return []
			}
			var i = 0, length = O.length, token_item = O[i];
			for ( ; i < length-1; ) {
				if(typeof O[i] != "undefined") {
					if ( ( token_item = _fn.call(root, token_item, O[ ++i ]) ) === false ) break;
				}
			}
			return token_item;
		}
/**
 * 배열의 오른쪽에서 왼쪽으로 연산을 진행하는데 수행한 결과가 오른쪽 값으로 반영되어 최종 오른쪽 값을 반환합니다.
 * @method ax5.util.reduce_right
 * @param {Array} O
 * @param {Function} _fn
 * @returns {Alltypes}
 * @example
 ```js
 var aarray = [5,4,3,2,1];
 result = ax5.util.reduce_right( aarray, function(p, n){
    console.log( n );
    return p * n;
 });
 console.log(result, aarray);
 120 [5, 4, 3, 2, 1]
 ```
 */
		function reduce_right(O, _fn){
			if (O == null || typeof O === "undeinfed"){
				console.error("argument error : ax5.util.map - use Array");
				return [];
			}
			if (!is_array(O)){
				console.error("argument error : ax5.util.map - use Array");
				return []
			}
			var i = O.length-1, token_item = O[i];
			for ( ; i > 0; ) {
				if(typeof O[i] != "undefined") {
					if ( ( token_item = _fn.call(root, token_item, O[ --i ]) ) === false ) break;
				}
			}
			return token_item;
		}
/**
 * 배열또는 오브젝트의 각 아이템을 인자로 하는 사용자 함수의 결과가 참인 아이템들의 배열을 반환합니다.
 * @method ax5.util.filter
 * @param {Object|Array} O
 * @param {Function} _fn
 * @returns {Array}
 * @example
```js
 var aarray = [5,4,3,2,1];
 result = ax5.util.filter( aarray, function(){
        return this % 2;
 });
 console.log(result);
 // [5, 3, 1]

 var filObject = {a:1, s:"string", oa:{pickup:true, name:"AXISJ"}, os:{pickup:true, name:"AX5"}};
 result = ax5.util.filter( filObject, function(){
	return this.pickup;
 });
 console.log( ax.to_json(result) );
 // [{"pickup": , "name": "AXISJ"}, {"pickup": , "name": "AX5"}]
```
 */
		function filter(O, _fn){
			if (O == null || typeof O === "undeinfed"){
				console.error("argument error : ax5.util.map");
				return [];
			}
			var key, i = 0, length = O.length, isObj = length === undefined || typeof O === "function", results = [], fn_result;
			if (isObj){
				for (key in O) {
					if(typeof O[key] != "undefined"){
						if( fn_result = _fn.call(O[key], key, O[key]) ) results.push( O[key] );
					}
				}
			} else {
				for ( ; i < length; ) {
					if(typeof O[i] != "undefined") {
						if ( fn_result = _fn.call(O[ i ], i, O[ i ]) ) results.push( O[ i ] );
						i++;
					}
				}
			}
			return results;
		}
/**
 * 에러를 발생시킵니다.
 * @method ax5.util.error
 * @param {String} msg
 * @example
 ```js
 ax5.util.error( "에러가 발생되었습니다." );
 ```
 */
		function error( msg ){
			throw new Error( msg );
		}
/**
 * Object를 JSONString 으로 반환합니다.
 * @method ax5.util.to_json
 * @param {Object|Array} O
 * @returns {String} JSON
 * @example
```js
 var ax = ax5.util;
 var myObject = {a:1, b:"2", c:{axj:"what", arrs:[0,2,"3"]},
        fn: function(abcdd){
            return abcdd;
        }
    };
 console.log( ax.to_json(myObject) );
```
 */
		function to_json(O){
			var json_string = "";
			if(ax5.util.is_array(O)){
				O.forEach(function(item, index){
					if(index == 0) json_string += "[";
					else json_string += ",";
					json_string += to_json(item);
				});
				json_string += "]";
			}
			else
			if(ax5.util.is_object(O)){
				json_string += "{";
				var json_object_body = [];
				each(O, function(key, value) {
					json_object_body.push( '"' + key + '": ' + to_json(value) );
				});
				json_string += json_object_body.join(", ");
				json_string += "}";
			}
			else
			if(ax5.util.is_string(O)){
				json_string = '"' + O + '"';
			}
			else
			if(ax5.util.is_number(O)){
				json_string = O;
			}
			else
			if(ax5.util.is_undefined(O)){
				json_string = "undefined";
			}
			else
			if(ax5.util.is_function(O)){
				json_string = '"{Function}"';
			}
			return json_string;
		}
/**
 * 타겟 오브젝트의 키를 대상 오브젝트의 키만큼 확장합니다.
 * @method ax5.util.extend
 * @param {Object} O - 타겟 오브젝트
 * @param {Object} _O - 대상 오브젝트
 * @param {Boolean} overwrite - 덮어쓰기 여부
 * @returns {Object} extened Object
 * @example
 ```js
 var axf = ax5.util;
 var obja = {a:1};
 axf.extend(obja, {b:2});
 axf.extend(obja, {a:2});
 axf.extend(obja, {a:2}, true);
 ```
 */
		function extend(O, _O, overwrite) {
			if ( typeof O !== "object" && typeof O !== "function" ) O = {};
			if(typeof _O === "string") O = _O;
			else {
				if(overwrite === true) {
					for(var k in _O) O[k] = _O[k];
				}
				else
				{
					for(var k in _O) if(typeof O[k] === "undefined") O[k] = _O[k];
				}
			}
			return O;
		}
/**
 * 타겟 오브젝트를 복제하여 참조를 다르게 합니다.
 * @method ax5.util.clone
 * @param {Object} O - 타겟 오브젝트
 * @returns {Object} clone Object
 * @example
 ```js
 var axf = ax5.util;
 var obja = {a:1};
 var objb = axf.clone( obja );
 obja.a = 3; // 원본 오브젝트 수정
 console.log(obja, objb);
 // Object {a: 3} Object {a: 2}
 ```
 */
		function clone(O){
			return extend({}, O);
		}
/**
 * 인자의 타입을 반환합니다.
 * @method ax5.util.get_type
 * @param {Object|Array|String|Number|Element|Etc} O
 * @returns {String} element|object|array|function|string|number|undefined
 * @example
 ```js

 ```
 */
		function get_type(O){
			var typeName;
			if( !!(O && O.nodeType == 1) ){
				typeName = "element";
			}
			else
			if(_toString.call(O) == "[object Object]") {
				typeName = "object";
			}
			else
			if(_toString.call(O) == "[object Array]") {
				typeName = "array";
			}
			else
			if(_toString.call(O) == "[object String]") {
				typeName = "string";
			}
			else
			if(_toString.call(O) == "[object Number]") {
				typeName = "number";
			}
			else
			if(typeof O === "function") {
				typeName = "function";
			}
			else
			if(typeof O === "undefined") {
				typeName = "undefined";
			}
			return typeName;
		}
/**
 * 오브젝트가 HTML 엘리먼트여부인지 판단합니다.
 * @method ax5.util.is_element
 * @param {Object} O
 * @returns {Boolean}
 */
		function is_element(O) { return !!(O && O.nodeType == 1); }
/**
 * 오브젝트가 Object인지 판단합니다.
 * @method ax5.util.is_object
 * @param {Object} O
 * @returns {Boolean}
 */
		function is_object(O) { return _toString.call(O) == "[object Object]"; }
/**
 * 오브젝트가 Array인지 판단합니다.
 * @method ax5.util.is_array
 * @param {Object} O
 * @returns {Boolean}
 */
		function is_array(O) { return _toString.call(O) == "[object Array]"; }
/**
 * 오브젝트가 Function인지 판단합니다.
 * @method ax5.util.is_function
 * @param {Object} O
 * @returns {Boolean}
 */
		function is_function(O) { return typeof O === "function"; }
/**
 * 오브젝트가 String인지 판단합니다.
 * @method ax5.util.is_string
 * @param {Object} O
 * @returns {Boolean}
 */
		function is_string(O) { return _toString.call(O) == "[object String]"; }
/**
 * 오브젝트가 Number인지 판단합니다.
 * @method ax5.util.is_number
 * @param {Object} O
 * @returns {Boolean}
 */
		function is_number(O) { return _toString.call(O) == "[object Number]"; }
/**
 * 오브젝트가 undefined인지 판단합니다.
 * @method ax5.util.is_undefined
 * @param {Object} O
 * @returns {Boolean}
 */
		function is_undefined(O) { return typeof O === "undefined"; }
/**
 * 오브젝트가 undefined이거나 null이거나 빈값인지 판단합니다.
 * @method ax5.util.is_nothing
 * @param {Object} O
 * @returns {Boolean}
 */
		function is_nothing(O) { return (typeof O === "undefined" || O === null || O === ""); }
/**
 * 오브젝트의 첫번째 아이템을 반환합니다.
 * @method ax5.util.first
 * @param {Object|Array} O
 * @returns {Object}
 * @example
 ```js
 ax5.util.first({a:1, b:2});
 // Object {a: 1}
 ```
 */
		function first(O){
			if( is_object(O) ) {
				var keys = Object.keys(O);
				var item = {}; item[keys[0]] = O[keys[0]];
				return item;
			}
			else
			if( is_array(O) ) {
				return O[0];
			}
			else
			{
				console.error("ax5.util.object.first", "argument type error");
				return undefined;
			}
		}
/**
 * 오브젝트의 마지막 아이템을 반환합니다.
 * @method ax5.util.last
 * @param {Object|Array} O
 * @returns {Object}
 * @example
 ```js
 ax5.util.last({a:1, b:2});
 // Object {b: 2}
 ```
 */
		function last(O){
			if( is_object(O) ) {
				var keys = Object.keys(O);
				var item = {}; item[keys[keys.length-1]] = O[keys[keys.length-1]];
				return item;
			}
			else
			if( is_array(O) ) {
				return O[O.length-1];
			}
			else
			{
				console.error("ax5.util.object.last", "argument type error");
				return undefined;
			}
		}
/**
 * 쿠키를 설정합니다.
 * @method ax5.util.set_cookie
 * @param {String} cname - 쿠키이름
 * @param {String} cvalue - 쿠키값
 * @param {Number} [exdays] - 쿠키 유지일수
 * @example
```js
 ax5.util.set_cookie("jslib", "AX5");
 ax5.util.set_cookie("jslib", "AX5", 3);
```
 */
		function set_cookie(cname, cvalue, exdays){
			document.cookie = cname + "=" + escape(cvalue) + "; path=/;" + (function(){
				if(typeof exdays != "undefined"){
					var d = new Date();
					d.setTime(d.getTime() + (exdays*24*60*60*1000));
					return "expires=" + d.toUTCString();
				}else{
					return "";
				}
			})();
		}
/**
 * 쿠키를 가져옵니다.
 * @method ax5.util.get_cookie
 * @param {String} cname
 * @returns {String} cookie value
 * @example
```js
 ax5.util.get_cookie("jslib");
```
 */
		function get_cookie(cname){
			var name = cname + "=";
			var ca = document.cookie.split(';');
			for(var i=0; i<ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1);
				if (c.indexOf(name) != -1) return unescape(c.substring(name.length, c.length));
			}
			return "";
		}
/**
 * jsonString 으로 alert 합니다.
 * @method ax5.util.alert
 * @param {Object|Array|String|Number} O
 * @returns {Object|Array|String|Number} O
 * @example
```js
 ax5.util.alert({a:1,b:2});
 ax5.util.alert("정말?");
```
 */
		function alert(O){
			window.alert( to_json(O) );
			return O;
		}
/**
 * 현재 페이지의 Url 정보를 리턴합니다.
 * @method ax5.util.url_util
 * @returns {Object}
 * @example
```js

 console.log( ax5.util.to_json( ax5.util.url_util() ) );
 {
    "href": "http://ax5:2018/samples/index.html?a=1&b=1#abc",
    "param": "a=1&b=1",
    "referrer": "",
    "pathname": "/samples/index.html",
    "hostname": "ax5",
    "port": "2018",
    "url": "http://ax5:2018/samples/index.html",
    "hashdata": "abc"
 }
```
 */
		function url_util() {
			var url = {
				href: window.location.href,
				param: window.location.search,
				referrer: document.referrer,
				pathname: window.location.pathname,
				hostname: window.location.hostname,
				port: window.location.port
			}, urls = url.href.split(/[\?#]/);
			url.param = url.param.replace("?", "");
			url.url = urls[0];
			if(url.href.search("#") > -1){
				url.hashdata = last(urls);
			}
			urls = null;
			return url;
		}

		function get_elements(query, parent_element){
			if(typeof parent_element === "undefined") parent_element = document;
			var elements = parent_element.querySelectorAll(query), return_elements = [];
			//console.info( elements );
			var i = 0, length = elements.length;
			for(;i<length;){
				return_elements.push( elements[i++] );
			}
			return return_elements;
		}
		return {
			each        : each,
			map         : map,
			reduce      : reduce,
			reduce_right: reduce_right,
			filter      : filter,
			error       : error,
			to_json     : to_json,
			extend      : extend,
			clone       : clone,
			get_type    : get_type,
			is_element  : is_element,
			is_object   : is_object,
			is_array    : is_array,
			is_function : is_function,
			is_string   : is_string,
			is_number   : is_number,
			is_undefined: is_undefined,
			is_nothing  : is_nothing,
			first       : first,
			last        : last,
			set_cookie  : set_cookie,
			get_cookie  : get_cookie,
			alert       : alert,
			url_util    : url_util,
			get_elements: get_elements
		}
	})();

	/**
	 * Refer to this by {@link ax5}.
	 * @namespace ax5.dom
	 */
	// todo : querySelectAll 을 활용한 dom 구현
	ax5.dom = function(query){

		function setCSS( options ){
			for(var di=0;di<this.dom.length;di++) {
				for ( name in options ) {
					this.dom[di].style[name] = options[name];
				}
			}
			return this;
		}

		var axdom = (function(){
			var util = ax5.util;
			function ax(query){
				this.version = ax5.info.version;
				this.dom = ax5.util.get_elements(query);
				this.x = function(command, O){
					// css bind
					if(command == "css"){
						setCSS.call(this, O);
					}
					// event bind

					// animate

					// class 관련

					// attr 관련

					return this;
				};
			}

			return ax;
		})();
		return new axdom(query);
	};

	if ( typeof module === "object" && module && typeof module.exports === "object" ){
		module.exports = ax5; // commonJS
	}else{
		root.ax5 = ax5;
		if ( typeof define === "function" && define.amd ) define("_ax5", [], function () { return ax5; }); // requireJS
	}

}.call(this));