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
app.DimensionSwitcher = function (opt_options){
	var options = opt_options ||{};
	
	var dimension_button = document.createElement('Dimension Button');
	dimension_button.innerHTML='BLA';

	var this_=this;
	var handleDimension = function(){
		var mode = window.location.href.match(/mode=([a-z0-9\-]+)\&?/i);
		var DIST = false;
		var isDev = mode && mode[1] === 'dev';
		var cs = isDev ? 'CesiumUnminified/Cesium.js' : 'Cesium/Cesium.js';
		var ol = (DIST && isDev) ? 'olcesium-debug.js' : '@loader';

		if (!window.LAZY_CESIUM) {
		document.write('<scr' + 'ipt type="text/javascript" src="../cesium/Build/' + cs + '"></scr' + 'ipt>');
		}
		document.write('<scr' + 'ipt type="text/javascript" src="../' + ol + '"></scr' + 'ipt>');

		var s;
		window.lazyLoadCesium = function() {
		if (!s) {
		  s = document.createElement("script");
		  s.type = "text/javascript";
		  s.src = '../cesium/Build/' + cs;
		  console.log('loading Cesium...');
		  document.body.appendChild(s);
		}
		return s;
		};
	};
	
    dimension_button.addEventListener('click', handleDimension, false);
    dimension_button.addEventListener('touchstart', handleDimension, false);

    var element = document.createElement('div');
    element.className = 'ol-control dimension_button ol-unselectable';
    element.appendChild(dimension_button);

    ol.control.Control.call(this, {
    	element: element,
    	target: options.target
    });
};

ol.inherits(app.DimensionSwitcher, ol.control.Control);
//2D3D Switcher (DimensionSwitcher) - END


app.controls = new ol.control.defaults({
    attribution: false
}).extend([
   app.LayerSwitcher,
   app.DimensionSwitcher //2D3D
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
    controls: app.controls,
});

app.layerSwitcher = new ol.control.LayerSwitcher({
        tipLabel: 'Légende' // Optional label for button
    });

app.dimensionSwitcher = new ol.control.DimensionSwitcher({ //2D3D
        tipLabel: 'Blub' // Optional label for button
    });
 
app.map.addControl(app.layerSwitcher, app.dimensionSwitcher); //2D3D

app.ol3d = new olcs.OLCesium({
        map: app.map,
        sceneOptions: { show: true }
        });

app.ol3d.scene_.skyAtmosphere.show=false;
app.ol3d.setEnabled(true);