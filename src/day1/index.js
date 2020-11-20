const fs = require('fs')
const readline = require('readline')

const fuelRequired = mass => {
  const fuel = Math.floor(mass / 3) - 2
  return fuel
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
    fuel.push(fuelPerMass)
    console.log(`Fuel for mass ${line}: ${fuelPerMass}`)
  }

  const totalFuel = fuel.reduce((acc, curr) => acc += curr, 0)
  console.log(`The total fuel is ${totalFuel}`)
}

runDay()