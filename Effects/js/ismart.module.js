;
(function() {
	iSmart().$package('ismart.module', function(IS) {
		IS.module = this;
		var t = Math.atan(1);
		console.log(t / Math.PI * 180);

		document.body.style.overflow = 'hidden';
		document.onselectstart = function() {
			return false;
		};

		var $ = IS.dom.$,
			mini = IS.dom.mini,
			css = IS.dom.css,
			$E = IS.event;



		var Templates = {
			'point': '<div class="ismart-point"></div>',
			'line': '<div class="ismart-line"></div>',
			'rectangle': '<div class="ismart-rectangle"></div>'
		}
		var ShapeManager = {
			init: function() {
				$E.addObserver(ShapeManager, 'keyPress', this.onKeyPress);
				$E.addObserver(ShapeManager, 'keyUp', this.onKeyUp);
				$E.addObserver(ShapeManager, 'keyDown', this.onKeyDown);
			},
			shapes: [],
			addShape: function(shape) {
				this.shapes.push(shape);
			},
			onKeyPress: function(event) {
				for(var i in this.shapes) {
					$E.notifyObservers(this.shapes[i], 'keyPress', event);
				}
			},
			onKeyUp: function(event) {
				for(var i in this.shapes) {
					$E.notifyObservers(this.shapes[i], 'keyUp', event);
				}
			},
			onKeyDown: function(event) {
				for(var i in this.shapes) {
					$E.notifyObservers(this.shapes[i], 'keyDown', event);
				}
			}
		}

		var Shape = Class.extend({
			_default: {
				x: 0,
				y: 0
			},
			init: function(param) {
				param = param || this._default;
				this.container = param.container || document.body;
				ShapeManager.addShape(this);
			},
			setPosition: function(x, y) {
				this.x = x;
				this.y = y;
			}
		});

		var InteractiveShape = Shape.extend({
			init: function(param) {
				this._super(param);
				this.dom = param.dom || {};
			},
			/**
			 * Save InteractiveShape as Dom Object
			 * @return {Object} 
			 */
			adapter: function(){
				return this.dom[0];
			},
			_bindMouseEvent: function() {
				var _this = this;

				var lastX = this.x;
				var lastY = this.y;
				$E.addObserver(this, 'click', this.onClick);
				$E.addObserver(this, 'mouseDown', this.onMouseDown);
				$E.addObserver(this, 'mouseUp', this.onMouseUp);
				$E.addObserver(this, 'mouseMove', this.onMouseMove);
				$E.addObserver(this, 'drag', this.onDrag);
				$E.addObserver(this, 'mouseOver', this.onMouseOver);
				$E.addObserver(this, 'mouseOut', this.onMouseOut);
				$E.addObserver(this, 'dragEnd', this.onDragEnd);
				$E.addObserver(this, 'select', this.onSelect);
				$E.addObserver(this, 'selectCancel', this.onSelectCancel);
				$E.addObserver(this, 'keyDown', this.onKeyDown);
				$E.addObserver(this, 'keyUp', this.onKeyUp);
				$E.addObserver(this, 'keyPress', this.onKeyPress);

				this.isMouseDown = false;

				$(this.dom).click(function(event) {
					$E.notifyObservers(_this, 'click', event);
					$E.notifyObservers(_this, 'select', event);
				});

				$(document.body).click(function(event) {
					$E.notifyObservers(_this, 'selectCancel', event);
				});

				$(this.dom).mousedown(function(event) {
					_this.isMouseDown = true;
					lastX = event.clientX;
					lastY = event.clientY;
					$E.notifyObservers(_this, 'mouseDown', event);
				});

				$(this.dom).mouseup(function(event) {
					if(_this.isMouseDown) {
						$E.notifyObservers(_this, 'dragEnd', event);
					}
					_this.isMouseDown = false;
					$E.notifyObservers(_this, 'mouseUp', event);
				});

				$(this.dom).mousemove(function(event) {
					$E.notifyObservers(_this, 'mouseMove', event);
					if(_this.isMouseDown) {
						var deltaX = event.clientX - lastX;
						var deltaY = event.clientY - lastY;
						event.deltaX = deltaX;
						event.deltaY = deltaY;
						lastX = event.clientX;
						lastY = event.clientY;
						$E.notifyObservers(_this, 'drag', event);
					}
				});

				$(this.dom).mouseover(function(event) {
					$E.notifyObservers(_this, 'mouseOver', event);
				});

				$(this.dom).mouseout(function(event) {
					$E.notifyObservers(_this, 'mouseOut', event);
					_this.isMouseDown = false;
				});

				$(this.dom).keyup(function(event) {
					$E.notifyObservers(_this, 'keyUp', event);
				});

				$(this.dom).keydown(function(event) {
					$E.notifyObservers(_this, 'keyDown', event);
				});

				this.dom.keypress(function(event) {
					console.log('keypress');
					$E.notifyObservers(_this, 'keyPress', event);
				});
			},
			onClick: function(event) {

			},
			onMouseDown: function(event) {

			},
			onMouseUp: function(event) {

			},
			onMouseMove: function(event) {

			},
			onDrag: function(event) {
				if(this.drag) {
					this._changeCur('move');
					this.setPosition(this.x + event.deltaX, this.y + event.deltaY);
				}
			},
			onMouseOver: function(event) {

			},
			onMouseOut: function(event) {

			},
			_changeCur: function(type) {
				this.dom.css('cursor', type);
			},
			onDragEnd: function(event) {
				this.dom.css('cursor', 'default');
			},

			onSelect: function() {

			},
			onSelectCancel: function() {

			},
			setPosition: function(x, y) {
				this.x = x;
				this.y = y;
				this.dom.css({
					left: this.x,
					top: this.y
				})
			},
			setStyle: function() {

			},
			/*
			 * keyCode
			 * ===============================
			 * 0    48
			 * 1    49
			 * 2    50
			 * 3    51
			 * 4    52
			 * 5    53
			 * 6    54
			 * 7    55
			 * 8    56
			 * 9    57
			 *
			 * A    65
			 * B    66
			 * C    67
			 * D    68
			 * E    69
			 * F    70
			 * G    71
			 * H    72
			 * I    73
			 * J    74
			 * K    75
			 * L    76
			 * M    77
			 * N    78
			 * O    79
			 * P    80
			 * Q    81
			 * R    82
			 * S    83
			 * T    84
			 * U    85
			 * V    86
			 * W    87
			 * X    88
			 * Y    89
			 * Z    90
			 *
			 * BackSpace    8
			 * Tab          9
			 * Clear        12
			 * Enter        13
			 * Shift        16
			 * Control      17
			 * Alt          18
			 * Cape Lock    20
			 * Esc          27
			 * Spacebar     32
			 * Page Up      33
			 * Page Down    34
			 * End          35
			 * Home         36
			 * Left Arrow   37
			 * Up Arrow     38
			 * Right Arrow  39
			 * Down Arrow   40
			 * Insert       45
			 * Delete       46
			 *
			 * Num Lock     144
			 *
			 * ;:           186
			 * =+           187
			 * ,<           188
			 * -_           189
			 * .>           190
			 * /?           191
			 * `~           192
			 *
			 * [{           219
			 * \|           220
			 * }]           221
			 * ’"           222
			 *
			 * F1   112
			 * F2   113
			 * F3   114
			 * F4   115
			 * F5   116
			 * F6   117
			 * F7   118
			 * F8   119
			 * F9   120
			 * F10  121
			 * F11  122
			 * F12  123
			 *
			 * 0    96
			 * 1    97
			 * 2    98
			 * 3    99
			 * 4    100
			 * 5    101
			 * 6    102
			 * 7    103
			 * 8    104
			 * 9    105
			 *
			 * *    106
			 * +    107
			 * Enter108
			 * -    109
			 * .    110
			 * /    111
			 *
			 */
			onKeyDown: function(event) {

			},
			onKeyUp: function(event) {

			},
			onKeyPress: function(event) {

			}
		});

		var Point = InteractiveShape.extend({
			init: function(param) {
				this._super(param);
				Point.id = Point.id || 1;
				var point = param.dom || $(this.container).append(Templates.point).children().last();

				this.dom = point;
				this.dom.addClass('ismart-point');
				this.id = 'ismart-point' + Point.id++;
				point.attr('id', this.id);

				this._bindMouseEvent();
				this.setPosition(param.x, param.y);
				this.setStyle(param);
				this.drag = param.drag || false;

			},

			setStyle: function(param) {
				if(param.size) {
					this.size = param.size;
					this.dom.css({
						width: param.size,
						height: param.size,
						'border-radius': this.size / 2
					});
				}

				this.dom.css({
					'background-image': '-webkit-linear-gradient(90deg, #4B952C 25%, #5DCE2C)'
				});
				css.createRule({
					cssText: '#' + this.id + ':hover' + '{box-shadow: 0 0 5px' + '#4B952C}'
				});
			}
		});

		var Rectangle = InteractiveShape.extend({
			init: function(param) {
				param.dom && param.dom.addClass('ismart-rectangle');
				this._super(param);
				Rectangle.id = Rectangle.id || 1;
				var rectangle = param.dom || $(this.container).append(Templates.rectangle).children().last();

				this.dom = rectangle;
				this.id = 'ismart-rectangle' + Rectangle.id++;
				rectangle.attr('id', this.id);

				this._bindMouseEvent();
				this.setPosition(param.x, param.y);
				this.setStyle(param);
				this.drag = param.drag || false;
			},

			setStyle: function(param) {
				this.width = param.width;
				this.height = param.height;
				this.dom.css({
					width: param.width && (param.width + 'px'),
					height: param.height && (param.height + 'px')
				})
			},
			onSelect: function(event) {
				this.dom.addClass('select');
				this.selectEvent = event;
				this.select = true;
			},
			onSelectCancel: function(event) {
				if(this.selectEvent && this.selectEvent.timeStamp == event.timeStamp) {

				} else {
					this.dom.removeClass('select');
					this.select = false;
				}
			},
			onKeyPress: function(event) {
				var deltaX = 5;
				var deltaY = 0;
				this.setPosition(this.x + deltaX, this.y + deltaY);
			},
			onKeyDown: function(event) {
				var deltaX = 0,
					deltaY = 0,
					step = 1;
				switch(event.keyCode) {
				case 37:
					//left arrow
					deltaX -= step;
					break;
				case 38:
					//up arrow
					deltaY -= step;
					break;
				case 39:
					// right arrow
					deltaX += step;
					break;
				case 40:
					//down arrow
					deltaY += step;
					break;
				default:
					break;
				}
				if(this.select){
					console.log(event.keyCode, deltaX, deltaY);
					this.setPosition(this.x + deltaX, this.y + deltaY);
				}
			}
		});

		this.ShapeManager = ShapeManager;
		this.Point = Point;
		this.Rectangle = Rectangle;

		(function() {
			ShapeManager.init();
			$(document.body).keypress(function(event) {
				$E.notifyObservers(ShapeManager, 'keyPress', event);
			});
			$(document.body).keydown(function(event) {
				$E.notifyObservers(ShapeManager, 'keyDown', event);
			});
			$(document.body).keyup(function(event) {
				$E.notifyObservers(ShapeManager, 'keyUp', event);
			});
		})();
	});
})();