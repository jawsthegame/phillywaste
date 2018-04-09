/**
 * Calculate the area of a polygon
 * @param {number[]} x - An ordered array of X coordinates
 * @param {number[]} y - An ordered array of Y coordinates
 */
function area(x, y) {
  const numPoints = x.length;
  let a = 0;
  let j = numPoints - 1;
  for (let i = 0; i < numPoints; i++) {
    a += (x[j] + x[i]) * (y[j] - y[i]);
    j = i;
  }
  return a/2;
};

/**
 * Given an area, return the appropriate color.
 * These colors were determined heuristically.
 * @param {number} a - The area of the polygon
 */
function colorByArea(a) {
  if (a < 0.000001) {
    return 'blue';
  } else if (a < 0.000005) {
    return 'green';
  } else if (a < 0.00001) {
    return 'yellow';
  } else if (a < 0.00005) {
    return 'orange';
  } else if (a > 0.001) {
    return 'black';
  } else {
    return 'red';
  }
};

/**
 * Add a set of points to the map and return a format
 * ingestible by the voronoi library.
 * @param {L.Map} map - Leaflet Map
 * @param {Object[]} points - An array of points {X: , Y: }
 * @param {string} color - The color to use when drwaing the points
 */
function addPoints(map, points, color) {
  all = [];
  points.forEach(function(point) {
    all.push({X: point.X, Y: point.Y});
    const marker = L.circleMarker(L.latLng(point.Y, point.X), {
      radius: 1,
      color: color
    });
    marker.addTo(map);
  });
  return all;
};

/**
 * Draw the Vornoi diagram using d3
 * @param {L.Map} map - Leaflet Map
 * @param {Object[]} wirePoints - Wire basket points {X: , Y: }
 * @param {Object[]} bbPoints - Big Belly points {X: , Y: }
 * @param {boolean} borders - Whether or not to render polygon borders
 * @param {boolean} fill - Whether or not to fill polygons
 */
function draw(map, wirePoints, bbPoints, borders, fill) {
  // Combine Wire + Big Belly trash can points and draw on map
  const points = addPoints(map, wirePoints, 'blue')
    .concat(addPoints(map, bbPoints, 'green'));

  // Set the Voronoi bounds to the area around Philadelphia
  const voronoi = d3.geom.voronoi().clipExtent([[39.86,-75.3],[40.1,-75]])
    .x(function(d) { return d.Y; })
    .y(function(d) { return d.X; });

  // Compute the Voronoi polygons and draw them on the map
  voronoi(points).forEach(function(polygon) {
    const x = [], y = [];
    polygon.forEach(function(point) {
      x.push(point[0]);
      y.push(point[1]);
    });
    
    const weight = borders ? 3 : 0;
    const fillColor = fill ? colorByArea(area(x, y)) : 'transparent';
    const plygn = L.polygon(polygon, {
      stroke: borders,
      weight: weight,
      fillColor: fillColor, 
      fillOpacity: 0.4
    });
    plygn.addTo(map);
  });
};

/**
 * Read the CSV files and render the map + layers
 * @param {boolean} borders - Whether or not to render polygon borders
 * @param {boolean} fill - Whether or not to fill polygons
 */
function showMap(borders = false, fill = true) {
  // Create Leaflet Map
  const map = L.map('map');
  
  // Add Stamen Toner tiles
  L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
  }).addTo(map);
  
  // Center on Philly
  map.setView([39.952584, -75.165222], 14);
  
  // Parse CSV files fro OpenDataPhilly and draw the Voronoi Diagram
  d3.csv('http://files.tomfleischer.com.s3.amazonaws.com/trash_voronoi/WasteBaskets_Wire.csv', function(wireCsv) {
    d3.csv('http://files.tomfleischer.com.s3.amazonaws.com/trash_voronoi/WasteBaskets_Big_Belly.csv', function(bbCsv) {
      draw(map, wireCsv, bbCsv, borders, fill);
    });
  });
}
