# Philly Waste Bins

Philadelphia has two types of municpal waste bins: traditional wire bins and 
Big Belly solar compactors. Thanks to [OpenDataPhilly](https://www.opendataphilly.org/),
the locations of these bins are publicly available.

The goal of this experiment is to show which areas of the cities are underserved by
municipal trash bins. To accomplish this, I have plotted a Voronoi Diagram using d3.
This diagram shows a polygon for each waste bin that represents everywhere where
that bin is the closest bin.

This experiment presupposes that the smaller the area
of the polygon, the "better served" that area is. More specifically, the smaller the
polygon, the less one would have to walk to get to the nearest trash bin. As such,
each polygon is shaded according to its area, with blue being the smallest and red
being the largest.

![map](http://phillywaste.tomfleischer.com/screenshot.png)

A live version of this map can be found [here](http://phillywaste.tomfleischer.com)
(also [with borders](http://phillywaste.tomfleischer.com/borders.html) and [with
unfilled polygons](http://phillywaste.tomfleischer.com/unfilled.html)).

## Problems
* Privately owned bins such as those on college campuses, are not included. (you'll
  notice the glaring "red" area in University City)

## Libraries Used:
* [Leaflet](http://leafletjs.com/)
* [D3.js](https://d3js.org/)

Also a special thanks to Chris Zetter for [this blog article](https://chriszetter.com/blog/2014/06/15/building-a-voronoi-map-with-d3-and-leaflet/).
