var line = d3.svg.line()
               .interpolate('basis');

var circles = d3.selectAll('.Oval').selectAll('circle'),
          circleCoords = [];

      circles.forEach( function(d) {
        console.log(circles);
        for ( i = 0; i < d.length; i++ ) {
          var cx = d3.select(d[i]).attr('cx'),
              cy = d3.select(d[i]).attr('cy');

          circleCoords.push([cx, cy]);
        }
      });

      lineGroup.append('path')
             .attr({
               'd' : line( circleCoords )
             });