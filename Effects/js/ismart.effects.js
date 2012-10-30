/**
 * ismart.effects.js
 * @description 通过css3实现的Animation&Transition
 * @author script
 * @date 2012.09.23
 * @version 0.1
 */
;
(function() {
	iSmart().$package('ismart.effects', function(IS) {
		IS.effects = this;
		var dom = IS.dom;
		var $ = IS.dom.mini;
		var $adapter = IS.adapter;
		var $E = IS.event;

		/**
		 * CSS 动画类
		 * 提供预设和自定义两种方式
		 * @type {Object}
		 *
		 * CSSAnimation 对一个dom元素添加了以下的事件：
		 * 		1.cssAnimationStart
		 * 		2.cssAnimationStop
		 * 		3.cssAnimationResume
		 * 		4.cssAnimationEnd
		 * 		5.cssAnimationIteration
		 * 	对这些事件可以采用如下的方式进行监听：可以同时注册一个或多个事件
		 * 	@example
		 *       var $E = IS.event;
		 *       $E.addObserver(element, 'cssAnimationStart', function(event){
		 *       		//do something
		 *       		console.log('cssAnimationStart event fired on element');
		 *       });
		 */
		var CSSAnimation = {
			/**
			 * @ignore
			 */
			_init: function(element, option) {
				for(var prop in this._default){
					if(option[prop]){
						$adapter.prefixedProperty(element, prop, option[prop]);
					}else{
						$adapter.prefixedProperty(element, prop, this._default[prop]);
					}
				}
			},
			/**
			 * @ignore
			 */
			_default: {
				animationDelay: "",
				animationDirection: "",
				animationDuration: "1s",
				animationFillMode: "both",
				animationIterationCount: "1",
				animationName: "",
				animationPlayState: "",
				animationTimingFunction: "ease"
			},
			/**
			 * @ignore
			 */
			_createKeyframe:function(){
				// dom.css.createRule({
				// 	cssText: '@webkit-keyframe ff{from: "";	to:"";}'
				// });
				// dom.css.createRule({
				// 	cssText: '#hello{border:1px solid #000;}'
				// });
				// var rules = dom.css.findRule({
				// 	type: 1,
				// 	selector: '#hello'
				// });
				// console.log(rules);
			},
			/**
			 * 在一个元素上播放指定css动画，如果要重新开始这个动画，使用
			 * restart方法，触发cssAnimationStart事件，同时绑定cssAnimationEnd
			 * 事件
			 *
			 * @param  {[type]} element [description]
			 * @param  {object} option  动画对象
			 *         option = {
			 *         		animationDelay: "",
			 *				animationDirection: "",
			 *				animationDuration: "",
			 *				animationFillMode: "",
			 *				animationIterationCount: "",
			 *				animationName: "",
			 *				animationPlayState: "",
			 *				animationTimingFunction: ""
			 *         }
			 * @param  {boolean} flag    是否是restart
			 * @return {[type]}         [description]
			 */
			animate: function(element, option, flag) {
				this._init(element,option);

				dom.$(element).addClass('animated').addClass(option);

				$adapter.prefixedEvent(element, "AnimationStart", function(event) {
					$E.notifyObservers(element, 'cssAnimationStart', event);
				});
				$adapter.prefixedEvent(element, "AnimationEnd", function(event) {
					$E.notifyObservers(element, 'cssAnimationEnd', event);
				});
				$adapter.prefixedEvent(element, "AnimationIteration", function(event){
					$E.notifyObservers(element,'cssAnimationIteration', event);
				});
			},
			/**
			 * 重新播放一个元素上的指定动画
			 * @param  {dom} element 要播放动画的dom节点
			 * @param  {string || object} option  播放的动画名称或者自定义对象
			 * @return
			 *
			 * why raf?
			 * 在指定名称的动画中，通过添加相应的类名来播放动画Animation, 移除类名的方法
			 * 来取消动画（非暂停和继续操作），如果在移除类之后立即添加类，通常认为是发生
			 * 在一帧之内的，并不能改变动画的渲染。所以我们需要一段小的时间间隔，让浏览器
			 * 发现这样的变化，setTimeout是可以完成这样的功能的，但是为什么不使用
			 * ismart.adapter提供的帧动画方法呢，:)
			 */
			restart: function(element, option) {
				var raf = $adapter.requestAnimationFrame;
				dom.$(element).removeClass(option);
				raf(function() {
					CSSAnimation.animate(element, option, true);
				}, {});
			},

			/**
			 * 暂停元素上的CSS Animation（option指定）
			 * @param  {[type]} element [description]
			 * @param  {[type]} option  [description]
			 * @return {[type]}         [description]
			 */
			stop: function(element, option) {
				$adapter.prefixedProperty(element, 'animationPlayState', 'paused');				
				$E.notifyObservers(element, 'cssAnimationStop');
			},

			resume: function(element, option) {
				$adapter.prefixedProperty(element, 'animationPlayState', 'running');
				$E.notifyObservers(element, 'cssAnimationResume');
			},

			toggle: function(element, option){
				if(this.getState(element, option) == 'paused'){
					this.resume(element, option);
				}else{
					this.stop(element, option);
				}
			},

			getState: function(element, option){
				return $adapter.prefixedProperty(element, 'animationPlayState');
			}
		}

		var CSSTranstion = {
			/**
			 * 为一个需要做transform变化的元素设置默认参数值
			 * @param  {object} stage dom元素节点
			 * @param  {object} transtion参数
			 *         param = {
			 *         		transformOrigin: 'left top';
			 *         }
			 * @return {[type]}       [description]
			 */
			_init: function(stage,param){
				document.body.style.overflow = 'hidden';
				stage.style.webkitTransition = '-webkit-transform 0.8s ease';
				stage.style.mozTransition = '-moz-transform 0.8s ease';
				stage.style.MSTransition = '-ms-transform 0.8s ease';
				stage.style.oTransition = '-o-transform 0.8s ease';
				stage.style.transition = 'transform 0.8s ease';

				if(param){
					for(var p in param){
						$adapter.prefixedProperty(stage, p, param[p]);
					}
				}
			},

			/**
			 * 缩放显示，将一个stage上的element缩放到指定倍数，并且屏幕居中显示
			 * 缩放变化将会应用到stage上
			 * @return {[type]} [description]
			 */
			zoom2: (function(){
				return {
					in: function(stage, element, scale){
						element = dom.$(element);
						var orgin = element.position().left + 'px ' + element.position().top + 'px';
						var cx = parseInt(jQuery(window).width()) / 2,
							cy = parseInt(jQuery(window).height()) / 2,
							ex = element.offset().left + parseInt(element.css('width')) / (2 / scale),
							ey = element.offset().top + parseInt(element.css('height')) / (2 / scale);

						var tx = cx - ex,
							ty = cy - ey;
						$adapter.prefixedProperty(stage, 'transformOrigin', element.position().left + 'px '+ element.position().top + 'px');
						$adapter.prefixedProperty(stage, 'transform',  'translate(' + tx  + 'px ,' + ty + 'px) ' +'scale('+scale+')');
					},
					out: function(stage, element, scale){
						$adapter.prefixedProperty(stage, 'transform', 'scale(' + scale + ')');
					}
				}
			})(),
			rotate: {
				to: function(element, deg, param){
					CSSTranstion._init(element, param);
					var rotate = 'rotate(' + deg + 'deg)';
					if(this._getRotate(element)){
						this._changeRotate(element, rotate);
					}else{
						$adapter.appendPrefixedProperty(element, 'transform', rotate);
					}
				},
				back: function(element){
					this._changeRotate(element, 'rotate(0deg)');
				},
				_getRotate: function(element){
					var transform = $adapter.prefixedProperty(element, 'transform');
					//var transform = 'translate(100px, 100px) rotate(98deg) scale(1)';
					var regRotate = /rotate[^\)]*\){1}/gi;
					return regRotate.exec(transform);
				},

				_changeRotate: function(element, rotate){
					var transform = $adapter.prefixedProperty(element, 'transform');
					//var transform = 'translate(100px, 100px) rotate(98deg) scale(1)';
					var regRotate = /rotate[^\)]*\){1}/gi;
					$adapter.prefixedProperty(element, 'transform', transform.replace(regRotate, rotate));
				}
			},

			
		}

		this.CSSAnimation = CSSAnimation;
		this.CSSTranstion = CSSTranstion;

		this.init = function() {
		}

		this.init();
	});
})();