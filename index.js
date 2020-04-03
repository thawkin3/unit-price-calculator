const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .get('/', (req, res) => {
    res.sendFile('index.html', { root: 'public' })
  })
  .get('/api/products', (req, res) => {
    res.json({
      products: [
        { name: 'Widget', sku: 100 },
        { name: 'Frozzle', sku: 101 },
        { name: 'Gadget', sku: 102 },
      ]
    })
  })
  .get('/api/descriptions', (req, res) => {
    // This will fake an API failure for the purpose of illustrating `Promise.allSettled()`
    // Half the time this will succeed and half the time this will fail
    const shouldFail = Math.random() > 0.5
    const jsonOutput = {
      descriptions: [
        { sku: 100, description: 'comes in various sizes' },
        { sku: 101, description: 'currently on backorder' },
        { sku: 102, description: 'available in pink and blue' },
      ]
    }
    if (shouldFail) {
      res.sendStatus(500)
    } else {
      res.json(jsonOutput)
    }
  })
  .get('/api/prices', (req, res) => {
    res.json({
      prices: [
        {
          sku: 100,
          priceOptions: {
            kg: [
              '$200 for 10 kg',
              '$300 for 20 kg',
              '$1000 for 100 kg',
            ],
            lbs: [
              '$200 for 22 lbs',
              '$300 for 44 lbs',
              '$1000 for 220 lbs',
            ]
          },
        },
        {
          sku: 101,
          priceOptions: {
            kg: [
              '$40 for 10 kg',
              '$70 for 20 kg',
              '$100 for 100 kg',
            ],
            lbs: [
              '$40 for 22 lbs',
              '$70 for 44 lbs',
              '$100 for 220 lbs',
            ]
          },
        },
        {
          sku: 102,
          priceOptions: {
            kg: [
              '$15 for 2 kg',
              '$17 for 3 kg',
              '$20 for 5 kg',
            ],
            lbs: [
              '$15 for 4 lbs',
              '$17 for 6 lbs',
              '$20 for 11 lbs',
            ]
          },
        },
      ]
    })
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
