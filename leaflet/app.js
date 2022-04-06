
  map = new L.Map("map", {
    center: new L.LatLng(18.5204, 73.8567),
    zoom: 8,
    elementType: "labels",
    stylers: [{ visibility: "on" }],
  }),
  drawnItems = L.featureGroup().addTo(map);

var hybridMutant = L.gridLayer
  .googleMutant({
    maxZoom: 24,
    type: "hybrid",
  })
  .addTo(map);
  
var source = L.WMS.source("http://localhost:8080/geoserver/project/wms", {
    format: 'image/png',
    transparent: true
})
var wmsLayer = source.getLayer('project:polygons');
wmsLayer.addTo(map);

L.control
  .layers(
    {
      Hybrid: hybridMutant,
	  Polygon: source
    },
    {},
    {
      collapsed: true,
    }
  )
  .addTo(map);


var results = new L.LayerGroup().addTo(map);

L.control.scale().addTo(map);
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// Initialise the draw control and pass it the FeatureGroup of editable layers
var drawControl = new L.Control.Draw({
  //position: 'topright',
  draw: {
    polyline: {
            metric: true
        },
    polygon: {
      allowIntersection: false,
      showArea: false,

      drawError: {
        color: "#b00b00",
        timeout: 1000,
      },
      shapeOptions: {
        color: "#5596da",
        showMeasurements: false,
        showLength: false,
      },
    },
    polyline: false,
    rectangle: false,
    circle: false,
    circlemaker: false,
    marker: false,
    circlemarker: false,
  },
});

map.on(L.Draw.Event.CREATED, function (e) {
  var type = e.layerType;
  var layer = e.layer;

  if (type == "polygon") {
    var latlngval = layer.getLatLngs();
    showArea: false;
    showMeasurements: false;
  }
  drawnItems.addLayer(layer);
});

map.on("draw:created", function (e) {
  check = Object.keys(drawnItems._layers).length;
  var type = e.layerType,
  layer = e.layer;
  map.removeControl(drawControl);

  if (type == "polygon") {
    var latlngval = layer.getLatLngs();
    //for polygon geometry
    var geojson = layer.toGeoJSON();
    var str = geojson["geometry"]["coordinates"][0];
    var myJsonString = JSON.stringify(str);
	
	let geometry = "POLYGON(("
	str.map((string,index)=>{if(index+1<str.length){
		geometry+=`${string[0]} ${string[1]},`
	}else{
		geometry+=`${string[0]} ${string[1]}`
	}})
	geometry+="))"
    document.getElementById("txt_geom").value = geometry;
  }  
  // map.addControl(drawControl);
  document.getElementById("btn_save_polygon").style.display = "block";
  document.getElementById("btn_save_polygon_dv").style.display = "block";
});

map.addControl(drawControl);
