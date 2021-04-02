import fetchData from './fetchData.js'
import { getAxes, getXScale, getYScale } from './scales.js'

const container = document.querySelector('.vis-container')
const displayVis = async () => {
  const dataset = await fetchData()
  const h = container.getBoundingClientRect().height
  const w = container.getBoundingClientRect().width
  const padding = 50
  const xScale = getXScale(dataset, w, padding)
  const yScale = getYScale(dataset, h, padding)
  // console.log(yScale(new Date(2220 * 1000)))

  const svg = d3
    .select(container)
    .append('svg')
    .attr('height', h)
    .attr('width', w)
    .style('border', '0.3rem solid var(--myPrim)')
    .style('border-radius', '0.3rem')
  // GET AXIS
  getAxes(yScale, padding, xScale, h, svg)

  // TOOLTIP
  const tooltip = d3
    .select(container)
    .append('div')
    .attr('class', 'tooltip')
    .attr('id', 'tooltip')
    .text('this is a tooltip')

  svg
    .selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('data-xvalue', ({ Year }) => {
      return new Date(`${Year}-01-01`)
    })
    .attr('data-yvalue', ({ Seconds }) => {
      const value = new Date(Seconds * 1000)
      return value
    })
    .attr('data-place', ({ Place }) => {
      return Place
    })
    .attr('class', 'dot')
    .attr('r', '5')
    .style('fill', ({ Doping }) => {
      let color
      Doping ? (color = '#984447') : (color = '#77BA99')
      return color
    })
    .style('stroke', ({ Doping }) => {
      let color
      Doping ? (color = '#462021') : (color = '#376D52')
      return color
    })
    .attr('cx', ({ Year }) => {
      return xScale(new Date(`${Year}-01-01`))
    })
    .attr('cy', ({ Seconds }) => {
      const value = yScale(new Date(Seconds * 1000))
      return value
    })
    .on('mouseover', (e) => {
      const element = e.target.getBoundingClientRect()
      const tooltip = document.getElementById('tooltip')
      console.log(element)
      tooltip.style.left = `${element.x}px`
      tooltip.style.top = `${element.top}px`
      tooltip.classList.add('active')
      tooltip.dataset.year = e.target.dataset.xvalue
      const [{ Doping, Name, Nationality, Time, Year, URL }] = dataset.filter(
        (racer) => racer.Place === parseInt(e.target.dataset.place)
      )
      tooltip.innerHTML = `<h4>${Name}: ${Nationality}</h4><h4>Year: ${Year}, Time: ${Time}</h4><p>${Doping}</p>`
    })
    .on('mouseout', () => {
      const tooltip = document.getElementById('tooltip')
      tooltip.classList.remove('active')
    })
  const legend = d3
    .select(container)
    .append('g')
    .attr('class', 'legend')
    .attr('id', 'legend')
  legend.append('g').attr('id', 'legend-g').append('div').attr('id', 'color-1')

  legend.select('#legend-g').append('text').text('Doping Allegations')
  legend.append('g').attr('id', 'legend-h').append('div').attr('id', 'color-2')

  legend.select('#legend-h').append('text').text('No Doping Allegations')
}

export default displayVis
