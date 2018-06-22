goog.provide('ol.control.MoonSwitcher');

ol.control.MoonSwitcher = function(opt_options) {

  var options = opt_options ? opt_options : {};

  var className = options.className !== undefined ? options.className : 'ol-rotate';

  var label = options.label !== undefined ? options.label : 'M';
  this.labelNode_ = typeof label === 'string' ? document.createTextNode(label) : label;
      
  var label2 = options.label2 !== undefined ? options.label2 : 'M2';
  this.label2Node_ = typeof label2 === 'string' ? document.createTextNode(label2) : label2;


  var tipLabel = options.tipLabel ? options.tipLabel : 'Toggle Moon';
    
  var button = document.createElement('button');
  button.className = className + '-reset';
  //assign the title 'Toggle Moon' to the button
  button.title = tipLabel;
  button.setAttribute('type', 'button');
  //button.title = tipLabel;
  button.appendChild(this.labelNode_);

  ol.events.listen(button, ol.events.EventType.CLICK,
      ol.control.MoonSwitcher.prototype.handleClick_, this);

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

ol.inherits(ol.control.MoonSwitcher, ol.control.Control);

/**
* @param {Event} event The event to handle
* @private
*/
ol.control.MoonSwitcher.prototype.handleClick_ = function(event) {
  event.preventDefault();
  this.toggleMoon();
  this.changeLabel_();
};


/**
 * @private
 */
//definition of the handleMoonChange_ function
ol.control.MoonSwitcher.prototype.changeLabel_ = function() {
  var map = this.getMap();
  var button = this.element.firstElementChild;
  if (!app.isMimas) {
    ol.dom.replaceNode(this.label2Node_, this.labelNode_);
    } else {
    ol.dom.replaceNode(this.labelNode_, this.label2Node_);
  }
  if (map) {
    map.updateSize();
  }
};

/**
 * @private
 */
ol.control.MoonSwitcher.prototype.toggleMoon = function() {
  var map = this.getMap();
  var view = map.getView();
  if (app.isMimas==true) {
  //console.dir("switch to M2");
  app.ol3d.setEnabled(false);
  app.isMimas=false;
  } else {
    //console.dir("switch to M");
    app.ol3d.setEnabled(true);
    app.isMimas=true;
  }
};