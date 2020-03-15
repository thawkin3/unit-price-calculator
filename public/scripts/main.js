(function(){
  // Global state for our unit price calculator app
  const appState = {
    prices: [],
    doesPreferKilograms: null,
  }

  // Use Promise.allSettled to fetch data from two API endpoints
  // and then populate the product dropdown once both endpoints have responded
  const fetchInitialProductData = () => {
    const fetchProductsPromise = fetch('/api/products')
      .then(response => response.json())

    const fetchPricesPromise = fetch('/api/prices')
      .then(response => response.json())

    Promise.allSettled([fetchProductsPromise, fetchPricesPromise])
      .then(data => {
        console.log('all settled! here are the results:', data)
        if (data?.[0]?.status === 'fulfilled' && data?.[0]?.status === 'fulfilled') {
          const products = data[0].value?.products
          const prices = data[1].value?.prices
          populateProductDropdown(products)
          savePriceData(prices)
          return
        }
        throw new Error('Missing product or price data')
      })
      .catch(err => console.log('oh no, error! reason:', err))
  }

  const populateProductDropdown = (products = []) => {
    const productDropdown = document.querySelector('#product')
    const productDropdownOptions = products.reduce((optionHtml, product) => {
      return `${optionHtml}<option value="${product.sku}">${product.name}</option>`
    }, '')
    productDropdown.insertAdjacentHTML('beforeend', productDropdownOptions)
  }

  const savePriceData = (prices = []) => {
    appState.prices = prices
  }

  const fetchUnitOfMeasurementPreference = () => {
    // Use the globalThis object to get the window
    // Use optional chaining to get the value out of localStorage if possible
    const doesPreferKilograms = globalThis.localStorage?.getItem?.('prefersKg')
    
    // Use nullish coalescing to either use the preference or default to true
    appState.doesPreferKilograms = JSON.parse(doesPreferKilograms ?? 'true')

    const kgOption = document.querySelector('#kg')
    const lbsOption = document.querySelector('#lbs')

    if (appState.doesPreferKilograms) {
      lbsOption.selected = false
      kgOption.selected = true
    } else {
      kgOption.selected = false
      lbsOption.selected = true
    }

    const unitOfMeasurementDropdown = document.querySelector('#unit')
    unitOfMeasurementDropdown.addEventListener('change', handleUnitChange)
  }

  const handleUnitChange = e => {
    const selectedValue = e.target.value
    const prefersKg = selectedValue === 'kg'
    // Use the globalThis object to get the window
    // Use optional chaining to set the value in localStorage if possible
    globalThis.localStorage?.setItem?.('prefersKg', prefersKg)
  }

  const init = () => {
    fetchInitialProductData()
    fetchUnitOfMeasurementPreference()
  }

  // Kick things off when the page loads
  init()
})()
