goog.provide('app');

//goog.require('ol.Map');
//goog.require('ol.View');
//goog.require('ol.layer.Tile');
//goog.require('ol.source.TileWMS');

app.base = new ol.layer.Tile({
        preload: 5,
        title: "Mimas Basemap (DLR)",
        //type: "base",
        visible: true,
        source: new ol.source.TileWMS({
                url: 'http://maps.planet.fu-berlin.de/mimas-bin/wms',
                params: {
                        LAYERS: 'BASE',
                        VERSION: '1.3.0',
                        TILED: true
                },
                wrapX: false
        })
});
app.geol001 = new ol.layer.Tile({
	preload: 5,
	title: "GEOL001",
	visible: true,
	source: new ol.source.TileWMS({
		url: 'http://maps.planet.fu-berlin.de/mimas-bin/wms',
		params: {
			LAYERS: 'GEOLOG001',
			VERSION: '1.3.0',
			TILED: true
		},
		wrapX: false
	})
});
app.ISS_126MI_FP3DAYMAP001 = new ol.layer.Tile({
	preload: 5,
	title: "126MI_FP3DAYMAP001 Mosaic",
	visible: true,
	source: new ol.source.TileWMS({
		url: 'http://maps.planet.fu-berlin.de/mimas-bin/wms',
		params: {
			LAYERS: 'ISS_126MI_FP3DAYMAP001',
			VERSION: '1.3.0',
			TILED: true
		},
		wrapX: false
	})
});
app.N1644785949_foot = new ol.layer.Tile({
	preload: 5,
	title: "Footprints",
	visible: true,
	source: new ol.source.TileWMS({
		url: 'http://maps.planet.fu-berlin.de/mimas-bin/wms',
		params: {
			LAYERS: 'N1644785949_foot',
			VERSION: '1.3.0',
			TILED: true
		},
		wrapX: false
	})
});
var cassImages=['N1644784329', 'N1644784749', 'N1644785949', 'N1644786249','N1644782658', 'N1644783429'];
app.cassImageLayers = [];
var tmpSource, tmpTile;
for (image of cassImages) {
	tmpSource = new ol.source.TileWMS({
		url: 'http://maps.planet.fu-berlin.de/mimas-bin/wms',
		params: {
			LAYERS: image,
			VERSION: '1.3.0',
			TILED: true
		},
		wrapX: false
	});
	tmpTile = new ol.layer.Tile({
		title: image,
		visible: true,
		source: tmpSource,
    });
    app.cassImageLayers.push(tmpTile);
}
app.gridTileWms = new ol.layer.Tile({
	preload: 5,
	title: "Graticule",
	visible: true,
	source: new ol.source.TileWMS({
		url: 'http://maps.planet.fu-berlin.de/mimas-bin/wms',
		params: {
			LAYERS: 'grid',
			VERSION: '1.3.0',
			TILED: true
		},
		wrapX: false
	})
});
app.gridsource=new ol.source.ImageWMS({
		url: 'http://maps.planet.fu-berlin.de/mimas-bin/wms',
		serverType: 'mapserver',
		crossOrigin: 'anonymous',
		params: {
			LAYERS: 'grid',
			VERSION: '1.3.0',
			TILED: false
		},
		wrapX: false
	});
app.grid = new ol.layer.Image({
	title: "Graticule",
	visible: true,
	source: app.gridsource
});
console.dir(app.gridsource);
var url = 'http://maps.planet.fu-berlin.de/mimas-bin/wms?' +
        'service=WFS&version=1.1.0&request=GetFeature&typename=grid&' +
        'outputFormat=geojson&srsname=EPSG:4326&' +
        'bbox=-180,-90,180,90,EPSG:4326';
var vectorSource = new ol.source.Vector({
	format: new ol.format.GeoJSON(),
	url: url,
	strategy: ol.loadingstrategy.bbox,
	wrapX: false
  });
  console.dir(vectorSource);
app.gridwfs = new ol.layer.Vector({
	title: 'Graticule',
	visible: true,
	source: vectorSource,
	style: new ol.style.Style({
	  stroke: new ol.style.Stroke({
		color: 'rgba(255, 255, 255, .4)',
		width: 1
	  })
	})
  });
app.view = new ol.View({
    //projection: app.projection60109,
    projection: 'EPSG:4326',
    center: [0, 0],
    zoom: 1,
    maxZoom: 16,
    minZoom: 0
});
app.LayerSwitcher = new ol.control.LayerSwitcher();


//2D3D Switcher (DimensionSwitcher) - START
var button = document.createElement('button'); 
//creates new element of type 'button'
button.innerHTML = '<p class="dimension_button">2D</p>';
//place clickable HTML content into button

//definition of switcher function
var handleDimension = function() {
  var mode = window.location.href.match(/mode=([a-z0-9\-]+)\&?/i); 
  //searches for matches against the regular expressions within website's URI --> checks current mode (2D/3D)
  var DIST = false;
  //DIST means false --> ??
  var isDev = mode && mode[1] === 'dev';
  //is true if the matched URI and the first position (?) of the matched URI are 'dev' in both type and value
  var cs = isDev ? 'CesiumUnminified/Cesium.js' : 'Cesium/Cesium.js';
  // if 'dev' in URI use 'CesiumUnminified/Cesium.js' else use 'Cesium/Cesium.js'
  var ol = (DIST && isDev) ? 'olcesium-debug.js' : 'olcesium-debug.js';//'@loader';
  // if DIST and isDev are both true use 'olcesium-debug.js' else use '@loader' --> DIST is always false ????

  //if LAZY_CESIUM is not true write a script-document based on cs
  if (!window.LAZY_CESIUM) { 
	document.write('<scr' + 'ipt type="text/javascript" src="node_modules/ol-cesium/dist/' + cs + '"></scr' + 'ipt>');
  //document.write('<scr' + 'ipt type="text/javascript" src="../cesium/Build/' + cs + '"></scr' + 'ipt>');
  }

  //write a script-document basd on ol
  document.write('<scr' + 'ipt type="text/javascript" src="node_modules/ol-cesium/dist/' + ol + '"></scr' + 'ipt>');
  //document.write('<scr' + 'ipt type="text/javascript" src="../' + ol + '"></scr' + 'ipt>');  

  var s; //auxiliary variable
  //definition of the lazyLoadCesium function --> if the map is not 2D, make it 2D
  window.lazyLoadCesium = function() {
    if (!s) {//if s is false
      s = document.createElement("script");      
      s.type = "text/javascript";
      s.src = 'node_modules/ol-cesium/dist/' + cs;
      //creates element of type 'script', for javascript, from the given directory
      console.log('loading Cesium...');
      //displays 'loading Cesium in the console'
      document.body.appendChild(s);
      //element of type 'script' is inserted into document
    }
    return s; //else return s --> if the map is 2D, keep it 2D
  };
};//ending of switcher function definition

button.addEventListener('click', handleDimension, false);
//applies handleDimension function upon click

var element = document.createElement('div');
//creates new element of type 'div' --> button content
element.className = 'dimension_button ol-unselectable ol-control';
//assign 'div' a styling class 
element.appendChild(button); //element of type 'button' is inserted into the element of type 'div'

//make button a new control named DimensionSwitcher
app.DimensionSwitcher = new ol.control.Control({
    element: element
});
//2D3D Switcher (DimensionSwitcher) - END


app.controls = new ol.control.defaults({
    attribution: false
}).extend([
   app.LayerSwitcher,
   app.DimensionSwitcher//DimensionSwitcher
]);


/**
 * @type {ol.Map}
 */
app.map = new ol.Map({
    target: 'map',
    layers: [
                app.base,
                //app.geol001,
                app.ISS_126MI_FP3DAYMAP001,
                new ol.layer.Group({
                        'title': 'Individual images',
                        'visible': true,
                        layers: app.cassImageLayers
                }),
                app.N1644785949_foot,
                app.gridTileWms,
                //app.gridwfs
        ],
    view: app.view,
    controls: app.controls
});

app.layerSwitcher = new ol.control.LayerSwitcher({
        tipLabel: 'Légende' // Optional label for button
    });
 
app.map.addControl(app.layerSwitcher, app.DimensionSwitcher);//DimensionSwitcher

app.ol3d = new olcs.OLCesium({
        map: app.map,
        sceneOptions: { show: true }
        });

app.ol3d.scene_.skyAtmosphere.show=false;
app.ol3d.setEnabled(true);