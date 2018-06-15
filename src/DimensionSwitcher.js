goog.provide('ol.control.DimensionSwitcher');

/**
 * @classdesc
 * A button control to reset rotation to 0.
 * To style this control use css selector `.ol-rotate`. A `.ol-hidden` css
 * selector is added to the button when the rotation is 0.
 *
 * @constructor
 * @extends {ol.control.Control}
 * @param {olx.control.DimensionSwitcherOptions=} opt_options DimensionSwitcher options.
 * @api stable
 */
ol.control.DimensionSwitcher = function(opt_options) {

  var options = opt_options ? opt_options : {};

  var className = options.className !== undefined ? options.className : 'ol-rotate';

  var label = options.label !== undefined ? options.label : '2D';
  this.labelNode_ = typeof label === 'string' ? document.createTextNode(label) : label;
      
  var label3D = options.label3D !== undefined ? options.label3D : '3D';
  this.label3DNode_ = typeof label3D === 'string' ? document.createTextNode(label3D) : label3D;

  /**
   * @type {Element}
   * @private
   */
  /*this.label_ = null;

  this.label_ = document.createElement('span');
  this.label_.className = 'ol-dimension';
  this.label_.textContent = label;*/

  var tipLabel = options.tipLabel ? options.tipLabel : 'Reset rotation';
    
  var button = document.createElement('button');
  button.className = className + '-reset';
  button.setAttribute('type', 'button');
  //button.title = tipLabel;
  button.appendChild(this.labelNode_);

  ol.events.listen(button, ol.events.EventType.CLICK,
      ol.control.DimensionSwitcher.prototype.handleClick_, this);

  var cssClasses = className + ' ' + ol.css.CLASS_UNSELECTABLE + ' ' +
      ol.css.CLASS_CONTROL;
  var element = document.createElement('div');
  element.className = cssClasses;
  element.appendChild(button);

  ol.control.Control.call(this, {
    element: element,
    target: options.target
  });


};
ol.inherits(ol.control.DimensionSwitcher, ol.control.Control);

/**
 * @param {Event} event The event to handle
 * @private
 */
ol.control.DimensionSwitcher.prototype.handleClick_ = function(event) {
  event.preventDefault();
  this.toggle3D();
  this.changeLabel_();
};

/**
 * @private
 */
//definition of the handleDimensionChange_ function
ol.control.DimensionSwitcher.prototype.changeLabel_ = function() {     //change "handleFullScreenChange_" to "handleDimensionChange_"
  var map = this.getMap();
  var button = this.element.firstElementChild;
  if (!app.is3D) {
    ol.dom.replaceNode(this.label3DNode_, this.labelNode_);
    } else {
    ol.dom.replaceNode(this.labelNode_, this.label3DNode_);
  }
  if (map) {
    map.updateSize();
  }
};

/**
 * @private
 */
ol.control.DimensionSwitcher.prototype.toggle3D = function() {
  var map = this.getMap();
  var view = map.getView();
  if (app.is3D==true) {
  //console.dir("switch to 2D");
  app.ol3d.setEnabled(false);
  app.is3D=false;
  } else {
    //console.dir("switch to 3D");
    app.ol3d.setEnabled(true);
    app.is3D=true;
  }
};
