import {
  select,
  csv,
  scaleLinear,
  scaleTime,
  extent,
  min,
  max,
  axisLeft,
  axisBottom,
  line,
  curveBasis,
  curveLinear,
  curveMonotoneX,
  curveNatural
} from 'd3';

const titleText = 'Afghanistan Polio Incidence';

const svg = select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

const render = (data) => {
  console.log('data', data)

  const xValue = d => d.year;
  const xAxisLabel = 'Year';

  const yValue = d => d.incidence;
  const circleRadius = 4;
  const yAxisLabel = 'Polio Cases';

  const margin = { top: 50, right: 40, bottom: 77, left: 100 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  // console.log('innerWidth', innerWidth)
  // console.log('innerHeight', innerHeight)

  const xScale = scaleTime()
    .domain(extent(data, xValue))
    .range([0, innerWidth])
    .nice()

  const yScale = scaleLinear()
    .domain([0, max(data, yValue)])
    .range([innerHeight, 0])
    .nice()

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const xAxis = axisBottom(xScale)
    .tickSize(-innerHeight)
    .tickPadding(15)
    // .ticks(6)

  const yAxis = axisLeft(yScale)
    .tickSize(-innerWidth)
    .tickPadding(15)

  const yAxisG = g.append('g').call(yAxis);
  yAxisG.selectAll('.domain').remove();

  yAxisG.append('text')
    .attr('class', 'axis-label')
    .attr('y', -60)
    .attr('x', -innerHeight / 2)
    .attr('fill', 'black')
    .attr('transform', `rotate(270)`)
    .attr('text-anchor', 'middle')
    .text(yAxisLabel);

  const xAxisG = g.append('g').call(xAxis)
    .attr('transform', `translate(0,${innerHeight})`);

  xAxisG.select('.domain').remove();

  xAxisG.append('text')
    .attr('class', 'axis-label')
    .attr('y', 65)
    .attr('x', innerWidth / 2)
    .attr('fill', 'black')
    .text(xAxisLabel);

  // g.selectAll('circle').data(data)
  //   .enter().append('circle')
  //     .attr('cy', d => yScale(yValue(d)))
  //     .attr('cx', d => xScale(xValue(d)))
  //     .attr('r', circleRadius)

  const lineGenerator = line()
    .x(d => xScale(xValue(d)))
    .y(d => yScale(yValue(d)))
    .curve(curveMonotoneX)//(curveBasis)

  g.append('path')
    .attr('class', 'line-path')
    .attr('d', lineGenerator(data))

  g.append('text')
    .attr('class', 'title')
    .attr('y', -10)
    .text(titleText);
};

csv('../data/polio_incidence.csv')
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
    // console.log('data', data)
    // console.log('data[0]', data[0])
    // console.log('data.columns', data.columns)
    
    const incidenceArr = []

    years.forEach(y => {
      const obj = {}
      // obj.country = countries[0];
      obj.year = y;
      obj.incidence = +data[0][y];
      incidenceArr.push(obj)
    });

    render(incidenceArr);
  });