goog.provide('ol.control.DimensionSwitcher');

/**
 * @classdesc
 * Provides a button that when clicked fills up the full screen with the map.
 * The full screen source element is by default the element containing the map viewport unless
 * overriden by providing the `source` option. In which case, the dom
 * element introduced using this parameter will be displayed in full screen.
 *
 * When in full screen mode, a close button is shown to exit full screen mode.
 * The [Fullscreen API](http://www.w3.org/TR/fullscreen/) is used to
 * toggle the map in full screen mode.
 *
 *
 * @constructor
 * @extends {ol.control.Control}
 * @param {olx.control.DimensionSwitcherOptions=} opt_options Options.
 * @api stable
 */
ol.control.DimensionSwitcher = function(opt_options) {

  var options = opt_options ? opt_options : {};

  /**
   * @private
   * @type {string}
   */
  this.cssClassName_ = options.className !== undefined ? options.className :
      'dimension_button';                                                       //change class name from 'ol-full-screen' to 'dimension_button'                                                                
                                                                                //position changed, but format is not acurate
  var label = options.label !== undefined ? options.label : '2D';         //'\u2922' signifies the diagonal double arrow --> change to "2D"

  /**
   * @private
   * @type {Node}
   */
  this.labelNode_ = typeof label === 'string' ?
      document.createTextNode(label) : label;

  var labelActive = options.labelActive !== undefined ? options.labelActive : '3D'; //'\u00d7' signifies the cross --> change to "3D"

  /**
   * @private
   * @type {Node}
   */
  this.labelActiveNode_ = typeof labelActive === 'string' ?
      document.createTextNode(labelActive) : labelActive;

  var tipLabel = options.tipLabel ? options.tipLabel : 'Toggle Dimension';        //'Toggle full-screen' is hover label --> change to "Toggle Dimension"
  var button = document.createElement('button');
  button.className = this.cssClassName_ + '-' + ol.control.DimensionSwitcher.is2D(); //change is "isFullScreen" to "is2D"
  button.setAttribute('type', 'button');
  button.title = tipLabel;
  button.appendChild(this.labelNode_);

  ol.events.listen(button, ol.events.EventType.CLICK,
      this.handleClick_, this);

  var cssClasses = this.cssClassName_ + ' ' + ol.css.CLASS_UNSELECTABLE +
      ' ' + ol.css.CLASS_CONTROL + ' ' +
      (!ol.control.DimensionSwitcher.isFullScreenSupported() ? ol.css.CLASS_UNSUPPORTED : ''); //not sure if "isFullScreenSupported" needs to be changed
  var element = document.createElement('div');
  element.className = cssClasses;
  element.appendChild(button);

  ol.control.Control.call(this, {
    element: element,
    target: options.target
  });

  /**
   * @private
   * @type {boolean}
   */
  this.keys_ = options.keys !== undefined ? options.keys : false;

  /**
   * @private
   * @type {Element|string|undefined}
   */
  this.source_ = options.source;

};
ol.inherits(ol.control.DimensionSwitcher, ol.control.Control);


/**
 * @param {Event} event The event to handle
 * @private
 */
ol.control.DimensionSwitcher.prototype.handleClick_ = function(event) {
  event.preventDefault();
  this.handleDimension_();                                                       //change "handleFullScreen_()" to "handleDimension_" -->renaming caused error
};


/**
 * @private
 */
ol.control.DimensionSwitcher.prototype.handleDimension__ = function() {         //change "handleFullScreen_()" to "handleDimension_"
  if (!ol.control.DimensionSwitcher.isFullScreenSupported()) {                  //can probably be deleted, since we are not going into FullScreen mode
    return;                                                                    //instead insert "handleDimension_" function here
  }
  var map = this.getMap();
  if (!map) {
    return;
  }
  if (ol.control.DimensionSwitcher.is2D()) {                           //case distiction --> change "isFullScreen" to "is2D"
    ol.control.DimensionSwitcher.exit2D();                             //function to get out of Fullscreen --> change "exitFullScreen" to "exit2D"
  } else {                                                                     
    var element;
    if (this.source_) {
      element = typeof this.source_ === 'string' ?                             // which string?
        document.getElementById(this.source_) :
        this.source_;
    } else {
      element = map.getTargetElement();
    }
    if (this.keys_) {                                                          //keys-shortcut for fullscreen --> delete
      ol.control.DimensionSwitcher.requestFullScreenWithKeys(element);         //keys-shortcut for fullscreen --> delete

    } else {
      ol.control.DimensionSwitcher.request2D(element);                //change"requestFullscreen" to "request2D"
    }
  }
};


/**
 * @private
 */
ol.control.DimensionSwitcher.prototype.handleDimensionChange_ = function() {     //change "handleFullScreenChange_" to "handleDimensionChange_"
  var button = this.element.firstElementChild;
  var map = this.getMap();
  if (ol.control.DimensionSwitcher.is2D()) {                              //change "isFullScreen" to "is2D"
    button.className = this.cssClassName_ + '-true';
    ol.dom.replaceNode(this.labelActiveNode_, this.labelNode_);
  } else {
    button.className = this.cssClassName_ + '-false';
    ol.dom.replaceNode(this.labelNode_, this.labelActiveNode_);
  }
  if (map) {
    map.updateSize();                                                             //not sure what to replace "updateSiz" with
  }
};


/**
 * @inheritDoc
 * @api stable
 */
ol.control.DimensionSwitcher.prototype.setMap = function(map) {                   //setMap = Remove the control from its current map and attach it to the new map
  ol.control.Control.prototype.setMap.call(this, map);
  if (map) {
    this.listenerKeys.push(ol.events.listen(document,
        ol.control.DimensionSwitcher.getChangeType_(),
        this.handleDimensionChange_, this)                                       //change "handleFullScreenChange_" to "handleDimensionChange_"
    );  
  }
};

/**
 * @return {boolean} Fullscreen is supported by the current platform.             //delete whole thing? Why would platform not support 2D...
 */
ol.control.DimensionSwitcher.isFullScreenSupported = function() {
  var body = document.body;
  return !!(
    body.webkitRequestFullscreen ||
    (body.mozRequestFullScreen && document.mozFullScreenEnabled) ||
    (body.msRequestFullscreen && document.msFullscreenEnabled) ||
    (body.requestFullscreen && document.fullscreenEnabled)
  );
};

/**
 * @return {boolean} Element is currently in fullscreen.                          //check if something is alread in 2D
 */
ol.control.DimensionSwitcher.is2D = function() {                          //change "isFullScreen" to "is2D"
  return !!(
    document.webkitIsFullScreen || document.mozFullScreen ||                      //insert DimensionSwitcher function ????...
    document.msFullscreenElement || document.fullscreenElement
  );
};

/**
 * Request to fullscreen an element.
 * @param {Node} element Element to request fullscreen
 */
ol.control.DimensionSwitcher.request2D = function(element) {              //...or here?
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
};

/**
 * Request to fullscreen an element with keyboard input.
 * @param {Node} element Element to request fullscreen
 */
ol.control.DimensionSwitcher.requestFullScreenWithKeys = function(element) {      //if keys-shortcut deleted above, delete this whole paragraph
  if (element.mozRequestFullScreenWithKeys) {
    element.mozRequestFullScreenWithKeys();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
  } else {
    ol.control.DimensionSwitcher.request2D(element);
  }
};

/**
 * Exit fullscreen.
 */
ol.control.DimensionSwitcher.exit2D = function() {                      //change "exitFullScreen" to "exit2D", insert DimensionSwitcher function for 3D back-change
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
};

/**
 * @return {string} Change type.
 * @private
 */
ol.control.DimensionSwitcher.getChangeType_ = (function() {
  var changeType;
  return function() {
    if (!changeType) {
      var body = document.body;
      if (body.webkitRequestFullscreen) {
        changeType = 'webkitfullscreenchange';
      } else if (body.mozRequestFullScreen) {
        changeType = 'mozfullscreenchange';
      } else if (body.msRequestFullscreen) {
        changeType = 'MSFullscreenChange';
      } else if (body.requestFullscreen) {
        changeType = 'fullscreenchange';
      }
    }
    return changeType;
  };
})();
