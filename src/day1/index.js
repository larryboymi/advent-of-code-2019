const fs = require('fs')
const readline = require('readline')

const fuelRequired = (newMass) => Math.floor(newMass / 3) - 2

const totalFuelRequired = initialMass => {
  let newMass = initialMass, prevMass = 0

  do {
    newMass = fuelRequired(newMass)
    if (newMass > 0) {
      prevMass = prevMass + newMass
    }
  } while (newMass > 0)
  return prevMass
}


const runDay = async () => {
  const fuel = []
  const fileStream = fs.createReadStream('input.txt')

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })

  for await (const line of rl) {
    const fuelPerMass = fuelRequired(line)
    const totalFuelForMass = totalFuelRequired(line)
    fuel.push(totalFuelForMass)
    console.log(`Initial fuel for mass ${line} is ${fuelPerMass}, total is ${totalFuelForMass}`)
  }

  const totalFuel = fuel.reduce((acc, curr) => acc += curr, 0)
  console.log(`The total fuel is ${totalFuel}`)
}

runDay()