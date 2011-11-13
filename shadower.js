(function(document, undef) {

    function _bind(fn, context) {
	      return function() { return fn.apply(context, arguments); };
    }

    function _toArray(obj) {
	      return Array.prototype.slice.call(obj);
    }

    function _position(elem) {
	      var curLeft = curTop = 0;

	      if (!elem.offsetParent) 
	          return {left: elem.offsetLeft, top: elem.offsetTop};

        curLeft += elem.offsetWidth / 2;

	      do {
	          curLeft += elem.offsetLeft;
	          curTop += elem.offsetTop;
	      } while (elem = elem.offsetParent);

	      return {left: curLeft, top: curTop};
    }

    // Constructor
    var Shadower = function() {
	      this.init.apply(this, arguments);
    };

    // Members
    Shadower.prototype = {
	      init: function(elem, options) {
	          if (typeof elem != 'object')
		            throw new TypeError('Illegal constructor');

	          this.elem = elem;
	          this.elemPos = _position(elem);
            this.isText = (!!elem.firstChild && elem.firstChild.nodeType == 3); // TEXTNODE
	          this.options = this.checkOptions(options);
	          
	          this.bindEvents();
	      },
	      
	      elem: null,
        isText: false,
	      options: {},
	      events: {
	          document_Mousemove: function(e) {
		            var x = this.elemPos.left - e.clientX;
		            var y = this.elemPos.top - e.clientY;
		            
		            var distance = Math.sqrt(Math.abs(x)^2 + Math.abs(y)^2),
		            blur = this.options.diffusion * Math.round(distance / 10);

		            x *= this.options.factor;
		            y *= this.options.factor;
                
                if (this.isText)
		                this.elem.setAttribute('style', 'text-shadow: ' + x + 'px ' + y + 'px ' + blur + 'px ' + this.options.color); 
                else
                    this.elem.setAttribute('style', 'box-shadow: ' + x + 'px ' + y + 'px ' + blur + 'px ' + this.options.color); 
	          }
	      },

	      checkOptions: function(options) {
	          options = options || {};
	          return {
		            color: options.color || 'black',
		            diffusion: +options.diffusion,
		            factor: +options.factor
	          };
	      },
	      
	      bindEvents: function() {
            this.events.document_Mousemove.fn = _bind(this.events.document_Mousemove, this);
	          document.addEventListener('mousemove', this.events.document_Mousemove.fn, true);
	      },

        tearDown: function() {
            document.removeEventListener('mousemove', this.events.document_Mousemove.fn, true);
        }
    };

    // Static
    Shadower.applyTo = function(elems, options) {
	      var shadowers = [];
        if (typeof elems == 'string')
            elems = _toArray(document.querySelectorAll(elems));

	      elems.forEach(function(elem) {
	          shadowers.push(new Shadower(elem, options));
	      });
    };

    // Define jQuery plugin if available
    if (typeof self.jQuery != 'undefined') {
        jQuery.fn.Shadower = function(options) {
            Shadower.applyTo($(this), options);
        }
    }

    // Define for AMD loaders
    if (typeof define === "function" && define.amd) 
	      define("shadower", [], function () { return Shadower; });

    // Export
    self.Shadower = Shadower;

})(self.document);