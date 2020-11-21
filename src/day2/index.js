const fs = require('fs')
const path = require('path')
const filePath = path.join(__dirname, 'input.txt')
const leftLocation = 1
const rightLocation = 2
const storageLocation = 3

const getCSVArray = path => {
  try {
    return (fs.readFileSync(path, 'utf8')).trim().split(',').map(Number)
  } catch( e) {
    console.error('Error reading file..', e);
  }
}

const add = (left, right) => left + right
const multiply = (left, right) => left * right
const end = false

const getOperation = opCode => {
  switch(opCode) {
    case 1:
      return add
    case 2:
      return multiply
    case 99:
    default:
      return end
  }
}

const apply = intArray => {
  let operate = true
  let location = 0
  while (operate) {
    const operation = getOperation(intArray[location])
    if (operation) {
      const storeLoc = intArray[location + storageLocation]
      const leftLoc = intArray[location + leftLocation]
      const rightLoc = intArray[location + rightLocation]
      console.log(`Operation is ${operation}, left operand is ${intArray[leftLoc]}, right operand is ${intArray[rightLoc]}, and will replace ${intArray[storeLoc]} in location ${storeLoc}`)
      intArray[storeLoc] = operation(intArray[leftLoc], intArray[rightLoc])
    } else {
      operate = false
    }
    location += 4
  }
}

const csvArray = getCSVArray(filePath)
console.log(`Array before is ${csvArray}`)
apply(csvArray)
console.log(`Array after is ${csvArray}`)
