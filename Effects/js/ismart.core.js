/**
 * @author script
 * @return ismart core 对象
 *
 * @version 0.1
 * @date 2012.09.23
 * @description ismart的核心处理模块：
 * 1、创建包命名空间
 */

function iSmart() {
	this.__ismart = this.__ismart || {};
	/**
	 * 创建包
	 * @param  {string} pkg  包的描述:example ismart.effects
	 * @param  {function} func 创建包中运行的函数
	 */
	var $package = function(pkg, func) {
			var pkglist = pkg.split('.');
			var cur = window;
			for (var i = 0; i < pkglist.length; i++) {
				cur[pkglist[i]] = cur[pkglist[i]] || {};
				cur = cur[pkglist[i]];
			}
			func.call(cur, __ismart);
		}

	__ismart.$package = $package;
	return __ismart;
};

;
(function() {
	iSmart().$package('ismart.Class', function(IS) {
		/* Simple JavaScript Inheritance
		 * By John Resig http://ejohn.org/
		 * MIT Licensed.
		 */
		// Inspired by base2 and Prototype
		(function() {
			var initializing = false,
				fnTest = /xyz/.test(function() {
					xyz;
				}) ? /\b_super\b/ : /.*/;
			// The base Class implementation (does nothing)
			this.Class = function() {};
			// Create a new Class that inherits from this class
			Class.extend = function(prop) {
				var _super = this.prototype;
				// Instantiate a base class (but only create the instance,
				// don't run the init constructor)
				initializing = true;
				var prototype = new this();
				initializing = false;
				// Copy the properties over onto the new prototype
				for (var name in prop) {
					// Check if we're overwriting an existing function
					prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]) ? (function(name, fn) {
						return function() {
							var tmp = this._super;
							// Add a new ._super() method that is the same method
							// but on the super-class
							this._super = _super[name];
							// The method only need to be bound temporarily, so we
							// remove it when we're done executing
							var ret = fn.apply(this, arguments);
							this._super = tmp;
							return ret;
						};
					})(name, prop[name]) : prop[name];
				}
				// The dummy class constructor

				function Class() {
					// All construction is actually done in the init method
					if (!initializing && this.init) this.init.apply(this, arguments);
				}
				// Populate our constructed prototype object
				Class.prototype = prototype;
				// Enforce the constructor to be what we expect
				Class.prototype.constructor = Class;
				// And make this class extendable
				Class.extend = arguments.callee; 
				return Class;
			};
		})();
	});
})();