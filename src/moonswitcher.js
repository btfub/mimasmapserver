goog.provide('ol.control.MoonSwitcher');

ol.control.DimensionSwitcher = function(opt_options) {

  var options = opt_options ? opt_options : {};

  var className = options.className !== undefined ? options.className : 'ol-rotate';

  var label = options.label !== undefined ? options.label : 'Mimas';
  this.labelNode_ = typeof label === 'string' ? document.createTextNode(label) : label;
      
  var label2 = options.label2 !== undefined ? options.label2 : 'Mimas2';
  this.label2Node_ = typeof label2 === 'string' ? document.createTextNode(label2) : label2;
}