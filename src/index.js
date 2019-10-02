import {
  select,
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
  curveBasis,
  curveLinear,
  curveMonotoneX,
  curveNatural,
  format
} from 'd3';

import UIControls from './ui_controls';
import { COUNTRY_CODES_OBJ, COUNTRY_CODES_ARR } from './country_codes'; // to pull name for titleText


const receiveUserSelection = () => {
  document.getElementById('user-country-select')
  .addEventListener('change', handleChange);
}

let countryName;
let incidenceArr = [];
let coverageArr = [];
let countryIdx;
let titleText = 'bleh';

const handleChange = e => {
  const countryCode = e.target.value;
  countryName = COUNTRY_CODES_OBJ[countryCode];
  console.log('countryCode', countryCode);
  countryIdx = COUNTRY_CODES_ARR.indexOf(countryCode)
  console.log('countryIdx', countryIdx);
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
  const xValue = d => d.year;
  const xAxisLabel = 'Year';

  const y1Value = d => d.incidence;
  const circleRadius = 4;
  const y1AxisLabel = 'New Polio Cases';
  
  const y2Value = d => d.coverage;
  // const circleRadius = 4;
  const y2AxisLabel = 'Polio Vaccine Coverage';

  const margin = { top: 100, right: 200, bottom: 100, left: 200 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = scaleTime()
    .domain(extent(data, xValue))
    .range([0, innerWidth])
    .nice()

  const y1Scale = scaleLinear()
    .domain([0, max(data, y1Value)])
    .range([innerHeight, 0])
    .nice()

  const y2Scale = scaleLinear()
    .domain([0, 100])
    .range([innerHeight, 0])
    .nice()

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const xAxis = axisBottom(xScale)
    .tickSize(-innerHeight)
    .tickPadding(15)
    .tickFormat(format(""))
    .ticks(6)

  const y1Axis = axisLeft(y1Scale)
    .tickSize(-innerWidth)
    .tickPadding(15)

  const y2Axis = axisRight(y2Scale)
    .tickSize(innerWidth)
    .tickPadding(15)

  const y1AxisG = g.append('g').call(y1Axis);
  y1AxisG.selectAll('.domain').remove()

  y1AxisG.append('text')
    .attr('class', 'axis-label')
    .attr('y', -100)
    .attr('x', -innerHeight / 2)
    .attr('fill', 'black')
    .attr('transform', `rotate(270)`)
    .attr('text-anchor', 'middle')
    .text(y1AxisLabel);

  const y2AxisG = g.append('g').call(y2Axis);
  y2AxisG.selectAll('.domain').remove();

  y2AxisG.append('text')
    .attr('class', 'axis-label')
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

  g.selectAll('.incidence-dot').data((data.every(d => d.incidence !== undefined) ? data : {}))
    .enter().append('circle')
      .attr('cy', d => y1Scale(y1Value(d)))
      .attr('cx', d => xScale(xValue(d)))
      .attr('r', circleRadius)
      .attr('class', 'incidence-dot')

  g.selectAll('.coverage-dot').data((data.every(d => d.coverage !== undefined) ? data : {}))
    .enter().append('circle')
      .attr('cy', d => y2Scale(y2Value(d)))
      .attr('cx', d => xScale(xValue(d)))
      .attr('r', circleRadius)
      .attr('class', 'coverage-dot')

  const y1LineGenerator = line()
    .x(d => xScale(xValue(d)))
    .y(d => y1Scale(y1Value(d)))
    .curve(curveMonotoneX)

  g.append('path')
    .attr('class', 'incidence-path')
    .attr('d', y1LineGenerator(data))

  const y2LineGenerator = line()
    .x(d => xScale(xValue(d)))
    .y(d => y2Scale(y2Value(d)))
    .curve(curveMonotoneX)

  g.append('path')
    .attr('class', 'coverage-path')
    .attr('d', y2LineGenerator(data))

  g.append('text')
    .attr('class', 'title')
    .attr('y', -10)
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

      // console.log('countries', countries)
      // console.log('years', years)
      // console.log('data', data)
      // console.log('data[0]', data[0])
      // console.log('data.columns', data.columns)

      // const incidenceArr = [];

      years.forEach(y => {
        const obj = {};
        // obj.country = countries[0];
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

      // console.log('countries', countries)
      // console.log('years', years)
      // console.log('coverage data', data)
      // console.log('data[0]', data[0])
      // console.log('data.columns', data.columns)

      // const coverageArr = [];

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

    // console.log('countries', countries)
    // console.log('years', years)
    // console.log('data', data)
    // console.log('data[0]', data[0])
    // console.log('data.columns', data.columns)
    
    // const incidenceArr = [];

    years.forEach(y => {
      const obj = {};
      // obj.country = countries[0];
      obj.year = y;
      obj.incidence = +data[0][y];
      incidenceArr.push(obj)
    });

    render(incidenceArr);
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

    // console.log('countries', countries)
    // console.log('years', years)
    // console.log('coverage data', data)
    // console.log('data[0]', data[0])
    // console.log('data.columns', data.columns)

    // const coverageArr = [];

    years.forEach(y => {
      const obj = {};
      obj.year = y;
      obj.coverage = +data[0][y];
      coverageArr.push(obj)
    })

    render(coverageArr);
  })