// const mouseG = g.append('g')
    // console.log('mouseG 1', mouseG)
    //   // .attr('class', 'mouse-over-effects');
    // mouseG.append('path')
    //   .attr("class", "mouse-line-y1")
    //   .style("stroke", "black")
    //   .style("stroke-width", "1px")
    //   .style("opacity", "0");

    // let lines = document.getElementsByClassName('incidence-path');

    // const mousePerLine = mouseG.selectAll('.mouse-per-line-y1')
    //   .data(data)
    //   .enter()
    //   .append("g")
    //   .attr("class", "mouse-per-line-y1");

    // mousePerLine.append('circle')
    //   .style("opacity", "0")
    //   .attr('class', 'moving-circle-y1')
    //   .attr("r", 7)
    //   .style("stroke", 'black') //d => {return color(d.name)})
    //   .style("fill", "none")
    //   .style("stroke-width", "1px")

    // mousePerLine.append("text")
    //   .style('opacity', '0')
    //   .attr('class', 'label moving-label-y1')
    //   .attr("transform", "translate(10,20)");

    // deleteNodes("moving-label-y1", "moving-circle-y1", "mouse-per-line-y1")
    //   .then(() => mouseG.append('rect') // append a rect to catch mouse movements on canvas
    //     .style("opacity", "0")
    //     .attr('width', innerWidth) // can't catch mouse events on a g element
    //     .attr('height', innerHeight)
    //     .attr('id', 'mouse-rect')
    //     // .attr('id', 'mouse-rect-y1')
    //     .attr('fill', 'none')
    //     .attr('pointer-events', 'all')
    //     .on('mouseout', () => { // on mouseout, hide line, circles and text
    //       select(".mouse-line-y1")
    //         .transition()
    //         .duration(1000)
    //         .style("opacity", "0");
    //       selectAll(".mouse-per-line-y1 .moving-circle-y1")
    //         .transition()
    //         .duration(1000)
    //         .style("opacity", "0");
    //       selectAll(".mouse-per-line-y1 .moving-label-y1")
    //         .transition()
    //         .duration(1000)
    //         .style("opacity", "0");
    //     })
    //     .on('mouseover', () => { // on mouseover, show line, circles and text
    //       deleteNodes("moving-label-y1", "moving-circle-y1", "mouse-per-line-y1");

    //       select(".mouse-line-y1")
    //         .style("opacity", "0")
    //         .transition()
    //         .duration(500)
    //         .style('opacity', '1');
    //       selectAll(".mouse-per-line-y1 .moving-circle-y1")
    //         .style("opacity", "0")
    //         .transition()
    //         .duration(500)
    //         .style('opacity', '1');
    //       selectAll(".mouse-per-line-y1 text")
    //         .style("opacity", "0")
    //         .transition()
    //         .duration(500)
    //         .style('opacity', '1');
    //     })
    //     .on('mousemove', () => { // mouse moving over graph
    //       deleteNodes("moving-label-y1", "moving-circle-y1", "mouse-per-line-y1");

    //       let container = document.getElementById('mouse-rect')
    //       // let container = document.getElementById('mouse-rect-y1')
    //       let mouseXY = mouse(container);

    //       select(".mouse-line-y1")
    //         .attr("d", () => {
    //           let d = "M" + mouseXY[0] + "," + innerHeight;
    //           d += " " + mouseXY[0] + "," + 0;
    //           return d;
    //         });

    //       selectAll(".mouse-per-line-y1")
    //         .attr("transform", function (d, i) {
    //           let beginning = 0;
    //           let end = (lines[i] ? lines[i].getTotalLength() : 0);
    //           let target = null;
    //           let pos;

    //           while (true) {
    //             target = Math.floor((beginning + end) / 2);
    //             pos = (lines[i] ? lines[i].getPointAtLength(target) : { x: 0, y: 0 });
    //             if ((target === end || target === beginning) && pos.x !== mouseXY[0]) {
    //               break;
    //             }
    //             if (pos.x > mouseXY[0]) end = target;
    //             else if (pos.x < mouseXY[0]) beginning = target;
    //             else break; //position found
    //           }

    //           select(this).select('.moving-label-y1')
    //             .text(y1Scale.invert(pos.y).toFixed(0)); // this appropriately sets label to read out y1 values

    //           return "translate(" + mouseXY[0] + "," + pos.y + ")";
    //         });
    //     })
    //   )

if (lines[i].getAttribute('class') === 'path graph-path coverage-path') {
  select(this).select('.moving-label')
    .text(y2Scale.invert(pos.y).toFixed(2));
}