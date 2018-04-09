var area = function(x, y) {
  var numPoints = x.length;
  var a = 0;
  var j = numPoints - 1;
  for (var i = 0; i < numPoints; i++) {
    a += (x[j] + x[i]) * (y[j] - y[i]);
    j = i;
  }
  return a/2;
};

var colorByArea = function(a) {
  if (a < 0.000001) {
    return '#175701';
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

var addPoints = function(map, points, color) {
  all = [];
  points.forEach(function(point) {
    all.push({X: point.X, Y: point.Y});
    var marker = L.circleMarker(L.latLng(point.Y, point.X), {
      radius: 1,
      color: color
    });
    marker.addTo(map);
  });
  return all;
};

var draw = function(map, wirePoints, bbPoints) {
  points = addPoints(map, wirePoints, 'blue')
    .concat(addPoints(map, bbPoints, 'green'));

  var voronoi = d3.geom.voronoi().clipExtent([[39.86,-75.3],[40.1,-75]])
    .x(function(d) { return d.Y; })
    .y(function(d) { return d.X; });

  voronoi(points).forEach(function(polygon) {
    var x = [];
    var y = [];
    polygon.forEach(function(point) {
      x.push(point[0]);
      y.push(point[1]);
    });
    var plygn = L.polygon(polygon, {
      stroke: false,
      weight: 0,
      fillColor: colorByArea(area(x, y)),
      fillOpacity: 0.4
    })
    plygn.addTo(map);
  });
};

var map = L.map('map');
L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);

map.setView([39.952584, -75.165222], 13);
d3.csv('http://files.tomfleischer.com.s3.amazonaws.com/trash_voronoi/WasteBaskets_Wire.csv', function(wireCsv) {
  d3.csv('http://files.tomfleischer.com.s3.amazonaws.com/trash_voronoi/WasteBaskets_Big_Belly.csv', function(bbCsv) {
    draw(map, wireCsv, bbCsv);
  });
});
