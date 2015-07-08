var $c,fW;
(function() {
	var d = document,
		w = window;
	fW = $c = function(selector,selecType) {
		return new FW(selector,selecType);
	};

	var FW = function(selector,selecType) {

		var elements;
		var re = /[A-Za-z]/; /* if tag */
		if(typeof selector === 'string'){
			var firstSymbol = selector.charAt(0);
		}

		if (typeof selector === 'string' && firstSymbol === '#' && selecType === undefined){
			selector = d.getElementById(selector.substr(1));
			elements = [selector];
		} else if (typeof selector === 'string' && firstSymbol === '.' && selecType === undefined){
			elements = d.getElementsByClassName(selector.substr(1));
		} else if (typeof selector === 'string' && firstSymbol.match(re) !== null && selecType === undefined){
			elements = d.getElementsByTagName(selector);
		} else if (typeof selector === 'string' && firstSymbol.match(re) !== null && selecType === 'name'){
			elements = d.getElementsByName(selector);
		} else if (typeof selector === 'string' && selecType === 'one'){
			selector = d.querySelector(selector);
			elements = [selector];
		} else if (typeof selector === 'string' && selecType === 'all'){
			elements = d.querySelectorAll(selector);
		} else {
			elements = [selector];
		}


		for (var i = 0; i < elements.length; i++) {
			this[i] = elements[i];
		}
		this.length = elements.length;



		this.map = function (callback) {
			var results = [];
			for (var i = 0; i < this.length; i++) {
				results.push(callback.call(this, this[i], i));
			}
			return results;
		};
		this.mapSingle = function (callback) {
			var m = this.map(callback);
			return m.length > 1 ? m : m[0];
		};
		this.each = function (callback) {
			this.map(callback);
			return this;
		};
		this.on = (function(e, func) {
			if (d.addEventListener) {
				return function(e, func){
					return this.each(function(element){
						element.addEventListener(e, func, false);
					});
				};
			} else {
				return function(e, func){
					return this.each(function(element){
						element['on'+e] = func;
					});
				};
			}
		}());

		this.off = (function (e, func) {
			if (d.removeEventListener) {
				return function (e, func) {
					return this.each(function (element) {
						element.removeEventListener(e, func, false);
					});
				};
			} else {
				return function (e, func) {
					return this.each(function (element) {
						element["on" + e] = null;
					});
				};
			}
		}());
		return this;
	};

	fW.fn = FW.prototype = {
		// my method

		hide: function() {
			this.map(function(element){
				element.style.display = 'none';
			});
			return this;
		},
		html: function(html) {
			if (typeof html !== "undefined") {
				return this.each(function (element) {
					element.innerHTML = html;
				});
			} else {
				return this.mapSingle(function (element) {
					return element.innerHTML;
				});
			}
		},
		show: function() {
			for (var i = 0; i < this.length; i++) {
				this[i].style.display = '';
			}
			return this;
		},
		remove: function() {
			for (var i = 0; i < this.length; i++) {
				this[i].parentNode.removeChild(this[i]);
			}
			return this;
		},
		append: function (elements) {
			return this.each(function (parentEl, i) {
				elements.each(function (childEl) {
					parentEl.appendChild( (i > 0) ? childEl.cloneNode(true) : childEl);
				});
			});
		},
		prepend: function (elements) {
			return this.each(function (parentEl, i) {
				for (var j = elements.length -1; j > -1; j--) {
					parentEl.insertBefore((i > 0) ? elements[j].cloneNode(true) : elements[j], parEl.firstChild);
				}
			});
		}
	};

}());




/* * * */
$c('p').hide();


$c('button').on('click',function(d,f){
	$c(this).html('d')
});

// my plug
$c.fn.red = function() {
	for (var i = 0; i < this.length; i++) {
		this[i].style.color = 'red';
	}
	return this;
}

$c('.gg').red();