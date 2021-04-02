const getXScale = (dataset, w, padding) => {
  const xScale = d3
    .scaleTime()
    .domain([
      new Date(
        d3.min(dataset, ({ Year }) => {
          return `${Year - 1}-01-01`
        })
      ),
      new Date(
        d3.max(dataset, ({ Year }) => {
          return `${Year + 1}-1-02`
        })
      ),
    ])
    .range([padding, w - padding])
  return xScale
}
const getYScale = (dataset, h, padding) => {
  const minTime = d3.min(dataset, ({ Seconds }) => {
    return new Date(Seconds * 1000)
  })
  const maxTime = d3.max(dataset, ({ Seconds }) => {
    return new Date(Seconds * 1000)
  })

  const yScale = d3
    .scaleTime()
    .domain([maxTime, minTime])
    .range([h - padding, padding])
  return yScale
}

const getAxes = (yScale, padding, xScale, h, svg) => {
  // X AXIS

  const xAxis = d3.axisBottom(xScale)
  svg
    .append('g')
    .attr('id', 'x-axis')
    .attr('transform', `translate(0, ${h - padding})`)
    .call(xAxis)

  // Y AXIS
  const timeFormat = d3.timeFormat('%M:%S')

  const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat)
  svg
    .append('g')
    .attr('id', 'y-axis')
    .attr('transform', `translate(${padding}, 0)`)
    .call(yAxis)
}

export { getAxes, getXScale, getYScale }
