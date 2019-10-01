const svg = d3.select('svg');

const width = +svg.attr('width'); // + parses this as a float
const height = +svg.attr('height'); // + parses this as a float

const render = data => {
  const xValue = d => d.population;
  const yValue = d => d.country;

  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => xValue)])
    .range([0, width]);

  const yScale = d3.scaleBand()
    .domain(data.map(d => yValue))
    .range([0, height]);

  svg.selectAll('rect').data(data)
    .enter().append('rect')
      .attr('y', d => yScale(yValue))
      .attr('width', d => xScale(xValue))
      .attr('height', yScale.bandwidth())
}

d3.csv('../data/data.csv')
  .then(data => {
    data.forEach(d => {
      d.population = +d.population * 1000;
    });
    render(data);
  })