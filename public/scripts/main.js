(function(){
  // Global state for our unit price calculator app
  const appState = {
    prices: [],
    doesPreferKilograms: null,
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
  }

  const addEventListeners = () => {
    const unitOfMeasurementDropdown = document.querySelector('#unit')
    unitOfMeasurementDropdown.addEventListener('change', handleUnitChange)

    const productDropdown = document.querySelector('#product')
    productDropdown.addEventListener('change', () => populateWeightAndPriceDropdown(appState.prices, appState.doesPreferKilograms))
  
    const form = document.querySelector('#unit-price-calculator-form')
    form.addEventListener('submit', handleFormSubmit)
  }

  const handleUnitChange = e => {
    const selectedValue = e.target.value
    const prefersKg = selectedValue === 'kg'

    appState.doesPreferKilograms = prefersKg
    // Use the globalThis object to get the window
    // Use optional chaining to set the value in localStorage if possible
    globalThis.localStorage?.setItem?.('prefersKg', prefersKg)

    populateWeightAndPriceDropdown(appState.prices, prefersKg)
  }

  const populateWeightAndPriceDropdown = (prices, doesPreferKilograms) => {
    const selectedSku = Number(document.querySelector('#product').value)
    const skuPriceOptions = prices.find(product => product.sku === selectedSku)
    const weightAndPriceOptions = skuPriceOptions?.priceOptions[doesPreferKilograms ? 'kg' : 'lbs']
    
    const weightAndPriceDropdown = document.querySelector('#weight-and-price')
    
    if (weightAndPriceOptions) {
      const dropdownOptions = weightAndPriceOptions.map((weightAndPriceOption) =>
        `<option value="${weightAndPriceOption}">${weightAndPriceOption}</option>`
      )
      weightAndPriceDropdown.innerHTML = [
        '<option disabled selected value="">Please select</option>',
        ...dropdownOptions,
      ].join('')
    } else {
      weightAndPriceDropdown.innerHTML =
        '<option disabled selected value="">Please select after choosing a product and unit of measurement</option>'
    }
    
  }

  const handleFormSubmit = e => {
    e.preventDefault()
    // Dynamic import for the calculate.js module
    import('./calculate.js')
      .then(module => {
        const selectedProductSku = Number(document.querySelector('#product').value)
        const selectedProduct = appState.products.find(product => product.sku === selectedProductSku)
        const selectedProductName = (selectedProduct || {}).name
        const selectedWeightAndPrice = document.querySelector('#weight-and-price').value
        
        module.calculateUnitPrice(selectedProductName, selectedWeightAndPrice)
      })
      .catch(err => console.log('error calculating unit price:', err))
  }

  // Use Promise.allSettled to fetch data from two API endpoints
  // and then populate the product dropdown once both endpoints have responded
  const fetchInitialProductData = (doesPreferKilograms) => {
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
          saveDataToAppState(products, prices)
          return
        }
        throw new Error('Missing product or price data')
      })
      .catch(err => console.log('oh no, error! reason:', err))
  }

  const populateProductDropdown = (products = []) => {
    const productDropdown = document.querySelector('#product')
    const productDropdownOptions = products.map((product) =>
      `<option value="${product.sku}">${product.name}</option>`
    )
    productDropdown.insertAdjacentHTML('beforeend', productDropdownOptions.join(''))
  }

  const saveDataToAppState = (products = [], prices = []) => {
    appState.products = products
    appState.prices = prices
  }

  const init = () => {
    fetchUnitOfMeasurementPreference()
    addEventListeners()
    fetchInitialProductData(appState.doesPreferKilograms)
  }

  // Kick things off when the page loads
  init()
})()
