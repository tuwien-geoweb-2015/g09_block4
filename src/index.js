require('../node_modules/openlayers/dist/ol.css');
require('./index.css');

var ol = require('openlayers');

var map = new ol.Map({
  controls: ol.control.defaults({attributionOptions: {collapsible: false}}),
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([16.373064, 48.20833]),
    zoom: 13
  })
});
var url = 'http://student.ifip.tuwien.ac.at/geoserver/wfs';
var layer = 'feedback';
var prefix = 'g09_2015'; // Ersetzen durch euren Arbeitsbereich-Namen
var featureNS = 'http://g09/2015'; // Ersetzen durch eure Namensraum-URI
var form = document.getElementById('feedback');

var feature = new ol.Feature();
feature.setGeometryName('geom');
feature.setGeometry(new ol.geom.Point(map.getView().getCenter()));

var send = require('./feedback_send');
send(form, feature, url, {
  featureType: layer,
  featurePrefix: prefix,
  featureNS: featureNS,
  srsName: map.getView().getProjection().getCode()
});

var feedbackPoints = new ol.source.Vector({
  features: new ol.Collection(),
});
map.addLayer(new ol.layer.Vector({ source: feedbackPoints }));
feedbackPoints.addFeature(feature);
var modify = new ol.interaction.Modify({
  features: feedbackPoints.getFeaturesCollection()
});
map.addInteraction(modify);

var modify = new ol.interaction.Modify({
  features: feedbackPoints.getFeaturesCollection()
});
map.addInteraction(modify);

var geolocation = new ol.Geolocation({
  projection: map.getView().getProjection(),
  tracking: true
});
geolocation.once('change:position', function(evt) {
  feature.getGeometry().setCoordinates(geolocation.getPosition());
  map.getView().setCenter(geolocation.getPosition());
});