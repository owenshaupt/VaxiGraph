import {
  select,
  selectAll,
  csv,
  scaleLinear,
  scaleTime,
  extent,
  min,
  max,
  axisLeft,
  axisRight,
  axisBottom,
  line,
  curveMonotoneX,
  format,
  easeCubic,
  color,
  event,
  mouse,
  point,
  bisector
} from "d3";

import { COUNTRY_CODES_OBJ, COUNTRY_CODES_ARR } from "./country_codes";
import { deleteNodes } from "./delete_nodes";

let countryName;
let incidenceArr = [];
let coverageArr = [];
let countryIdx;
let titleText = "Select a Country Below...";
let transitioned = false;

const handleChange = e => {
  if (!transitioned) {
    document
      .querySelector(".user-country-selector")
      .classList.remove("initial");
    document.querySelector(".legend-labels").classList.remove("hidden");
    transitioned = true;
  }

  const countryCode = e.target.value;
  e.target.blur();
  countryName = COUNTRY_CODES_OBJ[countryCode];
  countryIdx = COUNTRY_CODES_ARR.indexOf(countryCode);
  incidenceArr = [];
  coverageArr = [];

  selectAll("g > *").remove();

  render(countryIdx); // line 31 in console (console + 17 = code)

  titleText = `${countryName} Polio Incidence`;
};

document
  .getElementById("user-country-select")
  .addEventListener("change", handleChange);

const svg = select("svg");

const width = +svg.attr("width");
const height = +svg.attr("height");

async function render(countryIdx) {
  let data;

  if (typeof countryIdx === "number" && countryIdx >= 0) {
    data = await loadData(countryIdx);
  }

  // xValue is a function which extracts "year" from data
  const xValue = d => d.year;
  const xAxisLabel = "Year";

  // y1Value is a function which extracts "incidence" from data
  const y1Value = d => d.incidence;
  const y1AxisLabel = "New Polio Cases";

  // y2Value is a function which extracts "coverage" from data
  const y2Value = d => d.coverage;
  const y2AxisLabel = "Polio Vaccine Coverage";

  const margin = { top: 60, right: 200, bottom: 100, left: 200 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // sets the scale of x axis to be linear representation of time
  const xScale = scaleTime()
    .domain(extent(data, xValue))
    .range([0, innerWidth]);

  const y1Scale = scaleLinear()
    .domain([0, max(data, y1Value)])
    .range([innerHeight, 0])
    .nice(); // extend the domain to nice round numbers

  const y2Scale = scaleLinear()
    .domain([0, 100])
    .range([innerHeight, 0])
    .nice();

  svg
    .append("image")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .attr("width", innerWidth)
    .attr("height", innerHeight)
    .attr("xlink:href", "background.png");

  // create g element with origin at the graph body (inside the margins)
  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // create a new bottom-oriented axis generator
  const xAxis = axisBottom(xScale)
    .tickSize(-innerHeight) // set the size of the ticks (a tick is a line that goes across the graph)
    .tickPadding(15) // set the padding between ticks and labels
    .tickFormat(format("")) // set the tick format explicitly
    .ticks(9); // customize how ticks are generated and formatted

  const y1Axis = axisLeft(y1Scale)
    // .tickSize(-innerWidth) ticks are extended this far
    .tickPadding(15);

  const y2Axis = axisRight(y2Scale)
    .tickSize(innerWidth)
    .tickPadding(15);

  // creates a yAxis group where we append a g element
  const y1AxisG = g.append("g").call(y1Axis); // call .append on y1Axis
  y1AxisG.selectAll(".domain").remove(); // remove elements with class 'domain'

  // sets attributes on a new text element
  y1AxisG
    .append("text")
    .attr("class", "axis-label incidence-text")
    .attr("y", -90)
    .attr("x", -innerHeight / 2)
    .attr("fill", "black")
    .attr("transform", `rotate(270)`)
    .attr("text-anchor", "middle")
    .text(y1AxisLabel);

  const y2AxisG = g.append("g").call(y2Axis);
  // y2AxisG.selectAll('.domain').remove();

  y2AxisG
    .append("text")
    .attr("class", "axis-label coverage-text")
    .attr("y", -innerWidth - 70)
    .attr("x", innerHeight / 2)
    .attr("fill", "black")
    .attr("transform", `rotate(90)`)
    .attr("text-anchor", "middle")
    .text(y2AxisLabel);

  const xAxisG = g
    .append("g")
    .call(xAxis)
    .attr("transform", `translate(0,${innerHeight})`);

  xAxisG.select(".domain").remove();

  xAxisG
    .append("text")
    .attr("class", "axis-label")
    .attr("y", 54)
    .attr("x", innerWidth / 2)
    .attr("fill", "black")
    .text(xAxisLabel);

  // don't need these unless we want to show circles
  //
  // g.selectAll('.incidence-dot').data((Object.values(data).every(d => d.incidence !== undefined) ? data : {}))
  //   .enter().append('circle')
  //     .attr('cy', d => y1Scale(y1Value(d)))
  //     .attr('cx', d => xScale(xValue(d)))
  //     // .attr('r', circleRadius)
  //     .attr('class', 'incidence-dot')
  //
  // if (Object.values(data).every(d => d.coverage !== undefined)) {
  //   g.selectAll('.coverage-dot').data(data)
  //     .enter().append('circle')
  //       .attr('cy', d => y2Scale(y2Value(d)))
  //       .attr('cx', d => xScale(xValue(d)))
  //       // .attr('r', circleRadius)
  //       .attr('class', 'coverage-dot')
  // }

  //--------------------------drawing line + effect-----------------------------//
  if (data.every(d => d.incidence !== undefined)) {
    const y1LineGenerator = line()
      .x(d => xScale(xValue(d))) // set x accessor
      .y(d => y1Scale(y1Value(d))) // set y accessor
      .curve(curveMonotoneX);

    const y1Path = g
      .append("path")
      .attr("class", "path graph-path incidence-path")
      .attr("d", y1LineGenerator(data));

    const totalLengthY1 = y1Path.node().getTotalLength();

    y1Path
      .attr("stroke-dasharray", totalLengthY1 + " " + totalLengthY1)
      .attr("stroke-dashoffset", totalLengthY1)
      .transition()
      .duration(3000)
      .ease(easeCubic)
      .attr("stroke-dashoffset", 0);

    let y1Paths = document.getElementsByClassName("incidence-path");
    for (let i = 0; i < y1Paths.length; i++) {
      const ele = y1Paths[i];
      if (ele.getAttribute("d") === null) ele.remove();
    }

    //--------------------------mouseover line effect-----------------------------//
  }

  //-------------------y1-ABOVE-------------------y2-BELOW----------------------//-------------------------------------------------------------------------------------------

  if (data.every(d => d.coverage !== undefined)) {
    const y2LineGenerator = line()
      .x(d => xScale(xValue(d))) // set x accessor
      .y(d => y2Scale(y2Value(d))) // set y accessor
      .curve(curveMonotoneX);

    const y2Path = g
      .append("path")
      .attr("class", "path graph-path coverage-path")
      .attr("d", y2LineGenerator(data));

    const totalLengthY2 = y2Path.node().getTotalLength();

    y2Path
      .attr("stroke-dasharray", totalLengthY2 + " " + totalLengthY2)
      .attr("stroke-dashoffset", totalLengthY2)
      .transition()
      .duration(3000)
      .ease(easeCubic)
      .attr("stroke-dashoffset", 0);

    let y2Paths = document.getElementsByClassName("coverage-path");
    for (let i = 0; i < y2Paths.length; i++) {
      const ele = y2Paths[i];
      if (ele.getAttribute("d") === null) ele.remove();
    }

    //--------------------------mouseover line effect-----------------------------//

    const mouseG = g.append("g");

    mouseG
      .append("path")
      .attr("class", "mouse-line")
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .style("opacity", "0");

    let lines = document.getElementsByClassName("path");

    const mousePerLine = mouseG
      .selectAll(".mouse-per-line")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "mouse-per-line");

    mousePerLine
      .append("circle")
      .style("opacity", "0")
      .attr("class", "moving-circle")
      .attr("r", 7)
      .style("stroke", "black")
      .style("fill", "none")
      .style("stroke-width", "1px");

    mousePerLine
      .append("text")
      .style("opacity", "0")
      .attr("class", "label moving-label")
      .attr("transform", "translate(10,20)");

    mouseG
      .append("rect")
      .style("opacity", "0")
      .attr("width", innerWidth)
      .attr("height", innerHeight)
      .attr("id", "mouse-rect")
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("mouseout", () => {
        select(".mouse-line")
          .transition()
          .duration(1000)
          .style("opacity", "0");
        selectAll(".moving-circle")
          .transition()
          .duration(1000)
          .style("opacity", "0");
        selectAll(".moving-label")
          .transition()
          .duration(1000)
          .style("opacity", "0");
      })
      .on("mouseover", () => {
        deleteNodes("moving-label", "moving-circle", "mouse-per-line");

        select(".mouse-line")
          .style("opacity", "0")
          .transition()
          .duration(500)
          .style("opacity", "1");
        selectAll(".moving-circle")
          .style("opacity", "0")
          .transition()
          .duration(500)
          .style("opacity", "1");
        selectAll(".mouse-per-line text")
          .style("opacity", "0")
          .transition()
          .duration(500)
          .style("opacity", "1");
      })
      .on("mousemove", () => {
        deleteNodes("moving-label", "moving-circle", "mouse-per-line");

        let container = document.getElementById("mouse-rect");
        let mouseXY = mouse(container);

        select(".mouse-line").attr("d", () => {
          let d = "M" + mouseXY[0] + "," + innerHeight;
          d += " " + mouseXY[0] + "," + 0;
          return d;
        });

        selectAll(".mouse-per-line").attr("transform", function(d, i) {
          let beginning = 0;
          let end = lines[i] ? lines[i].getTotalLength() : 0;
          let target = null;
          let pos;

          while (true) {
            target = Math.floor((beginning + end) / 2);
            pos = lines[i] ? lines[i].getPointAtLength(target) : { x: 0, y: 0 };
            if (
              (target === end || target === beginning) &&
              pos.x !== mouseXY[0]
            ) {
              break;
            }
            if (pos.x > mouseXY[0]) end = target;
            else if (pos.x < mouseXY[0]) beginning = target;
            else break; // position found

            if (
              lines[i].getAttribute("class") === "path graph-path coverage-path"
            ) {
              select(this)
                .select(".moving-label")
                .text(`${y2Scale.invert(pos.y).toFixed(2)}%`);
            }

            if (
              lines[i].getAttribute("class") ===
              "path graph-path incidence-path"
            ) {
              select(this)
                .select(".moving-label")
                .text(y1Scale.invert(pos.y).toFixed(0));
            }
          }

          return "translate(" + mouseXY[0] + "," + pos.y + ")";
        });
      });
  }

  // draw title
  g.append("text")
    .attr("class", "title")
    .attr("y", -20)
    .attr("x", innerWidth / 2)
    .attr("text-anchor", "middle")
    .text(titleText);
}

async function loadData(countryIdx) {
  const indicenceDataArr = await loadIncidence(countryIdx);
  const coverageDataArr = await loadCoverage(countryIdx, indicenceDataArr);
  return coverageDataArr;
}

function loadIncidence(countryIdx) {
  return new Promise(resolve => {
    csv("./data/polio_incidence.csv").then(data => {
      const dataArr = [];

      const columns = Object.keys(data[countryIdx]);
      const years = columns
        .map(colHeader => {
          if (+colHeader) return +colHeader;
        })
        .filter(header => typeof header === "number");

      years.forEach(y => {
        const obj = {};
        obj.year = y;
        obj.incidence = +data[countryIdx][y];
        dataArr.push(obj);
      });

      resolve(dataArr);
    });
  });
}

function loadCoverage(countryIdx, dataArr) {
  return new Promise(resolve => {
    csv("./data/polio_coverage_estimates.csv").then(data => {
      dataArr.forEach(obj => {
        obj.coverage = +data[countryIdx][obj.year];
      });

      resolve(dataArr);
    });
  });
}

// Loads the first time only

csv("./data/polio_incidence.csv").then(data => {
  const columns = Object.keys(data[0]);
  const years = columns
    .map(colHeader => {
      if (+colHeader) return +colHeader;
    })
    .filter(header => typeof header === "number");

  years.forEach(y => {
    const obj = {};
    obj.year = y;
    obj.incidence = +data[0][y];
    incidenceArr.push(obj);
  });

  render([]);
});

csv("./data/polio_coverage_estimates.csv").then(data => {
  // receiveUserSelection();
  const columns = Object.keys(data[0]);
  const years = columns
    .map(colHeader => {
      if (+colHeader) return +colHeader;
    })
    .filter(header => typeof header === "number");

  years.forEach(y => {
    const obj = {};
    obj.year = y;
    obj.coverage = +data[0][y];
    coverageArr.push(obj);
  });

  render([]);
});
