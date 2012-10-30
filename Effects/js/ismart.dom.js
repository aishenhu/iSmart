;
(function(jQuery) {
	iSmart().$package('ismart.dom', function(IS) {
		IS.dom = IS.dom || this;
		if (jQuery) {
			this.$ = jQuery;
		}
		/**
		 * var ele = mini('selector'),使用css选择器语法的dom元素选择api
		 * 能满足大部分情况的使用需求， 重要的是它兼容dom原生对象
		 * 
		 * @return {[type]} [description]
		 */
		var mini = (function() {

			var snack = /(?:[\w\-\\.#]+)+(?:\[\w+?=([\'"])?(?:\\\1|.)+?\1\])?|\*|>/ig,
				exprClassName = /^(?:[\w\-_]+)?\.([\w\-_]+)/,
				exprId = /^(?:[\w\-_]+)?#([\w\-_]+)/,
				exprNodeName = /^([\w\*\-_]+)/,
				na = [null, null];

			function _find(selector, context) {

				/*
				 * This is what you call via x()
				 * Starts everything off...
				 */

				context = context || document;

				var simple = /^[\w\-_#]+$/.test(selector);

				if (!simple && context.querySelectorAll) {
					return realArray(context.querySelectorAll(selector));
				}

				if (selector.indexOf(',') > -1) {
					var split = selector.split(/,/g),
						ret = [],
						sIndex = 0,
						len = split.length;
					for (; sIndex < len; ++sIndex) {
						ret = ret.concat(_find(split[sIndex], context));
					}
					return unique(ret);
				}

				var parts = selector.match(snack),
					part = parts.pop(),
					id = (part.match(exprId) || na)[1],
					className = !id && (part.match(exprClassName) || na)[1],
					nodeName = !id && (part.match(exprNodeName) || na)[1],
					collection;

				if (className && !nodeName && context.getElementsByClassName) {

					collection = realArray(context.getElementsByClassName(className));

				} else {

					collection = !id && realArray(context.getElementsByTagName(nodeName || '*'));

					if (className) {
						collection = filterByAttr(collection, 'className', RegExp('(^|\\s)' + className + '(\\s|$)'));
					}

					if (id) {
						var byId = context.getElementById(id);
						return byId ? [byId] : [];
					}
				}

				return parts[0] && collection[0] ? filterParents(parts, collection) : collection;

			}

			function realArray(c) {

				/**
				 * Transforms a node collection into
				 * a real array
				 */

				try {
					return Array.prototype.slice.call(c);
				} catch (e) {
					var ret = [],
						i = 0,
						len = c.length;
					for (; i < len; ++i) {
						ret[i] = c[i];
					}
					return ret;
				}

			}

			function filterParents(selectorParts, collection, direct) {

				/**
				 * This is where the magic happens.
				 * Parents are stepped through (upwards) to
				 * see if they comply with the selector.
				 */

				var parentSelector = selectorParts.pop();

				if (parentSelector === '>') {
					return filterParents(selectorParts, collection, true);
				}

				var ret = [],
					r = -1,
					id = (parentSelector.match(exprId) || na)[1],
					className = !id && (parentSelector.match(exprClassName) || na)[1],
					nodeName = !id && (parentSelector.match(exprNodeName) || na)[1],
					cIndex = -1,
					node, parent, matches;

				nodeName = nodeName && nodeName.toLowerCase();

				while ((node = collection[++cIndex])) {

					parent = node.parentNode;

					do {

						matches = !nodeName || nodeName === '*' || nodeName === parent.nodeName.toLowerCase();
						matches = matches && (!id || parent.id === id);
						matches = matches && (!className || RegExp('(^|\\s)' + className + '(\\s|$)').test(parent.className));

						if (direct || matches) {
							break;
						}

					} while ((parent = parent.parentNode));

					if (matches) {
						ret[++r] = node;
					}
				}

				return selectorParts[0] && ret[0] ? filterParents(selectorParts, ret) : ret;

			}


			var unique = (function() {

				var uid = +new Date();

				var data = (function() {

					var n = 1;

					return function(elem) {

						var cacheIndex = elem[uid],
							nextCacheIndex = n++;

						if (!cacheIndex) {
							elem[uid] = nextCacheIndex;
							return true;
						}

						return false;

					};

				})();

				return function(arr) {

					/**
					 * Returns a unique array
					 */

					var length = arr.length,
						ret = [],
						r = -1,
						i = 0,
						item;

					for (; i < length; ++i) {
						item = arr[i];
						if (data(item)) {
							ret[++r] = item;
						}
					}

					uid += 1;

					return ret;

				};

			})();

			function filterByAttr(collection, attr, regex) {

				/**
				 * Filters a collection by an attribute.
				 */

				var i = -1,
					node, r = -1,
					ret = [];

				while ((node = collection[++i])) {
					if (regex.test(node[attr])) {
						ret[++r] = node;
					}
				}

				return ret;
			}

			return _find;

		})();

		/**
		 *  css 封装了通过js操作style样式的方法
		 *  1.通过type和名称(选择符)查找样式定义
		 *  2.动态创建一个样式定义
		 *
		 *  cssRule 中type字段的值和含义
		 *  [cssRule.type]type
		 * 	CSSRule.STYLE_RULE					1	CSSStyleRule
		 *	CSSRule.MEDIA_RULE					4	CSSMediaRule
		 *	CSSRule.FONT_FACE_RULE				5	CSSFontFaceRule
		 *	CSSRule.PAGE_RULE					6	CSSPageRule
		 *	CSSRule.IMPORT_RULE					3	CSSImportRule
		 *	CSSRule.CHARSET_RULE				2	CSSCharsetRule Obsolete
		 *	CSSRule.UNKNOWN_RULE				0	CSSUnknownRuleObsolete
		 *	CSSRule.KEYFRAMES_RULE				7	CSSKeyframesRule Experimental
		 *	CSSRule.KEYFRAME_RULE				8	CSSKeyframeRule Experimental
		 *	Reserved for future use				9	Should be used to define color profiles in the future
		 *	CSSRule.NAMESPACE_RULE				10	CSSNamespaceRule Experimental
		 *	CSSRule.COUNTER_STYLE_RULE			11	CSSCounterStyleRule Experimental
		 *	CSSRule.SUPPORTS_RULE				12	CSSSupportsRule Experimental
		 *	CSSRule.DOCUMENT_RULE				13	CSSDocumentRule Experimental
		 *	CSSRule.FONT_FEATURE_VALUES_RULE	14	CSSFontFeatureValuesRule Experimental
		 *	CSSRule.VIEWPORT_RULE				15	CSSViewportRule Experimental
		 *	CSSRule.REGION_STYLE_RULE			16	CSSRegionStyleRule Experimental
		 */
		var css = {
			/**
			 * 返回样式中匹配查询参数的cssRule
			 * @param  {Object} param 
			 *         param = {
			 *         		name: '',    //cssRule的名字,   @webkit-keyfram flash{}--->其中flash为其name
			 *         		type: '',    //cssRule的type
			 *         		selector:''  //cssRule所对应的选择符 , .flash {} ------>其中.flash即为selector
			 *         }
			 * @return {Array}       查询结果集
			 */
			findRule: function(param) {
				var name = param.name,
					type = param.type,
					selector = param.selector,
					ruleSet = [];
				var ss = document.styleSheets;
				for (var i = ss.length - 1; i >= 0; i--) {
					try {
						var s = ss[i],
							rs = s.cssRules ? s.cssRules : s.rules ? s.rules : [];

						for (var j = rs.length - 1; j >= 0; j--) {
							if ((name ? rs[j].name == name : true ) && (type ? rs[j].type == type : true)
								&& (selector ? rs[j].selectorText == selector : true)) {
								ruleSet.push( rs[j] );
							}
						}
					} catch (e) { /* Trying to interrogate a stylesheet from another domain will throw a security error */
					
					}
				}
				return ruleSet;
			},

			/**
			 * 根据传入的cssText创建一个样式规则，创建的规则位于节点style内，style节点的id
			 * 为ismart-style
			 * @param  {Object} param 样式规则定义
			 * @return 
			 *
			 * @example
			 * dom.css.createRule({
			 *		cssText: '#hello{border:1px solid #000;}'
			 * });
			 */
			createRule: function(param){
				var cssAnimationStyle = document.getElementById('ismart-style');
				if(!cssAnimationStyle){
					cssAnimationStyle = document.createElement('style');
					cssAnimationStyle.type = 'text/css';
					cssAnimationStyle.id = 'ismart-style';
					document.getElementsByTagName('head')[0].appendChild(cssAnimationStyle);
				}

				var cssText = param.cssText || '';
				var rule = document.createTextNode(cssText);
				cssAnimationStyle.appendChild(rule);
			}
		}

		this.mini = mini;
		this.css = css;

	});
})(window.jQuery);