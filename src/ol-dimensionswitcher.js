goog.provide('ol.control.DimensionSwitcher');
goog.require('ol.control');
//import Control from 'ol/control/control';
//import Observable from 'ol/observable';

/**
 * OpenLayers Dimension Switcher Control.
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object} opt_options Control options, extends olx.control.ControlOptions adding:  
 * **`tipLabel`** `String` - the button tooltip.
 */
ol.control.LayerSwitcher = function(opt_options) {

        var options = opt_options || {};

        var tipLabel = options.tipLabel ?
            options.tipLabel : 'Legend';

        var element = document.createElement('div');

        super({element: element, target: options.target});

        this.mapListeners = []; //discard?

        this.hiddenClassName = 'ol-unselectable ol-control dimension_button';
        if (DimensionSwitcher.isTouchDevice_()) {
            this.hiddenClassName += ' touch';
        }
        this.shownClassName = 'shown';

        element.className = this.hiddenClassName;

        var button = document.createElement('button');
        button.setAttribute('title', tipLabel);
        element.appendChild(button);

        this.panel = document.createElement('div');//panel?
        this.panel.className = 'panel';
        element.appendChild(this.panel);
        
        var this_ = this;

        button.onmouseover = function(e) { //is hover? discard?
            this_.showPanel();
        };

        button.onclick = function(e) { //insert function here?
            e = e || window.event;
            this_.showPanel();
            e.preventDefault();
        };

        this_.panel.onmouseout = function(e) {//discard?
            e = e || window.event;
            if (!this_.panel.contains(e.toElement || e.relatedTarget)) {
                this_.hidePanel();
            }
        };

};

ol.inherits(ol.control.DimensionSwitcher, ol.control.Control);