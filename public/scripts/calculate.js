console.log('loading the calculate.js file')

export const calculateUnitPrice = (productName, weightAndPrice) => {
  // Use String.prototype.matchAll to easily get all results
  // for price, weight, and unit of measurement
  const matchResults = [...weightAndPrice.matchAll(/\d+|lb|kg/g)]

  // Use BigInt just in case the numbers we're dealing with are REALLY big
  const price = BigInt(matchResults[0][0])
  const priceInPennies = BigInt(matchResults[0][0] * 100)
  const weight = BigInt(matchResults[1][0])
  const unit = matchResults[2][0]

  const unitPriceInPennies = Number(priceInPennies / weight)
  const unitPriceInDollars = unitPriceInPennies / 100
  const unitPriceFormatted = unitPriceInDollars.toFixed(2)

  return `The unit price for ${weight} ${unit} of ${productName.toLowerCase()}s for $${price} is <b>$${unitPriceFormatted} per ${unit}</b>`
}
