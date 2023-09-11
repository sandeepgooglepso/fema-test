// Dynamically load the Leaflet library
function loadScript(url, callback){
    var script = document.createElement("script")
    script.type = "text/javascript";

    if (script.readyState){  // For old versions of IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" || script.readyState == "complete"){
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {
        script.onload = callback;
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

loadScript("https://unpkg.com/leaflet@1.7.1/dist/leaflet.js", function() {
    // Your custom visualization code starts here
    looker.plugins.visualizations.add({
      id: "custom_geojson_polygon_map",
      label: "GeoJSON Polygon Map",
      options: {
        // Here you can define some options that users can set for the visualization.
        // For instance, you can allow users to set the map's default zoom level or center point.
      },
      // Set up the initial state of the visualization
      create: function(element, config) {
        element.innerHTML = `
          <div id="map" style="width: 100%; height: 100%;"></div>
        `;

        this.map = L.map('map').setView([37.7749, -122.4194], 10);  // Default to San Francisco for this example.
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
      },

      updateAsync: function(data, element, config, queryResponse, details, done) {
        // Clear the previous layers
        this.map.eachLayer(layer => {
          if (layer !== L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')) {
            this.map.removeLayer(layer);
          }
        });

        data.forEach(row => {
          const geojsonData = row["geojson_polygon.value"]; 

          if (geojsonData) {
            L.geoJSON(geojsonData).addTo(this.map);
          }
        });

        done();
      }
    });

});

loadScript("https://unpkg.com/leaflet@1.7.1/dist/leaflet.css", function() { /* CSS loaded callback */ });

