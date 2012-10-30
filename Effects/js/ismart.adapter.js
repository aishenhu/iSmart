/**
 * ismart.adapter.js
 * @description 封装实现统一的API接口，屏蔽浏览器之间的差异
 * @author script
 * @date 2012.09.23
 * @version 0.1
 */

;
(function() {
	iSmart().$package('ismart.adapter', function(IS) {
		IS.adapter = this;
		/**
		 * browse detect
		 * 浏览器检测类
		 * 		browser : name of browser
		 * 		version : version of browser
		 * 		OS      : Operation System
		 *
		 * <a href="http://www.quirksmode.org/js/detect.html">detect</a>
		 */
		var BrowserDetect = {
			init: function() {
				this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
				this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
				this.OS = this.searchString(this.dataOS) || "an unknown OS";
			},
			searchString: function(data) {
				for (var i = 0; i < data.length; i++) {
					var dataString = data[i].string;
					var dataProp = data[i].prop;
					this.versionSearchString = data[i].versionSearch || data[i].identity;
					if (dataString) {
						if (dataString.indexOf(data[i].subString) != -1) return data[i].identity;
					} else if (dataProp) return data[i].identity;
				}
			},
			searchVersion: function(dataString) {
				var index = dataString.indexOf(this.versionSearchString);
				if (index == -1) return;
				return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
			},
			/**
			 * 浏览器类型
			 * 		Chrome
			 *  	OmniWeb
			 *   	Safari
			 *   	Opera
			 *    	iCab
			 *     	Konqueror
			 *      Firefox
			 *      Camino
			 *      Netscape(old , new)
			 *      Explorer
			 *      Mozilla
			 */
			dataBrowser: [{
				string: navigator.userAgent,
				subString: "Chrome",
				identity: "Chrome"
			}, {
				string: navigator.userAgent,
				subString: "OmniWeb",
				versionSearch: "OmniWeb/",
				identity: "OmniWeb"
			}, {
				string: navigator.vendor,
				subString: "Apple",
				identity: "Safari",
				versionSearch: "Version"
			}, {
				prop: window.opera,
				identity: "Opera",
				versionSearch: "Version"
			}, {
				string: navigator.vendor,
				subString: "iCab",
				identity: "iCab"
			}, {
				string: navigator.vendor,
				subString: "KDE",
				identity: "Konqueror"
			}, {
				string: navigator.userAgent,
				subString: "Firefox",
				identity: "Firefox"
			}, {
				string: navigator.vendor,
				subString: "Camino",
				identity: "Camino"
			}, { // for newer Netscapes (6+)
				string: navigator.userAgent,
				subString: "Netscape",
				identity: "Netscape"
			}, {
				string: navigator.userAgent,
				subString: "MSIE",
				identity: "Explorer",
				versionSearch: "MSIE"
			}, {
				string: navigator.userAgent,
				subString: "Gecko",
				identity: "Mozilla",
				versionSearch: "rv"
			}, { // for older Netscapes (4-)
				string: navigator.userAgent,
				subString: "Mozilla",
				identity: "Netscape",
				versionSearch: "Mozilla"
			}],
			/**
			 * 操作系统类型
			 * 		Windows
			 * 		Mac
			 * 		Linux
			 * 		iPhone/iPod
			 */
			dataOS: [{
				string: navigator.platform,
				subString: "Win",
				identity: "Windows"
			}, {
				string: navigator.platform,
				subString: "Mac",
				identity: "Mac"
			}, {
				string: navigator.userAgent,
				subString: "iPhone",
				identity: "iPhone/iPod"
			}, {
				string: navigator.platform,
				subString: "Linux",
				identity: "Linux"
			}]

		};

		/**
		 * 检测当前浏览器是否支持css3的transform变化
		 * @return {Boolean} 支持为true
		 */
		var isSupportsTransforms =  function(){
				var check = $adapter.prefixedProperty(document.body, 'transform');
				return check !== undefined;
		}

		/**
		 * 创建帧动画对象，传入的函数，将在下一帧绘制时执行，所以函数只执行
		 * 一次
		 * 在不支持requestAnimationFrame的情况下，使用定时器模拟，fps 60
		 * 使用示例：
		 * @example
		 *         var raf = requestAnimationFrame;
		 *         raf(function(){
		 *              //处理代码
		 *         }, {});
		 * 
		 */
		var requestAnimationFrame = window.requestAnimationFrame 		|| 
									window.webkitRequestAnimationFrame  || 
									window.mozRequestAnimationFrame 	|| 
									window.oRequestAnimationFrame		|| 
									window.msRequestAnimationFrame 		||
									function(callback, element) {
										window.setTimeout(callback, 1000 / 60);
									};

		/**
		 * 通过帧动画对象循环调用func
		 * @param {function} func 按帧循环调用的函数
		 */
		var rafLoop = function(func) {
			var raf = requestAnimationFrame;
			raf(function() {
				func();
				raf(arguments.callee, {});
			}, {});
		}

		/**
		 * 绑定根据浏览器标识前缀进行命名的事件
		 * 1. Animation事件
		 * 		W3C standard			Firefox				webkit						Opera				IE10
		 *   	animationstart			animationstart		webkitAnimationStart		oanimationstart		MSAnimationStart
		 *    	animationiteration		animationiteration	webkitAnimationIteration	oanimationiteration	MSAnimationIteration
		 *     	animationend 			animationend		webkitAnimationEnd			oanimationend		MSAnimationEnd
		 * @example
		 * prefixedEvent(element, 'AnimationStart', function(event){
		 * 		//to do something when the element's AnimationStart event is fired.
		 * 		console.log('AnimationStart Event Start');
		 * });
		 */
		var prefixedEvent = function(element, type, callback){
			var pfx = ['webkit', 'moz', 'MS', 'o', ''];
			for( var p in pfx){
				if(!pfx[p]){
					type = type.toLowerCase();
				}
				element.addEventListener(pfx[p] + type, callback, false);
			}
		}

		/**
		 * 读取或者为一个元素的属性进行前缀赋值，prop传入标准属性
		 * @param  {dom} element 目标dom节点
		 * @param  {string} prop    标准属性
		 * @param  {值} value   属性值
		 * @return
		 *
		 * @example
		 *         var hello = IS.dom.mini('#hello');
		 *         prefixedProperty(hello, 'animationPlayState', 'pause');
		 */
		var prefixedProperty = function(element, prop, value){
			var pfx = ['webkit', 'moz', 'MS', 'o', ''];
			for(var p in pfx){
				var temp = prop;
				if(pfx[p]){
					temp = temp.substring(0,1).toUpperCase() + temp.substring(1);
				}
				temp = pfx[p] + temp;
				if(value){
					element.style[temp] = value;
				}else if(element.style[temp] !== undefined){
					return element.style[temp];
				}
			}
		}

		var appendPrefixedProperty = function(element, prop, value){
			var pfx = ['webkit', 'moz', 'MS', 'o', ''];
			for(var p in pfx){
				var temp = prop;
				if(pfx[p]){
					temp = temp.substring(0,1).toUpperCase() + temp.substring(1);
				}
				temp = pfx[p] + temp;
				if(value){
					element.style[temp] += ' '+value;
				}else if(element.style[temp] !== undefined){
					return element.style[temp];
				}
			}
		}

		/**
		 * 为一个元素绑定transitionEnd事件
		 * @param  {dom}   element  触发transition事件的dom节点元素
		 * @param  {Function} callback 事件处理函数
		 */
		var transitionEndEvent = function(element, callback){
			var transitionEnd = [
			    'transitionEnd',
			    'oTransitionEnd',
			    'msTransitionEnd',
			    'transitionend',
			    'webkitTransitionEnd'
		    ];

		    for(var t in transitionEnd){
		    	element.addEventListener(transitionEnd[t], callback, false);
		    }
		}

		/**
		 * ismart.adapter 的初始化函数
		 */
		var init = function(){
			BrowserDetect.init();
		}

		this.requestAnimationFrame = requestAnimationFrame;
		this.rafLoop = rafLoop;
		this.browser = BrowserDetect;
		this.isSupportsTransforms = isSupportsTransforms;
		this.prefixedEvent = prefixedEvent;
		this.transitionEndEvent = transitionEndEvent;
		this.prefixedProperty = prefixedProperty;
		this.appendPrefixedProperty = appendPrefixedProperty;

		init();
	});
})();