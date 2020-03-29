/*!
 * Scalar Lens plugin
 * Author: Michael Morgan
 * Licensed under the MIT license
 */


;(function ( $, window, document, undefined ) {

    var pluginName = 'scalarLenses',
        defaults = {
            propertyName: "value"
        };

    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, defaults, options) ;
        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype.init = function () {
      // Place initialization logic here
      // You already have access to the DOM element and
      // the options via the instance, e.g. this.element
      // and this.options



    const lenseObject = {
      "expanded": false,
    	"submitted": true/false,
    	"public": true/false,
    	"frozen": true/false,
    	"frozen-items": [ "slug1", "slug2"],
    	"visualization": {
    		"type": "force-directed/grid/list/map/radial/tree/word-cloud",
    		"options": {
    			"option": "value"
    		}
    	}
    };




    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new Plugin( this, options ));
            }
        });
    }

})( jQuery, window, document );
