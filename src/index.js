import { select,selectAll,csv,scaleLinear,scaleTime,extent,min,max,axisLeft,
  axisRight,axisBottom,line,curveMonotoneX,format,easeCubic,color,event,mouse,
  point,bisector} from 'd3';

import UIControls from './ui_controls';
import { COUNTRY_CODES_OBJ, COUNTRY_CODES_ARR } from './country_codes';

const receiveUserSelection = () => {
  document.getElementById('user-country-select')
    .addEventListener('change', handleChange);
}

let countryName;
let incidenceArr = [];
let coverageArr = [];
let countryIdx;
let titleText = 'Select a Country Below...';

const handleChange = e => {
  const countryCode = e.target.value;
  countryName = COUNTRY_CODES_OBJ[countryCode];
  countryIdx = COUNTRY_CODES_ARR.indexOf(countryCode)
  incidenceArr = [];
  coverageArr = [];
  loadData(countryIdx);
  d3.selectAll("svg > *").remove();
  titleText = `${ countryName } Polio Incidence`;
  render(incidenceArr);
  render(coverageArr);
}

const svg = select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

const render = data => {
  // xValue is a function which extracts "year" from data
  const xValue = d => d.year;
  const xAxisLabel = 'Year';

  // y1Value is a function which extracts "incidence" from data
  const y1Value = d => d.incidence;
  const y1AxisLabel = 'New Polio Cases';
  
  // y2Value is a function which extracts "coverage" from data
  const y2Value = d => d.coverage;
  const y2AxisLabel = 'Polio Vaccine Coverage';

  const margin = { top: 100, right: 200, bottom: 100, left: 200 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // sets the scale of x axis to be linear representation of time
  const xScale = scaleTime()
    .domain(extent(data, xValue))
    .range([0, innerWidth])
    // .nice() // extend the domain to nice round numbers

  const y1Scale = scaleLinear()
    .domain([0, max(data, y1Value)])
    .range([innerHeight, 0])
    .nice()

  const y2Scale = scaleLinear()
    .domain([0, 100])
    .range([innerHeight, 0])
    .nice()

  // create g element with origin at the graph body (inside the margins)
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // create a new bottom-oriented axis generator
  const xAxis = axisBottom(xScale)
    .tickSize(-innerHeight) // set the size of the ticks
    .tickPadding(15) // set the padding between ticks and labels
    .tickFormat(format("")) // set the tick format explicitly
    .ticks(9) // customize how ticks are generated and formatted

  const y1Axis = axisLeft(y1Scale)
    // .tickSize(-innerWidth) ticks are extended this far
    .tickPadding(15)

  const y2Axis = axisRight(y2Scale)
    .tickSize(innerWidth)
    .tickPadding(15)

  // creates a yAxis group where we append a g element
  const y1AxisG = g.append('g').call(y1Axis) // call .append on y1Axis
    .attr('class', 'testytesty')
  y1AxisG.selectAll('.domain').remove() // remove elements with class 'domain'

  // sets attributes on a new text element
  y1AxisG.append('text')
    .attr('class', 'axis-label incidence-text')
    .attr('y', -100)
    .attr('x', -innerHeight / 2)
    .attr('fill', 'black')
    .attr('transform', `rotate(270)`)
    .attr('text-anchor', 'middle')
    .text(y1AxisLabel);

  const y2AxisG = g.append('g').call(y2Axis);
  // y2AxisG.selectAll('.domain').remove();

  y2AxisG.append('text')
    .attr('class', 'axis-label coverage-text')
    .attr('y', -innerWidth - 80)
    .attr('x', innerHeight / 2)
    .attr('fill', 'black')
    .attr('transform', `rotate(90)`)
    .attr('text-anchor', 'middle')
    .text(y2AxisLabel);

  const xAxisG = g.append('g').call(xAxis)
    .attr('transform', `translate(0,${innerHeight})`);

  xAxisG.select('.domain').remove();

  xAxisG.append('text')
    .attr('class', 'axis-label')
    .attr('y', 65)
    .attr('x', innerWidth / 2)
    .attr('fill', 'black')
    .text(xAxisLabel);

  // debugger
  // g.selectAll('.incidence-dot').data((Object.values(data).every(d => d.incidence !== undefined) ? data : {}))
  //   .enter().append('circle')
  //     .attr('cy', d => y1Scale(y1Value(d)))
  //     .attr('cx', d => xScale(xValue(d)))
  //     // .attr('r', circleRadius)
  //     .attr('class', 'incidence-dot')


  // if (Object.values(data).every(d => d.coverage !== undefined)) {
  //   g.selectAll('.coverage-dot').data(data)
  //     .enter().append('circle')
  //       .attr('cy', d => y2Scale(y2Value(d)))
  //       .attr('cx', d => xScale(xValue(d)))
  //       // .attr('r', circleRadius)
  //       .attr('class', 'coverage-dot')
  // }

//--------------------------drawing line + effect-------------------------------//
  if (data.every(d => d.incidence !== undefined)) {
    const y1LineGenerator = line()
      .x(d => xScale(xValue(d))) // set x accessor
      .y(d => y1Scale(y1Value(d))) // set y accessor
      .curve(curveMonotoneX)

    const y1Path = g.append('path')
      .attr('class', 'path graph-path incidence-path')
      .attr('d', y1LineGenerator(data))

    const totalLengthY1 = y1Path.node().getTotalLength();
      
    y1Path
      .attr("stroke-dasharray", totalLengthY1 + " " + totalLengthY1)
      .attr("stroke-dashoffset", totalLengthY1)
      .transition()
        .duration(3000)
        .ease(easeCubic)
        .attr("stroke-dashoffset", 0);

    let unwantedY1Paths = document.getElementsByClassName('incidence-path');
    for (let i = 0; i < unwantedY1Paths.length; i++) {
      const ele = unwantedY1Paths[i];
      if (ele.getAttribute('d') === null) ele.remove()
    }
  }

  const y2LineGenerator = line()
    .x(d => xScale(xValue(d))) // set x accessor
    .y(d => y2Scale(y2Value(d))) // set y accessor
    .curve(curveMonotoneX)

  const y2Path = g.append('path')
    .attr('class', 'path graph-path coverage-path')
    .attr('d', y2LineGenerator(data))
  
  const totalLengthY2 = y2Path.node().getTotalLength();

  y2Path
    .attr("stroke-dasharray", totalLengthY2 + " " + totalLengthY2)
    .attr("stroke-dashoffset", totalLengthY2)
    .transition()
      .duration(3000)
      .ease(easeCubic)
      .attr("stroke-dashoffset", 0);

  let unwantedY2Paths = document.getElementsByClassName('coverage-path');
  for (let i = 0; i < unwantedY2Paths.length; i++) {
    const ele = unwantedY2Paths[i];
    if (ele.getAttribute('d') === null) ele.remove()
  }

//--------------------------mouseover line effect-----------------------------//
  const mouseG = g.append('g')
    .attr('class', 'mouse-over-effects');
  mouseG.append('path')
    .attr("class", "mouse-line")
    .style("stroke", "black")
    .style("stroke-width", "1px")
    .style("opacity", "0");

  let lines = document.getElementsByClassName('path');

  const mousePerLine = mouseG.selectAll('.mouse-per-line')
    .data(data)
    .enter()
    .append("g")
    .attr("class", "mouse-per-line");
  
  mousePerLine.append('circle')
    .style("opacity", "0")
    .attr('class', 'moving-circle')
    .attr("r", 7)
    .style("stroke", 'black') //d => {return color(d.name)})
    .style("fill", "none")
    .style("stroke-width", "1px")

  mousePerLine.append("text")
    .style('opacity', '0')
    .attr('class', 'moving-label')
    .attr("transform", "translate(10,20)");




  // console.log('mousePerLine', mousePerLine);
  // debugger

  const deleteNodes = () => {
    return new Promise(resolve => {
      let movingLabels = document.getElementsByClassName('moving-label');
      let movingCircles = document.getElementsByClassName('moving-circle');

      for (let i = 1; i < movingLabels.length; i++) {
        const node = movingLabels[i];
        node.remove();
      }

      for (let i = 1; i < movingCircles.length; i++) {
        const node = movingCircles[i];
        node.remove();
      }
      
      resolve();
    })
  }


  // do this shit THEN .append rect
    

    //   selectAll('.to-delete').remove();
    //   selectAll('.to-delete').remove();

  deleteNodes()
  .then(() => mouseG.append('rect') // append a rect to catch mouse movements on canvas
    .style("opacity", "0")
    .attr('width', innerWidth) // can't catch mouse events on a g element
    .attr('height', innerHeight)
    .attr('id', 'mouse-rect')
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .on('mouseout', () => { // on mouseout, hide line, circles and text
      select(".mouse-line")
        .transition()
          .duration(1000)
          .style("opacity", "0");
      selectAll(".mouse-per-line circle")
        .transition()
          .duration(1000)
          .style("opacity", "0");
      selectAll(".mouse-per-line text")
        .transition()
          .duration(1000)
          .style("opacity", "0");
    })
    .on('mouseover', () => { // on mouseover, show line, circles and text
      select(".mouse-line")
        .style("opacity", "0")
        .transition()
          .duration(500)
          .style('opacity', '1');
      selectAll(".mouse-per-line circle")
        .style("opacity", "0")
        .transition()
        .duration(500)
        .style('opacity', '1');
      selectAll(".mouse-per-line text")
        .style("opacity", "0")
        .transition()
        .duration(500)
        .style('opacity', '1');

      let movingLabels = document.getElementsByClassName('moving-label');

      for (let i = 1; i < movingLabels.length; i++) {
        const node = movingLabels[i];
        node.remove();
      }

      selectAll('.to-delete').remove();

      let movingCircles = document.getElementsByClassName('moving-circle');

      for (let i = 1; i < movingCircles.length; i++) {
        const node = movingCircles[i];
        node.remove();
      }

      selectAll('.to-delete').remove();

      
    })
    .on('mousemove', () => { // mouse moving over graph
      let movingLabels = document.getElementsByClassName('moving-label');

      for (let i = 1; i < movingLabels.length; i++) {
        const node = movingLabels[i];
        node.remove();
      }

      selectAll('.to-delete').remove();

      let movingCircles = document.getElementsByClassName('moving-circle');

      for (let i = 1; i < movingCircles.length; i++) {
        const node = movingCircles[i];
        node.remove();
      }

      selectAll('.to-delete').remove();

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
          let xYear = xScale.invert(mouseXY[0]),
            bisect = bisector(d => { return d.year; }).right;
          let idx = bisect(Object.values(d), xYear);

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
            else break; //position found
          }

          select(this).select('text')
            .text(y2Scale.invert(pos.y).toFixed(2));
          console.log(y2Scale)

          return "translate(" + mouseXY[0] + "," + pos.y + ")";
        });
      })
  )
  // draw title
  g.append('text')
    .attr('class', 'title')
    .attr('y', -10)
    .attr('x', innerWidth / 2)
    .attr('text-anchor', 'middle')
    .text(titleText);
};

const loadData = countryIdx => {
  csv('../data/polio_incidence.csv')
    .then(data => {
      receiveUserSelection()
      const columns = Object.keys(data[countryIdx]);
      const countries = data.map(d => d.Cname);
      const years = columns.map(colHeader => {
        if (+colHeader) return +colHeader
      }).filter(
        header => typeof header === "number"
      )

      years.forEach(y => {
        const obj = {};
        obj.year = y;
        obj.incidence = +data[countryIdx][y];
        incidenceArr.push(obj)
      });

      render(incidenceArr);
    });

  csv('../data/polio_coverage_estimates.csv')
    .then(data => {
      const columns = Object.keys(data[countryIdx]);
      const countries = data.map(d => d.Cname);
      const years = columns.map(colHeader => {
        if (+colHeader) return +colHeader
      }).filter(
        header => typeof header === "number"
      )

      years.forEach(y => {
        const obj = {};
        obj.year = y;
        obj.coverage = +data[countryIdx][y];
        coverageArr.push(obj)
      })

      render(coverageArr);
    })
}

csv('../data/polio_incidence.csv')
  .then(data => {
    receiveUserSelection()
    const columns = Object.keys(data[0]);
    const countries = data.map(d => d.Cname);
    const years = columns.map(colHeader => {
      if (+colHeader) return +colHeader
    }).filter(
      header => typeof header === "number"
    )

    years.forEach(y => {
      const obj = {};
      obj.year = y;
      obj.incidence = +data[0][y];
      incidenceArr.push(obj)
    });

    render([]);
  });

csv('../data/polio_coverage_estimates.csv')
  .then(data => {
    const columns = Object.keys(data[0]);
    const countries = data.map(d => d.Cname);
    const years = columns.map(colHeader => {
      if (+colHeader) return +colHeader
    }).filter(
      header => typeof header === "number"
    )

    years.forEach(y => {
      const obj = {};
      obj.year = y;
      obj.coverage = +data[0][y];
      coverageArr.push(obj)
    })

    render([]);
  })