// import {
//   select, selectAll, csv, scaleLinear, scaleTime, extent, min, max, axisLeft,
//   axisRight, axisBottom, line, curveMonotoneX, format, easeCubic, color, event, mouse,
//   point, bisector
// } from 'd3';

// import { receiveUserSelection, handleChange } from './index';

// export const loadData = countryIdx => {
//   let incidenceArr = [];
//   let coverageArr = [];

//   csv('../data/polio_incidence.csv')
//     .then(data => {
//       receiveUserSelection()
//       const columns = Object.keys(data[countryIdx]);
//       const countries = data.map(d => d.Cname);
//       const years = columns.map(colHeader => {
//         if (+colHeader) return +colHeader
//       }).filter(
//         header => typeof header === "number"
//       )

//       years.forEach(y => {
//         const obj = {};
//         obj.year = y;
//         obj.incidence = +data[countryIdx][y];
//         incidenceArr.push(obj)
//       });
//     });

//   csv('../data/polio_coverage_estimates.csv')
//     .then(data => {
//       const columns = Object.keys(data[countryIdx]);
//       const countries = data.map(d => d.Cname);
//       const years = columns.map(colHeader => {
//         if (+colHeader) return +colHeader
//       }).filter(
//         header => typeof header === "number"
//       )

//       years.forEach(y => {
//         const obj = {};
//         obj.year = y;
//         obj.coverage = +data[countryIdx][y];
//         coverageArr.push(obj)
//       })
//     })

//   return [incidenceArr, coverageArr]
// }