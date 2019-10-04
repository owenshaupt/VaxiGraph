const mouseG = g.append('g')

mouseG.append('path') // sets up the lint itself
  .attr("class", "mouse-line")
  .style("stroke", "black")
  .style("stroke-width", "1px")
  .style("opacity", "0");

mouseG.append('rect') // append a rect to catch mouse movements on canvas
  .style("opacity", "0")
  .attr('width', innerWidth)
  .attr('height', innerHeight)
  .attr('id', 'mouse-rect')
  .attr('fill', 'none')
  .attr('pointer-events', 'all')
  .on('mouseout', () => { // on mouseout, hide line
      select(".mouse-line")
        .transition()
          .duration(1000)
          .style("opacity", "0");
  })
  .on('mouseover', () => { // on mouseover, show line
    deleteNodes("moving-label", 'moving-circle', "mouse-line");

    select(".mouse-line")
      .style("opacity", "0")
      .transition()
        .duration(500)
        .style('opacity', '1');
    
  })
  .on('mousemove', () => { // mouse moving over graph
    deleteNodes("moving-label", 'moving-circle', "mouse-per-line");

    let container = document.getElementById('mouse-rect')
    let mouseXY = mouse(container);

    select(".mouse-line")
      .attr("d", () => {
        let d = "M" + mouseXY[0] + "," + innerHeight;
        d += " " + mouseXY[0] + "," + 0;
        return d;
      });

    selectAll(".mouse-per-line")
      .attr("transform", function (d, i) {
        let beginning = 0;
        let end = (lines[i] ? lines[i].getTotalLength() : 0);
        let target = null;
        let pos;

        while (true) {
          target = Math.floor((beginning + end) / 2);
          pos = (lines[i] ? lines[i].getPointAtLength(target) : {x:0, y:0});
          if ((target === end || target === beginning) && pos.x !== mouseXY[0]) {
            break;
          }
          if (pos.x > mouseXY[0]) end = target;
          else if (pos.x < mouseXY[0]) beginning = target;
          else break; // position found
        }

        select(this).select('.moving-label')
          .text(y2Scale.invert(pos.y).toFixed(2));

        return "translate(" + mouseXY[0] + "," + pos.y + ")";
      });
    })