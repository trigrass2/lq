
;
(function($, window, document, undefined) {
	//'use strict';

	var jRange = function() {
		return this.init.apply(this, arguments);
	};
	jRange.prototype = {
		defaults: {
			onstatechange: function() {},
			isRange: false,
			showLabels: true,
			showScale: true,
			step: 1,
			format: '%s',
			theme: 'theme-green',
			//width: 300,
			disable: false,
			barColor: "#a1fad0"
		},
		template: function (options) {
		    var html = '<div class="slider-container"><div class="back-bar">';
		    if (options.value != "") {
		        for (var i = 1; i <= options.value.split(',').length; i++) {
		            var strText = "";
		            if (options.value.split(',')[i - 1].split('/').length >= 3) {
		                var state = options.value.split(',')[i - 1].split('/')[3] == "0" ? "" : "(禁用)";
		                strText = options.value.split(',')[i - 1].split('/')[2] + state;
		            }
		            html += '<label class="lblTitle" name="' + i + '">' + strText + '</label>';
		            html += '<div class="selected-bar" name="' + i + '" ></div>';
		            html += '<div class="pointer low" name="' + i + '"></div><div class="pointer-label" name="' + i + '">123456</div>';
		            html += '<div class="pointer high" name="' + i + '"></div><div class="pointer-label" style="top: 15px;" name="' + i + '">456789</div>';
		        }
		    }
		    html += '<div class="clickable-dummy"></div></div><div class="scale"></div></div>';
		    return html;
		},
        //初始化参数
		init: function (node, options) {
		    this.options = $.extend({}, this.defaults, options);
			this.inputNode     = $(node);
		    this.options.width = this.inputNode.width();
			this.options.value = this.inputNode.val();
			var html = this.template(this.options);
			this.domNode = $(html);
			this.domNode.addClass(this.options.theme);
		    $(this.inputNode).nextAll().remove();
			this.inputNode.after(this.domNode);
			this.domNode.on('change', this.onChange);
			this.pointers = $('.pointer', this.domNode);
			this.labels        = $('.pointer-label', this.domNode);
			this.scale         = $('.scale', this.domNode);
			this.bar = $('.selected-bar', this.domNode);
			this.labelTitles = $('.lblTitle', this.domNode);
			this.clickableBar  = this.domNode.find('.clickable-dummy');
			this.interval = this.options.to - this.options.from;
		    if (this.interval == 0)this.interval = 1;
		    //*************
			this.groupCount = this.options.value.split(',').length;//this.options.value.length;
            //*************


			this.render();
		},
        //做准备
		render: function() {
			// Check if inputNode is visible, and have some width, so that we can set slider width accordingly.
			if (this.inputNode.width() === 0 && !this.options.width) {
				console.log('jRange : no width found, returning');
				return;
			} else {
				this.domNode.width(this.options.width || this.inputNode.width());
				this.inputNode.hide();
			}

			if (this.isSingle()) {
				this.lowPointer.hide();
				this.lowLabel.hide();
			}
			if (!this.options.showLabels) {
				this.labels.hide();
			}
			this.attachEvents();
			if (this.options.showScale) {
				this.renderScale();
			}
			this.setValue(this.options.value);
		},
		isSingle: function() {
			if (typeof(this.options.value) === 'number') {
				return true;
			}
			return (this.options.value.indexOf(',') !== -1 || this.options.isRange) ?
				false : true;
		},
		attachEvents: function() {
			this.pointers.on('mousedown touchstart', $.proxy(this.onDragStart, this));
			this.pointers.bind('dragstart', function(event) {
				event.preventDefault();
			});
		},
		onDragStart: function(e) {
			if ( this.options.disable || (e.type === 'mousedown' && e.which !== 1)) {
				return;
			}
			e.stopPropagation();
			e.preventDefault();
			var pointer = $(e.target);
			this.pointers.removeClass('last-active');
			pointer.addClass('focused last-active');
			var int1 = (parseInt(pointer.attr("name")) - 1) * 2 + (pointer.hasClass('low') ? 0 : 1);
			$(this.labels[int1]).addClass('focused');
			$(document).on('mousemove.slider touchmove.slider', $.proxy(this.onDrag, this, pointer));
			$(document).on('mouseup.slider touchend.slider touchcancel.slider', $.proxy(this.onDragEnd, this));
		},
		onDrag: function(pointer, e) {
			e.stopPropagation();
			e.preventDefault();

			if (e.originalEvent.touches && e.originalEvent.touches.length) {
				e = e.originalEvent.touches[0];
			} else if (e.originalEvent.changedTouches && e.originalEvent.changedTouches.length) {
				e = e.originalEvent.changedTouches[0];
			}

			var position = e.clientX - this.domNode.offset().left;
			this.domNode.trigger('change', [this, pointer, position]);


			var num = pointer.attr("name");
			var intCount = parseInt(num);

			var values = this.options.value.split(',')[intCount - 1].split('/');

			InitRest(values,this.inputNode[0].id);
		},
		onDragEnd: function(e) {
			this.pointers.removeClass('focused');
			this.labels.removeClass('focused');
			$(document).off('.slider');


			var maxx = parseInt(this.options.to);
			var circleWidth = $(this.pointers[0]).width() / 2;
			var pos = ((maxx - this.options.from) / this.interval) * this.domNode.width();
			$.each(this.pointers, function (i, point) {
			    if (Math.abs($(point).position().left + circleWidth - pos) < 5) {
			        $(this.pointers).removeClass("last-active");
			        $(point).addClass("last-active");
			        return false;
			    }
			});
		},
		onChange: function(e, self, pointer, position) {
			var min, max;
			if (self.isSingle()) {
				min = 0;
				max = self.domNode.width();
			} else {
			    /////////*** **********************************/
			    var num = pointer.attr("name");
			    var intCount = parseInt(num);
			    var low = $(self.pointers[(intCount - 1) * 2]);
			    var top = $(self.pointers[(intCount - 1) * 2 + 1]);

			    min = pointer.hasClass('high') ? low.position().left + low.width() / 2 : (intCount == 1 ? 0 : $(self.pointers[(intCount - 1) * 2-1]).position().left + $(self.pointers[(intCount - 1) * 2-1]).width() / 2);
			    max = pointer.hasClass('low') ? top.position().left + top.width() / 2 : (intCount == self.groupCount ? self.domNode.width() : $(self.pointers[(intCount) * 2]).position().left + $(self.pointers[(intCount) * 2 ]).width() / 2);

			    /////////*** **********************************/


			}
			var value = Math.min(Math.max(position, min), max);
			self.setPosition(pointer, value, false);
		},
        //指定点在线上的位置
		setPosition: function (pointer, pos, isPx, animate) {
		    /////////*** **********************************/
		    if (pointer.length == 0) return;

		    var circleWidth = $(this.pointers[0]).width() / 2;
		    if (isPx) {
		        pos = ((pos - this.options.from) / this.interval) * this.domNode.width();
		    }
		    pointer[animate ? 'animate' : 'css']({
		        'left': Math.round(pos - circleWidth)
		    });

		    var num = pointer.attr("name");
		    var intCount = parseInt(num);
		    var low = $(this.pointers[(intCount - 1) * 2]);
		    var top = $(this.pointers[(intCount - 1) * 2 + 1]);
		    var state = this.options.value.split(',')[intCount - 1].split('/')[3];

		    /////////*** **********点所连接的线的颜色的指示************************/
		    var leftPos,
                lowPos = parseInt(low.css("left").replace("px", "")),
                highPos = parseInt(top.css("left").replace("px", ""));

		    if (pointer[0] === top[0]) {
		        highPos = Math.round(pos - circleWidth);
		    } else {
		        lowPos = Math.round(pos - circleWidth);
		    }
		    if (this.isSingle()) {
		        leftPos = 0;
		    } else {
		        leftPos = lowPos + circleWidth;
		    }
		    
		    //条的状态
		    if (state == "0") {
		        var bColor = this.options.barColor;
		        var titleText = this.options.value.split(',')[intCount - 1].split('/')[2];
		        if (titleText == "早班") bColor = "#3DA0D6";
		        if (titleText == "中班") bColor = "#FDD800";
		        if (titleText == "晚班") bColor = "#F43133";

		        $(this.bar[intCount - 1])[animate ? 'animate' : 'css']({
		            'width': Math.round(highPos + circleWidth - leftPos),
		            'left': leftPos,
		            'background-color': bColor
		        }); //labelTitles
		    } else {
		        $(this.bar[intCount - 1])[animate ? 'animate' : 'css']({
		            'background-color': "#777777",
		            'width': Math.round(highPos + circleWidth - leftPos),
		            'left': leftPos,
		        }); //labelTitles
		    }
		    $(this.labelTitles[intCount - 1])[animate ? 'animate' : 'css']({
		        'left': (highPos + leftPos) / 2
		    });
		    this.showPointerValue(pointer, pos, animate, isPx);
		    //this.isReadonly();
		},
		// will be called from outside 赋值
		setValue: function(value) {
		    /////////*** **********************************/
		    var values = value.toString().split(',');
		    if (values == "")return;
		    for (var i = 0; i < values.length; i++) {
		        var intLow = parseInt(values[i].split('/')[0]);
		        var intTop = parseInt(values[i].split('/')[1]);
		        if (intLow < parseInt(this.options.from)) intLow = this.options.from;
		        if (intLow > parseInt(this.options.to)) intLow = this.options.to;
		        if (intTop < parseInt(this.options.from)) intTop = this.options.from;
		        if (intTop > parseInt(this.options.to)) intTop = this.options.to;
		        var low = $(this.pointers[i*2]);
		        var top = $(this.pointers[i * 2 + 1]);
		        this.setPosition(low, intLow,true);
		        this.setPosition(top, intTop, true);
		    }

		    //如果二个点重合判断哪个在上边
		    for (var i = 0; i < values.length; i++) {
		        var intLow = parseInt(values[i].split('/')[0]);
		        var intTop = parseInt(values[i].split('/')[1]);
		        var maxx = parseInt(this.options.to);
		        if (Math.abs(intTop - maxx) < 5 ) {
		            if (intLow == intTop) {
		                $(this.pointers).removeClass("last-active");
		                $(this.pointers[i * 2]).addClass("last-active");
		                break;
		            } else {
		                $(this.pointers).removeClass("last-active");
		                $(this.pointers[i * 2 + 1]).addClass("last-active");
		                break;
		            }
		        }
		    }
		    
		    /////////*** **********************************/
		},
		renderScale: function() {
			var s = this.options.scale || [this.options.from, this.options.to];
			var prc = Math.round((100 / (s.length - 1)) * 10) / 10;
			var str = '';
			for (var i = 0; i < s.length; i++) {
				str += '<span style="left: ' + i * prc + '%">' + (s[i] != '|' ? '<ins>' +intToTime(s[i]) + '</ins>' : '') + '</span>';
			}
			this.scale.html(str);

			$('ins', this.scale).each(function() {
				$(this).css({
					marginLeft: -$(this).outerWidth() / 2
				});
			});
		},
        //显示点所在位置的值是多少
		showPointerValue: function (pointer, position, animate, isDrag) {
		    var num = pointer.attr("name");
		    var intCount = parseInt(num);
		    var label =$($('.pointer-label', this.domNode)[pointer.hasClass('low') ? (intCount - 1) * 2 : (intCount - 1) * 2+1]);
			var text;
			var value = this.positionToValue(position);
			if ($.isFunction(this.options.format)) {
				var type = this.isSingle() ? undefined : (pointer.hasClass('low') ? 'low' : 'high');
				text = this.options.format(value, type);
			} else {
				text = this.options.format.replace('%s', value);
			}

			var width = label.html(intToTime(text)).width(),
				left = position - width / 2;
			left = Math.min(Math.max(left, 0), this.options.width - width);
			label[animate ? 'animate' : 'css']({
				left: left
			});
		    //if (isDrag) {
		        this.setInputValue(pointer, value);
		    //} 
		},
		valuesToPrc: function(values) {
			var lowPrc = ((values - this.options.from) * 100 / this.interval);
			return lowPrc;
		},
		prcToPx: function(prc) {
			return (this.domNode.width() * prc) / 100;
		},
		positionToValue: function(pos) {
			var value = (pos / this.domNode.width()) * this.interval;
			value = value + parseInt(this.options.from);
			return Math.round((value / this.options.step) * this.options.step);//Math.round
		},
		setInputValue: function(pointer, v) {
		    //v = Math.round(((v - this.options.from) / this.interval) * this.domNode.width());
		    /////////*** **********************************/
		    var values = this.options.value.toString().split(',');
			var newValues = "";
			for (var i = 0; i < values.length; i++) {
			    var num = pointer.attr("name");
			    var intCount = parseInt(num);
			    if (i + 1 == intCount) {
			        var intLow = parseInt(values[i].split('/')[0]);
			        var intTop = parseInt(values[i].split('/')[1]);
			        if (pointer.hasClass('low')) {
			            newValues += v + '/' + intTop + '/' + values[i].split('/')[2] + '/' + values[i].split('/')[3] + ',';
			        } else {
			            newValues += intLow + '/' + v + '/' + values[i].split('/')[2] + '/' + values[i].split('/')[3] + ',';
			        }
			    } else {
			        newValues += values[i] + ',';
			    }
		    }
		    if (newValues.length > 0) newValues = newValues.substr(0, newValues.length - 1);
		    this.options.value = newValues;
		    if (this.inputNode.val() !== this.options.value) {
		        this.inputNode.val(this.options.value);
		        this.options.onstatechange.call(this, this.options.value);
		    }

		    /////////*** **********************************/

		},
		getValue: function() {
			return this.options.value;
		},
		isReadonly: function(){
			this.domNode.toggleClass('slider-readonly', this.options.disable);
		},
		disable: function(){
			this.options.disable = true;
			this.isReadonly();
		},
		enable: function(){
			this.options.disable = false;
			this.isReadonly();
		},
		toggleDisable: function(){
			this.options.disable = !this.options.disable;
			this.isReadonly();
		}
	};

	/*$.jRange = function (node, options) {
		var jNode = $(node);
		if(!jNode.data('jrange')){
			jNode.data('jrange', new jRange(node, options));
		}
		return jNode.data('jrange');
	};

	$.fn.jRange = function (options) {
		return this.each(function(){
			$.jRange(this, options);
		});
	};*/

	var pluginName = 'jRange';
	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[pluginName] = function(option) {
		var args = arguments,
			result;

		this.each(function() {
			var $this = $(this),
				data = $.data(this, 'plugin_' + pluginName),
				options = typeof option === 'object' && option;
				$this.data('plugin_' + pluginName, (data = new jRange(this, options)));
		});

		// To enable plugin returns values
		return result || this;
	};

})(jQuery, window, document);

function intToTime(num) {

    var n = num * 5;
    var hour =parseInt(n / 60);
    var min = n % 60;
    var strDay = "";
    if (hour > 23) {
        strDay = "次日";
        hour -= 24;
    }
    var strHour = hour.toString();
    var strMin = min.toString();
    if (strHour.length == 1) strHour = "0" + strHour;
    if (strMin.length == 1) strMin = "0" + strMin;
    return strDay + " " + strHour + ":" + strMin;
}


