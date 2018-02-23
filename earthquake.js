var satelliteLayer = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});
// Define variables for our base layers
var streetmap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
    "T6YbdDixkOBWH_k9GbS8JQ"
);
var earthQuakeMarkers = [];
//Get the earthquake data
const earthquakeQuery = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function buildTectonic(data){
    createTectonicFeature(data);
};
buildTectonic(tectonic);
var tectonicPlates ;
function createTectonicFeature(data){
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + "Date::" + new Date(feature.properties.time) + "</p>");
    };
    tectonicPlates = L.geoJSON(data, {
        onEachFeature: onEachFeature
    });
}
// Perform a GET request to the query URL
d3.json(earthquakeQuery, function (data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data);
});
function createFeatures(earthquakeData) {
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + "Date::" + new Date(feature.properties.time) + "</p>");
        earthQuakeMarkers.push(
            L.circle(feature.properties.place), {
                fillColor: chooseColor(feature.properties.mag),
                fillOpacity: 0.75,
                radius: feature.properties.mag
            }
        );
    };

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature
    });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

function createMap(earthquakes) {
    // Define variables for our base layers
    var streetmap = L.tileLayer(
        "https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
        "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
        "T6YbdDixkOBWH_k9GbS8JQ"
    );
    var satelliteLayer = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    // Create a baseMaps object
    var baseMaps = {
        "Satellite": satelliteLayer,
        "Outdoor": streetmap
    };

    var overlayMaps = {
        "Earthquakes": earthquakes,
        "Fault Lines":tectonicPlates
    };
    var ethQuakeMap = L.map("map", {
        center: [40.7128, -74.0059],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(ethQuakeMap);
}
