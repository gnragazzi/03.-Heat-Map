const url =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'

const fetchData = async () => {
  const response = await fetch(url)
  const data = await response.json()
  return data
}
fetchData()

export default fetchData
