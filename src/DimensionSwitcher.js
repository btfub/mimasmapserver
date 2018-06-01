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

//DimensionSwitcher is a function based on iput options ??
ol.control.DimensionSwitcher = function(opt_options) {                    

  //store as object options: if opt_options is TRUE (exists?) opt_options exists, else it doesn't (??)
  var options = opt_options ? opt_options : {};                           

  /**
   * @private
   * @type {string}
   */
  //this is global object with the property cssClassName
  //if the property className of options is not undefined it will make up cssClassName_, else take the class 'dimension_button'
  this.cssClassName_ = options.className !== undefined ? options.className :
      'dimension_button';                                                       //change class name from 'ol-full-screen' to 'dimension_button'                                                                
                                                                                //position changed, but format is not acurate
  //if the property label of the object options is not undefined it will make up label, else take '2D' as label                                                                            
  var label = options.label !== undefined ? options.label : '2D';         //'\u2922' signifies the diagonal double arrow --> change to "2D"

  /**
   * @private
   * @type {Node}
   */
  //this is a global object with the property labelNode_
  //if the type of the label is string create a document object with a text node containing label ('2D'), else use existing label
  this.labelNode_ = typeof label === 'string' ?
      document.createTextNode(label) : label;

  //if labelActive of the object options is not undefined, it will make up labelActive, else '3D' makes up labelActive
  var labelActive = options.labelActive !== undefined ? options.labelActive : '3D'; //'\u00d7' signifies the cross --> change to "3D"

  /**
   * @private
   * @type {Node}
   */
  //this is a global object with the property labelActiveNode_
  //if the type of the labelActive is string create a document object with a text node containing labelActive ('3D'), else use existing labelActive
  this.labelActiveNode_ = typeof labelActive === 'string' ?
      document.createTextNode(labelActive) : labelActive;

  //if the property tip.label of the object options is not undefined it will make up tiplabel, else take 'Toggle Dimension' as tiplabel 
  var tipLabel = options.tipLabel ? options.tipLabel : 'Toggle Dimension';        //'Toggle full-screen' is hover label --> change to "Toggle Dimension"
  //create a document object called button of the type 'button'
  var button = document.createElement('button');
  //the property className of button is the concatenation 'dimension_button','-' and True/False
  button.className = this.cssClassName_ + '-' + ol.control.DimensionSwitcher.is2D(); //change "isFullScreen" to "is2D"
  //the Attribute type for the variable button is set to button
  button.setAttribute('type', 'button');
  //assign the title 'Toggle Dimension' to the button
  button.title = tipLabel;
  //assign the text node '2D' to the button 
  button.appendChild(this.labelNode_);

  //clicking the button triggers the associated event handleClick_ 
  ol.events.listen(button, ol.events.EventType.CLICK,
      this.handleClick_, this);

  //create the variable cssClasses containing class names for the button
  var cssClasses = this.cssClassName_ + ' ' + ol.css.CLASS_UNSELECTABLE +
      ' ' + ol.css.CLASS_CONTROL + ' ' +
      //if Fullscreen is not supported use ol.css.CLASS_UNSUPPORTED as 4th class in cssClasses else no 4th class
      (!ol.control.DimensionSwitcher.isFullScreenSupported() ? ol.css.CLASS_UNSUPPORTED : ''); //not sure if "isFullScreenSupported" needs to be changed
  //create a document object called element of the type 'div'
  var element = document.createElement('div');
  //assign the 3/4 classes from cssClasses to element
  element.className = cssClasses;
  //assign the div with the css classes to the button
  element.appendChild(button);

  //call method Control from object ol.control, don't understand the 'this'
  ol.control.Control.call(this, {
    //TBC ??
    element: element,
    //TBC ??
    target: options.target
  });

  /**
   * @private
   * @type {boolean}
   */
  //if the property key of the object options is not undefined it will make up the global variable keys_, else set it to false  
  this.keys_ = options.keys !== undefined ? options.keys : false;

  /**
   * @private
   * @type {Element|string|undefined}
   */
  //the global object with the property source_ is made up by the source of the object options (TBC content???)
  this.source_ = options.source;

};

//ol.control.DimensionSwitcher inherits methods from ol.control.Control
ol.inherits(ol.control.DimensionSwitcher, ol.control.Control);


/**
 * @param {Event} event The event to handle
 * @private
 */
//add mew method handle_Click_ to the DimensionSwitcher prototype
//when clicking execute the method handleDimension_ defined below
ol.control.DimensionSwitcher.prototype.handleClick_ = function(event) {
  //stop event propagation
  event.preventDefault();
  //execute method handleDimension_
  this.handleDimension_();                                                       //change "handleFullScreen_()" to "handleDimension_()"
};


/**
 * @private
 */
//add mew method handleDimension_ to the DimensionSwitcher prototype
ol.control.DimensionSwitcher.prototype.handleDimension_ = function() {         //change "handleFullScreen_" to "handleDimension_"
  //if full screen is not supported stop execution of function isFullScreenSupported (defined below)
  if (!ol.control.DimensionSwitcher.isFullScreenSupported()) {                  //can probably be deleted, since we are not going into FullScreen mode
    return;                                                                    //instead insert "handleDimension_()" function here
  }
  //display map object
  var map = this.getMap();
  //if the map object doesn't exist stop function (TBC ???)
  if (!map) {
    return;
  }
  //if the map is in 2D, exit 2D mode (make it 3D), else 
  if (ol.control.DimensionSwitcher.is2D()) {                           //case distiction --> change "isFullScreen" to "is2D"
    ol.control.DimensionSwitcher.exit2D();                             //function to get out of Fullscreen --> change "exitFullScreen" to "exit2D"
  } else {                                                                
    var element;
    //if source_ exists, else
    if (this.source_) {
      //..if the global property source_ has the value and type 'string', the document object from the global property source_ makes up element..
      element = typeof this.source_ === 'string' ?                                  
        document.getElementById(this.source_) :
        //..else source_ is makes up element
        this.source_;
    //element becomes the DOM element into which this map is rendered
    } else {
      element = map.getTargetElement();
    }
    //if keys_ exists
    if (this.keys_) {                                                          //keys-shortcut for fullscreen --> delete
      //execute requestFullScreenWithKeys defined below using the element parameter from above
      ol.control.DimensionSwitcher.requestFullScreenWithKeys(element);         //keys-shortcut for fullscreen --> delete
     //else execute request2D using the element parameter from above
    } else {
      ol.control.DimensionSwitcher.request2D(element);                //change"requestFullscreen" to "request2D"
    }
  }
};


/**
 * @private
 */
//definition of the handleDimensionChange_ function
ol.control.DimensionSwitcher.prototype.handleDimensionChange_ = function() {     //change "handleFullScreenChange_" to "handleDimensionChange_"
  //make element a firstElementChild of the button object
  var button = this.element.firstElementChild;
  //map stored in map object
  var map = this.getMap();
  //if method is2D is called
  if (ol.control.DimensionSwitcher.is2D()) {                              //change "isFullScreen" to "is2D"
    //give button the css class addition '-true'
    button.className = this.cssClassName_ + '-true';
    //replace the labelActiveNode_ ('3D') with the labelNode('2D')
    ol.dom.replaceNode(this.labelActiveNode_, this.labelNode_);
  //else
  } else {
    //give button the css class addition '-false'
    button.className = this.cssClassName_ + '-false';
    //replace the labelNode('2D') with the labelActiveNode_ ('3D')
    ol.dom.replaceNode(this.labelNode_, this.labelActiveNode_);
  }
  //if map exists (??? TBC)
  if (map) {
    //force a recalculation of the map viewport size
    map.updateSize();                                                             //not sure what to replace "updateSize" with
  }
};


/**
 * @inheritDoc
 * @api stable
 */
//definition of the setMap function
//function setMap removes the control from its current map and attach it to the new map
ol.control.DimensionSwitcher.prototype.setMap = function(map) {
  //call method setMap from object ol.control.Control.prototype, don't understand the 'this'
  ol.control.Control.prototype.setMap.call(this, map);
  //if map exists
  if (map) {
    //adds global listenerKeys containing document, getChangeType_, handleDimensionChange_ and this to 'this' (??? TBC)
    this.listenerKeys.push(ol.events.listen(document,
        ol.control.DimensionSwitcher.getChangeType_(),
        this.handleDimensionChange_, this)                                       //change "handleFullScreenChange_" to "handleDimensionChange_"
    );  
  }
};

/**
 * @return {boolean} Fullscreen is supported by the current platform.             //delete whole thing? Why would platform not support 2D...
 */
//definition of the isFullScreenSupported function
//function isFullScreenSupported enables fullscreen for different browsers
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
//definition of the is2D function
//function is2D checks if the map is set to 2D already
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
//definition of the request2D function
//function request2D request a 2D map for all browser types
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
//definition of the requestFullScreenWithKeys function
//function requestFullScreenWithKeys triggers request2D through key input for all browser types
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
//definition of the exit2D function
//function exit2D change the map from 2D to 3D for all browsers
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
//definition of the getChangeType_ function
//function getChangeType_ detect browser type and returns the respective change to fullscreen
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
