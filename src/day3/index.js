const fs = require('fs')
const path = require('path')
const readline = require('readline')
const filePath = path.join(__dirname, 'input.txt')

const getInstruction = input => ({
  direction: input.substring(0, 1),
  distance: parseInt(input.substring(1, input.length))
})

const getCSVArray = async path => {
  const wireInstructions = []
  try {
    const fileStream = fs.createReadStream(path)
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    })
    for await (const line of rl) {
      wireInstructions.push(line.trim().split(',').map(getInstruction))
    }
    return wireInstructions
  } catch( e) {
    console.error('Error reading file..', e);
  }
}

const travelUp = ({ x, y }) => ({ x, y: y + 1 })
const travelDown = ({ x, y }) => ({ x, y: y - 1})
const travelRight = ({ x, y }) => ({ x: x + 1, y })
const travelLeft = ({ x, y }) => ({ x: x - 1, y })

const travel = direction => {
  switch(direction) {
    case 'R':
      return travelRight
    case 'L':
      return travelLeft
    case 'U':
      return travelUp
    case 'D':
      return travelDown
  }
}

const trackCoordinates = (begin, direction, distance) => {
  const coordinates = []
  let position = begin
  for (let distanceTraveled = 0; distanceTraveled < distance; distanceTraveled++) {
    const prevDistance = coordinates.length ? coordinates[coordinates.length - 1].distanceTraveled : begin.distanceTraveled
    position = travel(direction)(position)
    coordinates.push({
      ...position,
      distanceTraveled: prevDistance + 1
    })
  }
  return coordinates
}

const getWire = changes =>
  changes.reduce((acc, { direction, distance }) => {
    acc = acc.concat(trackCoordinates(acc[acc.length - 1], direction, distance))
    return acc
  }, [{ x: 0, y: 0, distanceTraveled: 0 }])

const samePoint = ({ x, y}, { x: x2, y: y2}) => x === x2 && y === y2

const findIntersections = (wire1, wire2) =>
  wire1
  .filter(point =>
    wire2.some(point2 =>
      samePoint(point, point2)
    )
  )
  .map(point => ({
    ...point,
    distanceTraveledByBoth: point.distanceTraveled + wire2.find(point2 => samePoint(point, point2)).distanceTraveled
  }))

const getMahattanDistance = ({ x, y }) => Math.abs(x) + Math.abs(y)


const getLowestManhattan = intersections =>
  intersections.reduce((acc, curr) => {
    const makeCurrent = point => ({
      point,
      manhattanDistance: getMahattanDistance(point)
    })
    if (acc) {
      return acc.manhattanDistance > getMahattanDistance(curr)
      ? makeCurrent(curr)
      : acc
    }
    return makeCurrent(curr)
  }, null)

const getLowestCombinedSteps = intersections =>
intersections.reduce((acc, curr) => {
  const makeCurrent = point => ({
    ...point,
    distanceTraveledByBoth: point.distanceTraveledByBoth
  })
  if (acc) {
    return acc.distanceTraveledByBoth > curr.distanceTraveledByBoth
    ? makeCurrent(curr)
    : acc
  }
  return makeCurrent(curr)
}, null)

const runDay = async () => {
  const instructions = await getCSVArray(filePath)
  const wires = instructions.map(getWire)
  const intersections = findIntersections(wires[0].slice(1), wires[1].slice(1))
  console.log(`Intersections = ${intersections.length}`)
  const lowestSteps = getLowestCombinedSteps(intersections)
  console.log(JSON.stringify(lowestSteps))
}

runDay()