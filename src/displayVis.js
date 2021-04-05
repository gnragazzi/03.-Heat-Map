import fetchData from './fetchData.js'
import { getAxes, getXScale, getYScale } from './scales.js'
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const container = document.querySelector('.vis-container')
const displayVis = async () => {
  const { baseTemperature, monthlyVariance } = await fetchData()
  const h = container.getBoundingClientRect().height
  const w = container.getBoundingClientRect().width
  const padding = 70
  const xScale = getXScale(monthlyVariance, w, padding)

  const yScale = getYScale(h, padding)

  const svg = d3
    .select(container)
    .append('svg')
    .attr('height', h)
    .attr('width', w)
    .style('border', '0.3rem solid var(--myPrim)')
    .style('border-radius', '0.3rem')
  // // GET AXIS
  getAxes(yScale, padding, xScale, h, svg, months)

  // TOOLTIP
  const tooltip = d3
    .select('body')
    .append('div')
    .attr('class', 'tooltip')
    .attr('id', 'tooltip')
    .text('this is a tooltip')

  svg
    .selectAll('rect')
    .data(monthlyVariance)
    .enter()
    .append('rect')
    .attr('class', 'cell')
    .attr('data-month', ({ month }) => {
      return month - 1
    })
    .attr('data-year', ({ year }) => {
      return year
    })
    .attr('data-temp', ({ variance }) => {
      return variance
    })
    .attr('x', ({ year }) => {
      return xScale(new Date(`${year}-01-01`))
    })
    .attr('y', ({ month }) => {
      return yScale(month - 1)
    })
    .attr('width', 5)
    .attr('height', (h - padding * 2) / 12)
    // .style('stroke', 'red')
    .on('mouseover', (e) => {
      e.target.style.stroke = '#7389ae'
      const element = e.target.getBoundingClientRect()
      const tooltip = document.getElementById('tooltip')
      tooltip.style.left = `${element.right + 5}px`
      tooltip.style.top = `${element.bottom}px`
      tooltip.classList.add('active')
      const year = e.target.dataset.year
      tooltip.dataset.year = year
      const month = e.target.dataset.month
      const tempVar = e.target.dataset.temp
      const baseTemp = baseTemperature
      tooltip.innerHTML = `<h4>${year} - ${months[month]}</h4><p>${parseFloat(
        baseTemp + parseFloat(tempVar)
      ).toFixed(2)}°C</p><p>${tempVar > 0 ? '+' : ''}${parseFloat(
        tempVar
      ).toFixed(2)}°C</p>`
    })
    .on('mouseout', (e) => {
      e.target.style.stroke = ''
      const tooltip = document.getElementById('tooltip')
      tooltip.classList.remove('active')
    })
    .attr('fill', ({ variance }) => {
      const temp = parseFloat(baseTemperature + parseFloat(variance))
      if (temp < 4) {
        return '#4549C4'
      } else if (temp < 5.5) {
        return '#43ADEF'
      } else if (temp < 7) {
        return '#D6EFFF'
      } else if (temp < 8.5) {
        return '#FBBA72'
      } else if (temp < 10) {
        return '#FFA047'
      } else if (temp < 11.5) {
        return '#E23912'
      } else {
        return 'red'
      }
    })
  // const legend = d3
  //   .select(container)
  //   .append('g')
  //   .attr('class', 'legend')
  //   .attr('id', 'legend')
  const legendDomain = [4, 5.5, 7, 8.8, 10, 11.5]
  const legend = d3
    .select(container)
    .append('svg')
    .attr('id', 'legend')
    .attr('height', 50)
    .attr('width', 250)

  const legendScale = d3.scaleBand().domain(legendDomain).range([0, 250])
  const legendAxis = d3.axisBottom(legendScale).tickFormat((d) => `${d}°C`)
  legend
    .append('g')
    // .attr('id', '')
    .attr('transform', `translate(0, 30)`)
    .call(legendAxis)

  legend
    .selectAll('rect')
    .data(legendDomain)
    .enter()
    .append('rect')
    .attr('height', 30)
    .attr('width', 250 / legendDomain.length)
    .attr('x', (d) => legendScale(d))
    .attr('fill', (d) => {
      if (d === 4) {
        return '#4549C4'
      } else if (d === 5.5) {
        return '#43ADEF'
      } else if (d === 7) {
        return '#D6EFFF'
      } else if (d === 8.5) {
        return '#FBBA72'
      } else if (d === 10) {
        return '#FFA047'
      } else if (d === 11.5) {
        return '#E23912'
      } else {
        return 'red'
      }
    })
}
export default displayVis
