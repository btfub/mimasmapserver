goog.provide('ol.control.MoonSwitcher');

ol.control.MoonSwitcher = function(opt_options) {

  var options = opt_options ? opt_options : {};

//VON HIER

  var selectList = document.createElement("select");
  selectList.id = "mySelect";
  selectList.onchange = function(e){
      console.log(e);
      alert(this.value);
      this.toggleMoon; // ??
  }
  var array = ["Mimas","Enceladus"];
  for (var i = 0; i < array.length; i++) {
    var option = document.createElement("option");
    option.value = array[i];
    option.text = array[i];
    selectList.appendChild(option);
	}

//BIS HIER
  var className = options.className !== undefined ? options.className : 'ol-moonswitcher';

  var label = options.label !== undefined ? options.label : 'M';
  this.labelNode_ = typeof label === 'string' ? document.createTextNode(label) : label;
      
  var label2 = options.label2 !== undefined ? options.label2 : 'M2';
  this.label2Node_ = typeof label2 === 'string' ? document.createTextNode(label2) : label2;


  var tipLabel = options.tipLabel ? options.tipLabel : 'Toggle Moon';
    
  //var button = document.createElement('button');
  //button.className = className + '-reset';
  //assign the title 'Toggle Moon' to the button
  selectList.title = tipLabel;
  //button.setAttribute('type', 'button');
  //button.title = tipLabel;
  //button.appendChild(this.label2Node_);
  selectList.appendChild(this.label2Node_);

  
  /*
  ol.events.listen(button, ol.events.EventType.CLICK,
      ol.control.MoonSwitcher.prototype.handleClick_, this);
  */
  ol.events.listen(selectList, ol.events.EventType.CLICK, //DER HIER
      ol.control.MoonSwitcher.prototype.handleClick_, this);

  var cssClasses = className + ' ' + ol.css.CLASS_UNSELECTABLE + ' ' +
      ol.css.CLASS_CONTROL;
  var element = document.createElement('div');
  element.className = cssClasses;
  //element.appendChild(button);

  element.appendChild(selectList);//DER HIER

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
/*
ol.control.MoonSwitcher.prototype.handleClick_ = function(event) {
  event.preventDefault();
  this.toggleMoon();
  this.changeLabel_();
};
*/
//FÜR DROP-DOWN MENU

ol.control.MoonSwitcher.prototype.handleSelection_ = function(event) {
  event.preventDefault();
  this.toggleMoon();
  this.changeLabel_();
};


/**
 * @private
 */
//definition of the handleMoonChange_ function
/*
ol.control.MoonSwitcher.prototype.changeLabel_ = function() {
  var map = this.getMap();
  var button = this.element.firstElementChild;
  //var selectList = this.element.firstElementChild;  //didn't work
  if (!app.isMimas) {
    ol.dom.replaceNode(this.label2Node_, this.labelNode_);
    } else {
    ol.dom.replaceNode(this.labelNode_, this.label2Node_);
  }
  if (map) {
    map.updateSize(); // change upon clicking button
  }
};
*/
/**
 * @private
 */
ol.control.MoonSwitcher.prototype.toggleMoon = function() {

  var map = this.getMap();
  var view = map.getView();

  console.dir(app.map.getLayers());
  if (app.isMimas==true) {
    console.dir("switch to M2");
    //document.getElementById("mySelect").value = "mimas"; //mimas and enceladus need to be defined
    app.isMimas=false;
  } else {
    console.dir("switch to M");
    //document.getElementById("mySelect").value = "enceladus";
    app.isMimas=true;
  }
  app.moonlayers = app.isMimas == true ?  app.m: app.m2;
  app.map.getLayerGroup().setLayers(new ol.Collection(app.moonlayers));
  app.LayerSwitcher.renderPanel();
};