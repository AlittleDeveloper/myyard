(function(window,document){
	function yard (selector,context) {
		return new yard.fn.init(selector,context)
	};
	yard.fn = yard.prototype = {
	    constructor:yard,
	    push:Array.prototype.push,
		splice:Array.prototype.splice,
		init:function(selector,context){
			if(yard.isString(selector)){
				if(selector.startsWith('<') && selector.endsWith('>') && selector.length >3){
				    this.push.apply(this,yard.getElemments(selector))
                }else {
				    this.push.apply(this,select(selector,context))
                }
			}else if(selector.constructor === yard){
			    this.push.apply(this,selector)
            }else if (yard.isDom(selector)){
                this.push.call(this,selector)
            }else if(yard.isFunction(selector)){
                var ready = window.onload
                if(typeof ready== 'function'){
                    window.onload = function () {
                        ready();
                        selector();
                    }
                }else {
                    window.onload = function () {
                        selector();
                    }
                }
            }
		}
	};
	yard.fn.extend = yard.extend = function(){
        var targetObj = null;
        var originObj = [];
        if(arguments.length == 1){
            targetObj = this;
            originObj = [arguments[0]];
        }else if (arguments.length > 1){
            targetObj = arguments[0];
            originObj.push.apply(originObj,arguments);
            originObj = originObj.slice(1);
        }
        for (var i = originObj.length - 1; i >= 0; i--) {
            for(var key in originObj[i]){
                targetObj[key] = originObj[i][key]
            }
        }
        return targetObj;
	}
    yard.fn.init.prototype = yard.prototype;
    //参数
    var parameters = {documentAddEventListener:false,easyEvent:"blur focus focusin focusout load" +             " resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout" +
    " mouseenter mouseleave change select submit keydown keypress keyup error contextmenu",         windowGetcomputStyle:false,input:'form input filedset select option'};
    //init实例对象方法
    //节点操作
    yard.fn.extend({
        append:function (dom) {
            var domEle = yard(dom);
            for(var i = 0, leng = this.length; i < leng; i++){
                 for(var j = 0, lengj = domEle.length; j < lengj; j++){
                     //在没有遍历到最后一个this节点之前都应该使用clone节点
                      this[i].appendChild(i === this.length - 1 ? domEle[j].cloneNode(true):domEle[j])
                 }
            }
            return this;
        },
        appendTo:function (dom) {
            var _this = $(dom);
            _this.append(this);
            return this;
        },
        preSiblings:function (dom) {
            var silbings = yard(dom);
            for(var i = 0, leng = this.length; i < leng; i++){
                for(var j = 0, lengj = silbings.length; j < lengj; j++){
                    this[i].parentNode.insertBefore(i == this.length - 1 ? silbings[j] : silbings[j].cloneNode(true),this[i]);
                }
            }
            return this;
        },
        nextSiblings:function (dom) {
            var addDom = yard(dom);
            for(var i = 0, leng = this.length; i < leng; i++){
                for(var j = 0, lengj = addDom.length; j < lengj; j++){
                    var nextDom = yard.nextElement(this[i]);
                    if(i == this.length - 1){
                        if(nextDom){
                            this[i].parentNode.insertBefore(addDom[j],nextDom);
                        }else {
                            this[i].parentNode.appendChild(addDom[j]);
                        }
                    }else {
                        if(nextDom){
                            this[i].parentNode.insertBefore(addDom[j].cloneNode(true),nextDom);
                        }else {

                            this[i].parentNode.appendChild(addDom[j].cloneNode(true));
                        }
                    }
                }
            }
            return this;
        },
        remove:function () {
            for(var i = 0, leng = this.length; i < leng; i++){
                this[i].parentNode.removeChild(this[i])
            }
            return this;
        }
    })
    //事件绑定
    yard.fn.extend({
        on:function (type,fn) {
            for(var i = 0, leng = this.length; i < leng; i++){
                if( i == 0){
                    if(typeof this[0].addEventListener == 'function'){
                        parameters.documentAddEventListener = true;
                    }
                }
                if(parameters.documentAddEventListener){
                    this[i].addEventListener(type,fn,false);
                }else{
                    this[i].attachEvent('on' + type,fn)
                }
            }
            return this;
        },
        off:function (type,fn) {
            for(var i = 0, leng = this.length; i < leng; i++){
                if( i == 0){
                    if(typeof this[0].addEventListener == 'function'){
                        parameters.documentAddEventListener = true;
                    }
                }
                if(parameters.documentAddEventListener){
                    this[i].removeEventListener(type,fn,false);
                }else {
                    this[i].detachEvent('on' + type,fn)
                }
            }
            return this;
        }
    })
    //简单事件类型绑定
    var eventArr = parameters.easyEvent.split(' ');
    var obj = {};
    for(var i = 0, leng = eventArr.length; i < leng; i++){
        obj[eventArr[i]] = (function (i) {
            return function (callback) {
                return this.on(eventArr[i],callback);
            }
        })(i)
    };
    yard.fn.extend(obj)
    //css方法
    yard.fn.extend({
        getStyle:function (style) {
            if(!this[0]) return null;
            if(this[0].currentStyle){
                return this[0].currentStyle[style];
            }else {
                return window.getComputedStyle(this[0],null)[style];
            }
        },
        setStyle:function (stylename,stylevalue) {
            var styleObj = {};
            if(yard.isString(stylename)){
                styleObj[stylename] = stylevalue;
            }else {
                styleObj = stylename;
            };
            console.log(this)
            for(var i = 0, leng = this.length; i < leng; i++){
                console.log(this[i])
                for(var key in styleObj){
                    console.log(this[i])
                    console.log(key)
                    console.log(styleObj[key])
                    this[i].style[key] = styleObj[key];
                }
            }
            return this;
        },
        css:function () {
            var styleObj = {};
            if(arguments.length == 1){
                if(yard.isString(arguments[0])){
                    return this.getStyle(arguments[0])
                }else if(yard.isObject(arguments[0])){
                    styleObj = arguments[0];
                }
            }else {
                styleObj[arguments[0]] = arguments[1];
            }
            for(var i = 0, leng = this.length; i < leng; i++){
                return yard(this[i]).setStyle(styleObj);
            }
        }
    })
    //显示隐藏方法
    yard.fn.extend({
        show:function () {
            return this.css('display','block');
        },
        hide:function () {
            return this.css('display','none');
        },
        toggle:function () {
            for(var i = 0, leng = this.length; i < leng; i++){
                var that = yard(this[i]);
                if(that.css('display') == 'block'){
                    return that.css('display','none')
                }else if(that.css('display') == 'none'){
                    return that.css('display','block')
                }
            }
        }
    })
    //属性方法
    yard.fn.extend({
        getAttr:function (attrname) {
            if(!this[0]) return null;
            return this[0].getAttribute(attrname);
        },
        setAttr:function (attrname,attrValue) {
            var attrObje = {};
            if(yard.isString(attrname)){
                attrObje[attrname] = attrValue;
            }else if(yard.isObject(attrname)){
                attrObje = attrname;
            }
            for(var i = 0, leng = this.length; i < leng; i++){
                for(var key in attrObje){
                    this[i].setAttribute(key,attrObje[key])
                }
            }
            return this;
        },
        attr:function (attrname,attrValue) {
            var attrObje = {};
            if(arguments.length == 1){
                if(yard.isString(attrname)){
                    return this[0].getAttribute(attrname);
                }else if(yard.isObject(attrname)){
                    attrObje = attrname;
                }
            }else if(arguments.length == 2){
                attrObje[attrname] = attrValue;
            }
            for(var i = 0, leng = this.length; i < leng; i++){
                for(var key in attrObje){
                    this[i].setAttribute(key,attrObje[key])
                }
            }
            return this;
        },
        removeAttr:function (attrname) {
            for(var i = 0, leng = this.length; i < leng; i++){
                this[i].removeAttribute(attrname);
            }
            return this;
        }
    })
    //类名操作方法
    yard.fn.extend({
        getClass:function () {
            return this.attr('class') || this.attr('className');
        },
        hasClass:function (classname) {
            var classes = this.getClass().split(' ');
            if(!classname) return false;
            for(var i = 0, leng = classes.length; i < leng; i++){
                if(classes[i] == classname){
                    return true;
                }
            }
            return false;
        },
        setClass:function (classname) {
            return this.attr('class',classname) || this.attr('className',classname);
        },
        addClass:function (classname) {
            for(var i = 0, leng = this.length; i < leng; i++){
                if(!yard(this[i]).hasClass(classname)){
                    var getclass = yard(this[i]).getClass();
                    var classes = '';
                    if(getclass){
                        classes = getclass + ' ' + classname;
                    }else {
                        classes = classname;
                    }
                    yard(this[i]).setClass(classes);
                }
            }
            return this;
        },
        removeClass:function (classname) {
            for(var i = 0, leng = this.length; i < leng; i++){
                if(yard(this[i]).hasClass(classname)){
                    var oldClass = yard(this[i]).getClass().split(' ');
                    var classnameIndex = oldClass.indexOf(classname);
                    oldClass.splice(classnameIndex,1);
                    yard(this[i]).setClass(oldClass.join(' '));
                }
            }
            return this;
        },
        toggleClass:function (classname) {
            for(var i = 0, leng = this.length; i < leng; i++){
                var $dom = yard(this[i])
                if($dom.hasClass(classname)){
                    return $dom.removeClass(classname);
                }else {
                    return $dom.addClass(classname);
                }
            }
        }
    })
    //hover方法
    yard.fn.extend({
        hover:function (fn1,fn2) {
            if(!yard.isFunction(fn1) || !yard.isFunction(fn2)){
                return this;
            }
            console.log('我来啦')
            this.mouseenter(fn1).mouseout(fn2);
        }
    })
    //表单元素的val方法
    yard.fn.extend({
        val:function () {

            if(arguments.length == 1){

                for(var i = 0, leng = this.length; i < leng; i++){
                    if(yard.isFormElement(this[i])){
                        yard(this[i]).attr('value',arguments[0]);
                    }
                }
                return this;
            }else if(arguments.length == 0){
                if(yard.isFormElement(this[0])){
                    return yard(this[0]).attr('value');
                }else {
                    return '';
                }
            }
        }
    })
    //数据类型的检测
    yard.extend({
        isString:function (str) {
            return typeof str === 'string'
        },
        isFunction:function (fn) {
            return typeof  fn === 'function'
        },
        isBoolean:function (boo) {
            return typeof  boo === 'boolean'
        },
        isNumber:function (num) {
            return typeof num === 'number'
        },
        isNull:function (nul) {
            return nul === 'Null'
        },
        isArray:function (arr) {
            return Object.prototype.toString.call(arr) === '[object Array]'
        },
        isObject:function (obj) {
            return typeof obj === 'object' && !yard.isArray(obj) && !yard.isNull(obj)
        },
        isArrayLike:function (arr) {
            if (arr &&                                // o is not null, undefined, etc.
                typeof arr === 'object' &&            // o is an object
                isFinite(arr.length) &&               // arr.length is a finite number
                arr.length >= 0 &&                    // arr.length is non-negative
                arr.length===Math.floor(arr.length) &&  // arr.length is an integer
                arr.length < 4294967296)              // arr.length < 2^32
                return true;                        // Then arr is array-like
            else
                return false;                       // Otherwise it is not
        },
        isDom:function (dom) {
            return !!dom &&!!dom.nodeType
        }
    })
    //工具函数的封装
    //遍历函数
    yard.extend({
        each:function (dom,fn) {
            if(yard.isArrayLike(dom)){
                for(var i = 0, leng = dom.length; i < leng; i++){
                    var result = fn.call(dom[i],i,dom[i]);
                    if(result === false){
                        break;
                    }
                }
            }else if(yard.isObject(dom)){
                for(var key in dom){
                    var result = fn.call(dom[key],key,dom[key]);
                    if(result === false){
                        break;
                    }
                }
            }
        }
    })
    //动画函数
    yard.fn.extend({
        animate:function (obj,duration,easing,fn) {
            for(var j = 0, lengj = this.length; j < lengj; j++){
                var dom = this[j]
                var startObj = {};
                for (var key in obj) {
                    startObj[key] = parseFloat(window.getComputedStyle(dom, null)[key]);
                    obj[key] = parseFloat(obj[key]);
                }
                var timeB = +new Date();
                obj.timer = setInterval(function () {
                    var timeN = +new Date();
                    var useTime = timeN - timeB;
                    if (useTime >= duration) {
                        clearInterval(obj.timer)
                        for (var key in obj) {
                            dom.style[key] = obj[key] + getUnit(key);
                        }
                        if (fn) {
                            fn();
                        }
                    } else {
                        for (var i in startObj) {
                            var startValue = startObj[i]
                            var endValue = obj[i]
                            var distance = yard.easing[easing](null, useTime, startValue, endValue - startValue, duration)
                            dom.style[i] = distance + getUnit(i);
                        }
                    }
                }, 20)
                function getUnit(stylename) {
                    switch(stylename){
                        case 'opacity':
                            return '';
                        default:
                            return 'px';
                    }
                }
            }
        }
    })
    //事件对象
    yard.extend({
        getEvent:function (event) {
            return event?event:window.event;
        },
        getTarget:function (event) {
            var event = this.getEvent(event);
            return event.target?event.target:event.srcElement;
        },
        preventDefault:function (event) {
            var event = this.getEvent(event);
            if(event.preventDefault){
                event.preventDefault();
            }else {
                event.returnValue = false;
            }
        },
        stopPrapagation:function (event) {
            var event = this.getEvent(event);
            if(event.stopPrapagation){
                event.stopPrapagation();
            }else {
                event.cancelBubble = true;
            }
        }
    })
    //将字符串转化为元素节点
    yard.extend({
        getElemments:function (str) {
            var arr = [];
            var div = document.createElement('div');
            div.innerHTML = str;
            var kid = div.children;
            arr.push.apply(arr, kid);
            div = null;
            return arr
        }
    })
    //获取下一个元素节点
    yard.extend({
        nextElement:function (dom) {
            if (itcast.isDOM(dom)) {
                //获取到它的下一个dom节点(文本，元素)
                var next = dom.nextSibling;
                //去除文本节点
                while (next && next.nodeType === 3) {
                    next = next.nextSibling;
                }
                return next;
            }else {
                return false;
            }
        }
    })
    //判断是否是表单元素
    yard.extend({
        isFormElement:function (dom) {
            var formElementList = 'form input button select textarea option';
            console.log(dom)
            return formElementList.indexOf(dom.tagName.toLowerCase()) >= 0;
        }
    })
    //序列化表单
    yard.extend({
        serialize:function (form) {
            var parts = [],
                i,
                j,
                filed,
                option,
                optLens,
                optionVal,
                leng;
            for (i = 0 , leng = form.elements.length; i < leng; i++) {
                filed = form.elements[i];
                switch (filed.type) {
                    case 'select-one':
                    case 'select-multiple':
                        if (filed.name.length) {
                            for (j = 0 , optLens = filed.options.length; j < optLens; j++) {
                                option = filed.options[j];
                                optionVal = '';
                                if (option.selected) {
                                    if (option.hasAttribute) {
                                        optionVal = option.hasAttribute('value') ? option.value : option.text;
                                    } else {
                                        optionVal = option.attributes('value').specified ? option.value : option.text;
                                    }
                                    parts.push(encodeURIComponent(filed.name) + '=' + encodeURIComponent(optionVal));
                                }
                            }
                        }
                        break;
                    case 'undefined':
                    case 'reset':
                    case 'submit':
                    case 'file':
                    case 'button':
                        break;
                    case 'radio':
                    case 'checkbox':
                        if(!filed.checked){
                            break;
                        }
                    default:
                        if(filed.name.length){
                            parts.push(encodeURIComponent(filed.name) + '=' + encodeURIComponent(filed.value));
                        }
                }
            }
            return parts.join('&');
        }
    })
    //jsonp跨域
    yard.extend({
        jsonp:function (url,obj,callback) {
            var funcName = 'yangqiao_jsonp' + Math.random().toString().replace('.','');
            window[funcName] = callback;
            var queryString = url.indexOf('?') == -1?'?':'&';
            var query = '';
            for(var i in obj){
                query += 'i=' + obj[i] + '&';
            }
            queryString += query;
            var urls  = url + queryString + 'callback=' + funcName;
            var scripts = document.createElement('script');
            scripts.src = urls;
            document.body.appendChild(scripts);
        }
    })
    //urlencoded对象
    yard.extend({
        encodeObj:function (obj) {
            var query = '';
            for(var key in obj){
                query += key + '=' + obj[key] + '&';
            }
            query = query.slice(0,query.length-1);
           return query;
        }
    })
    //ajax方法
    yard.extend({
        ajax:function (obj) {
            var defaultOption = {
                method:'get',
                data:{}
            }
            //obj应该包含url method success data
            var content = yard.extend(defaultOption,obj);
            //兼容ie 5,6 的xhr ，不用兼容ie5,6可以直接用XMLHttpRequest对象
            function getXHR() {
                if(typeof XMLHttpRequest != 'undefined'){
                    return new XMLHttpRequest();
                }else if(typeof ActiveXObject != 'undefined'){
                    if(typeof arguments.callee.ActiveXString != 'string'){
                        var version = ['MSXML.XMLHttp.6.0','MSXML.XMLHttp.3.0','MSXML.XMLHttp'];
                        var i,leng;
                        for(i = 0,leng = version .length; i < leng; i++){
                            try{
                                new ActiveXObject(version[i]);
                                arguments.callee.ActiveXString =version[i];
                                break;
                            }catch(error){

                            }
                        }
                    }
                    return new ActiveXObject(arguments.callee.ActiveXString);
                }else {
                    throw new Error('Can not found XHR!');
                }
            }
            var xhr = getXHR();
            xhr.onreadystatechange = function () {
                if(xhr.readyState == 4){
                    //0:表示已经创建xhr对象，但是尚未调用open方法
                    //1:表示已经调用open方法，正在发送请求
                    //2:表示请求（send（））已经发送完毕，但是尚未接收到响应
                    //4:表示已经接收到全部响应
                    if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304){
                        content.success && content.success(xhr.responseText)
                        //可以通过xhr.getResponseHeader('content-type')获得某个响应头部信息;
                        //可以通过xhr.getAllResponseHeaders()获得所有响应头部信息
                    }
                }
            }

            if(content.method === 'post'){
                //get提交可以在url后面添加参数?name=haha&age=20;
                xhr.open(content.method,content.url,true);
                //post提交必须加上这句话，除非发送的是new FormDatal类型的数据；
                xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
                xhr.send(yard.encodeObj(data));//post可以在此发送数据，可以发送new FormData类型数据，也可以发送'name=yangqiao&age=12'类似的字符串数据；最好传入null.保证所有浏览器都兼容
            }else {
                xhr.open(content.method + '?' + yard.encodeObj(data),content.url,true);
                xhr.send(null);
            }


        }
    })
    //easing
    yard.easing = {}
    yard.extend( yard.easing,
        {
            easeInQuad: function (x, t, b, c, d) {
                return c*(t/=d)*t + b;
            },
            easeOutQuad: function (x, t, b, c, d) {
                return -c *(t/=d)*(t-2) + b;
            },
            easeInOutQuad: function (x, t, b, c, d) {
                if ((t/=d/2) < 1) return c/2*t*t + b;
                return -c/2 * ((--t)*(t-2) - 1) + b;
            },
            easeInCubic: function (x, t, b, c, d) {
                return c*(t/=d)*t*t + b;
            },
            easeOutCubic: function (x, t, b, c, d) {
                return c*((t=t/d-1)*t*t + 1) + b;
            },
            easeInOutCubic: function (x, t, b, c, d) {
                if ((t/=d/2) < 1) return c/2*t*t*t + b;
                return c/2*((t-=2)*t*t + 2) + b;
            },
            easeInQuart: function (x, t, b, c, d) {
                return c*(t/=d)*t*t*t + b;
            },
            easeOutQuart: function (x, t, b, c, d) {
                return -c * ((t=t/d-1)*t*t*t - 1) + b;
            },
            easeInOutQuart: function (x, t, b, c, d) {
                if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
                return -c/2 * ((t-=2)*t*t*t - 2) + b;
            },
            easeInQuint: function (x, t, b, c, d) {
                return c*(t/=d)*t*t*t*t + b;
            },
            easeOutQuint: function (x, t, b, c, d) {
                return c*((t=t/d-1)*t*t*t*t + 1) + b;
            },
            easeInOutQuint: function (x, t, b, c, d) {
                if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
                return c/2*((t-=2)*t*t*t*t + 2) + b;
            },
            easeInSine: function (x, t, b, c, d) {
                return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
            },
            easeOutSine: function (x, t, b, c, d) {
                return c * Math.sin(t/d * (Math.PI/2)) + b;
            },
            easeInOutSine: function (x, t, b, c, d) {
                return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
            },
            easeInExpo: function (x, t, b, c, d) {
                return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
            },
            easeOutExpo: function (x, t, b, c, d) {
                return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
            },
            easeInOutExpo: function (x, t, b, c, d) {
                if (t==0) return b;
                if (t==d) return b+c;
                if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
                return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
            },
            easeInCirc: function (x, t, b, c, d) {
                return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
            },
            easeOutCirc: function (x, t, b, c, d) {
                return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
            },
            easeInOutCirc: function (x, t, b, c, d) {
                if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
                return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
            },
            easeInElastic: function (x, t, b, c, d) {
                var s=1.70158;var p=0;var a=c;
                if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                if (a < Math.abs(c)) { a=c; var s=p/4; }
                else var s = p/(2*Math.PI) * Math.asin (c/a);
                return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
            },
            easeOutElastic: function (x, t, b, c, d) {
                var s=1.70158;var p=0;var a=c;
                if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                if (a < Math.abs(c)) { a=c; var s=p/4; }
                else var s = p/(2*Math.PI) * Math.asin (c/a);
                return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
            },
            easeInOutElastic: function (x, t, b, c, d) {
                var s=1.70158;var p=0;var a=c;
                if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
                if (a < Math.abs(c)) { a=c; var s=p/4; }
                else var s = p/(2*Math.PI) * Math.asin (c/a);
                if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
            },
            easeInBack: function (x, t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c*(t/=d)*t*((s+1)*t - s) + b;
            },
            easeOutBack: function (x, t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
            },
            easeInOutBack: function (x, t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
                return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
            },
            easeInBounce: function (x, t, b, c, d) {
                return c - Yard.easing.easeOutBounce (x, d-t, 0, c, d) + b;
            },
            easeOutBounce: function (x, t, b, c, d) {
                if ((t/=d) < (1/2.75)) {
                    return c*(7.5625*t*t) + b;
                } else if (t < (2/2.75)) {
                    return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
                } else if (t < (2.5/2.75)) {
                    return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
                } else {
                    return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
                }
            },
            easeInOutBounce: function (x, t, b, c, d) {
                if (t < d/2) return Yard.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
                return Yard.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
            }
        });
    function windowGetcomputStyle() {
        if(typeof window.getComputedStyle == 'function'){
            parameters.windowGetcomputStyle = true;
        }
    }
	//选择器的封装
    var select = (function () {
        function getid (id,content) {
            var dom = document.getElementById(id);
            if(dom){
                var parentDom = dom.parentNode;
                while(parentDom !== null){
                    if(parentDom === content){
                        return [dom];
                    }
                    parentDom = parentDom.parentNode;
                }
            }
        }
        function getTag (tag,content){
			/*ie8下测试该方法有问题*/
            var arr = [];
//            alert(content.getElementsByTagName(tag))
//            var str = Array.prototype.slice.call(content.getElementsByTagName(tag))
//            arr.push.apply(arr,str)
            var doms = content.getElementsByTagName(tag);
            for(var i = 0 , target; target = doms[i++];){
                arr.push.call(arr,target)
            }
            return arr;
        };
        function getClass(classname,content){
            if(classname && typeof classname=='string'){
                if(content.getElementsByClassName){
                    return content.getElementsByClassName(classname)
                }else {
                    var targetClass = ' ' + classname + ' ';
                    var domes = [];
                    var elements = content.getElementsByTagName('*');
                    for (var i = elements.length - 1; i >= 0; i--) {
                        var elementsClass = ' ' + elements[i].className + ' ';
                        if(elementsClass.indexOf(targetClass) >-1){
                            domes.push(elements[i])
                        }
                    }
                    return domes;
                }
            }
        }
        function get(dom,content){
            if(typeof content === 'string'){
                content = get(content);
            }else if (content.nodeType){
                content = [content]
            }
            for(var i = 0 , target; target = content[i++];){
                if(dom && typeof dom === 'string'){
                    var name;
                    var parentDom = target;
                    var reg = /^(?:(#[a-zA-Z_]\w*)|(\.[a-zA-Z_]\w*)|([a-zA-Z_][a-zA-Z_0-9]*))$/;
                    var match = reg.exec(dom);
                    if(name = match[1]){
                        return getid(name.slice(1),parentDom)
                    }else if (name = match[2]){
                        return getClass(name.slice(1),parentDom)
                    }else if (name = match[3]){
                        return getTag(name,parentDom)
                    }
                }
            }
        }
        function group(dom,content) {
            if(typeof dom === 'string'){
                var arr = [];
                var domstr = dom.split(',');
                for(var i = 0 , target; target = domstr[i++];){
                    arr.push(get(target,content))
                }
            }
            return arr
        }
        function level(dom,content) {

            if(typeof dom === 'string'){
                var result;
                var domstr = dom.split(' ');
                for(var i = 0 , target; target = domstr[i++];){
                    result = get(target,result || content)
                }
            }
            return result;
        }
        function endSele(dom,content) {
            content = content || document
            var arr = [];
            var domes = dom.split(',');
            for(var i = 0 , target; target = domes[i++];){
                arr.push.apply(arr,level(target,content))
            }
            return arr;
        }
        return endSele
    })()
	window.yard = window.$ = yard
})(window,document)