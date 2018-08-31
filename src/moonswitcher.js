goog.provide('ol.control.MoonSwitcher');

ol.control.MoonSwitcher = function(opt_options) {

  var options = opt_options ? opt_options : {};

  var className = options.className !== undefined ? options.className : 'ol-moonswitcher';

  var label = options.label !== undefined ? options.label : 'M';
  this.labelNode_ = typeof label === 'string' ? document.createTextNode(label) : label;
      
  var label2 = options.label2 !== undefined ? options.label2 : 'M2';
  this.label2Node_ = typeof label2 === 'string' ? document.createTextNode(label2) : label2;

  var tipLabel = options.tipLabel ? options.tipLabel : 'Toggle Moon';
  

  //what happends when clicking on dropdown element
  var selectList = document.createElement("select");
  selectList.id = "mySelect";
  selectList.title = tipLabel; //see next commented paragraph
  selectList.appendChild(this.label2Node_);//see next commented paragraph
  selectList.setAttribute('type', 'select');//see next commented paragraph

  ol.events.listen(selectList, ol.events.EventType.CLICK,
      ol.control.MoonSwitcher.prototype.handleSelection_, this); 
  

  //what appears on drop down menu
  var array = ["Mimas","Enceladus"];
  for (var i = 0; i < array.length; i++) {
    var option = document.createElement("option");
    option.value = array[i];
    option.text = array[i];
    selectList.appendChild(option);
	};

  //classes
  var cssClasses = className + ' ' + ol.css.CLASS_UNSELECTABLE + ' ' +
      ol.css.CLASS_CONTROL;
  var element = document.createElement('div');
  element.className = cssClasses;
  element.appendChild(selectList);//drop down menu becomes part of the element div

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
//what should happend when drop drop down menu is clicked
ol.control.MoonSwitcher.prototype.handleSelection_ = function(event) {
  event.preventDefault();
  this.toggleMoon();
};

/**
 * @private
 */
ol.control.MoonSwitcher.prototype.toggleMoon = function() {

  var map = this.getMap();
  var view = map.getView();

  console.dir(app.map.getLayers());
  if (app.isMimas==true) {
    console.dir("switch to M2");
    app.isMimas=false;
  } else {
    console.dir("switch to M");
    app.isMimas=true;
  }
  app.moonlayers = app.isMimas == true ?  app.m: app.m2;
  app.map.getLayerGroup().setLayers(new ol.Collection(app.moonlayers));
  app.LayerSwitcher.renderPanel();
};