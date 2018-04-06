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

app.view = new ol.View({
    //projection: app.projection60109,
    projection: 'EPSG:4326',
    center: [0, 0],
    zoom: 1,
    maxZoom: 16,
    minZoom: 0
});

app.controls = new ol.control.defaults({
    attribution: false
}).extend([
   //app.LayerSwitcher
]);

/**
 * @type {ol.Map}
 */
app.map = new ol.Map({
    target: 'map',
    layers: [
                app.base,
                //app.geol001,
                //app.ISS_126MI_FP3DAYMAP001,
                //new ol.layer.Group({
                //        'title': 'Individual images',
                //        'visible': true,
                //        layers: app.cassImageLayers
                //}),
                //app.N1644785949_foot,
                //app.gridTileWms,
                //app.gridwfs
        ],
    view: app.view,
    controls: app.controls,
});

app.ol3d = new olcs.OLCesium({
        map: app.map,
        sceneOptions: { show: true }
        });

app.ol3d.scene_.skyAtmosphere.show=false;
app.ol3d.setEnabled(true);
