import {
  select,
  csv,
  scaleLinear,
  scaleTime,
  extent,
  max,
  axisLeft,
  axisBottom,
  area,
  curveBasis
} from 'd3';

const titleText = 'Afghanistan Polio Incidence';

const svg = select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

const render = data => {
  const xValue = d => d.year;
  const xAxisLabelText = 'Year';
  const yValue = d => d.population;
  const yAxisLabelText = 'Polio Cases';
  const margin = { top: 50, right: 40, bottom: 77, left: 180 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const circleRadius = 4;

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
    .ticks(6)

  const yAxis = axisLeft(yScale)
    .tickSize(-innerWidth)
    .tickPadding(15)

  const yAxisG = g.append('g')
    .call(yAxis)

  yAxisG
    .selectAll('.domain')
    .remove();

  yAxisG.append('text')
    .attr('class', 'axis-label')
    .attr('y', -60)
    .attr('x', -innerHeight / 2)
    .attr('fill', 'black')
    .attr('transform', `rotate(270)`)
    .attr('text-anchor', 'middle')
    .text(yAxisLabelText);

  const xAxisG = g.append('g').call(xAxis)
    .attr('transform', `translate(0,${innerHeight})`);

  xAxisG.select('.domain').remove();

  xAxisG.append('text')
    .attr('class', 'axis-label')
    .attr('y', 65)
    .attr('x', innerWidth / 2)
    .attr('fill', 'black')
    .text(xAxisLabelText);

  const areaGenerator = area()
    .x(d => xScale(xValue(d)))
    .y0(innerHeight)
    .y1(d => yScale(yValue(d)))
    .curve(curveBasis)

  g.append('path')
    .attr('class', 'area-path')
    .attr('d', areaGenerator(data))

  g.append('text')
    .attr('class', 'title')
    .attr('y', -10)
    .text(titleText);
};

csv('../data/polio_incidence.csv')
  .then(data => {
    let columns = Object.keys(data[0]);

    const years = columns.map(colHeader => {
      if (+colHeader) return +colHeader
    }).filter(
      header => typeof header === "number"
    )

    console.log('years', years)
    console.log('data', data)
    console.log('data[0]', data[0])
    console.log('data.columns', data.columns)
    
    for (let i = 0; i < years.length; i++) {
      
    }
    
    data.forEach(d => {
      d.population = +d.population * 1000;
      d.year = new Date(d.year);
    });
    render(data);
  });